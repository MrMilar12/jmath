/* ─────────────────────────────────────────────
   JMath – app.js
   Interactive Math Learning + Quiz Engine
───────────────────────────────────────────── */

"use strict";

// ── Data ────────────────────────────────────────────────────────────────────

const modules = [
  {
    id: 1,
    icon: "➕",
    title: "Arithmetic Foundations",
    lessons: [
      {
        type: "text",
        title: "What is Arithmetic?",
        content: `
          <p>Arithmetic is the oldest branch of mathematics. It deals with
          <strong>numbers</strong> and the basic operations we perform on them.</p>
          <div class="highlight">The four core operations are:
            <strong>Addition (+), Subtraction (−), Multiplication (×), Division (÷)</strong>
          </div>
          <p>Every calculation you ever do—from splitting a bill to rocket
          trajectories—starts here.</p>
        `
      },
      {
        type: "quiz",
        question: "What is 15 × 8?",
        choices: ["110", "120", "125", "130"],
        answer: "120"
      },
      {
        type: "text",
        title: "Order of Operations (PEMDAS)",
        content: `
          <p>When an expression has multiple operations, use <strong>PEMDAS</strong>:</p>
          <div class="highlight">
            <strong>P</strong>arentheses → <strong>E</strong>xponents →
            <strong>M</strong>ultiply / <strong>D</strong>ivide →
            <strong>A</strong>dd / <strong>S</strong>ubtract
          </div>
          <p>Example: <code>2 + 3 × 4 = 2 + 12 = 14</code> (not 20!)</p>
        `
      },
      {
        type: "quiz",
        question: "Evaluate: 2 + 3 × (4 − 1)",
        choices: ["11", "13", "15", "17"],
        answer: "11"
      },
      {
        type: "quiz",
        question: "Which of the following equals 2³?",
        choices: ["6", "8", "9", "16"],
        answer: "8"
      }
    ]
  },
  {
    id: 2,
    icon: "🔢",
    title: "Fractions & Decimals",
    lessons: [
      {
        type: "text",
        title: "Understanding Fractions",
        content: `
          <p>A fraction represents a <strong>part of a whole</strong>. It has two parts:</p>
          <div class="highlight">
            <strong>Numerator</strong> (top) – how many parts you have<br/>
            <strong>Denominator</strong> (bottom) – how many equal parts the whole is divided into
          </div>
          <p>Example: <code>3/4</code> means 3 out of 4 equal parts.</p>
        `
      },
      {
        type: "quiz",
        question: "What is ½ + ¼?",
        choices: ["1/6", "2/8", "3/4", "1/3"],
        answer: "3/4"
      },
      {
        type: "text",
        title: "Converting Fractions to Decimals",
        content: `
          <p>To convert a fraction to a decimal, <strong>divide the numerator by the denominator</strong>.</p>
          <div class="highlight">
            <code>1/4 = 1 ÷ 4 = 0.25</code><br/>
            <code>3/5 = 3 ÷ 5 = 0.6</code>
          </div>
          <p>Some fractions produce <em>repeating decimals</em>, like <code>1/3 = 0.333…</code></p>
        `
      },
      {
        type: "quiz",
        question: "What is 3/4 as a decimal?",
        choices: ["0.34", "0.70", "0.75", "0.80"],
        answer: "0.75"
      },
      {
        type: "quiz",
        question: "Which fraction is equivalent to 0.5?",
        choices: ["1/4", "1/5", "1/2", "2/5"],
        answer: "1/2"
      }
    ]
  },
  {
    id: 3,
    icon: "📐",
    title: "Geometry Essentials",
    lessons: [
      {
        type: "text",
        title: "Shapes & Properties",
        content: `
          <p>Geometry is the study of <strong>shapes, sizes, and properties of space</strong>.</p>
          <div class="highlight">
            A <strong>polygon</strong> is any closed 2D shape with straight sides.<br/>
            Triangles (3 sides), Quadrilaterals (4 sides), Pentagons (5 sides)…
          </div>
          <p>The sum of interior angles of a triangle is always <strong>180°</strong>.</p>
        `
      },
      {
        type: "quiz",
        question: "What is the area of a rectangle with width 5 and height 8?",
        choices: ["13", "26", "35", "40"],
        answer: "40"
      },
      {
        type: "text",
        title: "The Pythagorean Theorem",
        content: `
          <p>In a right triangle, the square of the <strong>hypotenuse</strong> equals
          the sum of the squares of the other two sides:</p>
          <div class="highlight"><code>a² + b² = c²</code></div>
          <p>Example: If <code>a = 3</code> and <code>b = 4</code>, then
          <code>c = √(9 + 16) = √25 = 5</code>.</p>
        `
      },
      {
        type: "quiz",
        question: "In a right triangle, a = 6 and b = 8. What is c?",
        choices: ["10", "11", "12", "14"],
        answer: "10"
      },
      {
        type: "quiz",
        question: "What is the area of a circle with radius 7? (Use π ≈ 3.14)",
        choices: ["21.98", "43.96", "153.86", "44"],
        answer: "153.86"
      }
    ]
  },
  {
    id: 4,
    icon: "📊",
    title: "Algebra Basics",
    lessons: [
      {
        type: "text",
        title: "Variables & Expressions",
        content: `
          <p>Algebra uses <strong>letters (variables)</strong> to represent unknown numbers.</p>
          <div class="highlight">
            <code>x + 5 = 12</code> – here <strong>x</strong> is the unknown we want to find.
          </div>
          <p>To solve, perform the <em>same operation on both sides</em> of the equation:
          <code>x = 12 − 5 = 7</code>.</p>
        `
      },
      {
        type: "quiz",
        question: "Solve for x: 3x = 21",
        choices: ["5", "6", "7", "8"],
        answer: "7"
      },
      {
        type: "text",
        title: "Slope of a Line",
        content: `
          <p>The <strong>slope</strong> measures how steep a line is:</p>
          <div class="highlight"><code>m = (y₂ − y₁) / (x₂ − x₁)</code></div>
          <p>A positive slope goes <em>up left to right</em>; a negative slope goes <em>down</em>.</p>
          <p>The slope-intercept form of a line is <code>y = mx + b</code>, where
          <strong>b</strong> is the y-intercept.</p>
        `
      },
      {
        type: "quiz",
        question: "What is the slope between (1, 2) and (3, 8)?",
        choices: ["2", "3", "4", "6"],
        answer: "3"
      },
      {
        type: "quiz",
        question: "Solve: 2x + 4 = 14",
        choices: ["4", "5", "6", "7"],
        answer: "5"
      }
    ]
  }
];

// ── State ────────────────────────────────────────────────────────────────────

let currentModule  = null;
let currentLesson  = 0;
let score          = 0;
let totalQuizzes   = 0;
let answered       = false; // prevents double-answering

// ── Helpers ──────────────────────────────────────────────────────────────────

function app() {
  return document.getElementById("app");
}

function render(html) {
  const el = app();
  el.innerHTML = html;
  el.classList.remove("screen-enter");
  // Force reflow so re-adding class triggers animation
  void el.offsetWidth;
  el.classList.add("screen-enter");
}

function getProgress(moduleId) {
  return JSON.parse(localStorage.getItem("jmath_progress") || "{}")[moduleId] || 0;
}

function saveProgress(moduleId, lessonIndex) {
  const data = JSON.parse(localStorage.getItem("jmath_progress") || "{}");
  data[moduleId] = Math.max(data[moduleId] || 0, lessonIndex);
  localStorage.setItem("jmath_progress", JSON.stringify(data));
}

function isModuleDone(mod) {
  return getProgress(mod.id) >= mod.lessons.length;
}

function progressPercent() {
  if (!currentModule) return 0;
  return Math.round((currentLesson / currentModule.lessons.length) * 100);
}

function progressBar(percent) {
  return `
    <div class="progress-wrap">
      <div class="progress-fill" style="width:${percent}%"></div>
    </div>
    <p class="progress-label">${percent}%</p>
  `;
}

function quizCount(mod) {
  return mod.lessons.filter(l => l.type === "quiz").length;
}

// ── Screens ──────────────────────────────────────────────────────────────────

function renderHome() {
  currentModule = null;
  currentLesson = 0;
  score = 0;
  totalQuizzes = 0;

  render(`
    <div style="text-align:center;display:flex;flex-direction:column;gap:18px;align-items:center;">
      <div style="font-size:3.5rem">🧮</div>
      <h1 class="typewriter" id="homeTitle"></h1>
      <p class="subtitle">Master mathematics through interactive lessons and instant quizzes.
        Your progress is saved automatically.</p>
      <button onclick="renderModules()">🚀 Start Learning</button>
    </div>
  `);

  typeWrite("homeTitle", "JMath Learning");
}

function renderModules() {
  let cards = modules.map(m => {
    const done = isModuleDone(m);
    const prog = getProgress(m.id);
    const total = m.lessons.length;
    const pct = Math.round((prog / total) * 100);
    const badgeText = done ? "✅ Done" : prog > 0 ? `${pct}%` : "New";
    const badgeClass = done ? "done" : "";

    return `
      <button class="module-card" onclick="startModule(${m.id})">
        <span class="icon">${m.icon}</span>
        <span class="meta">
          <strong>${m.title}</strong>
          <span>${m.lessons.length} lessons · ${quizCount(m)} quizzes</span>
        </span>
        <span class="badge ${badgeClass}">${badgeText}</span>
      </button>
    `;
  }).join("");

  render(`
    <h2>📚 Modules</h2>
    <p class="subtitle">Choose a module to begin or continue.</p>
    <div style="display:flex;flex-direction:column;gap:10px;">${cards}</div>
    <button class="secondary" onclick="renderHome()">← Home</button>
  `);
}

function startModule(id) {
  currentModule = modules.find(m => m.id === id);
  currentLesson = 0;
  score = 0;
  totalQuizzes = currentModule.lessons.filter(l => l.type === "quiz").length;
  answered = false;
  renderLesson();
}

function renderLesson() {
  if (currentLesson >= currentModule.lessons.length) {
    saveProgress(currentModule.id, currentModule.lessons.length);
    renderResult();
    return;
  }

  saveProgress(currentModule.id, currentLesson);
  const lesson = currentModule.lessons[currentLesson];
  const pct = progressPercent();

  if (lesson.type === "text") {
    render(`
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div>
          <p class="subtitle" style="margin-bottom:4px;">${currentModule.icon} ${currentModule.title}</p>
          <h2>${lesson.title}</h2>
        </div>
        ${progressBar(pct)}
        <div class="lesson-content">${lesson.content}</div>
        <div class="btn-row">
          <button class="secondary" onclick="prevLesson()">← Back</button>
          <button onclick="nextLesson()">Next →</button>
        </div>
      </div>
    `);
  } else if (lesson.type === "quiz") {
    renderQuiz(lesson, pct);
  }
}

function renderQuiz(q, pct) {
  answered = false;
  const choices = q.choices.map((c, i) => `
    <button class="choice-btn" id="choice-${i}" onclick="checkAnswer(this, '${escAttr(c)}', '${escAttr(q.answer)}')">
      ${c}
    </button>
  `).join("");

  render(`
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div>
        <p class="subtitle" style="margin-bottom:4px;">${currentModule.icon} ${currentModule.title} · Quiz</p>
        <h3>${q.question}</h3>
      </div>
      ${progressBar(pct)}
      <div class="choices">${choices}</div>
      <p id="quiz-feedback" style="min-height:1.2em;text-align:center;font-weight:600;"></p>
      <div class="btn-row" id="quiz-next" style="display:none;">
        <button onclick="nextLesson()">Next →</button>
      </div>
    </div>
  `);
}

function checkAnswer(btn, selected, correct) {
  if (answered) return;
  answered = true;

  // Disable all choices
  document.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);

  const fb = document.getElementById("quiz-feedback");

  if (selected === correct) {
    btn.classList.add("correct");
    score++;
    fb.style.color = "var(--success)";
    fb.textContent = "✅ Correct!";
    playSound("correct");
  } else {
    btn.classList.add("wrong");
    fb.style.color = "var(--danger)";
    fb.textContent = `❌ Incorrect – the answer was "${correct}"`;
    playSound("wrong");
    // Highlight correct
    document.querySelectorAll(".choice-btn").forEach(b => {
      if (b.textContent.trim() === correct) b.classList.add("correct");
    });
  }

  document.getElementById("quiz-next").style.display = "flex";
}

function nextLesson() {
  currentLesson++;
  renderLesson();
}

function prevLesson() {
  if (currentLesson > 0) {
    currentLesson--;
    renderLesson();
  } else {
    renderModules();
  }
}

function renderResult() {
  const pct = totalQuizzes > 0 ? Math.round((score / totalQuizzes) * 100) : 100;
  const stars = pct === 100 ? "⭐⭐⭐" : pct >= 60 ? "⭐⭐" : "⭐";
  const msg   = pct === 100 ? "Perfect score! 🎉" : pct >= 60 ? "Well done! Keep it up." : "Keep practicing!";

  render(`
    <div style="text-align:center;display:flex;flex-direction:column;gap:16px;align-items:center;">
      <h2>Module Complete!</h2>
      <p class="subtitle">${currentModule.icon} ${currentModule.title}</p>
      <div class="result-score">${score}/${totalQuizzes}</div>
      <div class="stars">${stars}</div>
      <p class="subtitle">${msg}</p>
      ${progressBar(100)}
      <div class="btn-row">
        <button class="secondary" onclick="startModule(${currentModule.id})">🔁 Retry</button>
        <button onclick="renderModules()">📚 Modules</button>
      </div>
    </div>
  `);

  if (pct === 100) launchConfetti();
}

// ── Theme ────────────────────────────────────────────────────────────────────

function toggleTheme() {
  const isDark = document.documentElement.getAttribute("data-theme") !== "light";
  document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
  document.getElementById("themeToggle").textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("jmath_theme", isDark ? "light" : "dark");
}

function loadTheme() {
  const saved = localStorage.getItem("jmath_theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = saved === "light" ? "☀️" : "🌙";
}

// ── Typewriter effect ────────────────────────────────────────────────────────

function typeWrite(id, text, speed = 70) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = "";
  el.classList.add("typewriter");
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(timer);
      el.classList.remove("typewriter");
    }
  }, speed);
}

// ── Sound effects (Web Audio API) ───────────────────────────────────────────

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "correct") {
      osc.frequency.setValueAtTime(523, ctx.currentTime);       // C5
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (_) { /* AudioContext not available – silently skip */ }
}

// ── Confetti ─────────────────────────────────────────────────────────────────

function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx    = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 8 + 4,
    d: Math.random() * 140 + 10,
    color: `hsl(${Math.random() * 360},90%,60%)`,
    tilt: Math.random() * 10 - 10,
    tiltAngle: 0,
    tiltSpeed: Math.random() * 0.1 + 0.05
  }));

  let frame = 0;
  const MAX_FRAMES = 220;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.tiltAngle += p.tiltSpeed;
      p.y += (Math.cos(p.d) + 2) * 1.5;
      p.tilt = Math.sin(p.tiltAngle) * 12;

      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();

      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
    frame++;
    if (frame < MAX_FRAMES) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}

// ── Utility ───────────────────────────────────────────────────────────────────

// Escape a value for use inside a quoted HTML attribute
function escAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ── Init ─────────────────────────────────────────────────────────────────────

loadTheme();
renderHome();
