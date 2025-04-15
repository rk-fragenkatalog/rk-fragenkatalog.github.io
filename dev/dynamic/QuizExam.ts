// imports
import { question } from "./types.js";
import { shuffleArray, compareArrays } from "./array_functions.js";
import { QUESTION_COUNT } from "./questions2024.json";

// custom types for this class
type buttonType = {
    back: HTMLButtonElement;
    submit: HTMLButtonElement;
};

type sectionType = {
    examAllQuestions: HTMLDivElement;
    evaluation: HTMLDivElement;
}

export default class QuizExam {

    // properties
    // https://stackoverflow.com/questions/12686927/how-to-assert-a-type-of-an-htmlelement-in-typescript
    checkboxes: Array<Array<HTMLInputElement>> = [];  // equally: HTMLInputElement[][]
    checkboxLabels: Array<Array<HTMLLabelElement>> = [];
    questions: HTMLDivElement[] = [];

    // constant properties
    readonly shuffled25: question[];
    readonly totalAmountOfQuestions = QUESTION_COUNT;
    readonly amountOfQuestionsDisplayed = 20;
    readonly sections: sectionType;
    readonly buttons: buttonType;
    readonly shuffledIndices: number[] = shuffleArray([...Array(this.totalAmountOfQuestions).keys()]);
    readonly originalHTML: string;
    readonly articles: HTMLCollectionOf<HTMLDivElement>;


    constructor(questions: question[], articles: HTMLCollectionOf<HTMLDivElement>) {
        // very first init things
        this.sections = {
            examAllQuestions: document.getElementById("exam_all_questions")! as HTMLDivElement,
            evaluation: document.getElementById("exam_evaluation_block")! as HTMLDivElement,
        }
        this.originalHTML = this.sections.examAllQuestions.innerHTML;
        this.init();
        this.shuffled25 = shuffleArray(questions).slice(0, 25);
        this.articles = articles;

        // init buttons
        this.buttons = {
            back: document.getElementById("exam_back")! as HTMLButtonElement,
            submit: document.getElementById("exam_submit")! as HTMLButtonElement,

        };

        // init questions, checkboxes and labels
        for (let i = 0; i < this.amountOfQuestionsDisplayed; i++) {
            this.questions[i] = document.getElementById(`exam_Q${i}`)! as HTMLDivElement;

            // create empty lists for further assignments
            this.checkboxes[i] = [];
            this.checkboxLabels[i] = [];

            for (let j = 0; j < 4; j++) {
                this.checkboxes[i][j] = document.getElementById(`Q${i}_A${j}`)! as HTMLInputElement;
                this.checkboxLabels[i][j] = document.getElementById(`Q${i}_A${j}_label`)! as HTMLLabelElement;
            }
        }

        // event listeners for buttons
        this.buttons.submit.addEventListener("click", () => this.evaluateAnswers());
        this.buttons.back.addEventListener("click", () => this.backToStart());

        this.buildQuestions();
    }

    init(): void {
        const outputArray: string[] = [];

        for (let i = 0; i < this.amountOfQuestionsDisplayed; i++) {
            outputArray.push(`
                <div class="question" id="exam_Q${i}"></div>
                <div class="answer" id="exam_A${i}">
            `)
            for (let j = 0; j < 4; j++) {
                outputArray.push(`
                    <input type="checkbox" id="Q${i}_A${j}">
                    <label for="Q${i}_A${j}" id="Q${i}_A${j}_label"></label>
                    <br />
                `)
            }
            outputArray.push("</div>")
        }
        this.sections.examAllQuestions.innerHTML = outputArray.join("");
    }

    buildQuestions(): void {
        for (let i = 0; i < this.amountOfQuestionsDisplayed; i++) {

            const currentQuestion = this.shuffled25[i];
            const currentAnswers = shuffleArray(currentQuestion.a);

            for (let j = 0; j < 4; j++) {

                this.checkboxLabels[i][j].textContent = currentAnswers[j].aT;
                this.checkboxes[i][j].name = currentAnswers[j].aNo.toString();
            }

            this.questions[i].innerHTML = `<h3>Frage ${i + 1}: ${currentQuestion.q}</h3>`;
        }
    }

    evaluateAnswers(): void {
        const booleanArray: boolean[] = [];

        for (let i = 0; i < this.amountOfQuestionsDisplayed; i++) {

            const currentQuestion = this.shuffled25[i];
            const checked: number[] = [];
            const correct = currentQuestion.c

            for (let j = 0; j < 4; j++) {

                const name = parseFloat(this.checkboxes[i][j].name);

                if (this.checkboxes[i][j].checked) {
                    checked.push(name);

                    // incorrectly checked
                    if (!correct.includes(name)) {
                        this.checkboxLabels[i][j].setAttribute("class", "incorrect_label");
                    }
                }
                else {
                    // incorrectly not checked
                    if (correct.includes(name)) {
                        this.checkboxLabels[i][j].setAttribute("class", "incorrect_label");
                    }
                }

                this.checkboxes[i][j].disabled = true;
            }

            booleanArray.push(compareArrays(correct, checked));

        }

        this.buttons.submit.disabled = true;

        // '+' CAN be applied to 'number' and 'boolean'
        // @ts-ignore
        const achievedPoints: number = booleanArray.reduce((a, b) => a + b, 0)
        // https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers

        this.sections.evaluation.innerHTML = `<p><b>Erreichte Punkte:</b>\t${achievedPoints} / ${this.amountOfQuestionsDisplayed}</p>`;
    }

    backToStart(): void {
        const start = this.articles.namedItem("article_start")! as HTMLDivElement;
        const exam = this.articles.namedItem("article_exam")! as HTMLDivElement;

        start.hidden = false;
        exam.hidden = true;
        this.sections.examAllQuestions.innerHTML = this.originalHTML;
        this.buttons.submit.disabled = false;
        this.sections.evaluation.innerHTML = "";
    }
}
