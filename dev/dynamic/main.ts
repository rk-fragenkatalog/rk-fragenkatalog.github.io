// import of .json-file
import { questions } from "./questions2025.json";
import QuizPractice from "./QuizPractice.js";
import QuizExam from "./QuizExam.js";

const articles = document.getElementsByTagName("article")! as HTMLCollectionOf<HTMLDivElement>;
const buttons = document.getElementsByClassName("start_button")! as HTMLCollectionOf<HTMLButtonElement>;
let practice: QuizPractice;
let exam: QuizExam;

// quick and dirty
const password_input = document.getElementById("password_input")! as HTMLInputElement;
const password_submit = document.getElementById("password_submit")! as HTMLButtonElement;
const password_status = document.getElementById("password_status")! as HTMLDivElement;

// event listeners for buttons
password_submit.addEventListener("click", () => {
    if (password_input.value.toLowerCase() === "rk") {
        articles.namedItem("article_password")!.hidden = true;
        articles.namedItem("article_start")!.hidden = false;
    }
    else {
        password_status.innerHTML = "<p>Falsches Passwort!</p>";
    }
});

password_input.addEventListener("keypress", (event) => {
    // https://stackoverflow.com/questions/58341832/event-is-deprecated-what-should-be-used-instead
    if (event.key === "Enter") {
        password_submit.click();
    }
});

buttons.namedItem("button_practice")!.addEventListener("click", () => {
    articles.namedItem("article_start")!.hidden = true;
    articles.namedItem("article_practice")!.hidden = false;
    practice = new QuizPractice(questions, articles);
});

buttons.namedItem("button_exam")!.addEventListener("click", () => {
    articles.namedItem("article_start")!.hidden = true;
    articles.namedItem("article_exam")!.hidden = false;
    exam = new QuizExam(questions, articles);
});
