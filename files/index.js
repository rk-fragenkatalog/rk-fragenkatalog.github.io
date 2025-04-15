"use strict";
const articles = document.getElementsByTagName("article");
const buttons = document.getElementsByClassName("start_button");
// quick and dirty
const password_input = document.getElementById("password_input");
const password_submit = document.getElementById("password_submit");
const password_status = document.getElementById("password_status");
// event listeners for button
password_submit.addEventListener("click", () => {
    if (password_input.value.toLowerCase() === "rk") {
        articles.namedItem("article_password").hidden = true;
        articles.namedItem("article_start").hidden = false;
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
