let allQuestions = [];
let examSet = [];
let currentIndex = 0;
let score = 0;
let missedCategories = new Set();

const questionEl = document.getElementById('question-text');
const optionsEl = document.getElementById('options-container');
const currentNumEl = document.getElementById('current-num');
const gameArea = document.getElementById('game-area');
const resultsArea = document.getElementById('results-area');

// Fetch the 30-question bank
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        allQuestions = data;
        setupExam();
    })
    .catch(err => console.error("Error loading questions:", err));

function setupExam() {
    // Shuffle the 30 questions and pick the first 10
    examSet = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);
    showQuestion();
}

function showQuestion() {
    const q = examSet[currentIndex];
    questionEl.innerText = q.question;
    currentNumEl.innerText = currentIndex + 1;
    optionsEl.innerHTML = '';

    // Shuffle the multiple choice options so 'A' isn't always the same
    const shuffledOptions = q.options.sort(() => 0.5 - Math.random());

    shuffledOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.classList.add('opt-btn');
        btn.onclick = () => handleAnswer(option, q.answer, q.category, btn);
        optionsEl.appendChild(btn);
    });
}

function handleAnswer(selected, correct, category, btn) {
    const buttons = document.querySelectorAll('.opt-btn');
    buttons.forEach(b => b.style.pointerEvents = 'none'); // Prevent double clicking

    if (selected === correct) {
        score++;
        btn.classList.add('correct');
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
        btn.classList.add('wrong');
        missedCategories.add(category);
        gameArea.classList.add('shake'); // Trigger shake animation
        setTimeout(() => gameArea.classList.remove('shake'), 500);
    }

    setTimeout(() => {
        currentIndex++;
        if (currentIndex < 10) {
            showQuestion();
        } else {
            showResults();
        }
    }, 1200);
}

function showResults() {
    gameArea.classList.add('hidden');
    resultsArea.classList.remove('hidden');
    document.getElementById('final-score').innerText = `You scored ${score} / 10`;
    
    const list = document.getElementById('review-list');
    if (missedCategories.size === 0) {
        list.innerHTML = "<li>Perfect score! You have mastered these topics.</li>";
        confetti({ particleCount: 500, spread: 160 });
    } else {
        missedCategories.forEach(cat => {
            const li = document.createElement('li');
            li.innerText = cat;
            list.appendChild(li);
        });
    }
}