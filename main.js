const WORD_RATIO_REAL = 0.5; // 50% chance to show a real word

let score = parseInt(localStorage.getItem('streak')) || 0;
let bestScore = parseInt(localStorage.getItem('bestStreak')) || 0;
let currentWord = null;
let isReal = false;
let missedWords = JSON.parse(localStorage.getItem('missedWords')) || {};
let excludedWords = JSON.parse(localStorage.getItem('excludedWords')) || [];

if (excludedWords.length === 0 && !localStorage.getItem('excludedWordsInitializedV2')) {
    excludedWords = ["AB", "AD", "AH", "AN", "AS", "AT", "BE", "BY", "DO", "GO", "HA", "HI", "IF", "IN", "IS", "IT", "ME", "MY", "NO", "OF", "OH", "ON", "OR", "SO", "TO", "UP", "US", "WE", "YO"];
    localStorage.setItem('excludedWords', JSON.stringify(excludedWords));
    localStorage.setItem('excludedWordsInitializedV2', "true");
}

const elements = {
    score: document.getElementById('score'),
    bestScoreDisplay: document.getElementById('best-score'),
    btnClear: document.getElementById('btn-clear'),
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
    const validWords = scrabbleWords.filter(w => !excludedWords.includes(w.word));
    if (validWords.length === 0) return scrabbleWords[0];
    return validWords[Math.floor(Math.random() * validWords.length)];
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
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('bestStreak', bestScore);
            elements.bestScoreDisplay.textContent = bestScore;
        }
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
        
        // Track the missed word regardless of whether it's real or fake
        missedWords[currentWord.word] = (missedWords[currentWord.word] || 0) + 1;
        localStorage.setItem('missedWords', JSON.stringify(missedWords));
        updateMissedWordsUI();
    }

    elements.wordResult.textContent = currentWord.word;
    elements.definition.textContent = isReal ? currentWord.def : "Not a valid Scrabble word.";

    elements.card.classList.add('is-flipped');
    elements.guessingControls.classList.add('hidden');
    elements.nextControls.classList.remove('hidden');
}

function renderSettingsGrid() {
    const grid = document.getElementById('word-toggle-grid');
    grid.innerHTML = '';
    scrabbleWords.forEach(w => {
        const btn = document.createElement('div');
        btn.className = 'word-badge';
        if (excludedWords.includes(w.word)) {
            btn.classList.add('excluded');
        }
        btn.textContent = w.word;
        btn.addEventListener('click', () => {
            if (excludedWords.includes(w.word)) {
                excludedWords = excludedWords.filter(ew => ew !== w.word);
                btn.classList.remove('excluded');
            } else {
                excludedWords.push(w.word);
                btn.classList.add('excluded');
            }
            localStorage.setItem('excludedWords', JSON.stringify(excludedWords));
        });
        grid.appendChild(btn);
    });
}

elements.btnReal.addEventListener('click', () => handleGuess(true));
elements.btnFake.addEventListener('click', () => handleGuess(false));
elements.btnNext.addEventListener('click', setupNextWord);

document.getElementById('btn-settings').addEventListener('click', () => {
    document.getElementById('settings-view').classList.remove('hidden');
    renderSettingsGrid();
});

document.getElementById('btn-close-settings').addEventListener('click', () => {
    document.getElementById('settings-view').classList.add('hidden');
});

elements.btnClear.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear your streak and missed words? This will not affect your excluded words list.")) {
        score = 0;
        bestScore = 0;
        missedWords = {};
        localStorage.removeItem('streak');
        localStorage.removeItem('bestStreak');
        localStorage.removeItem('missedWords');
        elements.score.textContent = score;
        elements.bestScoreDisplay.textContent = bestScore;
        updateMissedWordsUI();
        setupNextWord();
        document.getElementById('settings-view').classList.add('hidden');
    }
});

// Initialize
elements.score.textContent = score;
elements.bestScoreDisplay.textContent = bestScore;
updateMissedWordsUI();
setupNextWord();
