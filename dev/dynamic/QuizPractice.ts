// imports
import { question } from "./types.js";
import { shuffleArray, compareArrays } from "./array_functions.js";

// custom types for this class
type divType = {
    question: HTMLDivElement;
    evaluation: HTMLDivElement;
    finalResults: HTMLDivElement;
};

type buttonType = {
    submit: HTMLButtonElement;
    next: HTMLButtonElement;
};

type progressType = {
    bar: HTMLProgressElement;
    label: HTMLLabelElement;
};

type checkType = {
    boxes: HTMLInputElement[];
    labels: HTMLLabelElement[];
};

type sectionType = {
    questionBlock: HTMLDivElement;
    buttonBlock: HTMLDivElement;
};

type counterType = {
    questions: number;
    correct: number;
    incorrect: number;
};

type storageType = {
    shuffledIndices: string | null;
    countersQuestions: string | null;
    countersCorrect: string | null;
    countersIncorrect: string | null;
};

const ANSWER_COUNT = 4;

export default class QuizPractice {
    // readonly properties can only be set in constructor
    // declare questions array
    readonly questions: question[];
    readonly totalAmountOfQuestions: number;
    readonly shuffledIndices: number[];
    readonly sections: sectionType;
    readonly divs: divType;
    readonly buttons: buttonType;
    readonly progress: progressType;
    readonly checks: checkType;
    readonly counters: counterType;
    readonly storage: storageType;

    constructor(questions: question[]) {
        // very first init things
        this.buildQuestionsHTMLStructure();
        this.questions = questions;
        this.totalAmountOfQuestions = questions.length;

        this.storage = {
            shuffledIndices: sessionStorage.getItem("shuffledIndices"),
            countersQuestions: sessionStorage.getItem("countersQuestions"),
            countersCorrect: sessionStorage.getItem("countersCorrect"),
            countersIncorrect: sessionStorage.getItem("countersIncorrect"),
        };

        this.counters = {
            questions: (this.storage.countersQuestions) ? Number.parseInt(this.storage.countersQuestions, 10) : 0,
            correct: (this.storage.countersCorrect) ? Number.parseInt(this.storage.countersCorrect, 10) : 0,
            incorrect: (this.storage.countersIncorrect) ? Number.parseInt(this.storage.countersIncorrect, 10) : 0,
        };

        // https://stackoverflow.com/questions/3895478/does-javascript-have-a-method-like-range-to-generate-a-range-within-the-supp
        this.shuffledIndices = (this.storage.shuffledIndices) ? JSON.parse(this.storage.shuffledIndices) : shuffleArray([...new Array(this.totalAmountOfQuestions).keys()]);

        this.sections = {
            questionBlock: document.getElementById("practice_question_block")! as HTMLDivElement,
            buttonBlock: document.getElementById("practice_button_block")! as HTMLDivElement,
        };

        this.divs = {
            question: document.getElementById("practice_question")! as HTMLDivElement,
            evaluation: document.getElementById("practice_evaluation")! as HTMLDivElement,
            finalResults: document.getElementById("practice_final_results")! as HTMLDivElement,
        };

        this.buttons = {
            submit: document.getElementById("practice_submit")! as HTMLButtonElement,
            next: document.getElementById("practice_next")! as HTMLButtonElement,
        };

        this.checks = {
            boxes: [],
            labels: [],
        };

        // init checkboxes and their labels
        for (let i = 0; i < ANSWER_COUNT; ++i) {
            this.checks.boxes[i] = document.getElementById(`practice_A${i}`)! as HTMLInputElement;
            this.checks.labels[i] = document.getElementById(`practice_A${i}_label`)! as HTMLLabelElement;
        }

        // init progress
        this.progress = {
            bar: document.getElementById("practice_progress_bar")! as HTMLProgressElement,
            label: document.getElementById("practice_progress_label")! as HTMLLabelElement,
        };

        // event listeners for buttons
        this.buttons.next.addEventListener("click", () => this.buildQuestion());
        this.buttons.submit.addEventListener("click", () => this.evaluateAnswer());

        // display first question
        this.buildQuestion();
        this.updateProgress();
    }

    buildQuestionsHTMLStructure(): void {
        const outputArray: string[] = [];

        for (let i = 0; i < ANSWER_COUNT; ++i) {
            outputArray.push(`
                <input type="checkbox" id="practice_A${i}">
                <label for="practice_A${i}" id="practice_A${i}_label"></label><br />
            `)
        }

        document.getElementById("practice_answer")!.innerHTML = outputArray.join("");
    }

    buildQuestion(): void {
        if (this.prepareNextQuestion()) {
            const currentQuestion = this.questions[this.shuffledIndices[this.counters.questions]];
            const currentAnswers = shuffleArray(currentQuestion.a);

            // update checkbox labels
            for (let i = 0; i < ANSWER_COUNT; ++i) {
                this.checks.labels[i].textContent = currentAnswers[i].aT;
                this.checks.boxes[i].name = currentAnswers[i].aNo.toString();
                // textContent vs. innerText
                // https://www.microfocus.com/documentation/silk-test/200/en/silktestworkbench-help-en/SILKTEST-21EEFF3F-DIFFERENCEBETWEENTEXTCONTENTSINNERTEXTINNERHTML-REF.html
            }

            // update question text
            this.divs.question.innerHTML = `<h3>${currentQuestion.q}</h3>`;
        }
    }

    evaluateAnswer(): void {
        const currentQuestion = this.questions[this.shuffledIndices[this.counters.questions]];
        const checked: number[] = [];
        const outputArray: string[] = [];
        let correct: boolean;

        for (let i = 0; i < ANSWER_COUNT; ++i) {
            if (this.checks.boxes[i].checked) {
                checked.push(Number.parseInt(this.checks.boxes[i].name, 10));
            }
            this.checks.boxes[i].disabled = true;
        }

        correct = compareArrays(currentQuestion.c, checked);

        if (correct) {
            outputArray.push("<b class='correct'>Richtig!</b>");
            this.counters.correct++;
        }
        else {
            outputArray.push("<b class='incorrect'>Falsch.</b> Richtig ist:<ul>");

            for (let answer of currentQuestion.a) {
                if (currentQuestion.c.includes(answer.aNo)) {
                    outputArray.push(`<li>${answer.aT}</li>`);
                }
            }
            outputArray.push("</ul>");
            this.counters.incorrect++;
        }

        // write outcome to HTML
        this.divs.evaluation.innerHTML = outputArray.join("");

        // change buttons
        // lock submit
        // make next visible
        this.buttons.submit.disabled = true;
        this.buttons.next.disabled = false;

        // increment question counter
        this.counters.questions++;
        this.updateProgress();
    }

    updateProgress(): void {
        this.progress.bar.setAttribute("value", this.counters.correct.toString());
        this.progress.bar.setAttribute("max", this.counters.questions.toString());
        this.progress.label.textContent = `${this.counters.correct} richtig & ${this.counters.incorrect} falsch / ${this.counters.questions} insgesamt`

        // check question counter
        if (this.counters.questions === this.totalAmountOfQuestions) {
            this.buttons.next.textContent = "Abschluss";
        }
    }

    prepareNextQuestion(): boolean {
        this.buttons.submit.disabled = false;
        this.buttons.next.disabled = true;
        this.divs.evaluation.innerHTML = "";

        // enable checkboxes
        // remove checks
        for (let i = 0; i < ANSWER_COUNT; ++i) {
            this.checks.boxes[i].disabled = false;
            this.checks.boxes[i].checked = false;
        }

        // check question counter again
        if (this.counters.questions === this.totalAmountOfQuestions) {
            this.showFinalResults();
            return false;
        }
        else {
            return true;
        }
    }

    showFinalResults(): void {
        this.sections.questionBlock.hidden = true;
        this.sections.buttonBlock.hidden = true;
        this.divs.evaluation.hidden = true;
        this.divs.finalResults.hidden = false;
        sessionStorage.clear()
    }
}
