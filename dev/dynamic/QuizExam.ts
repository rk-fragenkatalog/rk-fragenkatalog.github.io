// imports
import { question } from "./types.js";
import { shuffleArray, compareArrays } from "./array_functions.js";

// custom types for this class
type buttonType = {
    submit: HTMLButtonElement;
};

type sectionType = {
    examAllQuestions: HTMLDivElement;
    evaluation: HTMLDivElement;
}

export default class QuizExam {
    // properties
    // https://stackoverflow.com/questions/12686927/how-to-assert-a-type-of-an-htmlelement-in-typescript
    checkboxes: HTMLInputElement[][] = [];
    checkboxLabels: HTMLLabelElement[][] = [];
    questions: HTMLDivElement[] = [];

    // constant properties
    readonly amountOfQuestionsDisplayed = 25;
    readonly shuffled_questions: question[];
    readonly sections: sectionType;
    readonly buttons: buttonType;
    readonly originalHTML: string;
    readonly articles: HTMLCollectionOf<HTMLDivElement>;

    constructor(questions: question[], articles: HTMLCollectionOf<HTMLDivElement>) {
        // very first init things
        this.sections = {
            examAllQuestions: document.getElementById("exam_all_questions")! as HTMLDivElement,
            evaluation: document.getElementById("exam_evaluation_block")! as HTMLDivElement,
        }
        this.originalHTML = this.sections.examAllQuestions.innerHTML;
        this.buildQuestionsHTMLStructure();
        this.shuffled_questions = shuffleArray(questions).slice(0, this.amountOfQuestionsDisplayed);
        this.articles = articles;

        // init buttons
        this.buttons = {
            submit: document.getElementById("exam_submit")! as HTMLButtonElement,
        };

        // event listeners for buttons
        this.buttons.submit.addEventListener("click", () => this.evaluateAnswers());

        // init questions, checkboxes and labels
        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            this.questions[i] = document.getElementById(`exam_Q${i}`)! as HTMLDivElement;

            // create empty lists for further assignments
            this.checkboxes[i] = [];
            this.checkboxLabels[i] = [];

            for (let j = 0; j < 4; ++j) {
                this.checkboxes[i][j] = document.getElementById(`Q${i}_A${j}`)! as HTMLInputElement;
                this.checkboxLabels[i][j] = document.getElementById(`Q${i}_A${j}_label`)! as HTMLLabelElement;
            }
        }

        this.buildQuestions();
    }

    buildQuestionsHTMLStructure(): void {
        const outputArray: string[] = [];

        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            outputArray.push(`
                <div class="question" id="exam_Q${i}"></div>
                <div class="answer" id="exam_A${i}">
            `)
            for (let j = 0; j < 4; ++j) {
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
        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            const currentQuestion = this.shuffled_questions[i];
            const currentAnswers = shuffleArray(currentQuestion.a);

            for (let j = 0; j < 4; ++j) {
                this.checkboxLabels[i][j].textContent = currentAnswers[j].aT;
                this.checkboxes[i][j].name = currentAnswers[j].aNo.toString();
            }

            this.questions[i].innerHTML = `<h3>Frage ${i + 1}: ${currentQuestion.q}</h3>`;
        }
    }

    evaluateAnswers(): void {
        const booleanArray: boolean[] = [];

        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            const currentQuestion = this.shuffled_questions[i];
            const checked: number[] = [];
            const correct = currentQuestion.c

            for (let j = 0; j < 4; ++j) {
                const name = parseFloat(this.checkboxes[i][j].name);

                if (this.checkboxes[i][j].checked) {
                    checked.push(name);

                    // incorrectly checked
                    if (!correct.includes(name)) {
                        this.checkboxLabels[i][j].setAttribute("class", "incorrect_label");
                    }
                }
                else if (correct.includes(name)) { // incorrectly not checked
                    this.checkboxLabels[i][j].setAttribute("class", "incorrect_label");
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
}
