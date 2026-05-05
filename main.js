const WORD_RATIO_REAL = 0.7; // 70% chance to show a real word

let score = 0;
let currentWord = null;
let isReal = false;
let missedWords = new Set();

const elements = {
    score: document.getElementById('score'),
    card: document.getElementById('card'),
    wordDisplay: document.getElementById('word-display'),
    wordResult: document.getElementById('word-result'),
    resultStatus: document.getElementById('result-status'),
    definition: document.getElementById('definition'),
    btnReal: document.getElementById('btn-real'),
    btnFake: document.getElementById('btn-fake'),
    btnNext: document.getElementById('btn-next'),
    guessingControls: document.getElementById('guessing-controls'),
    nextControls: document.getElementById('next-controls'),
    missedWordsContainer: document.getElementById('missed-words-container'),
    missedWordsList: document.getElementById('missed-words-list')
};

function getRandomRealWord() {
    return scrabbleWords[Math.floor(Math.random() * scrabbleWords.length)];
}

function getRandomFakeWord() {
    return fakeWords[Math.floor(Math.random() * fakeWords.length)];
}

function setupNextWord() {
    elements.card.classList.remove('is-flipped', 'is-correct', 'is-incorrect');
    elements.guessingControls.classList.remove('hidden');
    elements.nextControls.classList.add('hidden');
    elements.resultStatus.className = "status-badge";
    
    // Decide if next word is real or fake
    isReal = Math.random() < WORD_RATIO_REAL;
    
    if (isReal) {
        currentWord = getRandomRealWord();
        elements.wordDisplay.textContent = currentWord.word;
    } else {
        currentWord = { word: getRandomFakeWord(), def: "Not a valid Scrabble word." };
        elements.wordDisplay.textContent = currentWord.word;
    }
}

function handleGuess(userGuessedReal) {
    const isCorrect = userGuessedReal === isReal;
    
    if (isCorrect) {
        score++;
        elements.score.textContent = score;
        elements.resultStatus.textContent = "Correct";
        elements.resultStatus.className = "status-badge status-correct";
        elements.card.classList.add('is-correct');
    } else {
        score = 0; // Reset score on mistake
        elements.score.textContent = score;
        elements.resultStatus.textContent = "Incorrect";
        elements.resultStatus.className = "status-badge status-incorrect";
        elements.card.classList.add('is-incorrect');
        
        // Track if it was a real word but user guessed fake
        if (isReal && !userGuessedReal) {
            missedWords.add(currentWord.word);
            elements.missedWordsContainer.classList.remove('hidden');
            elements.missedWordsList.textContent = Array.from(missedWords).join(', ');
        }
    }

    elements.wordResult.textContent = currentWord.word;
    elements.definition.textContent = isReal ? currentWord.def : "Not a valid Scrabble word.";

    elements.card.classList.add('is-flipped');
    elements.guessingControls.classList.add('hidden');
    elements.nextControls.classList.remove('hidden');
}

elements.btnReal.addEventListener('click', () => handleGuess(true));
elements.btnFake.addEventListener('click', () => handleGuess(false));
elements.btnNext.addEventListener('click', setupNextWord);

// Initialize
setupNextWord();
