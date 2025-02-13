// Game Logic
const board = document.getElementById('board');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const levelDisplay = document.getElementById('level');
const resetButton = document.getElementById('reset');
const levelMessage = document.getElementById('levelMessage');

let cards = [];
let flippedCards = [];
let matchedCards = [];
let score = 0;
let level = 1;
let time = 0;
let timer;

const cardValues = ['🍎', '🍌', '🍒', '🍍', '🍓', '🍇', '🍉', '🍊']; // Card symbols
let totalCards = cardValues.concat(cardValues); // Duplicate for matching pairs

function shuffleCards() {
    return totalCards.sort(() => Math.random() - 0.5);
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerDisplay.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function resetGame() {
    clearInterval(timer);
    time = 0;
    score = 0;
    flippedCards = [];
    matchedCards = [];
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    timerDisplay.textContent = 'Time: 00:00';
    levelMessage.textContent = '';

    totalCards = cardValues.concat(cardValues); // Reset cards
    const shuffledCards = shuffleCards();
    board.innerHTML = '';
    shuffledCards.forEach((cardValue, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = cardValue;
        card.dataset.index = index;
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function flipCard(e) {
    const card = e.target;
    if (flippedCards.length < 2 && !card.classList.contains('flip') && !card.classList.contains('matched')) {
        card.classList.add('flip');
        card.textContent = card.dataset.value;
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedCards.push(card1, card2);
        score += 10;
        scoreDisplay.textContent = score;

        // Check if all cards are matched and increase level
        if (matchedCards.length === totalCards.length) {
            if (level < 10) {
                levelUp();
            } else {
                endGame();
            }
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            card1.textContent = '';
            card2.textContent = '';
        }, 1000);
    }

    flippedCards = [];
}

function levelUp() {
    level++;
    levelDisplay.textContent = level;
    score += 20; // Bonus points for leveling up

    // Show level-up message
    levelMessage.textContent = `Level ${level}`;
    levelMessage.classList.add('level-up-message');
    
    setTimeout(() => {
        levelMessage.classList.remove('level-up-message');
        resetGame(); // Start next level
    }, 1000); // Show message for 1 second
}

function endGame() {
    clearInterval(timer);
    levelMessage.textContent = "Congratulations! You've completed all 10 levels!";
    levelMessage.classList.add('level-up-message');
}

resetButton.addEventListener('click', resetGame);

// Start the game
resetGame();
startTimer();