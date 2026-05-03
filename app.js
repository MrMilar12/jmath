"use strict";

const appState = {
  screen: "home",
  activity: null,
  currentQuiz: null,
  competencyView: null,
  stats: {
    rawInput: "",
    values: [],
    computed: null
  },
  piecewise: {
    scenario: "taxi",
    x: 0,
    guessX: 0,
    guessY: ""
  },
  quadratic: {
    a: 1,
    b: 0,
    c: 0,
    vertexGame: {
      round: 0,
      target: null,
      guessX: "",
      guessY: "",
      points: 0
    }
  }
};

const competencyKeys = {
  interpretation: "Interpretation",
  selection: "Selection",
  problemSolving: "Problem-solving"
};

const storageKey = "genmath_final_plan_v1";
const defaultData = {
  xp: 0,
  level: 1,
  badges: [],
  moduleCompletion: {
    stats: false,
    piecewise: false,
    quadratic: false
  },
  competency: {
    interpretation: { score: 0, attempts: 0 },
    selection: { score: 0, attempts: 0 },
    problemSolving: { score: 0, attempts: 0 }
  },
  quizHistory: []
};

const dataDetectiveSets = [
  {
    name: "Cafe Daily Sales",
    values: [120, 122, 119, 121, 500],
    outlier: true,
    prompt: "Which measure best represents the typical daily sales?",
    options: ["Mean", "Median", "Mode"],
    answer: "Median",
    explanation:
      "The outlier (500) pulls the mean too high. Median is more reliable when outliers exist."
  },
  {
    name: "Quiz Scores",
    values: [78, 80, 80, 82, 85, 89],
    outlier: false,
    prompt: "You want the most frequently occurring score. Which measure should you choose?",
    options: ["Mean", "Median", "Mode"],
    answer: "Mode",
    explanation: "Mode identifies the value that appears most often, which is 80."
  },
  {
    name: "Travel Time (minutes)",
    values: [34, 35, 35, 36, 37, 38],
    outlier: false,
    prompt: "For an overall average travel time report, which measure is most appropriate?",
    options: ["Mean", "Median", "Mode"],
    answer: "Mean",
    explanation: "Without large outliers, mean gives a balanced summary of all values."
  }
];

const competencyQuiz = [
  {
    competency: "interpretation",
    question: "A class has scores 65, 70, 72, 74, 95. The 95 is very high. Which is safer for a typical score?",
    choices: ["Mean", "Median", "Mode"],
    answer: "Median",
    rationale: "Median is robust to extreme values."
  },
  {
    competency: "selection",
    question: "Dataset: 8, 8, 9, 10, 10, 10, 11. You want most common value.",
    choices: ["Mean", "Median", "Mode"],
    answer: "Mode",
    rationale: "Mode captures the most frequent observation."
  },
  {
    competency: "problemSolving",
    question: "Taxi fare: base 50 pesos for first 2 km, then 12 pesos per km after. What is fare for 5 km?",
    choices: ["74", "80", "86", "96"],
    answer: "86",
    rationale: "5 km is 3 km beyond 2 km, so 50 + 12(3) = 86."
  },
  {
    competency: "problemSolving",
    question: "For f(x)= {2x+1 if x<3, x^2 if x>=3}, what is f(4)?",
    choices: ["9", "8", "17", "16"],
    answer: "16",
    rationale: "For x >= 3, use x^2, so 4^2 = 16."
  }
];

function loadData() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return structuredClone(defaultData);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(defaultData),
      ...parsed,
      competency: {
        ...defaultData.competency,
        ...(parsed.competency || {})
      },
      moduleCompletion: {
        ...defaultData.moduleCompletion,
        ...(parsed.moduleCompletion || {})
      },
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : []
    };
  } catch (_) {
    return structuredClone(defaultData);
  }
}

let db = loadData();

function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(db));
}

function app() {
  return document.getElementById("app");
}

function esc(v) {
  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function levelFromXp(xp) {
  return Math.floor(xp / 120) + 1;
}

function xpIntoLevel(xp) {
  return xp % 120;
}

function grantXp(amount, reason) {
  const oldLevel = db.level;
  db.xp += amount;
  db.level = levelFromXp(db.xp);
  maybeUnlockBadge();
  saveData();
  if (db.level > oldLevel) {
    toast(`Level up! You reached Level ${db.level}. (+${amount} XP: ${reason})`);
    launchConfetti();
  } else {
    toast(`+${amount} XP: ${reason}`);
  }
}

function maybeUnlockBadge() {
  const next = [];
  if (db.moduleCompletion.stats) next.push("Statistics Explorer");
  if (db.moduleCompletion.piecewise) next.push("Piecewise Builder");
  if (db.moduleCompletion.quadratic) next.push("Parabola Pilot");
  if (Object.values(db.competency).every(c => c.attempts >= 2 && c.score >= 1)) {
    next.push("Competency Starter");
  }
  if (db.level >= 3) next.push("Level 3 Achiever");

  for (const badge of next) {
    if (!db.badges.includes(badge)) {
      db.badges.push(badge);
      toast(`Badge unlocked: ${badge}`);
    }
  }
}

function recordCompetency(competency, isCorrect, source) {
  const ref = db.competency[competency];
  ref.attempts += 1;
  if (isCorrect) ref.score += 1;
  db.quizHistory.push({
    competency,
    isCorrect,
    source,
    timestamp: new Date().toISOString()
  });
  saveData();
}

function competencyPct(key) {
  const c = db.competency[key];
  if (!c.attempts) return 0;
  return Math.round((c.score / c.attempts) * 100);
}

function completionPct() {
  const flags = Object.values(db.moduleCompletion);
  const complete = flags.filter(Boolean).length;
  return Math.round((complete / flags.length) * 100);
}

function render(html) {
  const el = app();
  el.innerHTML = html;
  el.classList.remove("screen-enter");
  void el.offsetWidth;
  el.classList.add("screen-enter");
  wireCommonButtons();
}

function wireCommonButtons() {
  const homeButtons = document.querySelectorAll("[data-go-home]");
  homeButtons.forEach(b => b.addEventListener("click", () => {
    appState.screen = "home";
    draw();
  }));

  const analyticsButtons = document.querySelectorAll("[data-go-analytics]");
  analyticsButtons.forEach(b => b.addEventListener("click", () => {
    appState.screen = "analytics";
    draw();
  }));
}

function topStatsPanel() {
  const lvlXp = xpIntoLevel(db.xp);
  const pct = Math.round((lvlXp / 120) * 100);
  return `
    <section class="top-panel">
      <div class="top-chip">XP: ${db.xp}</div>
      <div class="top-chip">Level ${db.level}</div>
      <div class="top-chip">Badges: ${db.badges.length}</div>
      <div class="xp-track" aria-label="Level progress">
        <div class="xp-fill" style="width:${pct}%"></div>
      </div>
    </section>
  `;
}

function draw() {
  if (appState.screen === "home") return renderHome();
  if (appState.screen === "stats") return renderStats();
  if (appState.screen === "piecewise") return renderPiecewise();
  if (appState.screen === "quadratic") return renderQuadratic();
  if (appState.screen === "quiz") return renderQuiz();
  if (appState.screen === "analytics") return renderAnalytics();
  renderHome();
}

function renderHome() {
  render(`
    ${topStatsPanel()}
    <section class="hero">
      <h1>Gen Math Interactive Website</h1>
      <p class="subtitle">Game-based learning module for General Mathematics (First Quarter)</p>
      <div class="goal-grid">
        <div class="goal-card">Interpret measures of central tendency and variability</div>
        <div class="goal-card">Identify appropriate measures for data sets</div>
        <div class="goal-card">Solve practical problems using piecewise functions</div>
      </div>
      <div class="btn-row">
        <button id="startStats">Start Module 1: Statistics</button>
        <button class="secondary" id="openQuiz">Competency Quiz</button>
      </div>
    </section>

    <section class="module-grid">
      <button class="module-card large" id="goStats">
        <div class="icon">📊</div>
        <div>
          <strong>Module 1: Statistics</strong>
          <span>Compute mean, median, mode, range, variance, standard deviation + charts</span>
        </div>
        <span class="badge ${db.moduleCompletion.stats ? "done" : ""}">${db.moduleCompletion.stats ? "Complete" : "In Progress"}</span>
      </button>

      <button class="module-card large" id="goPiecewise">
        <div class="icon">🔀</div>
        <div>
          <strong>Module 2: Piecewise Functions</strong>
          <span>Build functions from real-life scenarios and test outputs</span>
        </div>
        <span class="badge ${db.moduleCompletion.piecewise ? "done" : ""}">${db.moduleCompletion.piecewise ? "Complete" : "In Progress"}</span>
      </button>

      <button class="module-card large" id="goQuadratic">
        <div class="icon">📈</div>
        <div>
          <strong>Module 3: Quadratic Functions</strong>
          <span>Dynamic graph and "Find the Vertex" challenge</span>
        </div>
        <span class="badge ${db.moduleCompletion.quadratic ? "done" : ""}">${db.moduleCompletion.quadratic ? "Complete" : "In Progress"}</span>
      </button>
    </section>

    <section class="btn-row spread">
      <button class="secondary" data-go-analytics>View Results & Analytics</button>
      <button class="secondary" id="resetData">Reset Local Progress</button>
    </section>
  `);

  on("startStats", "click", () => {
    appState.screen = "stats";
    draw();
  });
  on("goStats", "click", () => {
    appState.screen = "stats";
    draw();
  });
  on("goPiecewise", "click", () => {
    appState.screen = "piecewise";
    draw();
  });
  on("goQuadratic", "click", () => {
    appState.screen = "quadratic";
    draw();
  });
  on("openQuiz", "click", startQuiz);
  on("resetData", "click", () => {
    db = structuredClone(defaultData);
    saveData();
    toast("Progress reset");
    draw();
  });
}

function parseValues(raw) {
  return raw
    .split(/[,\s]+/)
    .map(v => Number(v.trim()))
    .filter(v => Number.isFinite(v));
}

function computeStats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  if (!n) return null;
  const mean = sorted.reduce((s, v) => s + v, 0) / n;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

  const freq = new Map();
  let maxF = 0;
  for (const v of sorted) {
    const f = (freq.get(v) || 0) + 1;
    freq.set(v, f);
    if (f > maxF) maxF = f;
  }
  const modes = [...freq.entries()].filter(([_, f]) => f === maxF && f > 1).map(([v]) => v);

  const range = sorted[n - 1] - sorted[0];
  const variance = sorted.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance);

  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);

  return {
    sorted,
    mean,
    median,
    modes,
    range,
    variance,
    sd,
    min: sorted[0],
    max: sorted[n - 1],
    q1,
    q3,
    iqr: q3 - q1
  };
}

function quantile(sorted, p) {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * p;
  const low = Math.floor(pos);
  const high = Math.ceil(pos);
  if (low === high) return sorted[low];
  return sorted[low] + (sorted[high] - sorted[low]) * (pos - low);
}

function renderStats() {
  const computed = appState.stats.computed;
  render(`
    ${topStatsPanel()}
    <h2>📊 Module 1: Statistics</h2>
    <p class="subtitle">Interpret central tendency and variability through computation and visuals.</p>

    <section class="card">
      <label for="dataInput">Enter dataset (comma or space separated):</label>
      <textarea id="dataInput" rows="3" placeholder="Example: 78, 80, 82, 82, 90">${esc(appState.stats.rawInput)}</textarea>
      <div class="btn-row left">
        <button id="computeStats">Compute Statistics</button>
        <button class="secondary" id="showSample">Use Sample Data</button>
        <button class="secondary" data-go-home>Back Home</button>
      </div>
      <p class="hint">Interactive prompt: What does your mean say about overall performance? Is there any outlier?</p>
    </section>

    <section class="card">
      <h3>Data Detective Game 🕵️</h3>
      <p class="subtitle">Choose the best measure (mean, median, or mode) for each dataset.</p>
      <div class="btn-row left">
        <button id="newDetective">New Case</button>
      </div>
      <div id="detectiveArea"></div>
    </section>

    ${computed ? statsResultHtml(computed) : ""}
  `);

  on("computeStats", "click", () => {
    const raw = val("dataInput");
    const values = parseValues(raw);
    if (!values.length) {
      toast("Please enter at least one valid number.");
      return;
    }
    appState.stats.rawInput = raw;
    appState.stats.values = values;
    appState.stats.computed = computeStats(values);
    grantXp(20, "Completed statistics computation");
    db.moduleCompletion.stats = true;
    saveData();
    draw();
    drawStatsCharts();
  });

  on("showSample", "click", () => {
    appState.stats.rawInput = "65, 70, 72, 74, 95";
    appState.stats.values = parseValues(appState.stats.rawInput);
    appState.stats.computed = computeStats(appState.stats.values);
    draw();
    drawStatsCharts();
  });

  on("newDetective", "click", () => {
    const set = dataDetectiveSets[Math.floor(Math.random() * dataDetectiveSets.length)];
    appState.activity = { type: "detective", set, answered: false };
    renderDetective();
  });

  if (!appState.activity || appState.activity.type !== "detective") {
    const set = dataDetectiveSets[0];
    appState.activity = { type: "detective", set, answered: false };
  }
  renderDetective();

  if (computed) drawStatsCharts();
}

function statsResultHtml(c) {
  return `
    <section class="card">
      <h3>Computed Results</h3>
      <div class="stats-grid">
        <div><strong>Mean</strong><span>${c.mean.toFixed(2)}</span></div>
        <div><strong>Median</strong><span>${c.median.toFixed(2)}</span></div>
        <div><strong>Mode</strong><span>${c.modes.length ? c.modes.join(", ") : "No mode"}</span></div>
        <div><strong>Range</strong><span>${c.range.toFixed(2)}</span></div>
        <div><strong>Variance</strong><span>${c.variance.toFixed(2)}</span></div>
        <div><strong>Std. Dev.</strong><span>${c.sd.toFixed(2)}</span></div>
      </div>
      <div class="question-callout">
        <strong>What does this mean?</strong>
        <p>If standard deviation is high, your data are spread out. Compare mean and median to spot skewness.</p>
      </div>
      <div class="chart-grid">
        <canvas id="barCanvas" width="420" height="220" aria-label="Bar chart of dataset"></canvas>
        <canvas id="boxCanvas" width="420" height="220" aria-label="Box plot of dataset"></canvas>
      </div>
    </section>
  `;
}

function drawStatsCharts() {
  const c = appState.stats.computed;
  if (!c) return;
  const bar = document.getElementById("barCanvas");
  const box = document.getElementById("boxCanvas");
  if (!bar || !box) return;
  drawBarChart(bar, c.sorted);
  drawBoxPlot(box, c);
}

function drawBarChart(canvas, values) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pad = 28;
  const w = canvas.width - pad * 2;
  const h = canvas.height - pad * 2;
  const max = Math.max(...values);

  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, pad + h);
  ctx.lineTo(pad + w, pad + h);
  ctx.stroke();

  const bw = w / values.length - 8;
  values.forEach((v, i) => {
    const bh = (v / max) * (h - 8);
    const x = pad + i * (bw + 8) + 4;
    const y = pad + h - bh;
    const grad = ctx.createLinearGradient(x, y, x, y + bh);
    grad.addColorStop(0, "#28d7d1");
    grad.addColorStop(1, "#0f87d9");
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, bw, bh);

    ctx.fillStyle = "#f8fbff";
    ctx.font = "12px Georgia";
    ctx.fillText(String(v), x + 2, y - 4);
  });

  ctx.fillStyle = "#d7e8ff";
  ctx.font = "bold 13px Georgia";
  ctx.fillText("Bar Chart", 12, 18);
}

function drawBoxPlot(canvas, c) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pad = 32;
  const midY = canvas.height / 2 + 14;
  const min = c.min;
  const max = c.max;
  const toX = v => pad + ((v - min) / (max - min || 1)) * (canvas.width - pad * 2);

  ctx.fillStyle = "#d7e8ff";
  ctx.font = "bold 13px Georgia";
  ctx.fillText("Box Plot", 12, 18);

  ctx.strokeStyle = "#f5f8ff";
  ctx.lineWidth = 2;

  const xMin = toX(c.min);
  const xQ1 = toX(c.q1);
  const xMed = toX(c.median);
  const xQ3 = toX(c.q3);
  const xMax = toX(c.max);

  ctx.beginPath();
  ctx.moveTo(xMin, midY);
  ctx.lineTo(xQ1, midY);
  ctx.moveTo(xQ3, midY);
  ctx.lineTo(xMax, midY);
  ctx.stroke();

  ctx.fillStyle = "rgba(40, 215, 209, 0.35)";
  ctx.strokeStyle = "#28d7d1";
  ctx.fillRect(xQ1, midY - 32, xQ3 - xQ1, 64);
  ctx.strokeRect(xQ1, midY - 32, xQ3 - xQ1, 64);

  ctx.strokeStyle = "#ffcc66";
  ctx.beginPath();
  ctx.moveTo(xMed, midY - 32);
  ctx.lineTo(xMed, midY + 32);
  ctx.stroke();

  ctx.strokeStyle = "#f5f8ff";
  [xMin, xMax].forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x, midY - 18);
    ctx.lineTo(x, midY + 18);
    ctx.stroke();
  });

  ctx.fillStyle = "#e9f2ff";
  ctx.font = "11px Georgia";
  [["min", c.min, xMin], ["Q1", c.q1, xQ1], ["Med", c.median, xMed], ["Q3", c.q3, xQ3], ["max", c.max, xMax]]
    .forEach(([name, val, x]) => {
      ctx.fillText(`${name}:${Number(val).toFixed(1)}`, x - 20, midY + 52);
    });
}

function renderDetective() {
  const wrap = document.getElementById("detectiveArea");
  if (!wrap || !appState.activity || appState.activity.type !== "detective") return;
  const game = appState.activity;
  const set = game.set;

  wrap.innerHTML = `
    <div class="detective-box">
      <p><strong>Case:</strong> ${esc(set.name)}</p>
      <p><strong>Dataset:</strong> ${set.values.join(", ")}</p>
      <p>${esc(set.prompt)}</p>
      <div class="btn-row left" id="detectiveOptions">
        ${set.options.map(o => `<button class="choice-btn detective-choice" data-opt="${esc(o)}">${esc(o)}</button>`).join("")}
      </div>
      <p id="detectiveFeedback" class="hint"></p>
    </div>
  `;

  document.querySelectorAll(".detective-choice").forEach(btn => {
    btn.addEventListener("click", () => {
      if (game.answered) return;
      game.answered = true;
      const chosen = btn.dataset.opt;
      const ok = chosen === set.answer;
      recordCompetency("selection", ok, "Data Detective");
      if (ok) {
        btn.classList.add("correct");
        grantXp(15, "Data Detective correct");
      } else {
        btn.classList.add("wrong");
      }
      const feedback = document.getElementById("detectiveFeedback");
      feedback.textContent = `${ok ? "Correct" : "Not quite"}: ${set.explanation}`;
      feedback.style.color = ok ? "var(--success)" : "var(--danger)";
      document.querySelectorAll(".detective-choice").forEach(b => {
        b.disabled = true;
        if (b.dataset.opt === set.answer) b.classList.add("correct");
      });
    });
  });
}

const scenarioDefs = {
  taxi: {
    title: "Taxi Fare",
    label: "distance (km)",
    formulaText: "f(x)=50 for x<=2, then 50 + 12(x-2) for x>2",
    fn: x => (x <= 2 ? 50 : 50 + 12 * (x - 2))
  },
  electricity: {
    title: "Electricity Billing",
    label: "kWh",
    formulaText: "f(x)=300 for x<=100, then 300 + 9(x-100) for x>100",
    fn: x => (x <= 100 ? 300 : 300 + 9 * (x - 100))
  },
  mobile: {
    title: "Mobile Data",
    label: "GB",
    formulaText: "f(x)=199 for x<=10, then 199 + 25(x-10) for x>10",
    fn: x => (x <= 10 ? 199 : 199 + 25 * (x - 10))
  }
};

function renderPiecewise() {
  const s = scenarioDefs[appState.piecewise.scenario];
  const x = Number(appState.piecewise.x);
  const y = s.fn(x);

  render(`
    ${topStatsPanel()}
    <h2>🔀 Module 2: Piecewise Functions</h2>
    <p class="subtitle">Solve practical problems with interval-based rules.</p>

    <section class="card">
      <h3>Build the Function</h3>
      <p class="subtitle">Scenario-driven piecewise model with live interval highlighting.</p>
      <div class="btn-row left" id="scenarioBtns">
        <button class="secondary ${appState.piecewise.scenario === "taxi" ? "active" : ""}" data-s="taxi">Taxi 🚕</button>
        <button class="secondary ${appState.piecewise.scenario === "electricity" ? "active" : ""}" data-s="electricity">Electricity ⚡</button>
        <button class="secondary ${appState.piecewise.scenario === "mobile" ? "active" : ""}" data-s="mobile">Mobile Data 📱</button>
      </div>

      <p><strong>${esc(s.title)} rule:</strong> ${esc(s.formulaText)}</p>
      <div class="range-wrap">
        <label for="pieceX">Input ${esc(s.label)}: <strong>${x}</strong></label>
        <input type="range" id="pieceX" min="0" max="150" step="1" value="${x}" />
        <p class="hint">Output: <strong>${y.toFixed(2)}</strong></p>
      </div>
      <canvas id="pieceCanvas" width="440" height="240" aria-label="Piecewise graph"></canvas>
    </section>

    <section class="card">
      <h3>Guess the Output</h3>
      <p class="subtitle">Given an input, predict the output.</p>
      <div class="quiz-inline">
        <label>Input x</label>
        <input id="guessX" type="number" value="${Number(appState.piecewise.guessX) || 0}" />
        <label>Predicted f(x)</label>
        <input id="guessY" type="number" value="${esc(appState.piecewise.guessY)}" />
      </div>
      <div class="btn-row left">
        <button id="checkGuess">Check Answer</button>
        <button class="secondary" data-go-home>Back Home</button>
      </div>
      <p id="guessFeedback" class="hint"></p>
    </section>
  `);

  document.querySelectorAll("#scenarioBtns [data-s]").forEach(btn => {
    btn.addEventListener("click", () => {
      appState.piecewise.scenario = btn.dataset.s;
      draw();
    });
  });

  on("pieceX", "input", e => {
    appState.piecewise.x = Number(e.target.value);
    draw();
  });

  on("checkGuess", "click", () => {
    const gx = Number(val("guessX"));
    const gy = Number(val("guessY"));
    appState.piecewise.guessX = gx;
    appState.piecewise.guessY = val("guessY");

    const expected = scenarioDefs[appState.piecewise.scenario].fn(gx);
    const ok = Math.abs(expected - gy) < 0.01;
    recordCompetency("problemSolving", ok, "Piecewise Guess Output");

    const fb = byId("guessFeedback");
    if (ok) {
      fb.textContent = `Correct. f(${gx}) = ${expected.toFixed(2)}.`;
      fb.style.color = "var(--success)";
      grantXp(18, "Piecewise correct prediction");
      db.moduleCompletion.piecewise = true;
      saveData();
    } else {
      fb.textContent = `Try again. Expected f(${gx}) = ${expected.toFixed(2)}.`;
      fb.style.color = "var(--danger)";
    }
  });

  drawPiecewiseGraph();
}

function drawPiecewiseGraph() {
  const canvas = byId("pieceCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const s = scenarioDefs[appState.piecewise.scenario];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pad = 34;
  const w = canvas.width - pad * 2;
  const h = canvas.height - pad * 2;
  const maxX = 150;
  const ys = [];
  for (let x = 0; x <= maxX; x += 1) ys.push(s.fn(x));
  const maxY = Math.max(...ys) * 1.08;

  const toX = x => pad + (x / maxX) * w;
  const toY = y => pad + h - (y / maxY) * h;

  ctx.strokeStyle = "rgba(240,248,255,0.25)";
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, pad + h);
  ctx.lineTo(pad + w, pad + h);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,206,99,0.15)";
  const breakX = appState.piecewise.scenario === "taxi" ? 2 : appState.piecewise.scenario === "electricity" ? 100 : 10;
  ctx.fillRect(toX(0), pad, toX(breakX) - toX(0), h);

  ctx.strokeStyle = "#27d6cc";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = 0; x <= maxX; x += 1) {
    const px = toX(x);
    const py = toY(s.fn(x));
    if (x === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();

  const markerX = Number(appState.piecewise.x);
  const markerY = s.fn(markerX);
  ctx.fillStyle = "#ffe082";
  ctx.beginPath();
  ctx.arc(toX(markerX), toY(markerY), 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f6fbff";
  ctx.font = "12px Georgia";
  ctx.fillText(`active x=${markerX}`, toX(markerX) + 6, toY(markerY) - 8);
  ctx.fillText(s.title, 12, 18);
}

function renderQuadratic() {
  const q = appState.quadratic;
  render(`
    ${topStatsPanel()}
    <h2>📈 Module 3: Quadratic Functions</h2>
    <p class="subtitle">GeoGebra-like dynamic parabola plus vertex challenge.</p>

    <section class="card">
      <h3>Dynamic Graph Engine</h3>
      <div class="slider-grid">
        <label>a: <strong>${q.a}</strong></label>
        <input id="aVal" type="range" min="-5" max="5" step="0.1" value="${q.a}" />
        <label>b: <strong>${q.b}</strong></label>
        <input id="bVal" type="range" min="-10" max="10" step="0.1" value="${q.b}" />
        <label>c: <strong>${q.c}</strong></label>
        <input id="cVal" type="range" min="-20" max="20" step="0.1" value="${q.c}" />
      </div>
      <p class="hint">Function: f(x) = ${q.a.toFixed(1)}x² + ${q.b.toFixed(1)}x + ${q.c.toFixed(1)}</p>
      <canvas id="quadCanvas" width="460" height="270" aria-label="Quadratic graph"></canvas>
    </section>

    <section class="card">
      <h3>Find the Vertex Game 🎮</h3>
      <p class="subtitle">Score points by estimating the vertex accurately.</p>
      <div class="btn-row left">
        <button id="startVertex">New Round</button>
      </div>
      <div id="vertexGameArea"></div>
      <div class="btn-row left">
        <button class="secondary" data-go-home>Back Home</button>
      </div>
    </section>
  `);

  on("aVal", "input", e => {
    q.a = Number(e.target.value);
    draw();
  });
  on("bVal", "input", e => {
    q.b = Number(e.target.value);
    draw();
  });
  on("cVal", "input", e => {
    q.c = Number(e.target.value);
    draw();
  });

  on("startVertex", "click", startVertexRound);

  drawQuadratic();
  renderVertexArea();
}

function drawQuadratic() {
  const canvas = byId("quadCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { a, b, c } = appState.quadratic;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pad = 24;
  const w = canvas.width - 2 * pad;
  const h = canvas.height - 2 * pad;

  const minX = -10;
  const maxX = 10;
  const minY = -20;
  const maxY = 20;

  const toX = x => pad + ((x - minX) / (maxX - minX)) * w;
  const toY = y => pad + h - ((y - minY) / (maxY - minY)) * h;

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1;
  for (let gx = -10; gx <= 10; gx += 2) {
    ctx.beginPath();
    ctx.moveTo(toX(gx), toY(minY));
    ctx.lineTo(toX(gx), toY(maxY));
    ctx.stroke();
  }
  for (let gy = -20; gy <= 20; gy += 4) {
    ctx.beginPath();
    ctx.moveTo(toX(minX), toY(gy));
    ctx.lineTo(toX(maxX), toY(gy));
    ctx.stroke();
  }

  ctx.strokeStyle = "#f2f6ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(toX(minX), toY(0));
  ctx.lineTo(toX(maxX), toY(0));
  ctx.moveTo(toX(0), toY(minY));
  ctx.lineTo(toX(0), toY(maxY));
  ctx.stroke();

  ctx.strokeStyle = "#7af0d7";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = minX; x <= maxX; x += 0.05) {
    const y = a * x * x + b * x + c;
    if (x === minX) ctx.moveTo(toX(x), toY(y));
    else ctx.lineTo(toX(x), toY(y));
  }
  ctx.stroke();

  if (Math.abs(a) > 1e-9) {
    const vx = -b / (2 * a);
    const vy = a * vx * vx + b * vx + c;
    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(toX(vx), toY(vy), 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f6fbff";
    ctx.font = "12px Georgia";
    ctx.fillText(`Vertex (${vx.toFixed(2)}, ${vy.toFixed(2)})`, toX(vx) + 6, toY(vy) - 6);
  }
}

function startVertexRound() {
  const a = randInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
  const vx = randInt(-4, 4);
  const vy = randInt(-6, 6);
  const b = -2 * a * vx;
  const c = vy + a * vx * vx;

  appState.quadratic.vertexGame.round += 1;
  appState.quadratic.vertexGame.target = { a, b, c, vx, vy };
  appState.quadratic.vertexGame.guessX = "";
  appState.quadratic.vertexGame.guessY = "";

  renderVertexArea();
}

function renderVertexArea() {
  const host = byId("vertexGameArea");
  if (!host) return;
  const g = appState.quadratic.vertexGame;

  if (!g.target) {
    host.innerHTML = `<p class="hint">Start a round to generate a parabola challenge.</p>`;
    return;
  }

  host.innerHTML = `
    <div class="vertex-box">
      <p><strong>Round ${g.round}</strong>: Find the vertex of</p>
      <p class="equation">f(x) = ${g.target.a}x² ${formatSigned(g.target.b)}x ${formatSigned(g.target.c)}</p>
      <div class="quiz-inline">
        <label>Vertex x</label>
        <input id="vertexGuessX" type="number" value="${esc(g.guessX)}" />
        <label>Vertex y</label>
        <input id="vertexGuessY" type="number" value="${esc(g.guessY)}" />
      </div>
      <div class="btn-row left">
        <button id="checkVertex">Submit Guess</button>
      </div>
      <p id="vertexFeedback" class="hint">Current points: ${g.points}</p>
    </div>
  `;

  on("checkVertex", "click", () => {
    const gx = Number(val("vertexGuessX"));
    const gy = Number(val("vertexGuessY"));
    g.guessX = val("vertexGuessX");
    g.guessY = val("vertexGuessY");

    const dx = Math.abs(gx - g.target.vx);
    const dy = Math.abs(gy - g.target.vy);
    const accurate = dx <= 0.2 && dy <= 0.2;
    const almost = dx <= 1 && dy <= 1;

    const fb = byId("vertexFeedback");
    if (accurate) {
      g.points += 10;
      grantXp(20, "Accurate vertex found");
      db.moduleCompletion.quadratic = true;
      saveData();
      recordCompetency("problemSolving", true, "Quadratic Vertex");
      fb.textContent = `Excellent! Vertex is (${g.target.vx}, ${g.target.vy}). +10 points.`;
      fb.style.color = "var(--success)";
    } else if (almost) {
      g.points += 4;
      grantXp(10, "Near vertex estimate");
      recordCompetency("problemSolving", true, "Quadratic Vertex (Near)");
      fb.textContent = `Close! Exact vertex is (${g.target.vx}, ${g.target.vy}). +4 points.`;
      fb.style.color = "#ffd166";
    } else {
      recordCompetency("problemSolving", false, "Quadratic Vertex");
      fb.textContent = `Not yet. Exact vertex is (${g.target.vx}, ${g.target.vy}).`;
      fb.style.color = "var(--danger)";
    }
  });
}

function startQuiz() {
  appState.currentQuiz = {
    index: 0,
    score: 0,
    items: shuffle([...competencyQuiz])
  };
  appState.screen = "quiz";
  draw();
}

function renderQuiz() {
  const qz = appState.currentQuiz;
  if (!qz) return;
  const done = qz.index >= qz.items.length;

  if (done) {
    const pct = Math.round((qz.score / qz.items.length) * 100);
    grantXp(25, "Completed competency quiz");
    render(`
      ${topStatsPanel()}
      <section class="hero compact">
        <h2>🧩 Quiz Complete</h2>
        <p class="subtitle">Score: <strong>${qz.score}/${qz.items.length}</strong> (${pct}%)</p>
        <div class="btn-row">
          <button id="retryQuiz">Retry Quiz</button>
          <button class="secondary" data-go-analytics>View Analytics</button>
          <button class="secondary" data-go-home>Home</button>
        </div>
      </section>
    `);
    on("retryQuiz", "click", startQuiz);
    return;
  }

  const item = qz.items[qz.index];
  const number = qz.index + 1;
  render(`
    ${topStatsPanel()}
    <section class="card">
      <p class="subtitle">Question ${number} of ${qz.items.length} · ${competencyKeys[item.competency]}</p>
      <h3>${esc(item.question)}</h3>
      <div class="choices" id="quizChoices">
        ${item.choices.map(c => `<button class="choice-btn" data-c="${esc(c)}">${esc(c)}</button>`).join("")}
      </div>
      <p id="quizFb" class="hint"></p>
      <div class="btn-row left">
        <button class="secondary" data-go-home>Exit Quiz</button>
      </div>
    </section>
  `);

  const buttons = [...document.querySelectorAll("#quizChoices .choice-btn")];
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => (b.disabled = true));
      const selected = btn.dataset.c;
      const ok = selected === item.answer;
      recordCompetency(item.competency, ok, "Competency Quiz");
      if (ok) {
        btn.classList.add("correct");
        qz.score += 1;
      } else {
        btn.classList.add("wrong");
        const hit = buttons.find(b => b.dataset.c === item.answer);
        if (hit) hit.classList.add("correct");
      }

      const fb = byId("quizFb");
      fb.textContent = `${ok ? "Correct" : "Incorrect"}. ${item.rationale}`;
      fb.style.color = ok ? "var(--success)" : "var(--danger)";

      setTimeout(() => {
        qz.index += 1;
        draw();
      }, 900);
    });
  });
}

function renderAnalytics() {
  const i = competencyPct("interpretation");
  const s = competencyPct("selection");
  const p = competencyPct("problemSolving");
  const overall = completionPct();

  render(`
    ${topStatsPanel()}
    <h2>📊 Results & Analytics</h2>
    <p class="subtitle">Performance per competency, stored in LocalStorage for thesis-ready tracking.</p>

    <section class="card">
      <div class="stats-grid compact">
        <div><strong>Interpretation</strong><span>${i}%</span></div>
        <div><strong>Selection</strong><span>${s}%</span></div>
        <div><strong>Problem-solving</strong><span>${p}%</span></div>
        <div><strong>Module Completion</strong><span>${overall}%</span></div>
      </div>
      <canvas id="analyticsCanvas" width="460" height="250" aria-label="Competency chart"></canvas>
      <div class="question-callout">
        <strong>Auto Feedback</strong>
        <p>${generateFeedback(i, s, p)}</p>
      </div>
      <div class="btn-row left">
        <button class="secondary" data-go-home>Back Home</button>
      </div>
    </section>

    <section class="card">
      <h3>Badges</h3>
      <div class="badge-row">
        ${db.badges.length ? db.badges.map(b => `<span class="badge done">${esc(b)}</span>`).join("") : "<span class=\"hint\">No badges yet. Keep playing modules.</span>"}
      </div>
    </section>
  `);

  drawAnalyticsChart(i, s, p);
}

function drawAnalyticsChart(i, s, p) {
  const canvas = byId("analyticsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const labels = ["Interpretation", "Selection", "Problem-solving"];
  const values = [i, s, p];

  const pad = 36;
  const w = canvas.width - pad * 2;
  const h = canvas.height - pad * 2;

  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, pad + h);
  ctx.lineTo(pad + w, pad + h);
  ctx.stroke();

  const bw = 90;
  values.forEach((v, idx) => {
    const x = pad + 30 + idx * 130;
    const bh = (v / 100) * (h - 10);
    const y = pad + h - bh;

    const grad = ctx.createLinearGradient(x, y, x, y + bh);
    grad.addColorStop(0, "#ffe082");
    grad.addColorStop(1, "#2dd4bf");
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, bw, bh);

    ctx.fillStyle = "#f7fbff";
    ctx.font = "12px Georgia";
    ctx.fillText(`${v}%`, x + 30, y - 6);
    ctx.fillText(labels[idx], x + 2, pad + h + 18);
  });
}

function generateFeedback(i, s, p) {
  const notes = [];
  if (i >= 70) notes.push("You improved in interpreting data.");
  else notes.push("Practice interpreting mean, median, mode, and variability.");

  if (s >= 70) notes.push("You can choose appropriate measures in many datasets.");
  else notes.push("Practice selecting the best measure when outliers are present.");

  if (p >= 70) notes.push("Your practical problem-solving with piecewise/quadratic tasks is strong.");
  else notes.push("Practice real-life piecewise and vertex problems for higher confidence.");

  return notes.join(" ");
}

function on(id, event, handler) {
  const el = byId(id);
  if (el) el.addEventListener(event, handler);
}

function byId(id) {
  return document.getElementById(id);
}

function val(id) {
  const el = byId(id);
  return el ? el.value : "";
}

function formatSigned(v) {
  return v >= 0 ? `+ ${v}` : `- ${Math.abs(v)}`;
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toast(message) {
  const old = byId("toast");
  if (old) old.remove();
  const t = document.createElement("div");
  t.id = "toast";
  t.className = "toast";
  t.textContent = message;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add("show"), 8);
  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 220);
  }, 1800);
}

function toggleTheme() {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const next = isLight ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("genmath_theme", next);
  const btn = byId("themeToggle");
  if (btn) btn.textContent = next === "light" ? "☀" : "☾";
}

function loadTheme() {
  const theme = localStorage.getItem("genmath_theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);
  const btn = byId("themeToggle");
  if (btn) btn.textContent = theme === "light" ? "☀" : "☾";
}

function launchConfetti() {
  const canvas = byId("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const bits = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height,
    r: 3 + Math.random() * 5,
    v: 1 + Math.random() * 3,
    drift: -1 + Math.random() * 2,
    hue: Math.floor(Math.random() * 360)
  }));

  let frame = 0;
  const max = 160;

  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bits.forEach(b => {
      b.y += b.v;
      b.x += b.drift;
      ctx.fillStyle = `hsl(${b.hue} 95% 65%)`;
      ctx.fillRect(b.x, b.y, b.r, b.r);
    });
    frame += 1;
    if (frame < max) requestAnimationFrame(step);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  step();
}

loadTheme();
on("themeToggle", "click", toggleTheme);
draw();
