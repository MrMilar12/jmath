/**
 * jmath — Interactive Math Space
 * app.js
 *
 * Features:
 *  - Five topics: addition, subtraction, multiplication, division, mixed
 *  - Three difficulty levels: easy, medium, hard
 *  - 10 questions per round with a per-question countdown timer
 *  - Multiple-choice answers (4 choices)
 *  - Score tracking with time-bonus points
 *  - High-score persistence via localStorage
 */

"use strict";

// ─── Configuration ────────────────────────────────────────────────────────────

const CONFIG = {
  questionsPerRound: 10,
  timerSeconds: { easy: 20, medium: 15, hard: 10 },
  points: { correct: 10, timeBonusMax: 5 },
  ranges: {
    easy:   { a: [1, 12],  b: [1, 12]  },
    medium: { a: [1, 50],  b: [1, 50]  },
    hard:   { a: [1, 200], b: [1, 200] },
  },
  maxHighScores: 5,
};

const TOPICS = ["addition", "subtraction", "multiplication", "division", "mixed"];

// ─── State ─────────────────────────────────────────────────────────────────────

let state = {
  topic: "addition",
  difficulty: "easy",
  questions: [],
  current: 0,
  score: 0,
  correctCount: 0,
  totalTime: 0,
  timer: null,
  timeLeft: 0,
  answered: false,
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────

const screens = {
  menu:    document.getElementById("menu-screen"),
  quiz:    document.getElementById("quiz-screen"),
  results: document.getElementById("results-screen"),
};

const $ = id => document.getElementById(id);

// ─── Utility helpers ──────────────────────────────────────────────────────────

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[name].classList.add("active");
}

// ─── Question generation ──────────────────────────────────────────────────────

function pickTopic(topic) {
  if (topic !== "mixed") return topic;
  const ops = ["addition", "subtraction", "multiplication", "division"];
  return ops[randInt(0, ops.length - 1)];
}

function generateQuestion(topic, difficulty) {
  const op = pickTopic(topic);
  const { a: [aMin, aMax], b: [bMin, bMax] } = CONFIG.ranges[difficulty];

  let num1, num2, answer, questionText;

  switch (op) {
    case "addition":
      num1 = randInt(aMin, aMax);
      num2 = randInt(bMin, bMax);
      answer = num1 + num2;
      questionText = `${num1} + ${num2} = ?`;
      break;

    case "subtraction":
      // Ensure non-negative result for easy/medium; allow any for hard
      num1 = randInt(aMin, aMax);
      num2 = randInt(bMin, Math.min(num1, bMax));
      answer = num1 - num2;
      questionText = `${num1} − ${num2} = ?`;
      break;

    case "multiplication": {
      // Cap multipliers to avoid huge numbers on easy/medium
      const capA = difficulty === "hard" ? aMax : Math.min(aMax, 12);
      const capB = difficulty === "hard" ? bMax : Math.min(bMax, 12);
      num1 = randInt(aMin, capA);
      num2 = randInt(bMin, capB);
      answer = num1 * num2;
      questionText = `${num1} × ${num2} = ?`;
      break;
    }

    case "division": {
      // Generate a clean division: pick divisor then multiple
      const capDiv = difficulty === "hard" ? 20 : 12;
      num2 = randInt(2, capDiv);
      num1 = num2 * randInt(1, difficulty === "hard" ? 20 : 12);
      answer = num1 / num2;
      questionText = `${num1} ÷ ${num2} = ?`;
      break;
    }
  }

  // Generate 3 plausible wrong answers
  const wrongs = new Set();
  while (wrongs.size < 3) {
    let w;
    const spread = Math.max(5, Math.round(Math.abs(answer) * 0.4));
    w = answer + randInt(-spread, spread);
    if (w !== answer && w >= 0) wrongs.add(w);
  }

  const choices = shuffle([answer, ...wrongs]);
  return { questionText, answer, choices, op };
}

function buildRound() {
  state.questions = Array.from({ length: CONFIG.questionsPerRound }, () =>
    generateQuestion(state.topic, state.difficulty)
  );
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function startTimer() {
  clearInterval(state.timer);
  state.timeLeft = CONFIG.timerSeconds[state.difficulty];
  updateTimerDisplay();

  state.timer = setInterval(() => {
    state.timeLeft--;
    updateTimerDisplay();

    if (state.timeLeft <= 0) {
      clearInterval(state.timer);
      if (!state.answered) handleTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const el = $("timer-display");
  el.textContent = state.timeLeft;
  const timerStat = el.closest(".timer-stat");
  if (timerStat) {
    timerStat.classList.toggle("urgent", state.timeLeft <= 5);
  }
}

function stopTimer() {
  clearInterval(state.timer);
}

// ─── Quiz Flow ────────────────────────────────────────────────────────────────

function startQuiz() {
  buildRound();
  state.current = 0;
  state.score = 0;
  state.correctCount = 0;
  state.totalTime = 0;
  showScreen("quiz");
  renderQuestion();
}

function renderQuestion() {
  state.answered = false;
  const q = state.questions[state.current];
  const total = CONFIG.questionsPerRound;

  // Header labels
  $("topic-label").textContent = state.topic;
  $("diff-label").textContent  = state.difficulty;

  // Stats
  $("score-display").textContent    = state.score;
  $("question-counter").textContent = `${state.current + 1} / ${total}`;

  // Progress bar
  $("progress-bar").style.width = `${(state.current / total) * 100}%`;

  // Question text
  $("question-text").textContent = q.questionText;

  // Choices
  const choicesEl = $("choices");
  choicesEl.innerHTML = "";
  q.choices.forEach(choice => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = choice;
    btn.addEventListener("click", () => handleAnswer(choice, btn));
    choicesEl.appendChild(btn);
  });

  // Hide feedback
  const feedback = $("feedback");
  feedback.className = "feedback hidden";

  // Start timer
  startTimer();
}

function handleAnswer(selected, btnEl) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();

  const q = state.questions[state.current];
  const correct = selected === q.answer;
  const timeUsed = CONFIG.timerSeconds[state.difficulty] - state.timeLeft;
  state.totalTime += timeUsed;

  // Disable all buttons and mark correct/wrong
  const buttons = $("choices").querySelectorAll(".choice-btn");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (Number(btn.textContent) === q.answer) btn.classList.add("correct");
    else if (btn === btnEl && !correct)        btn.classList.add("wrong");
  });

  // Score
  if (correct) {
    const timeBonus = Math.round(
      (state.timeLeft / CONFIG.timerSeconds[state.difficulty]) * CONFIG.points.timeBonusMax
    );
    state.score += CONFIG.points.correct + timeBonus;
    state.correctCount++;
  }

  // Feedback banner
  showFeedback(correct, q.answer);

  // Advance after short delay
  setTimeout(nextQuestion, 1200);
}

function handleTimeout() {
  state.answered = true;
  const q = state.questions[state.current];
  state.totalTime += CONFIG.timerSeconds[state.difficulty];

  const buttons = $("choices").querySelectorAll(".choice-btn");
  buttons.forEach(btn => {
    btn.disabled = true;
    if (Number(btn.textContent) === q.answer) btn.classList.add("correct");
  });

  showFeedback(false, q.answer, true);
  setTimeout(nextQuestion, 1400);
}

function showFeedback(correct, correctAnswer, timeout = false) {
  const feedback = $("feedback");
  const icon = $("feedback-icon");
  const text = $("feedback-text");

  if (timeout) {
    feedback.className = "feedback wrong-fb";
    icon.textContent = "⏰";
    text.textContent = `Time's up! The answer was ${correctAnswer}.`;
  } else if (correct) {
    feedback.className = "feedback correct-fb";
    icon.textContent = "✅";
    text.textContent = "Correct! Well done!";
  } else {
    feedback.className = "feedback wrong-fb";
    icon.textContent = "❌";
    text.textContent = `Not quite. The answer was ${correctAnswer}.`;
  }
}

function nextQuestion() {
  state.current++;
  if (state.current >= CONFIG.questionsPerRound) {
    showResults();
  } else {
    renderQuestion();
  }
}

// ─── Results ──────────────────────────────────────────────────────────────────

function showResults() {
  const total   = CONFIG.questionsPerRound;
  const pct     = (state.correctCount / total) * 100;
  const avgTime = (state.totalTime / total).toFixed(1);

  // Emoji + message
  let emoji, title, subtitle;
  if (pct === 100) {
    emoji = "🏆"; title = "Perfect Score!"; subtitle = "Absolutely flawless — incredible work!";
  } else if (pct >= 80) {
    emoji = "🌟"; title = "Great Job!";     subtitle = "You're really getting the hang of this!";
  } else if (pct >= 60) {
    emoji = "👍"; title = "Good Effort!";   subtitle = "Keep practising and you'll nail it!";
  } else if (pct >= 40) {
    emoji = "📚"; title = "Keep Going!";    subtitle = "Review your answers and try again.";
  } else {
    emoji = "💪"; title = "Don't Give Up!"; subtitle = "Every attempt makes you smarter — try again!";
  }

  $("results-emoji").textContent    = emoji;
  $("results-title").textContent    = title;
  $("results-subtitle").textContent = subtitle;
  $("res-score").textContent        = state.score;
  $("res-correct").textContent      = `${state.correctCount}/${total}`;
  $("res-time").textContent         = `${avgTime}s`;

  saveHighScore();
  showScreen("results");
}

// ─── High Scores ──────────────────────────────────────────────────────────────

function getHighScores() {
  try {
    return JSON.parse(localStorage.getItem("jmath_scores") || "[]");
  } catch {
    return [];
  }
}

function saveHighScore() {
  const scores = getHighScores();
  scores.push({
    score:      state.score,
    correct:    state.correctCount,
    topic:      state.topic,
    difficulty: state.difficulty,
    date:       new Date().toLocaleDateString(),
  });
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, CONFIG.maxHighScores);
  localStorage.setItem("jmath_scores", JSON.stringify(trimmed));
  renderHighScores(trimmed);
}

function renderHighScores(scores) {
  const container = document.getElementById("high-scores");
  const list      = document.getElementById("scores-list");

  if (!scores.length) {
    container.classList.add("hidden");
    return;
  }

  container.classList.remove("hidden");
  list.innerHTML = "";
  scores.forEach((s, i) => {
    const li = document.createElement("li");
    li.innerHTML =
      `<span>#${i + 1} ${s.topic} · ${s.difficulty} · ${s.date}</span>` +
      `<span class="score-pts">${s.score} pts</span>`;
    list.appendChild(li);
  });
}

// ─── Menu interactions ────────────────────────────────────────────────────────

// Topic selection
document.querySelectorAll(".topic-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".topic-btn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    state.topic = btn.dataset.topic;
  });
});

// Difficulty selection
document.querySelectorAll(".diff-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.difficulty = btn.dataset.difficulty;
  });
});

// Start quiz
$("start-btn").addEventListener("click", startQuiz);

// Retry (same topic + difficulty)
$("retry-btn").addEventListener("click", startQuiz);

// Back to menu
$("menu-btn").addEventListener("click", () => {
  showScreen("menu");
  renderHighScores(getHighScores());
});

// ─── Init ─────────────────────────────────────────────────────────────────────

(function init() {
  // Mark default topic button as selected
  const defaultTopic = document.querySelector(`.topic-btn[data-topic="${state.topic}"]`);
  if (defaultTopic) defaultTopic.classList.add("selected");

  // Load existing high scores on menu
  renderHighScores(getHighScores());
})();
