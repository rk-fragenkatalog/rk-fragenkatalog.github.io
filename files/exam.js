(function(){function p(o,i,f){var a="function"==typeof require&&require;function c(n,r){if(!i[n]){if(!o[n]){var e="function"==typeof require&&require;if(!r&&e)return e(n,!0);if(a)return a(n,!0);var r=new Error("Cannot find module '"+n+"'");throw r.code="MODULE_NOT_FOUND",r}var e=i[n]={exports:{}};o[n][0].call(e.exports,function(r){var e;return c(o[n][1][r]||r)},e,e.exports,p,o,i,f)}return i[n].exports}for(var r=0;r<f.length;r++)c(f[r]);return c}return p})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const array_functions_js_1 = require("./array_functions.js");
class QuizExam {
    constructor(questions) {
        // properties
        // https://stackoverflow.com/questions/12686927/how-to-assert-a-type-of-an-htmlelement-in-typescript
        this.checkboxes = [];
        this.checkboxLabels = [];
        this.questions = [];
        // constant properties
        this.amountOfQuestionsDisplayed = 25;
        // very first init things
        this.sections = {
            examAllQuestions: document.getElementById("exam_all_questions"),
            evaluation: document.getElementById("exam_evaluation_block"),
        };
        this.originalHTML = this.sections.examAllQuestions.innerHTML;
        this.buildQuestionsHTMLStructure();
        this.shuffled_questions = (0, array_functions_js_1.shuffleArray)(questions).slice(0, this.amountOfQuestionsDisplayed);
        // init buttons
        this.buttons = {
            submit: document.getElementById("exam_submit"),
        };
        // event listeners for buttons
        this.buttons.submit.addEventListener("click", () => this.evaluateAnswers());
        // init questions, checkboxes and labels
        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            this.questions[i] = document.getElementById(`exam_Q${i}`);
            // create empty lists for further assignments
            this.checkboxes[i] = [];
            this.checkboxLabels[i] = [];
            for (let j = 0; j < 4; ++j) {
                this.checkboxes[i][j] = document.getElementById(`Q${i}_A${j}`);
                this.checkboxLabels[i][j] = document.getElementById(`Q${i}_A${j}_label`);
            }
        }
        this.buildQuestions();
    }
    buildQuestionsHTMLStructure() {
        const outputArray = [];
        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            outputArray.push(`
                <div class="question" id="exam_Q${i}"></div>
                <div class="answer" id="exam_A${i}">
            `);
            for (let j = 0; j < 4; ++j) {
                outputArray.push(`
                    <input type="checkbox" id="Q${i}_A${j}">
                    <label for="Q${i}_A${j}" id="Q${i}_A${j}_label"></label>
                    <br />
                `);
            }
            outputArray.push("</div>");
        }
        this.sections.examAllQuestions.innerHTML = outputArray.join("");
    }
    buildQuestions() {
        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            const currentQuestion = this.shuffled_questions[i];
            const currentAnswers = (0, array_functions_js_1.shuffleArray)(currentQuestion.a);
            for (let j = 0; j < 4; ++j) {
                this.checkboxLabels[i][j].textContent = currentAnswers[j].aT;
                this.checkboxes[i][j].name = currentAnswers[j].aNo.toString();
            }
            this.questions[i].innerHTML = `<h3>Frage ${i + 1}: ${currentQuestion.q}</h3>`;
        }
    }
    evaluateAnswers() {
        const booleanArray = [];
        for (let i = 0; i < this.amountOfQuestionsDisplayed; ++i) {
            const currentQuestion = this.shuffled_questions[i];
            const checked = [];
            const correct = currentQuestion.c;
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
            booleanArray.push((0, array_functions_js_1.compareArrays)(correct, checked));
        }
        this.buttons.submit.disabled = true;
        // '+' CAN be applied to 'number' and 'boolean'
        // @ts-ignore
        const achievedPoints = booleanArray.reduce((a, b) => a + b, 0);
        // https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
        this.sections.evaluation.innerHTML = `
            <p><b>Erreichte Punkte:</b>\t${achievedPoints} / ${this.amountOfQuestionsDisplayed}</p>
            <p><b>Info:</b> Kästchen, deren Zustand nicht mit der Lösung übereinstimmt, haben
            <span class="incorrect_label">rot</span>
            markierten Text (rot ohne Kreuz: hätte angekreuzt werden müssen; rot mit Kreuz: hätte
            nicht angekreuzt werden dürfen).</p>
        `;
    }
}
exports.default = QuizExam;

},{"./array_functions.js":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shuffleArray = shuffleArray;
exports.compareArrays = compareArrays;
// functions, copied from the internet
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
// Randomize array in-place using Durstenfeld shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; --i) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
// https://www.30secondsofcode.org/articles/s/javascript-array-comparison
// compare two arrays, neglect order of elements (~set comparison)
function compareArrays(a, b) {
    if (a.length !== b.length)
        return false;
    const uniqueValues = new Set([...a, ...b]);
    for (const v of uniqueValues) {
        const aCount = a.filter(e => e === v).length;
        const bCount = b.filter(e => e === v).length;
        if (aCount !== bCount)
            return false;
    }
    return true;
}

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const questions2025_json_1 = require("./questions2025.json");
exports.default = questions2025_json_1.questions;

},{"./questions2025.json":5}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const current_questions_js_1 = __importDefault(require("./current_questions.js"));
const QuizExam_js_1 = __importDefault(require("./QuizExam.js"));
const exam = new QuizExam_js_1.default(current_questions_js_1.default);

},{"./QuizExam.js":1,"./current_questions.js":3}],5:[function(require,module,exports){
module.exports={
    "questions": [
        {
            "q": "Die Notrufnummer der Feuerwehr lautet...",
            "a": [
                {
                    "aNo": 1,
                    "aT": "122"
                },
                {
                    "aNo": 2,
                    "aT": "133"
                },
                {
                    "aNo": 3,
                    "aT": "144"
                },
                {
                    "aNo": 4,
                    "aT": "112"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Die Notrufnummer vom Rettungsdienst lautet...",
            "a": [
                {
                    "aNo": 1,
                    "aT": "141"
                },
                {
                    "aNo": 2,
                    "aT": "133"
                },
                {
                    "aNo": 3,
                    "aT": "144"
                },
                {
                    "aNo": 4,
                    "aT": "112"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Die Notrufnummer der Polizei lautet...",
            "a": [
                {
                    "aNo": 1,
                    "aT": "122"
                },
                {
                    "aNo": 2,
                    "aT": "133"
                },
                {
                    "aNo": 3,
                    "aT": "144"
                },
                {
                    "aNo": 4,
                    "aT": "911"
                }
            ],
            "c": [
                2
            ]
        },
        {
            "q": "Die Nummer des Euro-Notrufs lautet...",
            "a": [
                {
                    "aNo": 1,
                    "aT": "122"
                },
                {
                    "aNo": 2,
                    "aT": "128"
                },
                {
                    "aNo": 3,
                    "aT": "144"
                },
                {
                    "aNo": 4,
                    "aT": "112"
                }
            ],
            "c": [
                4
            ]
        },
        {
            "q": "Welche Angaben sind beim Wählen des Notrufs sinnvoll?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Ob ich einen ÖNORM-Verbandskasten besitze"
                },
                {
                    "aNo": 2,
                    "aT": "Genaue Adressangabe"
                },
                {
                    "aNo": 3,
                    "aT": "Exakte Kilometerangabe und Fahrtrichtung auf der Autobahn"
                },
                {
                    "aNo": 4,
                    "aT": "Body-Mass-Index"
                }
            ],
            "c": [
                2,
                3
            ]
        },
        {
            "q": "Welche Nummer sollte bei einem medizinischen Notfall bevorzugt gerufen werden?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "1450"
                },
                {
                    "aNo": 2,
                    "aT": "144"
                },
                {
                    "aNo": 3,
                    "aT": "Völlig egal"
                },
                {
                    "aNo": 4,
                    "aT": "133"
                }
            ],
            "c": [
                2
            ]
        },
        {
            "q": "Was soll man bei einem Notruf beachten?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Den Anweisungen der Leitstelle folgen"
                },
                {
                    "aNo": 2,
                    "aT": "Sich für den Notruf Zeit nehmen und auf die Fragen der Leitstelle antworten"
                },
                {
                    "aNo": 3,
                    "aT": "Notruf wählen, Notfallort nennen, auflegen und Erste Hilfe leisten"
                },
                {
                    "aNo": 4,
                    "aT": "Das Gespräch beendet die Leitstelle"
                }
            ],
            "c": [
                1,
                2,
                4
            ]
        },
        {
            "q": "Welche Maßnahmen gehören zu den Basismaßnahmen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Psychische Betreuung (Look-Listen-Link)"
                },
                {
                    "aNo": 2,
                    "aT": "Zur Aktivierung des Kreislaufs aufstehen"
                },
                {
                    "aNo": 3,
                    "aT": "Angenehme Lagerung einnehmen (z. B. erhöhter Oberkörper bei Atemnot)"
                },
                {
                    "aNo": 4,
                    "aT": "Für frische Luft sorgen und bei Notwendigkeit beengende Kleidungsstücke öffnen"
                }
            ],
            "c": [
                1,
                3,
                4
            ]
        },
        {
            "q": "Welche Aufgaben hat der:die Ersthelfer:in?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Starke Blutungen stillen"
                },
                {
                    "aNo": 2,
                    "aT": "Notruf absetzen"
                },
                {
                    "aNo": 3,
                    "aT": "E-Card und Ausweis kontrollieren"
                },
                {
                    "aNo": 4,
                    "aT": "Retten von Verletzten aus allen Gefahrensituation"
                }
            ],
            "c": [
                1,
                2
            ]
        },
        {
            "q": "Welche Maßnahmen ergreifen Sie, wenn eine Person reglos am Bauch liegt?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Sofort stabile Seitenlage durchführen"
                },
                {
                    "aNo": 2,
                    "aT": "Notruf (veranlassen)"
                },
                {
                    "aNo": 3,
                    "aT": "Laut ansprechen und sanft schütteln"
                },
                {
                    "aNo": 4,
                    "aT": "Wenn keine Reaktion: Person umdrehen"
                }
            ],
            "c": [
                2,
                3,
                4
            ]
        },
        {
            "q": "Welche Rettungsmöglichkeiten aus einer Gefahrenzone hat der:die Ersthelfer:in?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Rautekgriff anwenden"
                },
                {
                    "aNo": 2,
                    "aT": "Wegziehen in Bauch- oder Rückenlage"
                },
                {
                    "aNo": 3,
                    "aT": "Rettungstuch verwenden"
                },
                {
                    "aNo": 4,
                    "aT": "Seiltechniken anwenden"
                }
            ],
            "c": [
                1,
                2
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind beim Verdacht der Unterkühlung zu setzen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Notruf, Basismaßnahmen"
                },
                {
                    "aNo": 2,
                    "aT": "Warme alkoholische Getränke verabreichen, frottieren, gut zudecken"
                },
                {
                    "aNo": 3,
                    "aT": "Warme gezuckerte Getränke verabreichen, Bewegung vermeiden, gut zudecken"
                },
                {
                    "aNo": 4,
                    "aT": "Kopf-Tieflagerung um weiteres Absinken der Temperatur zu vermeiden"
                }
            ],
            "c": [
                1,
                3
            ]
        },
        {
            "q": "Welches Material wird für den manuellen Druck benötigt?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Saugendes Material, z. B. Wundauflage"
                },
                {
                    "aNo": 2,
                    "aT": "Material zum Abbinden"
                },
                {
                    "aNo": 3,
                    "aT": "Falls vorhanden: Einmalhandschuhe"
                },
                {
                    "aNo": 4,
                    "aT": "Wunddesinfektion"
                }
            ],
            "c": [
                1,
                3
            ]
        },
        {
            "q": "Wie versorgt man eine:n Verletzte:n mit einer stark blutenden Wunde an einer Extremität?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Nur der Notruf abzusetzen – der Rettungsdienst kümmert sich um die Wunde"
                },
                {
                    "aNo": 2,
                    "aT": "Pflasterverband anbringen"
                },
                {
                    "aNo": 3,
                    "aT": "Manuellen Druck auf die Wunde ausüben oder Druckverband anlegen"
                },
                {
                    "aNo": 4,
                    "aT": "Notruf absetzen, verletzten Körperteil hochhalten"
                }
            ],
            "c": [
                3,
                4
            ]
        },
        {
            "q": "Bei welcher Verletzung ist der manuelle Druck zur Blutstillung geeignet?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Starke Blutung am Unterschenkel"
                },
                {
                    "aNo": 2,
                    "aT": "Schürfwunde"
                },
                {
                    "aNo": 3,
                    "aT": "Magenblutung"
                },
                {
                    "aNo": 4,
                    "aT": "Bluterguss"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Was versteht man unter einer starken Blutung?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Wenn aus einer Wunde innerhalb kurzer Zeit eine große Blutmenge verloren geht"
                },
                {
                    "aNo": 2,
                    "aT": "Wenn ein paar Tropfen Blut langsam aus der Wunde tropfen"
                },
                {
                    "aNo": 3,
                    "aT": "Wenn das Blut aus der Wunde spritzt"
                },
                {
                    "aNo": 4,
                    "aT": "Wenn das Blut im Schwall austritt"
                }
            ],
            "c": [
                1,
                3,
                4
            ]
        },
        {
            "q": "Welche Maßnahme ist von:vom Ersthelfer:in zu setzen, wenn es bei einer starken Blutung durch den Druckverband durchblutet?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Manuellen Druck auf dem Druckverband ausüben"
                },
                {
                    "aNo": 2,
                    "aT": "Weiterbluten lassen"
                },
                {
                    "aNo": 3,
                    "aT": "Bestehenden Druckverband wieder heruntergeben und mit verwendetem Material wieder neuen Druckverband anlegen"
                },
                {
                    "aNo": 4,
                    "aT": "Abbindung vornehmen"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Was sollte der:die Ersthelfer:in bei der Blutstillung vermeiden?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Verwendung einer keimfreien Wundauflage"
                },
                {
                    "aNo": 2,
                    "aT": "Durchführung der Basismaßnahmen"
                },
                {
                    "aNo": 3,
                    "aT": "Wenn möglich: Direkten Kontakt mit Blut"
                },
                {
                    "aNo": 4,
                    "aT": "Wenn möglich: Verwendung von Mullbindenverbänden"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind beim Anlegen eines Druckverbandes durchzuführen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "E-Card und Ausweis kontrollieren"
                },
                {
                    "aNo": 2,
                    "aT": "Keimfreie Wundauflage fest auf die Wunde drücken"
                },
                {
                    "aNo": 3,
                    "aT": "Druckkörper durch festes Umwickeln mit der Mullbinde einwickeln"
                },
                {
                    "aNo": 4,
                    "aT": "Verletzte:r soll anfangs selbst fest auf die Wunde drücken"
                }
            ],
            "c": [
                2,
                3,
                4
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind beim Verschlucken (schwere Verlegung der Atemwege) durchzuführen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Oberkörper nach vorne beugen, Brustkorb stützen und bis zu 5x Heimlich-Manöver durchführen. Falls keine Besserung: Bis zu 5 Schläge zwischen die Schulterblätter durchführen usw."
                },
                {
                    "aNo": 2,
                    "aT": "Oberkörper nach vorne beugen, Brustkorb stützen und bis zu 5x fest zwischen die Schulterblätter schlagen. Falls keine Besserung: Heimlich-Handgriff bis zu 5x durchführen usw."
                },
                {
                    "aNo": 3,
                    "aT": "Dem:der Betroffenen warme Getränke zum Auflösen des Fremdkörpers verabreichen"
                },
                {
                    "aNo": 4,
                    "aT": "Falls der:die Betroffene reglos wird, entspricht dies einem Atem-Kreislauf-Stillstand und es ist sofort mit der Wiederbelebung zu beginnen"
                }
            ],
            "c": [
                2,
                4
            ]
        },
        {
            "q": "Wie lautet die Erste-Hilfe-Maßnahme, die mit saugendem Material mit den Fingern, dem Handballen oder der Faust mit Druck auf die stark blutende Wunde ausgeübt wird?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Manueller Druck"
                },
                {
                    "aNo": 2,
                    "aT": "Blutdruck"
                },
                {
                    "aNo": 3,
                    "aT": "Herzdruckmassage"
                },
                {
                    "aNo": 4,
                    "aT": "Druckverband"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Welche Lagerung wird bei einer starken Blutung empfohlen (z.B. Kreissägenverletzung am Unterarm)?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Oberkörper-Hochlagerung"
                },
                {
                    "aNo": 2,
                    "aT": "Beine-Hochlagerung"
                },
                {
                    "aNo": 3,
                    "aT": "Deckenrolle unter dem Knie"
                },
                {
                    "aNo": 4,
                    "aT": "Lagerung ohne Veränderung der Körperhaltung"
                }
            ],
            "c": [
                2
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind bei einer starken Blutung am Unterschenkel durchzuführen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Verletzte:n hinlegen"
                },
                {
                    "aNo": 2,
                    "aT": "Verletzte:n stehen lassen"
                },
                {
                    "aNo": 3,
                    "aT": "Ersthelfer:in soll nur den Notruf absetzen"
                },
                {
                    "aNo": 4,
                    "aT": "Manuellen Druck durchführen oder Druckverband anlegen; Beine hochlagern"
                }
            ],
            "c": [
                1,
                4
            ]
        },
        {
            "q": "Wie wird die Mund-zu-Mund-Beatmung im Rahmen der Ersten Hilfe durchgeführt?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Notfallbeatmungstuch über Nase der erkrankten Person legen, Kopf nackenwärts überstrecken, Mund zuhalten und 2 Mal beatmen"
                },
                {
                    "aNo": 2,
                    "aT": "Der:die Ersthelfer:in kontrolliert durch das normale Heben und Senken des Brustkorbs die Effektivität der Beatmung"
                },
                {
                    "aNo": 3,
                    "aT": "Die Beatmung wird ausschließlich durch den:die Notarzt/Notärztin durchgeführt"
                },
                {
                    "aNo": 4,
                    "aT": "Notfallbeatmungstuch über den Mund der erkrankten Person legen, Kopf nackenwärts überstrecken, Nase zuhalten und 2 Mal beatmen"
                }
            ],
            "c": [
                2,
                4
            ]
        },
        {
            "q": "Wie wird das Bewusstsein überprüft?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Reglose Person massieren, bis der:die Notarzt/Notärztin eintrifft"
                },
                {
                    "aNo": 2,
                    "aT": "Durch lautes Ansprechen und sanftes Schütteln an den Schultern"
                },
                {
                    "aNo": 3,
                    "aT": "Pupillenreflexe der reglosen Person mit einer (Handy-)Taschenlampe überprüfen"
                },
                {
                    "aNo": 4,
                    "aT": "Schmerzreiz am Handrücken durchführen"
                }
            ],
            "c": [
                2
            ]
        },
        {
            "q": "Welche Lagerung wird bei einer reglosen Person mit normaler Atmung durchgeführt?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Oberkörper-Hochlagerung"
                },
                {
                    "aNo": 2,
                    "aT": "Lagerung ohne Veränderung der Körperhaltung"
                },
                {
                    "aNo": 3,
                    "aT": "Deckenrolle unter dem Knie"
                },
                {
                    "aNo": 4,
                    "aT": "Stabile Seitenlage"
                }
            ],
            "c": [
                4
            ]
        },
        {
            "q": "Wie soll ein:e Ersthelfer:in weiter vorgehen, wenn festgestellt wird, dass die reglose Person atmet, die Atmung aber nicht normal ist?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Stabile Seitenlage durchführen"
                },
                {
                    "aNo": 2,
                    "aT": "Wiederbelebung beginnen"
                },
                {
                    "aNo": 3,
                    "aT": "Erkrankte:n liegen lassen und auf Rettungsdienst warten"
                },
                {
                    "aNo": 4,
                    "aT": "Erkrankte:n 2-mal beatmen"
                }
            ],
            "c": [
                2
            ]
        },
        {
            "q": "Welche Schritte sind als nächstes durchzuführen, wenn der:die Verletzte auf lautes Ansprechen und sanftes Schütteln nicht reagiert?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Hilferuf, Atmung kontrollieren, Atemwege freimachen"
                },
                {
                    "aNo": 2,
                    "aT": "Stabile Seitenlage durchführen"
                },
                {
                    "aNo": 3,
                    "aT": "Vor dem Eintreffen des Rettungsdienstes sind keine weiteren Maßnahmen erforderlich"
                },
                {
                    "aNo": 4,
                    "aT": "Hilferuf, Atemwege freimachen, Atmung kontrollieren"
                }
            ],
            "c": [
                4
            ]
        },
        {
            "q": "Wie wird die stabile Seitenlage korrekt durchgeführt?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Arm zur Seite legen, gegenüberliegendes Knie hochziehen, Handgelenk aufs Knie legen und herdrehen"
                },
                {
                    "aNo": 2,
                    "aT": "Arm nach oben legen, gegenüberliegendes Knie hochziehen und herdrehen"
                },
                {
                    "aNo": 3,
                    "aT": "Arm zur Seite legen, gegenüberliegendes Knie hochziehen, Ellbogen aufs Knie und herdrehen"
                },
                {
                    "aNo": 4,
                    "aT": "Beide Arme zur Seite legen, gegenüberliegendes Knie hochziehen und herdrehen"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Ausrüstung kann Ersthelfer:innen vor Infektionen schützen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Beatmungstuch"
                },
                {
                    "aNo": 2,
                    "aT": "Einmalhandschuhe"
                },
                {
                    "aNo": 3,
                    "aT": "Taschentuch"
                },
                {
                    "aNo": 4,
                    "aT": "Rettungsdecke"
                }
            ],
            "c": [
                1,
                2
            ]
        },
        {
            "q": "Wie gehen Sie bei der Wiederbelebung einer erwachsenen Person als trainierte:r Ersthelfer:in vor?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "3 Herzdruckmassagen / 1 Beatmung"
                },
                {
                    "aNo": 2,
                    "aT": "10 Herzdruckmassagen / 5 Beatmungen"
                },
                {
                    "aNo": 3,
                    "aT": "15 Herzdruckmassagen / 2 Beatmungen"
                },
                {
                    "aNo": 4,
                    "aT": "30 Herzdruckmassagen / 2 Beatmungen"
                }
            ],
            "c": [
                4
            ]
        },
        {
            "q": "Wann spricht man von einer reglosen Person?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Person reagiert nur auf Schmerzreize wie Zwicken in die Wangen"
                },
                {
                    "aNo": 2,
                    "aT": "Person ist verwirrt und kann sich an nichts erinnern"
                },
                {
                    "aNo": 3,
                    "aT": "Keine Reaktion auf lautes Ansprechen und sanftes Schütteln"
                },
                {
                    "aNo": 4,
                    "aT": "Bewusstseinslage kann durch die:den Ersthelfer:in nicht überprüft werden"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Was bedeutet die Abkürzung „AED“?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Automatisierte - Energiegeladene - Darreichung"
                },
                {
                    "aNo": 2,
                    "aT": "Automatisierte - Erdgas - Dauerfunktion"
                },
                {
                    "aNo": 3,
                    "aT": "Automatisierter - Externer- Defibrillator"
                },
                {
                    "aNo": 4,
                    "aT": "Automatisierter - Elektrischer- Druck"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Welche Aussagen treffen bei einer reglosen Person zu?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "In Rückenlage besteht Lebensgefahr durch Ersticken"
                },
                {
                    "aNo": 2,
                    "aT": "Stabile Seitenlage ist die optimale Lagerung, wenn normale Atmung feststellbar ist"
                },
                {
                    "aNo": 3,
                    "aT": "In Rückenlage besteht keine Lebensgefahr"
                },
                {
                    "aNo": 4,
                    "aT": "Falls keine normale Atmung feststellbar, mit Wiederbelebung starten"
                }
            ],
            "c": [
                1,
                2,
                4
            ]
        },
        {
            "q": "In welchem Alter darf von Ersthelfer:innen ein Defibrillator verwendet werden?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Ab dem 1. Lebensjahr"
                },
                {
                    "aNo": 2,
                    "aT": "Ab dem 8. Lebensjahr"
                },
                {
                    "aNo": 3,
                    "aT": "Ab Beginn der Pubertät"
                },
                {
                    "aNo": 4,
                    "aT": "In jedem Alter"
                }
            ],
            "c": [
                4
            ]
        },
        {
            "q": "Was bedeutet „defibrillieren“?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "elektrisieren"
                },
                {
                    "aNo": 2,
                    "aT": "früh erkennen"
                },
                {
                    "aNo": 3,
                    "aT": "entflimmern"
                },
                {
                    "aNo": 4,
                    "aT": "reanimieren"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind durchzuführen, sobald der:die Erkrankte in die stabile Seitenlage gebracht wurde?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Elektroden des Defibrillators am Brustkorb anbringen"
                },
                {
                    "aNo": 2,
                    "aT": "Basismaßnahmen durchführen"
                },
                {
                    "aNo": 3,
                    "aT": "Spätestens jetzt Notruf wählen, regelmäßige Atemkontrollen"
                },
                {
                    "aNo": 4,
                    "aT": "Sofort mit Herzdruckmassage und Beatmung beginnen"
                }
            ],
            "c": [
                2,
                3
            ]
        },
        {
            "q": "Welche Aussagen treffen bezüglich Defibrillation zu?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Die Defibrillation darf in jedem Alter angewendet werden"
                },
                {
                    "aNo": 2,
                    "aT": "Die Defibrillation darf nur von Sanitäter:innen angewendet werden"
                },
                {
                    "aNo": 3,
                    "aT": "Die Defibrillation darf nur von einem Arzt/einer Ärztin angewendet werden"
                },
                {
                    "aNo": 4,
                    "aT": "Die rechtliche Situation besagt, dass die Defibrillation in einer Notsituation unbedenklich ist"
                }
            ],
            "c": [
                1,
                4
            ]
        },
        {
            "q": "Welche Maßnahmen führen Sie bei einer reglosen Person mit normaler Atmung durch?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Stabile Seitenlage zum Freihalten der Atemwege"
                },
                {
                    "aNo": 2,
                    "aT": "Auf dem Rücken liegend und mit überstrecktem Kopf lagern"
                },
                {
                    "aNo": 3,
                    "aT": "Flache Rückenlagerung und Beine hochlagern"
                },
                {
                    "aNo": 4,
                    "aT": "Erhöhter Oberkörper für die Entlastung des Herzens"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Was soll ein:e Ersthelfer:in bei der Defibrillation beachten?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Elektroden fest auf den Brustkorb kleben"
                },
                {
                    "aNo": 2,
                    "aT": "Während Schockabgabe die erkrankte Person nicht berühren"
                },
                {
                    "aNo": 3,
                    "aT": "Nassen Brustkorb vorher abtrocknen"
                },
                {
                    "aNo": 4,
                    "aT": "Während Schockabgabe die zu defibrillierende Person berühren (Qualitätskontrolle)"
                }
            ],
            "c": [
                1,
                2,
                3
            ]
        },
        {
            "q": "Welche Handgriffe führen Sie vor einer Mund-zu-Mund-Beatmung durch?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Kinn hochziehen"
                },
                {
                    "aNo": 2,
                    "aT": "Nase zuhalten"
                },
                {
                    "aNo": 3,
                    "aT": "Arm im rechten Winkel zur Seite legen"
                },
                {
                    "aNo": 4,
                    "aT": "Stabile Seitenlage"
                }
            ],
            "c": [
                1,
                2
            ]
        },
        {
            "q": "Wenn ein:e Erwachsene:r nicht ansprechbar ist und nicht normal atmet, rufen Sie den Rettungsdienst und...",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Führen die stabile Seitenlage durch"
                },
                {
                    "aNo": 2,
                    "aT": "Führen sofort Beatmungen durch"
                },
                {
                    "aNo": 3,
                    "aT": "Beginnen sofort mit der Herzdruckmassage"
                },
                {
                    "aNo": 4,
                    "aT": "Versuchen eine Lagerung mit erhöhten Beinen"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Aus welchen Schritten besteht der Notfallcheck?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Atemwege freimachen und Atmung kontrollieren"
                },
                {
                    "aNo": 2,
                    "aT": "Notfallcheck dürfen nur Sanitäter:innen oder Notarzt/Notärztinnen durchführen"
                },
                {
                    "aNo": 3,
                    "aT": "Laut ansprechen und sanft schütteln, Hilferuf"
                },
                {
                    "aNo": 4,
                    "aT": "Atemkontrolle nicht länger als 10 Sekunden durchführen"
                }
            ],
            "c": [
                1,
                3,
                4
            ]
        },
        {
            "q": "Welche Aussagen zur Herzdruckmassage im Rahmen der Ersten Hilfe sind korrekt?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Beide Arme des Helfers durchstrecken"
                },
                {
                    "aNo": 2,
                    "aT": "Störende Kleidung der erkrankten Person entfernen (dicke Mäntel etc.)"
                },
                {
                    "aNo": 3,
                    "aT": "Erkrankte Person auf eine harte Unterlage legen"
                },
                {
                    "aNo": 4,
                    "aT": "Auf die Mitte des Brustkorbes schnell und kräftig drücken"
                }
            ],
            "c": [
                1,
                2,
                3,
                4
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind bei einem Atem-Kreislauf-Stillstand durchzuführen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Zweimalige Beatmung und danach den Notruf absetzen"
                },
                {
                    "aNo": 2,
                    "aT": "Einen Defibrillator und Verbandskasten holen lassen"
                },
                {
                    "aNo": 3,
                    "aT": "Notruf absetzen und Beatmungen durchführen"
                },
                {
                    "aNo": 4,
                    "aT": "Notruf absetzen und sofort Herzdruckmassagen und Beatmungen (30:2) durchführen"
                }
            ],
            "c": [
                2,
                4
            ]
        },
        {
            "q": "Welche Vorgehensweise ist bei der Anwendung eines Defibrillators korrekt?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Defibrillator einschalten und den Anweisungen des Geräts folgen"
                },
                {
                    "aNo": 2,
                    "aT": "Während Schockabgabe Herzdruckmassage durchführen"
                },
                {
                    "aNo": 3,
                    "aT": "Elektroden aufkleben und dann erst Defibrillator einschalten"
                },
                {
                    "aNo": 4,
                    "aT": "Solange eine Beatmung durchgeführt wird: keine Elektroden aufkleben"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Womit sichert ein:e Ersthelfer:in bei einem Verkehrsunfall ab?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Warndreieck"
                },
                {
                    "aNo": 2,
                    "aT": "Feuerlöscher"
                },
                {
                    "aNo": 3,
                    "aT": "Warnblinkanlage"
                },
                {
                    "aNo": 4,
                    "aT": "Blaulicht"
                }
            ],
            "c": [
                1,
                3
            ]
        },
        {
            "q": "Wann muss ein Warndreieck auf Freilandstraßen aufgestellt werden?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Bei Nebel muss kein Warndreieck aufgestellt werden"
                },
                {
                    "aNo": 2,
                    "aT": "Wenn das Fahrzeug auf einer unübersichtlichen Straßenstelle zum Stillstand gekommen ist"
                },
                {
                    "aNo": 3,
                    "aT": "Wenn das Fahrzeug bei schlechter Sicht zum Stillstand gekommen ist"
                },
                {
                    "aNo": 4,
                    "aT": "Wenn noch kein Notruf abgesetzt wurde"
                }
            ],
            "c": [
                2,
                3
            ]
        },
        {
            "q": "Warum muss der Helm abgenommen werden, wenn der:die Verletzte nicht reagiert?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Aus versicherungstechnischen Gründen"
                },
                {
                    "aNo": 2,
                    "aT": "Gefahr einer Wirbelsäulenverletzung"
                },
                {
                    "aNo": 3,
                    "aT": "Um die Atmung zu erleichtern"
                },
                {
                    "aNo": 4,
                    "aT": "Um die Atmung zu überprüfen"
                }
            ],
            "c": [
                3,
                4
            ]
        },
        {
            "q": "Welche Schritte gehören zum Rautekgriff beim Retten aus einem PKW?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Oberkörper stützen, Gurt entfernen"
                },
                {
                    "aNo": 2,
                    "aT": "Schlüssel abziehen und Handbremse ziehen"
                },
                {
                    "aNo": 3,
                    "aT": "Verletzte:n auf den eigenen Oberschenkel ziehen bzw. setzen"
                },
                {
                    "aNo": 4,
                    "aT": "Deaktivierung der Airbags, falls diese nicht ausgelöst haben"
                }
            ],
            "c": [
                1,
                3
            ]
        },
        {
            "q": "Wie verhalten Sie sich bei einem Verkehrsunfall mit einer reglosen Person im Fahrzeug?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Fremdschutz geht vor Selbstschutz"
                },
                {
                    "aNo": 2,
                    "aT": "Falls möglich: Rettung aus dem Fahrzeug"
                },
                {
                    "aNo": 3,
                    "aT": "Selbstschutz beachten"
                },
                {
                    "aNo": 4,
                    "aT": "In ausreichendem Abstand absichern"
                }
            ],
            "c": [
                2,
                3,
                4
            ]
        },
        {
            "q": "Die GAMS-Regel erläutert dem Ersthelfer richtiges Verhalten bei Gefahr. „G“ steht für Gefahr erkennen, „A“ für Abstand halten, „S“ steht für Spezialkräfte anfordern und „M“ für?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Menschenrettung durchführen (falls gefahrlos möglich)"
                },
                {
                    "aNo": 2,
                    "aT": "Medizinisches Personal herbeiziehen (Rettungsdienst)"
                },
                {
                    "aNo": 3,
                    "aT": "Material überprüfen (Verbandskasten)"
                },
                {
                    "aNo": 4,
                    "aT": "Mund öffnen (stabile Seitenlage)"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Welchen Grundsatz soll jede:r Ersthelfer:in in einer Gefahrenzone beachten?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Es gibt nie ein Gefahrenpotential bei der Leistung von Erster Hilfe"
                },
                {
                    "aNo": 2,
                    "aT": "Selbstschutz geht vor Fremdschutz"
                },
                {
                    "aNo": 3,
                    "aT": "Fremdschutz geht vor Eigenschutz"
                },
                {
                    "aNo": 4,
                    "aT": "Dem:der Mutigen gehört die Welt"
                }
            ],
            "c": [
                2
            ]
        },
        {
            "q": "Wann und wozu schalten Sie die Warnblinkanlage ein?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Vor dem Anlegen der Warnweste"
                },
                {
                    "aNo": 2,
                    "aT": "Nach dem Anlegen der Warnweste"
                },
                {
                    "aNo": 3,
                    "aT": "Wenn Gefahr vom eigenen Fahrzeug ausgeht"
                },
                {
                    "aNo": 4,
                    "aT": "Wenn Sie vor Gefahren warnen wollen"
                }
            ],
            "c": [
                1,
                3,
                4
            ]
        },
        {
            "q": "Durch starke Sonnenbestrahlung kann es zu Kopfschmerzen, Übelkeit, Erbrechen, Bewusstseinsstörungen, Krämpfen etc. kommen. Mit welchen Notfällen ist zu rechnen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Sonnenallergie"
                },
                {
                    "aNo": 2,
                    "aT": "Hitzenotfall"
                },
                {
                    "aNo": 3,
                    "aT": "Schlaganfall"
                },
                {
                    "aNo": 4,
                    "aT": "Nasenbluten"
                }
            ],
            "c": [
                2
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind bei einem Krampfanfall korrekt?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Zunge festhalten, um Zungenbiss zu vermeiden"
                },
                {
                    "aNo": 2,
                    "aT": "Während des Krampfs vor weiteren Verletzungen schützen (z. B. Sessel wegstellen)"
                },
                {
                    "aNo": 3,
                    "aT": "Nach dem Krampfanfall Atmung überprüfen"
                },
                {
                    "aNo": 4,
                    "aT": "Wenn Erkrankte:r nach dem Krampf ansprechbar ist: Seitenlagerung empfohlen"
                }
            ],
            "c": [
                2,
                3,
                4
            ]
        },
        {
            "q": "Welche Anzeichen können auf einen Schlaganfall deuten?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Plötzliche Schwäche, Gefühlsstörung oder Lähmung einer Körperseite"
                },
                {
                    "aNo": 2,
                    "aT": "Heißer Kopf"
                },
                {
                    "aNo": 3,
                    "aT": "Akute Bauchschmerzen"
                },
                {
                    "aNo": 4,
                    "aT": "Erkrankte:r kann keinen einfachen Satz nachsprechen"
                }
            ],
            "c": [
                1,
                4
            ]
        },
        {
            "q": "Bei welchen Erkrankungen wird eine Lagerung mit erhöhtem Oberkörper empfohlen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Allergische Reaktion"
                },
                {
                    "aNo": 2,
                    "aT": "Herzbeschwerden"
                },
                {
                    "aNo": 3,
                    "aT": "Hitzenotfall"
                },
                {
                    "aNo": 4,
                    "aT": "Asthmaanfall"
                }
            ],
            "c": [
                1,
                2,
                3,
                4
            ]
        },
        {
            "q": "Bei welchen Notfällen ist eine Seitenlage sinnvoll?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Bewusstseinsstörung"
                },
                {
                    "aNo": 2,
                    "aT": "Gefahr des Erbrechens"
                },
                {
                    "aNo": 3,
                    "aT": "Herzbeschwerden mit Atemnot"
                },
                {
                    "aNo": 4,
                    "aT": "Bei verstauchtem Knöchel"
                }
            ],
            "c": [
                1,
                2
            ]
        },
        {
            "q": "Welche Gefahren bestehen bei einem Stich, z. B. von einer Biene?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Schwellung und Rötung des Gewebes im Bereich der Einstichstelle"
                },
                {
                    "aNo": 2,
                    "aT": "Gefahr einer schweren allergischen Reaktion"
                },
                {
                    "aNo": 3,
                    "aT": "Schwellungen im Bereich der Atemwege"
                },
                {
                    "aNo": 4,
                    "aT": "Unterzuckerung"
                }
            ],
            "c": [
                1,
                2,
                3
            ]
        },
        {
            "q": "Welche der angeführten Erste-Hilfe-Maßnahmen sind bei einem Schlaganfall zu setzen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Notruf"
                },
                {
                    "aNo": 2,
                    "aT": "Seitenlage empfohlen"
                },
                {
                    "aNo": 3,
                    "aT": "Basismaßnahmen"
                },
                {
                    "aNo": 4,
                    "aT": "Die betroffene Körperregion möglichst hochhalten"
                }
            ],
            "c": [
                1,
                2,
                3
            ]
        },
        {
            "q": "Was können Anzeichen für einen Herzinfarkt sein?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Kopfschmerzen und Ohrensausen"
                },
                {
                    "aNo": 2,
                    "aT": "Schmerzen in der Brust"
                },
                {
                    "aNo": 3,
                    "aT": "Engegefühl in der Brust"
                },
                {
                    "aNo": 4,
                    "aT": "Angst, Atemnot"
                }
            ],
            "c": [
                2,
                3,
                4
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind bei einer Vergiftung durchzuführen, wenn das Gift bekannt ist und der:die Betroffene ansprechbar ist und normal reagiert?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Zuerst Notruf, dann Vergiftungsinformationszentrale kontaktieren und Anweisungen folgen"
                },
                {
                    "aNo": 2,
                    "aT": "Sofort schluckweise Wasser zum Trinken geben; falls keine Besserung Notruf wählen"
                },
                {
                    "aNo": 3,
                    "aT": "Zum Erbrechen bringen"
                },
                {
                    "aNo": 4,
                    "aT": "Seitenlage durchführen"
                }
            ],
            "c": [
                1,
                4
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind bei einem Verdacht eines Herzinfarkts zu setzen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Notruf verständigen, Defibrillator und Verbandskasten holen lassen"
                },
                {
                    "aNo": 2,
                    "aT": "Lagerung mit erhöhten Beinen"
                },
                {
                    "aNo": 3,
                    "aT": "Beruhigen der Person"
                },
                {
                    "aNo": 4,
                    "aT": "Falls nach 1 Stunde keine Besserung: Hausarzt aufsuchen"
                }
            ],
            "c": [
                1,
                3
            ]
        },
        {
            "q": "Durch körperliche Anstrengung in heißer oder feuchtwarmer Umgebung kann es zu einem Wärmestau und zu einer Erhöhung der Körpertemperatur kommen. Wie nennt man dieses Krankheitsbild?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Hexenschuss"
                },
                {
                    "aNo": 2,
                    "aT": "Hypertonie"
                },
                {
                    "aNo": 3,
                    "aT": "Hitzschlag"
                },
                {
                    "aNo": 4,
                    "aT": "Hyperventilation"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Bei welchem Notfall muss nicht immer sofort der Rettungsdienst verständigt werden?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Schmerzen in der Brust"
                },
                {
                    "aNo": 2,
                    "aT": "Taubheitsgefühl in einer Körperhälfte"
                },
                {
                    "aNo": 3,
                    "aT": "Asthmaanfall"
                },
                {
                    "aNo": 4,
                    "aT": "Kollaps"
                }
            ],
            "c": [
                4
            ]
        },
        {
            "q": "Welche Aussagen treffen bei einer Vergiftung zu?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Eine Vergiftung kann einen lebensbedrohlichen Zustand hervorrufen"
                },
                {
                    "aNo": 2,
                    "aT": "Vergiftungen entstehen am häufigsten bei Gefahrgutunfällen"
                },
                {
                    "aNo": 3,
                    "aT": "Nur bei Aufnahme großer Mengen schädlicher Substanzen kann von einer Vergiftung gesprochen werden"
                },
                {
                    "aNo": 4,
                    "aT": "Nur feste Stoffe können Vergiftungen hervorrufen"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Welche typischen Warnzeichen weisen auf einen Schlaganfall hin?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Plötzliche Schwäche oder Gefühlsstörungen einer Körperseite, besonders im Gesicht oder im Arm"
                },
                {
                    "aNo": 2,
                    "aT": "Schwindel, Gangunsicherheit und Verwirrtheit"
                },
                {
                    "aNo": 3,
                    "aT": "Erkrankte:r kann keinen einfachen Satz nachsprechen"
                },
                {
                    "aNo": 4,
                    "aT": "Schnelle Atmung (hyperventilieren)"
                }
            ],
            "c": [
                1,
                2,
                3
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind bei einem Asthmaanfall zu setzen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Notruf 144 verständigen, Lagerung mit erhöhtem Oberkörper"
                },
                {
                    "aNo": 2,
                    "aT": "1450 verständigen, Lagerung mit erhöhten Beinen"
                },
                {
                    "aNo": 3,
                    "aT": "Notfallmedikamente sollen eingenommen werden"
                },
                {
                    "aNo": 4,
                    "aT": "Kühlung der Atemwege, z. B. mit Eiswürfeln von innen und von außen"
                }
            ],
            "c": [
                1,
                3
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind nach einer Vergiftung durchzuführen? Die Person ist nicht ansprechbar.",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Giftentfernung durch provoziertes Erbrechen"
                },
                {
                    "aNo": 2,
                    "aT": "Überprüfung der Atmung: stabile Seitenlage oder Wiederbelebung durchführen"
                },
                {
                    "aNo": 3,
                    "aT": "Bei nicht vorhandener Atmung Verzicht auf Herzdruckmassage"
                },
                {
                    "aNo": 4,
                    "aT": "Bei Tabletten in den Atemwegen: Heimlich-Manöver im Liegen durchführen"
                }
            ],
            "c": [
                2
            ]
        },
        {
            "q": "Welche Erste-Hilfe-Maßnahmen sind beim Verdacht der Blutzuckerentgleisung bei einem Diabetiker zu setzen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Wenn die betroffene Person ansprechbar ist, soll Zuckerhaltiges zu trinken oder zu essen verabreicht werden"
                },
                {
                    "aNo": 2,
                    "aT": "Lagerung: Seitenlagerung"
                },
                {
                    "aNo": 3,
                    "aT": "Lagerung: mit erhöhten Beinen"
                },
                {
                    "aNo": 4,
                    "aT": "Notruf absetzen"
                }
            ],
            "c": [
                1,
                3,
                4
            ]
        },
        {
            "q": "Bei welchen Notfällen wird eine Lagerung mit erhöhtem Oberkörper empfohlen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Atemnot"
                },
                {
                    "aNo": 2,
                    "aT": "Herzbeschwerden"
                },
                {
                    "aNo": 3,
                    "aT": "Starke Blutung"
                },
                {
                    "aNo": 4,
                    "aT": "Kollaps"
                }
            ],
            "c": [
                1,
                2
            ]
        },
        {
            "q": "Bei Verdacht auf Schlaganfall wendet der:die Ersthelfer:in den FAST-Test an. F steht für Face (Gesicht), S steht für Speech (Sprache), T steht für Time (Zeit). Wofür steht das „A“ bei FAST?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Apoplexie (Schlaganfall)"
                },
                {
                    "aNo": 2,
                    "aT": "Arms (Arme)"
                },
                {
                    "aNo": 3,
                    "aT": "Arrhythmie (Unregelmäßigkeit)"
                },
                {
                    "aNo": 4,
                    "aT": "Azidose (Übersäuerung)"
                }
            ],
            "c": [
                2
            ]
        },
        {
            "q": "Was sind Erste-Hilfe-Maßnahmen bei einem Kollaps?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Beine hochlagern"
                },
                {
                    "aNo": 2,
                    "aT": "Warme gezuckerte Getränke verabreichen"
                },
                {
                    "aNo": 3,
                    "aT": "Sollte sich der Zustand nicht rasch bessern: Rettungsdienst verständigen"
                },
                {
                    "aNo": 4,
                    "aT": "Eis zum Lutschen verabreichen"
                }
            ],
            "c": [
                1,
                3
            ]
        },
        {
            "q": "Wie lautet die Telefonnummer der Vergiftungsinformationszentrale (VIZ)?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "01/43 43 43"
                },
                {
                    "aNo": 2,
                    "aT": "01/144"
                },
                {
                    "aNo": 3,
                    "aT": "01/0800 133 133"
                },
                {
                    "aNo": 4,
                    "aT": "01/406 43 43"
                }
            ],
            "c": [
                4
            ]
        },
        {
            "q": "Welches Prinzip wird verwendet, um bei einem psychiatrischen Notfall zu unterstützen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Das Look-Listen-Link Prinzip"
                },
                {
                    "aNo": 2,
                    "aT": "Das FAST Prinzip"
                },
                {
                    "aNo": 3,
                    "aT": "Das STOP Prinzip"
                },
                {
                    "aNo": 4,
                    "aT": "Das Feel-Hear-Soul Prinzip"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Welche Telefonnummern kann man in Österreich für Beratung in psychisch belastenden Situationen wählen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "01/406 43 43"
                },
                {
                    "aNo": 2,
                    "aT": "116 123"
                },
                {
                    "aNo": 3,
                    "aT": "147"
                },
                {
                    "aNo": 4,
                    "aT": "142"
                }
            ],
            "c": [
                2,
                3,
                4
            ]
        },
        {
            "q": "Eine Person befindet sich in einer psychisch belastenden Situation. In welchem Fall muss man sofort den Rettungsdienst verständigen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Wenn die betroffene Person eine geringe Verhaltensänderung zeigt"
                },
                {
                    "aNo": 2,
                    "aT": "Wenn die betroffene Person 3 Tage hintereinander schlecht geschlafen hat"
                },
                {
                    "aNo": 3,
                    "aT": "Bei Selbst- oder Fremdgefährdung"
                },
                {
                    "aNo": 4,
                    "aT": "Wenn die betroffene Personen nicht gut erklären, was sie braucht"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Etwa wieviel Prozent der Unfälle passieren zu Hause/in der Freizeit/beim Sport?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "10"
                },
                {
                    "aNo": 2,
                    "aT": "50"
                },
                {
                    "aNo": 3,
                    "aT": "75"
                },
                {
                    "aNo": 4,
                    "aT": "95"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Welche Maßnahmen sind nach einer Bissverletzung (Haustier) zu setzen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Wunde mit Wasser spülen, verbinden und sofort ärztlich versorgen lassen"
                },
                {
                    "aNo": 2,
                    "aT": "Wunde mit Händedesinfektion desinfizieren, verbinden"
                },
                {
                    "aNo": 3,
                    "aT": "Wunde verbinden und nach 2 Tagen ärztlich begutachten lassen"
                },
                {
                    "aNo": 4,
                    "aT": "Wunde mit erträglich heißem Seifenwasser spülen und verbinden"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Welche der angeführten Erste-Hilfe-Maßnahmen sind bei Nasenbluten zu setzen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Verletzte:n hinsetzen und den Kopf nach vorne beugen lassen, Nasenflügel zudrücken"
                },
                {
                    "aNo": 2,
                    "aT": "Verletzte:n hinsetzen und den Kopf nackenwärts beugen lassen"
                },
                {
                    "aNo": 3,
                    "aT": "Kaltes Tuch in den Nacken legen"
                },
                {
                    "aNo": 4,
                    "aT": "Zuckerhaltige Getränke verabreichen"
                }
            ],
            "c": [
                1,
                3
            ]
        },
        {
            "q": "Welche Aussagen treffen bei Verbrennungen zu?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "10 Minuten mit Wasser spülen"
                },
                {
                    "aNo": 2,
                    "aT": "Bis zu 10 Minuten mit handwarmem Wasser spülen"
                },
                {
                    "aNo": 3,
                    "aT": "Ausgiebig mit Wasser spülen (keine Temperatur- und Zeitvorgabe)"
                },
                {
                    "aNo": 4,
                    "aT": "Verbrennungen werden nicht gespült, sondern nur locker und steril verbunden"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Wie sind Augenverätzungen zu versorgen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Sofort Augenarzt kontaktieren"
                },
                {
                    "aNo": 2,
                    "aT": "10 Minuten mit handwarmem Wasser spülen und Notruf wählen"
                },
                {
                    "aNo": 3,
                    "aT": "Sofort und ausgiebig mit Wasser spülen und Notruf wählen"
                },
                {
                    "aNo": 4,
                    "aT": "Nach dem Spülen des verätzten Auges über beide Augen einen Verband anlegen"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Welche Lagerung wird bei einer Kopfverletzung empfohlen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Stabile Seitenlage"
                },
                {
                    "aNo": 2,
                    "aT": "Bein-Hochlagerung"
                },
                {
                    "aNo": 3,
                    "aT": "Oberkörper-Hochlagerung"
                },
                {
                    "aNo": 4,
                    "aT": "Keine spezielle Lagerung"
                }
            ],
            "c": [
                3
            ]
        },
        {
            "q": "Was machen Sie, wenn ein:e verletzte:r Motorradfahrer:in außerhalb einer Gefahrenzone auf dem Bauch liegt und nicht reagiert?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Umdrehen und Helm abnehmen"
                },
                {
                    "aNo": 2,
                    "aT": "Umdrehen und Helm aufgesetzt lassen"
                },
                {
                    "aNo": 3,
                    "aT": "Helm in Bauchlage abnehmen"
                },
                {
                    "aNo": 4,
                    "aT": "Stabile Seitenlage mit Helm durchführen"
                }
            ],
            "c": [
                1
            ]
        },
        {
            "q": "Was können Hinweise auf eine Knochen-/ Gelenkverletzung sein?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Bewegungsunfähigkeit oder Bewegungseinschränkung"
                },
                {
                    "aNo": 2,
                    "aT": "Schmerzen, Schwellung"
                },
                {
                    "aNo": 3,
                    "aT": "Abnorme Stellung"
                },
                {
                    "aNo": 4,
                    "aT": "Große Beweglichkeit"
                }
            ],
            "c": [
                1,
                2,
                3
            ]
        },
        {
            "q": "Wann kann es bei einer Knochen-/ Gelenkverletzung sinnvoll sein, den Notruf zu wählen?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "In der Nacht, damit ich Angehörige/Nachbarn nicht bitten muss, mich ins Krankenhaus zu bringen"
                },
                {
                    "aNo": 2,
                    "aT": "Wenn mir öffentliche Verkehrsmittel zu teuer sind"
                },
                {
                    "aNo": 3,
                    "aT": "Bei starken Schmerzen"
                },
                {
                    "aNo": 4,
                    "aT": "Bei einer Verletzung der Hüfte oder des Oberarms"
                }
            ],
            "c": [
                3,
                4
            ]
        },
        {
            "q": "Wie kann ich bei einer Knochen-/ Gelenkverletzung Erste Hilfe leisten?",
            "a": [
                {
                    "aNo": 1,
                    "aT": "Bei einer Verrenkung der Schulter ist diese vorsichtig von Ersthelfer:innen einzurenken"
                },
                {
                    "aNo": 2,
                    "aT": "Bei einem Armbruch kann ein Dreiecktuch angelegt werden"
                },
                {
                    "aNo": 3,
                    "aT": "Bei einer Verstauchung des Fußes wird mit heißen Umschlägen therapiert"
                },
                {
                    "aNo": 4,
                    "aT": "Generell gilt: Ruhigstellen – kühlen – Beengendes entfernen/lockern"
                }
            ],
            "c": [
                2,
                4
            ]
        }
    ]
}

},{}]},{},[4]);
