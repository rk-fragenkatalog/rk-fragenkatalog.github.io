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

const ANSWER_COUNT = 4;

export default class QuizExam {
    // properties
    // https://stackoverflow.com/questions/12686927/how-to-assert-a-type-of-an-htmlelement-in-typescript
    checkboxes: HTMLInputElement[][] = [];
    checkboxLabels: HTMLLabelElement[][] = [];
    questions: HTMLDivElement[] = [];

    // constant properties
    readonly amountOfQuestionsDisplayed = 25;
    readonly shuffledQuestions: question[];
    readonly sections: sectionType;
    readonly buttons: buttonType;

    constructor(questions: question[]) {
        // very first init things
        this.sections = {
            examAllQuestions: document.getElementById("exam_all_questions")! as HTMLDivElement,
            evaluation: document.getElementById("exam_evaluation_block")! as HTMLDivElement,
        }
        this.buildQuestionsHTMLStructure();
        this.shuffledQuestions = shuffleArray(questions).slice(0, this.amountOfQuestionsDisplayed);

        // init buttons
        this.buttons = {
            submit: document.getElementById("exam_submit")! as HTMLButtonElement,
        };

        // event listeners for buttons
        this.buttons.submit.addEventListener("click", () => this.evaluateAnswers());

        this.buildQuestions();
    }

    buildQuestionsHTMLStructure(): void {
        const outputArray: string[] = [];

        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            outputArray.push(`
                <div class="question" id="exam_Q${i}"></div>
                <div class="answer" id="exam_A${i}">
            `)
            for (let j = 0; j < ANSWER_COUNT; ++j) {
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
        // init questions, checkboxes and labels
        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            this.questions[i] = document.getElementById(`exam_Q${i}`)! as HTMLDivElement;

            // create empty lists for further assignments
            this.checkboxes[i] = [];
            this.checkboxLabels[i] = [];

            for (let j = 0; j < ANSWER_COUNT; ++j) {
                this.checkboxes[i][j] = document.getElementById(`Q${i}_A${j}`)! as HTMLInputElement;
                this.checkboxLabels[i][j] = document.getElementById(`Q${i}_A${j}_label`)! as HTMLLabelElement;
            }
        }

        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            const currentQuestion = this.shuffledQuestions[i];
            const currentAnswers = shuffleArray(currentQuestion.a);

            for (let j = 0; j < ANSWER_COUNT; ++j) {
                this.checkboxLabels[i][j].textContent = currentAnswers[j].aT;
                this.checkboxes[i][j].name = currentAnswers[j].aNo.toString();
            }

            this.questions[i].innerHTML = `<h3>Frage ${i + 1}: ${currentQuestion.q}</h3>`;
        }
    }

    evaluateAnswers(): void {
        const booleanArray: boolean[] = [];

        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            const currentQuestion = this.shuffledQuestions[i];
            const checked: number[] = [];
            const correct = currentQuestion.c;

            for (let j = 0; j < ANSWER_COUNT; ++j) {
                const name = Number.parseInt(this.checkboxes[i][j].name, 10);

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
        const achievedPoints = booleanArray.reduce((sum, isCorrect) => sum + (isCorrect ? 1 : 0), 0);

        this.sections.evaluation.innerHTML = `
            <p><b>Erreichte Punkte:</b>\t${achievedPoints} / ${this.amountOfQuestionsDisplayed}</p>
            <p><b>Info:</b> Kästchen, deren Zustand nicht mit der Lösung übereinstimmt, haben
            <span class="incorrect_label">rot</span>
            markierten Text (rot ohne Kreuz: hätte angekreuzt werden müssen; rot mit Kreuz: hätte
            nicht angekreuzt werden dürfen).</p>
        `;
    }
}
