const words = ["ALIBI", "CRIME", "MOTIVE", "WEAPON", "GUESS"];
const clues = [
    "The murderer had a motive...",
    "The crime scene revealed a clue...",
    "The suspect left behind a weapon...",
    "Witnesses heard a noise...",
    "Who could the suspect be?",
];

let currentWord = words[Math.floor(Math.random() * words.length)];
let currentClue = 0;

const board = document.getElementById("board");
const clueElement = document.getElementById("clue");
const resultElement = document.getElementById("result");

const maxGuesses = 6;
let guesses = [];
let currentGuess = "";

function setupBoard() {
    board.innerHTML = "";
    for (let i = 0; i < maxGuesses * 5; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        board.appendChild(tile);
    }
}

function updateBoard() {
    const tiles = board.querySelectorAll(".tile");
    let index = guesses.length * 5;
    currentGuess.split("").forEach((letter, i) => {
        tiles[index + i].textContent = letter;
    });

    // Clear remaining tiles in the row
    for (let i = currentGuess.length; i < 5; i++) {
        tiles[index + i].textContent = "";
    }
}

function submitGuess() {
    if (currentGuess.length !== 5) return;

    const tiles = board.querySelectorAll(".tile");
    const feedback = [];
    let index = guesses.length * 5;

    for (let i = 0; i < currentGuess.length; i++) {
        const letter = currentGuess[i];
        if (letter === currentWord[i]) {
            feedback.push("correct");
        } else if (currentWord.includes(letter)) {
            feedback.push("present");
        } else {
            feedback.push("absent");
        }
    }

    feedback.forEach((status, i) => {
        tiles[index + i].classList.add(status);
    });

    guesses.push(currentGuess);
    currentGuess = "";

    if (feedback.every((status) => status === "correct")) {
        resultElement.hidden = false;
        resultElement.textContent = "You solved the mystery!";
        document.removeEventListener("keydown", handleKeyInput);
        return;
    }

    if (guesses.length === maxGuesses) {
        resultElement.hidden = false;
        resultElement.textContent = `The word was ${currentWord}. Try again!`;
        document.removeEventListener("keydown", handleKeyInput);
        return;
    }

    currentClue++;
    clueElement.innerHTML = `<strong>Clue:</strong> ${clues[currentClue]}`;
}

function handleKeyInput(event) {
    const key = event.key.toUpperCase();

    if (key === "ENTER") {
        submitGuess();
    } else if (key === "BACKSPACE") {
        currentGuess = currentGuess.slice(0, -1);
        updateBoard();
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
        currentGuess += key;
        updateBoard();
    }
}

// Setup the game
setupBoard();
clueElement.innerHTML = `<strong>Clue:</strong> ${clues[currentClue]}`;
resultElement.hidden = true;

// Listen for keyboard input
document.addEventListener("keydown", handleKeyInput);
