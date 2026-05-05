const WORD_RATIO_REAL = 0.5; // 50% chance to show a real word

let score = parseInt(localStorage.getItem('streak')) || 0;
let currentWord = null;
let isReal = false;
let missedWords = JSON.parse(localStorage.getItem('missedWords')) || {};

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

function updateMissedWordsUI() {
    const words = Object.keys(missedWords);
    if (words.length > 0) {
        elements.missedWordsContainer.classList.remove('hidden');
        const displayArray = words.map(w => {
            const count = missedWords[w];
            return count > 1 ? `${w} x${count}` : w;
        });
        elements.missedWordsList.textContent = displayArray.join(', ');
    } else {
        elements.missedWordsContainer.classList.add('hidden');
    }
}

function handleGuess(userGuessedReal) {
    const isCorrect = userGuessedReal === isReal;
    
    if (isCorrect) {
        score++;
        localStorage.setItem('streak', score);
        elements.score.textContent = score;
        elements.resultStatus.textContent = "Correct";
        elements.resultStatus.className = "status-badge status-correct";
        elements.card.classList.add('is-correct');
    } else {
        score = 0; // Reset score on mistake
        localStorage.setItem('streak', score);
        elements.score.textContent = score;
        elements.resultStatus.textContent = "Incorrect";
        elements.resultStatus.className = "status-badge status-incorrect";
        elements.card.classList.add('is-incorrect');
        
        // Track if it was a real word but user guessed fake
        if (isReal && !userGuessedReal) {
            missedWords[currentWord.word] = (missedWords[currentWord.word] || 0) + 1;
            localStorage.setItem('missedWords', JSON.stringify(missedWords));
            updateMissedWordsUI();
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
elements.score.textContent = score;
updateMissedWordsUI();
setupNextWord();
