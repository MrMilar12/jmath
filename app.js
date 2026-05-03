"use strict";

// ─── SweetAlert2 helper ───────────────────────────────────────────────────────
function swalPop(opts) {
  if (typeof Swal === "undefined") return Promise.resolve({ isConfirmed: true });
  return Swal.fire({
    background: "rgba(6, 19, 30, 0.97)",
    color: "#f3fbff",
    confirmButtonColor: "#26d0ce",
    cancelButtonColor: "rgba(255,255,255,0.15)",
    backdrop: "rgba(0,0,0,0.72)",
    customClass: { popup: "swal-custom-popup" },
    ...opts
  });
}

// ─── App metadata ─────────────────────────────────────────────────────────────
const AUTHOR_BIO =
  "Sir Jayson is a passionate and dedicated Mathematics teacher who believes " +
  "every student can learn — when content is made interesting, relevant, and " +
  "interactive. With years of classroom experience, he designed this domain " +
  "to guide students through key General Mathematics concepts using games, " +
  "visuals, and guided discovery.";

const GM_PREFACE =
  "This interactive learning module covers the core competencies of General " +
  "Mathematics for the First Quarter. Each topic is designed step-by-step — " +
  "from a motivation game that sparks curiosity, to guided discussion, " +
  "hands-on activities, and a final assessment. By the end, you will be able " +
  "to interpret statistical measures, evaluate piecewise functions, and graph " +
  "quadratic equations with confidence.";

const COMPETENCIES = [
  "Interpret measures of central tendency and variability",
  "Identify the most appropriate measure for a given data set",
  "Solve practical problems involving piecewise functions",
  "Graph and analyze quadratic functions in standard form"
];

// ─── Topics definition ────────────────────────────────────────────────────────
const TOPICS = [
  {
    id: 1,
    icon: "📊",
    title: "Measures of Central Tendency & Variability",
    color: "#26d0ce",
    phases: ["Motivation", "Discussion", "Activity", "Assessment"]
  },
  {
    id: 2,
    icon: "🔀",
    title: "Piecewise Functions",
    color: "#ffd166",
    phases: ["Motivation", "Discussion", "Activity", "Assessment"]
  },
  {
    id: 3,
    icon: "📈",
    title: "Quadratic Functions",
    color: "#ef6c9f",
    phases: ["Motivation", "Discussion", "Activity", "Assessment"]
  }
];

// ─── Quiz banks ───────────────────────────────────────────────────────────────
const QUIZ = {
  1: [
    {
      q: "Scores: 65, 70, 72, 74, 95. Which measure best represents a 'typical' score?",
      opts: ["Mean", "Median", "Mode"],
      a: "Median",
      why: "The high outlier (95) inflates the mean. Median is more robust.",
      competency: "interpretation"
    },
    {
      q: "Dataset: 8, 8, 9, 10, 10, 10, 11. You want the most common value.",
      opts: ["Mean", "Median", "Mode"],
      a: "Mode",
      why: "Mode captures the most frequent observation, which is 10.",
      competency: "selection"
    },
    {
      q: "What does a large standard deviation indicate?",
      opts: ["Data is close together", "Data is spread out", "No outliers exist"],
      a: "Data is spread out",
      why: "Standard deviation measures spread — larger means more variation.",
      competency: "interpretation"
    },
    {
      q: "Temps: 22, 21, 23, 22, 150. Which measure is most affected by the outlier?",
      opts: ["Mean", "Median", "Mode"],
      a: "Mean",
      why: "Mean adds all values, so extreme outliers shift it significantly.",
      competency: "selection"
    }
  ],
  2: [
    {
      q: "f(x)= {50 if x≤2, 50+12(x-2) if x>2}. Find f(5).",
      opts: ["74", "80", "86", "96"],
      a: "86",
      why: "x=5 > 2, so use 50 + 12(5-2) = 50 + 36 = 86.",
      competency: "problemSolving"
    },
    {
      q: "f(x)= {2x if x<0, x² if x≥0}. Find f(-3).",
      opts: ["-6", "9", "6", "-9"],
      a: "-6",
      why: "x=-3 < 0, use 2x: 2(-3) = -6.",
      competency: "problemSolving"
    },
    {
      q: "Electricity: f(x)={300 if x≤100, 300+9(x-100) if x>100}. Find f(120).",
      opts: ["318", "480", "420", "300"],
      a: "480",
      why: "x=120 > 100, so 300 + 9(120-100) = 300 + 180 = 480.",
      competency: "problemSolving"
    },
    {
      q: "Which real-life situation is best modeled by a piecewise function?",
      opts: ["Constant salary", "Progressive tax brackets", "Flat-rate shipping"],
      a: "Progressive tax brackets",
      why: "Tax rates change at different income intervals — classic piecewise.",
      competency: "selection"
    }
  ],
  3: [
    {
      q: "f(x) = 2x² - 8x + 6. What is the x-coordinate of the vertex?",
      opts: ["2", "-2", "4", "-4"],
      a: "2",
      why: "vx = -b/(2a) = -(-8)/(2×2) = 8/4 = 2.",
      competency: "problemSolving"
    },
    {
      q: "f(x) = -3x² + 12x - 5. Does the parabola open upward or downward?",
      opts: ["Upward", "Downward", "Neither"],
      a: "Downward",
      why: "a = -3 < 0, so the parabola opens downward.",
      competency: "interpretation"
    },
    {
      q: "For f(x) = x² - 4x + 4, what is the vertex?",
      opts: ["(2, 0)", "(0, 4)", "(-2, 0)", "(4, 0)"],
      a: "(2, 0)",
      why: "vx = 4/2 = 2, vy = 4 - 8 + 4 = 0. Vertex: (2, 0).",
      competency: "problemSolving"
    },
    {
      q: "Ball height: h(t) = -5t² + 20t. What is the maximum height?",
      opts: ["15 m", "20 m", "25 m", "10 m"],
      a: "20 m",
      why: "vt = -20/(2×-5) = 2s. h(2) = -5(4)+40 = -20+40 = 20 m.",
      competency: "problemSolving"
    }
  ]
};

// ─── State ────────────────────────────────────────────────────────────────────
const appState = {
  screen: "landing",
  topicId: 1,
  topicPhase: 1,
  quizState: null,
  statsData: { raw: "", computed: null },
  piecewise: { scenario: "taxi", x: 5, guessX: 0, guessY: "" },
  quadratic: { a: 1, b: 0, c: 0, vGame: { round: 0, target: null, pts: 0, guessX: "", guessY: "" } },
  detective: { set: null, answered: false }
};

const voiceState = {
  rate: 0.95,
  pitch: 1,
  volume: 1
};

const voiceRuntime = {
  voicesReady: false,
  queue: [],
  isQuirky: false
};

const coachRuntime = {
  key: "",
  step: 0,
  corner: "right",
  dismissed: false,
  lastTypedToken: "",
  typingTimer: null
};

// ─── Detective game data ──────────────────────────────────────────────────────
const DETECTIVE_SETS = [
  {
    name: "Café Daily Sales",
    values: [120, 122, 119, 121, 500],
    prompt: "Which best represents TYPICAL daily sales?",
    opts: ["Mean", "Median", "Mode"],
    a: "Median",
    why: "The outlier 500 pulls the mean up. Median (121) is more representative."
  },
  {
    name: "Quiz Scores (Class A)",
    values: [78, 80, 80, 82, 85, 89],
    prompt: "You want the most frequently occurring score.",
    opts: ["Mean", "Median", "Mode"],
    a: "Mode",
    why: "Mode is 80 — the most frequent score."
  },
  {
    name: "Travel Time (min)",
    values: [34, 35, 35, 36, 37, 38],
    prompt: "For an overall average travel report, which measure works best?",
    opts: ["Mean", "Median", "Mode"],
    a: "Mean",
    why: "No outliers here — mean gives a balanced summary of all commute times."
  },
  {
    name: "Monthly Salaries (₱)",
    values: [18000, 19000, 20000, 20000, 250000],
    prompt: "A researcher wants the 'typical' salary to avoid bias from the CEO's pay.",
    opts: ["Mean", "Median", "Mode"],
    a: "Median",
    why: "The CEO salary (250k) inflates the mean. Median is fair here."
  }
];

// ─── Piecewise scenarios ──────────────────────────────────────────────────────
const SCENARIOS = {
  taxi: {
    title: "Taxi Fare 🚕",
    label: "km",
    rule: "₱50 for first 2 km, then ₱12/km after",
    formula: "f(x) = 50 if x ≤ 2 ; 50 + 12(x − 2) if x > 2",
    fn: x => x <= 2 ? 50 : 50 + 12 * (x - 2),
    maxX: 20
  },
  electricity: {
    title: "Electricity Bill ⚡",
    label: "kWh",
    rule: "₱300 for first 100 kWh, then ₱9/kWh after",
    formula: "f(x) = 300 if x ≤ 100 ; 300 + 9(x − 100) if x > 100",
    fn: x => x <= 100 ? 300 : 300 + 9 * (x - 100),
    maxX: 200
  },
  mobile: {
    title: "Mobile Data 📱",
    label: "GB",
    rule: "₱199 for first 10 GB, then ₱25/GB after",
    formula: "f(x) = 199 if x ≤ 10 ; 199 + 25(x − 10) if x > 10",
    fn: x => x <= 10 ? 199 : 199 + 25 * (x - 10),
    maxX: 30
  }
};

// ─── LocalStorage ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "sirjayson_gm_v1";
const DEFAULT_DB = {
  xp: 0,
  level: 1,
  badges: [],
  phaseComplete: {},
  competency: {
    interpretation: { score: 0, attempts: 0 },
    selection: { score: 0, attempts: 0 },
    problemSolving: { score: 0, attempts: 0 }
  }
};

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DB);
    const p = JSON.parse(raw);
    return {
      ...structuredClone(DEFAULT_DB),
      ...p,
      competency: { ...DEFAULT_DB.competency, ...(p.competency || {}) },
      phaseComplete: p.phaseComplete || {},
      badges: Array.isArray(p.badges) ? p.badges : []
    };
  } catch (_) { return structuredClone(DEFAULT_DB); }
}

let db = loadDb();
function saveDb() { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }

function markPhase(topicId, phase) {
  db.phaseComplete[`${topicId}_${phase}`] = true;
  saveDb();
}
function phaseIsComplete(topicId, phase) {
  return !!db.phaseComplete[`${topicId}_${phase}`];
}
function topicIsComplete(topicId) {
  return [1, 2, 3, 4].every(p => phaseIsComplete(topicId, p));
}
function overallCompletionPct() {
  const total = TOPICS.length * 4;
  const done = Object.values(db.phaseComplete).filter(Boolean).length;
  return Math.round((done / total) * 100);
}

function grantXp(amount, reason) {
  const oldLevel = db.level;
  db.xp += amount;
  db.level = Math.floor(db.xp / 100) + 1;
  checkBadges();
  saveDb();
  toast(`+${amount} XP — ${reason}`);
  if (db.level > oldLevel) {
    swalPop({
      title: `🎉 Level Up!`,
      html: `<p>You are now <strong>Level ${db.level}</strong>!</p>`,
      icon: "success",
      timer: 2200,
      showConfirmButton: false
    });
    launchConfetti();
  }
}

function recordComp(key, correct) {
  db.competency[key].attempts += 1;
  if (correct) db.competency[key].score += 1;
  saveDb();
}

function compPct(key) {
  const c = db.competency[key];
  return c.attempts ? Math.round((c.score / c.attempts) * 100) : 0;
}

function checkBadges() {
  const candidates = [
    [topicIsComplete(1), "📊 Statistics Master"],
    [topicIsComplete(2), "🔀 Piecewise Pro"],
    [topicIsComplete(3), "📈 Quadratic Expert"],
    [db.xp >= 200, "⭐ 200 XP Scholar"],
    [db.level >= 4, "🏆 Level 4 Achiever"],
    [TOPICS.every(t => topicIsComplete(t.id)), "🎓 Gen Math Complete"]
  ];
  candidates.forEach(([cond, badge]) => {
    if (cond && !db.badges.includes(badge)) {
      db.badges.push(badge);
      toast(`🏅 Badge unlocked: ${badge}`);
    }
  });
}

// ─── Core render ──────────────────────────────────────────────────────────────
function appEl() { return document.getElementById("app"); }
function byId(id) { return document.getElementById(id); }
function val(id) { const e = byId(id); return e ? e.value : ""; }
function on(id, ev, fn) { const e = byId(id); if (e) e.addEventListener(ev, fn); }
function esc(v) {
  return String(v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function render(html) {
  const el = appEl();
  el.innerHTML = `${html}${voiceDockHtml()}`;
  el.classList.remove("screen-enter");
  void el.offsetWidth;
  el.classList.add("screen-enter");
  applyPageMotion();
  wireDataGo();
  wireVoiceDock();
  syncTeacherCoach();
}

function applyPageMotion() {
  const nodes = document.querySelectorAll(
    ".xp-panel, .landing-content, .author-card, .preface-card, .teacher-guide, .topic-card, .topic-header, .phase-card, .card, .discuss-section, .callout-box, .quiz-progress, .stats-result-grid, .badge-row, .voice-dock"
  );
  nodes.forEach((node, idx) => {
    node.classList.remove("motion-item");
    // Restart animation so each new screen draw feels dynamic.
    void node.offsetWidth;
    node.classList.add("motion-item");
    node.style.setProperty("--motion-delay", `${Math.min(idx * 45, 540)}ms`);
  });
}

function voiceDockHtml() {
  return `
    <div class="voice-dock">
      <button id="btnVoiceRead" class="secondary" type="button">🔊 Read Aloud</button>
      <button id="btnVoiceQuirky" class="secondary" type="button">🤪 Quirky Voice</button>
      <button id="btnVoiceStop" class="secondary" type="button">⏹ Stop</button>
    </div>
  `;
}

function pickVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v => /en-PH|en-US|fil|tagalog/i.test(`${v.lang} ${v.name}`)) || voices[0] || null;
}

function initVoiceEngine() {
  if (!("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  const update = () => {
    voiceRuntime.voicesReady = synth.getVoices().length > 0;
  };
  update();
  if (typeof synth.addEventListener === "function") {
    synth.addEventListener("voiceschanged", update);
  } else {
    synth.onvoiceschanged = update;
  }
}

function getScreenNarrationText() {
  if (appState.screen === "landing") {
    return `Welcome to Sir Jayson's Learning Domain. ${AUTHOR_BIO}`;
  }
  if (appState.screen === "preface") {
    return `General Mathematics preface. ${GM_PREFACE} Core competencies include: ${COMPETENCIES.join(", ")}.`;
  }
  if (appState.screen === "modules") {
    return "Choose a topic. Each topic has four phases: Motivation game, Discussion, Activity, and Assessment quiz.";
  }
  if (appState.screen === "topic") {
    const topic = TOPICS.find(t => t.id === appState.topicId);
    const phaseNames = ["Motivation", "Discussion", "Activity", "Assessment"];
    const phaseName = phaseNames[appState.topicPhase - 1] || "Learning";
    return `You are in ${topic ? topic.title : "General Mathematics"}. Current phase: ${phaseName}.`;
  }
  if (appState.screen === "analytics") {
    return "This is your analytics page showing interpretation, selection, and problem solving performance, along with your completion and badges.";
  }
  return "General Mathematics interactive module.";
}

function setVoiceSubtitle(text) {
  let el = byId("voiceSubtitle");
  if (!el) {
    el = document.createElement("div");
    el.id = "voiceSubtitle";
    el.className = "voice-subtitle";
    document.body.appendChild(el);
  }
  el.textContent = text;
  el.classList.add("show");
}

function clearVoiceSubtitle() {
  const el = byId("voiceSubtitle");
  if (!el) return;
  el.classList.remove("show");
}

function splitNarration(text) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const sentenceChunks = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
  const out = [];
  sentenceChunks.forEach(chunk => {
    if (chunk.length <= 180) {
      out.push(chunk);
      return;
    }
    for (let i = 0; i < chunk.length; i += 170) {
      out.push(chunk.slice(i, i + 170));
    }
  });
  return out;
}

function speakQueueNext() {
  if (!("speechSynthesis" in window)) return;
  if (!voiceRuntime.queue.length) {
    clearVoiceSubtitle();
    return;
  }

  const synth = window.speechSynthesis;
  const part = voiceRuntime.queue.shift();
  const utter = new SpeechSynthesisUtterance(part);
  const v = pickVoice();
  if (v) utter.voice = v;
  utter.rate = voiceRuntime.isQuirky ? 1.16 : voiceState.rate;
  utter.pitch = voiceRuntime.isQuirky ? 1.35 : voiceState.pitch;
  utter.volume = voiceState.volume;
  utter.onstart = () => {
    const lead = voiceRuntime.isQuirky ? "Sir Jayson (quirky): " : "Sir Jayson: ";
    setVoiceSubtitle(lead + part);
  };
  utter.onend = () => {
    if (voiceRuntime.queue.length) speakQueueNext();
    else clearVoiceSubtitle();
  };
  utter.onerror = () => {
    if (voiceRuntime.queue.length) speakQueueNext();
    else clearVoiceSubtitle();
  };
  synth.speak(utter);
}

function speakText(text, mode = "normal") {
  if (!("speechSynthesis" in window)) {
    toast("Voice narration is not supported in this browser.");
    return;
  }
  const msg = (text || "").trim();
  if (!msg) return;

  const synth = window.speechSynthesis;
  synth.cancel();
  voiceRuntime.isQuirky = mode === "quirky";
  voiceRuntime.queue = splitNarration(msg);

  // Some browsers load voices asynchronously after first user interaction.
  if (!voiceRuntime.voicesReady && synth.getVoices().length === 0) {
    setVoiceSubtitle("Loading voice engine...");
    setTimeout(() => {
      voiceRuntime.voicesReady = synth.getVoices().length > 0;
      if (!voiceRuntime.voicesReady) {
        setVoiceSubtitle("Using default browser voice...");
      }
      speakQueueNext();
    }, 180);
    return;
  }

  speakQueueNext();
}

function stopSpeaking() {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  voiceRuntime.queue = [];
  clearVoiceSubtitle();
}

function wireVoiceDock() {
  on("btnVoiceRead", "click", () => speakText(getScreenNarrationText()));
  on("btnVoiceQuirky", "click", () => speakText(getScreenNarrationText(), "quirky"));
  on("btnVoiceStop", "click", stopSpeaking);
}

function refreshTenorEmbed() {
  const old = byId("tenorEmbedScript");
  if (old) old.remove();
  const s = document.createElement("script");
  s.id = "tenorEmbedScript";
  s.src = "https://tenor.com/embed.js";
  s.async = true;
  document.body.appendChild(s);
}

function wireDataGo() {
  document.querySelectorAll("[data-go]").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.go;
      if (t === "modules") { appState.screen = "modules"; draw(); }
      else if (t === "landing") { appState.screen = "landing"; draw(); }
      else if (t === "analytics") { appState.screen = "analytics"; draw(); }
      else if (t === "preface") { appState.screen = "preface"; draw(); }
    });
  });
}

function draw() {
  const s = appState.screen;
  if (s === "landing") return renderLanding();
  if (s === "preface") return renderPreface();
  if (s === "modules") return renderModules();
  if (s === "topic") return renderTopic();
  if (s === "analytics") return renderAnalytics();
  renderLanding();
}

function moduleTeacherLine(topicId, phase) {
  const lines = {
    "1_1": "Notice how one outlier can trick your mean. In this game, compare answers before trusting the first result.",
    "1_2": "While we discuss, ask: is this dataset balanced or skewed? That decides if mean or median is better.",
    "1_3": "As you solve the activity, say your interpretation out loud: what does each value tell about the class?",
    "1_4": "During assessment, read like a detective. Look for outliers and keywords before selecting your answer.",
    "2_1": "In this motivation game, one story has different price rules. That is exactly why piecewise functions exist.",
    "2_2": "Discussion tip: condition first, formula second. Always identify the interval before computing.",
    "2_3": "In the game, move the input and predict the output before checking the graph. That builds real understanding.",
    "2_4": "Assessment strategy: locate the interval quickly, then substitute carefully. Most mistakes happen in rule selection.",
    "3_1": "Watch how the ball reaches a highest point. That turning point is the vertex we will analyze.",
    "3_2": "During discussion, connect coefficients to graph behavior: a controls opening, b shifts the vertex.",
    "3_3": "Use sliders like an experiment. Change one value at a time and explain what changed in the parabola.",
    "3_4": "For quiz items, combine formula and graph intuition. Verify if your computed vertex matches the shape."
  };
  return lines[`${topicId}_${phase}`] || "Keep going. Understand the concept, then apply it step by step.";
}

function moduleTeacherDialog(topicId, phase, screen) {
  if (screen === "landing") {
    return [
      "Welcome, Math Explorer. I will guide you like a game coach while you learn.",
      "Click Next and watch this dialogue move, just like a live talking character.",
      "When you are ready, press Start Learning and we begin your first module adventure."
    ];
  }

  if (screen === "modules") {
    return [
      "Pick one topic first. We will go step by step so you do not feel lost.",
      "Each topic has 4 parts: Motivation, Discussion, Activity, and Assessment.",
      "Start with the topic you find most interesting, then complete all phases."
    ];
  }

  return [
    moduleTeacherLine(topicId, phase),
    "Watch the clues inside the game and examples. They are part of the lesson discussion.",
    "Click Next to continue the guide, then apply the tip immediately in this phase."
  ];
}

function teacherGuideCard(topicId, phase, label = "Now discussing") {
  return `
    <div class="teacher-guide">
      <div class="teacher-css-anim mini" aria-hidden="true">
        <div class="chalkboard-anim">
          <p class="ck c1">Think</p>
          <p class="ck c2">Solve</p>
          <p class="ck c3">Explain</p>
        </div>
        <div class="sir-figure">
          <div class="sir-head">
            <div class="sir-hair"></div>
            <div class="sir-brow left"></div>
            <div class="sir-brow right"></div>
            <div class="sir-eyes"><div class="sir-eye"></div><div class="sir-eye"></div></div>
            <div class="sir-glasses"></div>
            <div class="sir-smile"></div>
          </div>
          <div class="sir-torso-row">
            <div class="sir-arm left-arm"></div>
            <div class="sir-body"><div class="sir-tie"></div></div>
            <div class="sir-arm right-arm"></div>
          </div>
          <div class="sir-legs"><div class="sir-leg"></div><div class="sir-leg"></div></div>
        </div>
      </div>
      <div class="teacher-bubble">
        <strong>Sir Jayson • ${esc(label)}</strong>
        <p id="coachTypedText" class="coach-typed"></p>
        <div class="coach-controls">
          <button id="btnCoachNext" type="button" class="secondary">Next →</button>
          <button id="btnCoachOk" type="button" class="secondary">OK</button>
        </div>
      </div>
    </div>
  `;
}

function getCoachContext() {
  if (appState.screen === "landing") {
    return {
      topicId: 1,
      phase: 1,
      label: "Welcome briefing"
    };
  }
  if (appState.screen === "modules") {
    return {
      topicId: appState.topicId || 1,
      phase: 1,
      label: "Topic orientation"
    };
  }
  if (appState.screen === "topic") {
    const labels = ["Motivation", "Discussion", "Activity", "Assessment"];
    return {
      topicId: appState.topicId,
      phase: appState.topicPhase,
      label: labels[appState.topicPhase - 1] || "Guidance"
    };
  }
  return null;
}

function coachContextKey(ctx) {
  return `${appState.screen}_${ctx.topicId}_${ctx.phase}`;
}

function clearCoachTyping() {
  if (coachRuntime.typingTimer) {
    clearInterval(coachRuntime.typingTimer);
    coachRuntime.typingTimer = null;
  }
}

function typeCoachLine(line, token) {
  const host = byId("coachTypedText");
  if (!host) return;
  clearCoachTyping();
  host.textContent = "";
  host.classList.add("typing");
  let i = 0;
  coachRuntime.typingTimer = setInterval(() => {
    i += 1;
    host.textContent = line.slice(0, i);
    if (i >= line.length) {
      clearCoachTyping();
      host.classList.remove("typing");
      coachRuntime.lastTypedToken = token;
    }
  }, 16);
}

function setCoachLine(line, token) {
  const host = byId("coachTypedText");
  if (!host) return;
  if (coachRuntime.lastTypedToken === token) {
    clearCoachTyping();
    host.classList.remove("typing");
    host.textContent = line;
    return;
  }
  typeCoachLine(line, token);
}

function updateCoachButtons(lines) {
  const next = byId("btnCoachNext");
  const ok = byId("btnCoachOk");
  if (!next || !ok) return;
  const last = coachRuntime.step >= lines.length - 1;
  next.style.display = last ? "none" : "inline-flex";
  next.disabled = last;
  ok.textContent = last ? "OK" : "Skip";
}

function applyCoachCornerClass() {
  const overlay = byId("teacherCoachOverlay");
  if (!overlay) return;
  overlay.classList.remove("corner-left", "corner-right");
  overlay.classList.add(coachRuntime.corner === "left" ? "corner-left" : "corner-right");
}

function fadeCoachBubble(after) {
  const bubble = document.querySelector("#teacherCoachOverlay .teacher-bubble");
  if (!bubble) {
    after();
    return;
  }
  bubble.classList.add("coach-fade-out");
  setTimeout(() => {
    bubble.classList.remove("coach-fade-out");
    after();
  }, 220);
}

function wireTeacherCoach(ctx) {
  const lines = moduleTeacherDialog(ctx.topicId, ctx.phase, appState.screen);
  const current = lines[Math.min(coachRuntime.step, lines.length - 1)] || "";
  const token = `${coachRuntime.key}_${coachRuntime.step}`;
  setCoachLine(current, token);
  updateCoachButtons(lines);

  on("btnCoachNext", "click", () => {
    if (coachRuntime.step >= lines.length - 1) return;
    fadeCoachBubble(() => {
      coachRuntime.step += 1;
      coachRuntime.corner = coachRuntime.corner === "right" ? "left" : "right";
      applyCoachCornerClass();
      const nxt = lines[coachRuntime.step] || "";
      setCoachLine(nxt, `${coachRuntime.key}_${coachRuntime.step}`);
      updateCoachButtons(lines);
    });
  });

  on("btnCoachOk", "click", () => {
    fadeCoachBubble(() => {
      coachRuntime.dismissed = true;
      const overlay = byId("teacherCoachOverlay");
      if (overlay) overlay.remove();
      document.body.classList.remove("has-coach");
      clearCoachTyping();
    });
  });
}

function syncTeacherCoach() {
  const ctx = getCoachContext();
  const old = byId("teacherCoachOverlay");
  if (!ctx) {
    if (old) old.remove();
    document.body.classList.remove("has-coach");
    return;
  }

  const key = coachContextKey(ctx);
  if (coachRuntime.key !== key) {
    coachRuntime.key = key;
    coachRuntime.step = 0;
    coachRuntime.corner = "right";
    coachRuntime.dismissed = false;
    coachRuntime.lastTypedToken = "";
  }

  if (coachRuntime.dismissed) {
    if (old) old.remove();
    document.body.classList.remove("has-coach");
    return;
  }

  document.body.classList.add("has-coach");

  const html = `
    <aside id="teacherCoachOverlay" class="teacher-coach-overlay ${coachRuntime.corner === "left" ? "corner-left" : "corner-right"} motion-item" style="--motion-delay:120ms">
      ${teacherGuideCard(ctx.topicId, ctx.phase, ctx.label)}
    </aside>
  `;

  if (old) old.outerHTML = html;
  else document.body.insertAdjacentHTML("beforeend", html);

  wireTeacherCoach(ctx);
}

// ─── XP bar panel ─────────────────────────────────────────────────────────────
function xpPanel() {
  const pct = Math.min(100, Math.round(((db.xp % 100) / 100) * 100));
  return `
    <div class="xp-panel">
      <span class="xp-chip">⚡ ${db.xp} XP</span>
      <span class="xp-chip">Level ${db.level}</span>
      <span class="xp-chip">🏅 ${db.badges.length}</span>
      <div class="xp-bar-outer"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

// ─── SCREEN: Landing ──────────────────────────────────────────────────────────
function renderLanding() {
  render(`
    <div class="landing-page landing-intro">
      <div class="teacher-stage">
        <div class="teacher-stack">
          <div class="tenor-wrap">
            <div class="tenor-gif-embed"
                 data-postid="12908703"
                 data-share-method="host"
                 data-aspect-ratio="1"
                 data-width="100%">
              <a href="https://tenor.com/view/teacher-school-teaching-showing-gif-12908703">Teacher School GIF</a>
            </div>
          </div>
          <div id="teacherCss" class="teacher-css-anim">
            <div class="chalkboard-anim">
              <p class="ck c1">f(x) = ax² + bx + c</p>
              <p class="ck c2">μ = Σx ÷ n</p>
              <p class="ck c3">σ = √(Σ(x−μ)²÷n)</p>
            </div>
            <div class="sir-figure">
              <div class="sir-head">
                <div class="sir-hair"></div>
                <div class="sir-brow left"></div>
                <div class="sir-brow right"></div>
                <div class="sir-eyes"><div class="sir-eye"></div><div class="sir-eye"></div></div>
                <div class="sir-glasses"></div>
                <div class="sir-smile"></div>
              </div>
              <div class="sir-torso-row">
                <div class="sir-arm left-arm"></div>
                <div class="sir-body">
                  <div class="sir-tie"></div>
                </div>
                <div class="sir-arm right-arm"></div>
              </div>
              <div class="sir-legs">
                <div class="sir-leg"></div>
                <div class="sir-leg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="landing-content">
        <div class="domain-label">Welcome to</div>
        <h1 class="domain-title">Sir Jayson's<br>Learning Domain</h1>
        <div class="author-card">
          <p>${esc(AUTHOR_BIO)}</p>
        </div>
        <div class="btn-row" style="justify-content:center;margin-top:10px">
          <button class="btn-glow" id="btnStart">🚀 Start Learning</button>
        </div>
        <p class="hint" style="text-align:center;margin-top:8px">
          Progress is saved automatically on your device.
        </p>
      </div>
    </div>
  `);

  refreshTenorEmbed();

  on("btnStart", "click", () => {
    swalPop({
      title: "Mano po! 👋 Welcome, Math Explorer!",
      html: `
        <p>You are about to enter <strong>Sir Jayson's General Mathematics</strong> interactive module.</p>
        <p style="margin-top:10px;font-size:.9em;opacity:.8">
          Earn XP • Unlock Badges • Master every topic through games & activities!
        </p>`,
      imageUrl: "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
      imageWidth: 200,
      imageHeight: 140,
      imageAlt: "Mathematics animated",
      confirmButtonText: "Let's Go! →",
      allowOutsideClick: false
    }).then(r => {
      if (r.isConfirmed) { appState.screen = "preface"; draw(); }
    });
  });
}

// ─── SCREEN: Preface ──────────────────────────────────────────────────────────
function renderPreface() {
  render(`
    <div class="preface-page">
      <div class="gm-title-wrap">
        <h1 class="gm-title">GENERAL MATHEMATICS</h1>
        <div class="gm-subtitle">First Quarter — Interactive Learning Module</div>
      </div>

      <div class="preface-card">
        <h2>📜 Preface</h2>
        <p>${esc(GM_PREFACE)}</p>
      </div>

      <div class="preface-card">
        <h2>🎯 Core Competencies</h2>
        <ul class="competency-list">
          ${COMPETENCIES.map((c, i) => `<li><span class="comp-num">${i + 1}</span>${esc(c)}</li>`).join("")}
        </ul>
      </div>

      <div class="btn-row" style="justify-content:center;gap:12px;margin-top:4px">
        <button data-go="landing" class="secondary">← Back</button>
        <button id="btnEnterModule" class="btn-glow">Enter Module →</button>
      </div>
    </div>
  `);

  on("btnEnterModule", "click", () => {
    swalPop({
      title: "Module Overview 📚",
      html: `
        <div style="text-align:left">
          <p style="margin-bottom:10px">This module has <strong>3 topics</strong>, each with 4 phases:</p>
          <ol style="padding-left:20px;line-height:1.9">
            <li>🎮 <strong>Motivation Game</strong> — spark curiosity</li>
            <li>📖 <strong>Discussion</strong> — guided interactive lesson</li>
            <li>🧩 <strong>Activity</strong> — practice and explore</li>
            <li>📝 <strong>Assessment</strong> — check your mastery</li>
          </ol>
        </div>`,
      confirmButtonText: "Begin! 🎓",
      allowOutsideClick: false
    }).then(r => {
      if (r.isConfirmed) { appState.screen = "modules"; draw(); }
    });
  });
}

// ─── SCREEN: Modules ──────────────────────────────────────────────────────────
function renderModules() {
  const cards = TOPICS.map(t => {
    const done = topicIsComplete(t.id);
    const phasesComplete = [1, 2, 3, 4].filter(p => phaseIsComplete(t.id, p)).length;
    const dots = [1, 2, 3, 4].map(p =>
      `<span class="phase-dot ${phaseIsComplete(t.id, p) ? "done" : ""}"></span>`
    ).join("");
    return `
      <button class="topic-card ${done ? "complete" : ""}" data-tid="${t.id}"
        style="--tc:${t.color}">
        <div class="tc-icon">${t.icon}</div>
        <div class="tc-meta">
          <strong>${esc(t.title)}</strong>
          <div class="phase-dots">${dots}</div>
          <span class="tc-sub">${phasesComplete}/4 phases complete</span>
        </div>
        <span class="tc-badge ${done ? "done" : ""}">${done ? "Complete ✓" : phasesComplete > 0 ? `Phase ${phasesComplete + 1}` : "Start"}</span>
      </button>
    `;
  }).join("");

  render(`
    ${xpPanel()}
    <div class="modules-page">
      <h2>📚 Topics</h2>
      <p class="subtitle">Each topic follows 4 phases: Motivation → Discussion → Activity → Assessment</p>
      <div class="topic-list" id="topicList">${cards}</div>
      <div class="btn-row spread" style="margin-top:8px">
        <button data-go="preface" class="secondary">← Preface</button>
        <button data-go="analytics" class="secondary">📊 Results & Analytics</button>
      </div>
    </div>
  `);

  byId("topicList").addEventListener("click", e => {
    const card = e.target.closest("[data-tid]");
    if (!card) return;
    const tid = Number(card.dataset.tid);
    appState.topicId = tid;
    const nextPhase = [1, 2, 3, 4].find(p => !phaseIsComplete(tid, p)) || 1;
    appState.topicPhase = nextPhase;
    appState.screen = "topic";
    draw();
  });
}

// ─── SCREEN: Topic (phase router) ────────────────────────────────────────────
function renderTopic() {
  const t = TOPICS.find(t => t.id === appState.topicId);
  const phase = appState.topicPhase;

  if (phase === 1) renderMotivation(t);
  else if (phase === 2) renderDiscussion(t);
  else if (phase === 3) renderActivity(t);
  else renderAssessment(t);
}

function phaseBar(topicId, activePhase, phaseNames) {
  return `
    <div class="phase-bar">
      ${phaseNames.map((name, i) => {
        const n = i + 1;
        const state = n < activePhase ? "done" : n === activePhase ? "active" : "";
        return `<div class="phase-step ${state}"><span>${n}</span>${name}</div>`;
      }).join("")}
    </div>
  `;
}

function topicHeader(t, phase) {
  return `
    ${xpPanel()}
    <div class="topic-header" style="--tc:${t.color}">
      <span class="th-icon">${t.icon}</span>
      <div>
        <h2>${esc(t.title)}</h2>
        ${phaseBar(t.id, phase, t.phases)}
      </div>
    </div>
  `;
}

function nextPhaseBtn(label, nextPhase, topicId, xpAmount, xpReason, swalOpts) {
  return `<button id="btnNextPhase" class="btn-glow">${label}</button>`;
}

function wireNextPhase(topicId, currentPhase, xpAmount, xpReason, swalMsg, swalTitle) {
  on("btnNextPhase", "click", () => {
    markPhase(topicId, currentPhase);
    grantXp(xpAmount, xpReason);
    if (currentPhase < 4) {
      swalPop({
        title: swalTitle || "Phase Complete! 🎉",
        html: swalMsg,
        icon: "success",
        confirmButtonText: "Continue →",
        timer: 3500,
        timerProgressBar: true
      }).then(() => {
        appState.topicPhase = currentPhase + 1;
        draw();
      });
    } else {
      markPhase(topicId, 4);
      checkBadges();
      swalPop({
        title: "Topic Mastered! 🏆",
        html: `<p>You completed all 4 phases of <strong>${TOPICS.find(t => t.id === topicId).title}</strong>!</p>`,
        icon: "success",
        confirmButtonText: "Back to Topics"
      }).then(() => {
        appState.screen = "modules";
        draw();
      });
      if ([1, 2, 3, 4].every(p => phaseIsComplete(topicId, p))) launchConfetti();
    }
  });
}

// ─── PHASE 1: Motivation ──────────────────────────────────────────────────────
function renderMotivation(t) {
  if (t.id === 1) renderMotivation1(t);
  else if (t.id === 2) renderMotivation2(t);
  else renderMotivation3(t);
}

function renderMotivation1(t) {
  const ds = [22, 21, 23, 22, 150];
  const mean = (ds.reduce((s, v) => s + v, 0) / ds.length).toFixed(1);

  render(`
    ${topicHeader(t, 1)}
    <div class="phase-card motivation">
      <h3>🎮 Motivation Game: The Number Trap!</h3>
      <p class="subtitle">Can you spot when a number is trying to trick you?</p>
      <div class="data-box">
        <strong>Temperature Readings (°C):</strong>
        <div class="num-chips">
          ${ds.map((v, i) => `<span class="num-chip ${v === 150 ? "outlier" : ""}">${v}</span>`).join("")}
        </div>
        <p class="hint">One reading looks suspicious… 👀</p>
      </div>
      <p>The <strong>mean</strong> of this data is <span class="highlight-val">${mean}°C</span>. Does that seem right for a temperature?</p>
      <p style="margin-top:6px">Which single number best represents a <em>typical</em> temperature?</p>
      <div class="choices" id="motChoices">
        ${["Mean (${mean}°C)", "Median (22°C)", "Mode (22°C)"].map((o, i) => {
          const opts = [`Mean (${mean}°C)`, "Median (22°C)", "Mode (22°C)"];
          return `<button class="choice-btn mot-btn" data-opt="${opts[i]}">${opts[i]}</button>`;
        }).join("")}
      </div>
      <p id="motFeedback" class="hint"></p>
      <div class="btn-row" style="margin-top:8px">
        <button data-go="modules" class="secondary">← Topics</button>
        <button id="btnNextPhase" class="btn-glow" style="display:none">Next: Discussion →</button>
      </div>
    </div>
  `);

  let answered = false;
  document.querySelectorAll(".mot-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (answered) return;
      answered = true;
      document.querySelectorAll(".mot-btn").forEach(b => b.disabled = true);
      const chosen = btn.dataset.opt;
      const ok = chosen.startsWith("Median") || chosen.startsWith("Mode");
      if (ok) btn.classList.add("correct"); else btn.classList.add("wrong");
      const fb = byId("motFeedback");
      fb.innerHTML = ok
        ? `✅ Correct! The outlier (150°C) skews the mean to ${mean}°C — not realistic. Median or Mode (22°C) is more representative.`
        : `❌ Look again! The outlier 150°C drags the mean up to ${mean}°C. Try Median or Mode instead.`;
      fb.style.color = ok ? "var(--success)" : "var(--danger)";
      swalPop({
        title: ok ? "Nice catch! 🕵️" : "Good try!",
        html: ok
          ? `<p>Outliers distort the <strong>mean</strong>. In statistics, we often use <strong>median</strong> or <strong>mode</strong> when extreme values are present.</p>`
          : `<p>The value <strong>150°C</strong> is an outlier — it pulls the mean way up. Median (22°C) stays stable!</p>`,
        icon: ok ? "success" : "info",
        timer: 3500,
        timerProgressBar: true,
        showConfirmButton: false
      });
      byId("btnNextPhase").style.display = "inline-flex";
    });
  });

  wireNextPhase(t.id, 1, 15, "Motivation complete",
    "<p>Now let's explore the concepts behind central tendency and variability in detail!</p>",
    "Ready for Discussion! 📖");
}

function renderMotivation2(t) {
  render(`
    ${topicHeader(t, 1)}
    <div class="phase-card motivation">
      <h3>🎮 Motivation Game: Fare Guesser Challenge!</h3>
      <p class="subtitle">Before we learn the formula, let's test your instincts!</p>
      <div class="scenario-box">
        <p>🚕 <strong>Taxi Rules:</strong> ₱50 for the first 2 km, then ₱12 per km after that.</p>
        <p style="margin-top:10px">You traveled <strong class="highlight-val">7 km</strong>. What do you think the fare is?</p>
      </div>
      <div class="quiz-inline" style="max-width:320px">
        <label>Your estimate (₱):</label>
        <input type="number" id="fareGuess" placeholder="Enter amount" min="0" />
      </div>
      <div class="btn-row" style="margin-top:10px">
        <button id="btnCheckFare">Check My Answer!</button>
      </div>
      <p id="fareFeedback" class="hint"></p>
      <div class="btn-row" style="margin-top:8px">
        <button data-go="modules" class="secondary">← Topics</button>
        <button id="btnNextPhase" class="btn-glow" style="display:none">Next: Discussion →</button>
      </div>
    </div>
  `);

  on("btnCheckFare", "click", () => {
    const guess = Number(val("fareGuess"));
    const correct = 50 + 12 * (7 - 2); // = 110
    const diff = Math.abs(guess - correct);
    const ok = diff <= 5;
    const fb = byId("fareFeedback");
    fb.innerHTML = `The correct fare is <strong>₱${correct}</strong>. (50 + 12×5 = 50 + 60 = 110)`;
    fb.style.color = ok ? "var(--success)" : "var(--warn)";
    swalPop({
      title: ok ? "Great Instinct! 🎉" : `Close! The answer is ₱${correct}`,
      html: `<p>For 7 km: use ₱50 for first 2 km, then ₱12 × 5 remaining km = <strong>₱110</strong>.</p><p style="margin-top:8px">This is exactly what <strong>piecewise functions</strong> model!</p>`,
      icon: ok ? "success" : "info",
      timer: 4000,
      timerProgressBar: true,
      showConfirmButton: false
    });
    byId("btnNextPhase").style.display = "inline-flex";
  });

  wireNextPhase(t.id, 1, 15, "Motivation complete",
    "<p>Great! Now let's formalize the math behind piecewise functions.</p>",
    "Ready for Discussion! 📖");
}

function renderMotivation3(t) {
  render(`
    ${topicHeader(t, 1)}
    <div class="phase-card motivation">
      <h3>🎮 Motivation Game: Where Does the Ball Land?</h3>
      <p class="subtitle">A ball is thrown straight up. Use your intuition!</p>
      <div class="scenario-box">
        <p>⛹️ The height of a ball is described by:</p>
        <p class="equation-display">h(t) = −5t² + 20t</p>
        <p>where <em>t</em> is time in seconds and <em>h</em> is height in meters.</p>
        <p style="margin-top:10px">What is the <strong>maximum height</strong> the ball reaches?</p>
      </div>
      <div class="choices" id="ballChoices">
        ${["15 m", "20 m", "25 m", "30 m"].map(o =>
          `<button class="choice-btn ball-btn" data-opt="${o}">${o}</button>`
        ).join("")}
      </div>
      <p id="ballFeedback" class="hint"></p>
      <div class="btn-row" style="margin-top:8px">
        <button data-go="modules" class="secondary">← Topics</button>
        <button id="btnNextPhase" class="btn-glow" style="display:none">Next: Discussion →</button>
      </div>
    </div>
  `);

  document.querySelectorAll(".ball-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".ball-btn").forEach(b => b.disabled = true);
      const ok = btn.dataset.opt === "20 m";
      if (ok) btn.classList.add("correct"); else btn.classList.add("wrong");
      const fb = byId("ballFeedback");
      fb.innerHTML = ok
        ? "✅ Correct! At t = 2s, h(2) = −5(4) + 40 = 20 m. That's the vertex!"
        : "❌ The ball peaks at 20 m. We find this using the vertex formula: t = −b/2a = 2s.";
      fb.style.color = ok ? "var(--success)" : "var(--danger)";
      swalPop({
        title: ok ? "You found the Vertex! 🎯" : "The Vertex holds the answer!",
        html: `<p>The <strong>vertex</strong> of h(t) = −5t² + 20t gives the maximum height.</p>
               <p style="margin-top:8px">t = −20/(2×−5) = <strong>2 seconds</strong> → h(2) = <strong>20 m</strong></p>`,
        icon: ok ? "success" : "info",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false
      });
      byId("btnNextPhase").style.display = "inline-flex";
    });
  });

  wireNextPhase(t.id, 1, 15, "Motivation complete",
    "<p>Let's now explore quadratic functions and their graphs in depth!</p>",
    "Ready for Discussion! 📖");
}

// ─── PHASE 2: Discussion ──────────────────────────────────────────────────────
function renderDiscussion(t) {
  if (t.id === 1) renderDiscussion1(t);
  else if (t.id === 2) renderDiscussion2(t);
  else renderDiscussion3(t);
}

function renderDiscussion1(t) {
  render(`
    ${topicHeader(t, 2)}
    <div class="phase-card discussion">
      <h3>📖 Discussion: Measures of Central Tendency & Variability</h3>

      <div class="discuss-section">
        <div class="discuss-label">What is Mean?</div>
        <p>The <strong>mean</strong> (average) is the sum of all values divided by the count.</p>
        <div class="formula-box">μ = (Σx) ÷ n</div>
        <div class="example-box">
          <strong>Example:</strong> Scores: 70, 75, 80, 85, 90<br>
          Mean = (70+75+80+85+90) ÷ 5 = 400 ÷ 5 = <strong>80</strong>
        </div>
      </div>

      <div class="discuss-section">
        <div class="discuss-label" style="background:#ffd166;color:#222">What is Median?</div>
        <p>The <strong>median</strong> is the middle value when data is sorted. It is not affected by outliers.</p>
        <div class="formula-box" style="border-color:#ffd166">Arrange → Find center</div>
        <div class="example-box">
          <strong>Odd:</strong> [65, 70, <u>80</u>, 85, 95] → Median = <strong>80</strong><br>
          <strong>Even:</strong> [65, 70, 80, 85] → Median = (70+80)÷2 = <strong>75</strong>
        </div>
      </div>

      <div class="discuss-section">
        <div class="discuss-label" style="background:#ef6c9f">What is Mode?</div>
        <p>The <strong>mode</strong> is the value that appears most often. Best for categorical data.</p>
        <div class="example-box">
          <strong>Example:</strong> [70, 80, 80, 85, 90] → Mode = <strong>80</strong>
        </div>
      </div>

      <div class="discuss-section">
        <div class="discuss-label" style="background:#00b894;color:#fff">Variability</div>
        <p><strong>Range</strong> = max − min &nbsp;|&nbsp; <strong>Variance</strong> = Σ(x−μ)²÷n &nbsp;|&nbsp; <strong>Std Dev</strong> = √Variance</p>
        <p class="hint">High standard deviation = data is spread out. Low = data is clustered near the mean.</p>
      </div>

      <div class="callout-box">
        <strong>🤔 Think About This:</strong>
        <p>Dataset: [20, 21, 22, 21, 200]. The mean is 56.8. But 4 of the 5 values are around 21. Which measure is more honest?</p>
        <button id="btnThink1" class="secondary" style="margin-top:8px">Reveal Answer 💡</button>
      </div>

      <div class="btn-row" style="margin-top:10px">
        <button data-go="modules" class="secondary">← Topics</button>
        <button id="btnNextPhase" class="btn-glow">Next: Activity →</button>
      </div>
    </div>
  `);

  on("btnThink1", "click", () => {
    swalPop({
      title: "Median or Mode! 🎯",
      html: `<p>The value 200 is an extreme outlier. It pulls the <strong>mean</strong> to 56.8 — far from any real data point.</p>
             <p style="margin-top:8px">The <strong>median</strong> (21) and <strong>mode</strong> (21) both capture the true typical value.</p>`,
      icon: "info",
      confirmButtonText: "Got it! ✔"
    });
  });

  wireNextPhase(t.id, 2, 20, "Discussion complete",
    "<p>Time to practice — you'll compute statistics yourself and play the Data Detective game!</p>",
    "Discussion Done! 🧠");
}

function renderDiscussion2(t) {
  render(`
    ${topicHeader(t, 2)}
    <div class="phase-card discussion">
      <h3>📖 Discussion: Piecewise Functions</h3>

      <div class="discuss-section">
        <div class="discuss-label">What is a Piecewise Function?</div>
        <p>A <strong>piecewise function</strong> uses different rules for different intervals of x.</p>
        <div class="formula-box">
          f(x) = { rule₁ &nbsp;if&nbsp; condition₁<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ rule₂ &nbsp;if&nbsp; condition₂
        </div>
        <p class="hint">Real-world examples: taxi fares, progressive tax, electricity billing, shipping rates.</p>
      </div>

      <div class="discuss-section">
        <div class="discuss-label" style="background:#ffd166;color:#222">How to Evaluate</div>
        <p><strong>Step 1:</strong> Identify which interval your input x falls into.</p>
        <p><strong>Step 2:</strong> Apply the corresponding rule.</p>
        <div class="example-box">
          f(x) = { 50 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if x ≤ 2<br>
                 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ 50 + 12(x−2) if x > 2<br><br>
          Find f(5): &nbsp; 5 > 2 → use 50 + 12(5−2) = 50 + 36 = <strong>₱86</strong>
        </div>
      </div>

      <div class="discuss-section">
        <div class="discuss-label" style="background:#6c5ce7">Graph Interpretation</div>
        <p>Each piece of the function is graphed only in its own interval. The graph may have <strong>open</strong> or <strong>closed dots</strong> at boundaries.</p>
        <p class="hint">Closed dot (•) means the point is included. Open dot (∘) means excluded.</p>
      </div>

      <div class="callout-box">
        <strong>🤔 Try It:</strong>
        <p>f(x) = { 3x if x < 0 &nbsp;|&nbsp; x² if x ≥ 0. What is f(−4)?</p>
        <button id="btnThink2" class="secondary" style="margin-top:8px">Check Answer 💡</button>
      </div>

      <div class="btn-row" style="margin-top:10px">
        <button data-go="modules" class="secondary">← Topics</button>
        <button id="btnNextPhase" class="btn-glow">Next: Activity →</button>
      </div>
    </div>
  `);

  on("btnThink2", "click", () => {
    swalPop({
      title: "f(−4) = −12 ✅",
      html: `<p>Since −4 < 0, we use the first rule: <strong>3x</strong>.</p>
             <p style="margin-top:8px">f(−4) = 3 × (−4) = <strong>−12</strong></p>`,
      icon: "success",
      confirmButtonText: "Got it! ✔"
    });
  });

  wireNextPhase(t.id, 2, 20, "Discussion complete",
    "<p>Now let's interact with live piecewise graphs and test your prediction skills!</p>",
    "Discussion Done! 🧠");
}

function renderDiscussion3(t) {
  render(`
    ${topicHeader(t, 2)}
    <div class="phase-card discussion">
      <h3>📖 Discussion: Quadratic Functions</h3>

      <div class="discuss-section">
        <div class="discuss-label">Standard Form</div>
        <p>A <strong>quadratic function</strong> has the form:</p>
        <div class="formula-box">f(x) = ax² + bx + c &nbsp;(a ≠ 0)</div>
        <p class="hint">When a > 0, the parabola opens <strong>upward</strong>. When a < 0, it opens <strong>downward</strong>.</p>
      </div>

      <div class="discuss-section">
        <div class="discuss-label" style="background:#ffd166;color:#222">The Vertex</div>
        <p>The <strong>vertex</strong> is the turning point of the parabola — either its minimum or maximum.</p>
        <div class="formula-box" style="border-color:#ffd166">
          Vertex x = −b ÷ (2a)<br>
          Vertex y = f(vertex x)
        </div>
        <div class="example-box">
          f(x) = 2x² − 8x + 6<br>
          vx = −(−8) ÷ (2×2) = 8÷4 = <strong>2</strong><br>
          vy = 2(4) − 8(2) + 6 = 8 − 16 + 6 = <strong>−2</strong><br>
          Vertex: <strong>(2, −2)</strong>
        </div>
      </div>

      <div class="discuss-section">
        <div class="discuss-label" style="background:#ef6c9f">Graph Behavior</div>
        <p>The <strong>axis of symmetry</strong> is the vertical line x = vertex x. The parabola is symmetric about it.</p>
        <p class="hint">Intercepts: Set f(x) = 0 and solve. The y-intercept is always (0, c).</p>
      </div>

      <div class="callout-box">
        <strong>🤔 Quick Check:</strong>
        <p>For f(x) = −3x² + 12x − 9, does the parabola open up or down? What is the vertex?</p>
        <button id="btnThink3" class="secondary" style="margin-top:8px">Reveal Answer 💡</button>
      </div>

      <div class="btn-row" style="margin-top:10px">
        <button data-go="modules" class="secondary">← Topics</button>
        <button id="btnNextPhase" class="btn-glow">Next: Activity →</button>
      </div>
    </div>
  `);

  on("btnThink3", "click", () => {
    swalPop({
      title: "Opens Downward, Vertex (2, 3) ✅",
      html: `<p>a = −3 < 0 → opens <strong>downward</strong>.</p>
             <p style="margin-top:8px">vx = −12 ÷ (2×−3) = −12 ÷ −6 = <strong>2</strong></p>
             <p>vy = −3(4) + 12(2) − 9 = −12 + 24 − 9 = <strong>3</strong></p>
             <p>Vertex: <strong>(2, 3)</strong></p>`,
      icon: "success",
      confirmButtonText: "Got it! ✔"
    });
  });

  wireNextPhase(t.id, 2, 20, "Discussion complete",
    "<p>Time to use the dynamic graph engine and find vertices in the activity!</p>",
    "Discussion Done! 🧠");
}

// ─── PHASE 3: Activity ────────────────────────────────────────────────────────
function renderActivity(t) {
  if (t.id === 1) renderActivity1(t);
  else if (t.id === 2) renderActivity2(t);
  else renderActivity3(t);
}

/* ── Topic 1 Activity: Stats calculator + Data Detective ── */
function renderActivity1(t) {
  const c = appState.statsData.computed;
  if (!appState.detective.set) {
    appState.detective.set = DETECTIVE_SETS[0];
    appState.detective.answered = false;
  }

  render(`
    ${topicHeader(t, 3)}
    <div class="phase-card activity">
      <h3>🧩 Activity: Statistics Explorer & Data Detective</h3>

      <div class="card">
        <h4>Stats Calculator</h4>
        <label for="dataInput">Enter numbers (comma or space separated):</label>
        <textarea id="dataInput" rows="2" placeholder="Example: 78, 80, 82, 82, 90">${esc(appState.statsData.raw)}</textarea>
        <div class="btn-row left">
          <button id="btnCompute">Compute</button>
          <button class="secondary" id="btnSample">Use Sample Data</button>
        </div>
        ${c ? statsResultHtml(c) : ""}
      </div>

      <div class="card">
        <h3>🕵️ Data Detective</h3>
        <p class="subtitle">Pick the best measure for each dataset and explain why.</p>
        <button id="btnNewCase" class="secondary">New Case 🔄</button>
        <div id="detectiveArea"></div>
      </div>

      <div class="btn-row" style="margin-top:10px">
        <button data-go="modules" class="secondary">← Topics</button>
        <button id="btnNextPhase" class="btn-glow">Next: Assessment →</button>
      </div>
    </div>
  `);

  on("btnCompute", "click", () => {
    const raw = val("dataInput");
    const vals = parseNums(raw);
    if (!vals.length) { toast("Enter at least one valid number"); return; }
    appState.statsData.raw = raw;
    appState.statsData.computed = computeStats(vals);
    draw();
    setTimeout(drawStatsCharts, 60);
  });

  on("btnSample", "click", () => {
    appState.statsData.raw = "65, 70, 72, 74, 95";
    appState.statsData.computed = computeStats(parseNums(appState.statsData.raw));
    draw();
    setTimeout(drawStatsCharts, 60);
  });

  on("btnNewCase", "click", () => {
    const sets = DETECTIVE_SETS;
    const next = sets[(sets.indexOf(appState.detective.set) + 1) % sets.length];
    appState.detective.set = next;
    appState.detective.answered = false;
    renderDetective();
  });

  renderDetective();
  if (c) setTimeout(drawStatsCharts, 60);

  wireNextPhase(t.id, 3, 25, "Activity complete",
    "<p>Excellent work! Now let's test your mastery with the Assessment.</p>",
    "Activity Complete! 🧩");
}

function statsResultHtml(c) {
  return `
    <div class="stats-result-grid">
      <div><strong>Mean</strong><span>${c.mean.toFixed(2)}</span></div>
      <div><strong>Median</strong><span>${c.median.toFixed(2)}</span></div>
      <div><strong>Mode</strong><span>${c.modes.length ? c.modes.join(", ") : "—"}</span></div>
      <div><strong>Range</strong><span>${c.range.toFixed(2)}</span></div>
      <div><strong>Variance</strong><span>${c.variance.toFixed(2)}</span></div>
      <div><strong>Std Dev</strong><span>${c.sd.toFixed(2)}</span></div>
    </div>
    <div class="callout-box" style="margin-top:8px">
      <strong>Interpretation Tip:</strong>
      <p>${c.sd < 5 ? "Small std dev — data is tightly clustered around the mean." : "Large std dev — data is spread out; check for outliers!"}</p>
    </div>
    <div class="chart-row">
      <canvas id="barCanvas" width="420" height="220" aria-label="Bar chart"></canvas>
      <canvas id="boxCanvas" width="420" height="220" aria-label="Box plot"></canvas>
    </div>
  `;
}

function renderDetective() {
  const host = byId("detectiveArea");
  if (!host) return;
  const { set, answered } = appState.detective;
  if (!set) return;

  host.innerHTML = `
    <div class="detective-box">
      <p><strong>Case:</strong> ${esc(set.name)}</p>
      <p><strong>Data:</strong> ${set.values.join(", ")}</p>
      <p>${esc(set.prompt)}</p>
      <div class="btn-row left" id="detChoices">
        ${set.opts.map(o => `<button class="choice-btn det-btn" data-o="${esc(o)}">${esc(o)}</button>`).join("")}
      </div>
      <p id="detFeedback" class="hint"></p>
    </div>
  `;

  document.querySelectorAll(".det-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      if (answered) return;
      appState.detective.answered = true;
      document.querySelectorAll(".det-btn").forEach(b => { b.disabled = true; });
      const chosen = btn.dataset.o;
      const ok = chosen === set.a;
      recordComp("selection", ok);
      if (ok) { btn.classList.add("correct"); grantXp(10, "Data Detective correct"); }
      else {
        btn.classList.add("wrong");
        document.querySelectorAll(".det-btn").forEach(b => { if (b.dataset.o === set.a) b.classList.add("correct"); });
      }
      const fb = byId("detFeedback");
      fb.textContent = (ok ? "✅ " : "❌ ") + set.why;
      fb.style.color = ok ? "var(--success)" : "var(--danger)";
    });
  });
}

/* ── Topic 2 Activity: Piecewise graph + Guess the Output ── */
function renderActivity2(t) {
  const s = SCENARIOS[appState.piecewise.scenario];
  const x = Number(appState.piecewise.x);

  render(`
    ${topicHeader(t, 3)}
    <div class="phase-card activity">
      <h3>🧩 Activity: Piecewise Graph & Guess the Output</h3>

      <div class="card">
        <h4>Build the Function — Live Graph</h4>
        <div class="btn-row left" id="scenBtns">
          ${Object.entries(SCENARIOS).map(([k, sc]) =>
            `<button class="secondary ${appState.piecewise.scenario === k ? "active" : ""}" data-sc="${k}">${sc.title}</button>`
          ).join("")}
        </div>
        <p><strong>Rule:</strong> ${esc(s.rule)}</p>
        <p class="formula-box">${esc(s.formula)}</p>
        <div class="range-group">
          <label>Input ${s.label}: <strong id="xLabel">${x}</strong></label>
          <input type="range" id="pieceRange" min="0" max="${s.maxX}" value="${x}" step="1" />
          <p class="hint">Output: <strong>₱${s.fn(x).toFixed(2)}</strong></p>
        </div>
        <canvas id="pieceCanvas" width="460" height="240" aria-label="Piecewise graph"></canvas>
      </div>

      <div class="card">
        <h4>Guess the Output 🎯</h4>
        <div class="quiz-inline">
          <label>Input (${s.label})</label>
          <input type="number" id="guessX" value="${Number(appState.piecewise.guessX) || ""}" />
          <label>Predicted output (₱)</label>
          <input type="number" id="guessY" value="${esc(appState.piecewise.guessY)}" />
        </div>
        <div class="btn-row left" style="margin-top:8px">
          <button id="btnCheckGuess">Check My Prediction</button>
        </div>
        <p id="guessFeedback" class="hint"></p>
      </div>

      <div class="btn-row" style="margin-top:10px">
        <button data-go="modules" class="secondary">← Topics</button>
        <button id="btnNextPhase" class="btn-glow">Next: Assessment →</button>
      </div>
    </div>
  `);

  document.querySelectorAll("#scenBtns [data-sc]").forEach(b => {
    b.addEventListener("click", () => { appState.piecewise.scenario = b.dataset.sc; draw(); });
  });

  on("pieceRange", "input", e => {
    appState.piecewise.x = Number(e.target.value);
    draw();
  });

  on("btnCheckGuess", "click", () => {
    const gx = Number(val("guessX"));
    const gy = Number(val("guessY"));
    appState.piecewise.guessX = gx;
    appState.piecewise.guessY = val("guessY");
    const expected = SCENARIOS[appState.piecewise.scenario].fn(gx);
    const ok = Math.abs(expected - gy) < 0.01;
    const fb = byId("guessFeedback");
    fb.innerHTML = ok
      ? `✅ Correct! f(${gx}) = ₱${expected.toFixed(2)}`
      : `❌ Expected f(${gx}) = ₱${expected.toFixed(2)}. Check which interval ${gx} falls in.`;
    fb.style.color = ok ? "var(--success)" : "var(--danger)";
    recordComp("problemSolving", ok);
    if (ok) grantXp(12, "Piecewise prediction correct");
    swalPop({
      title: ok ? "Correct! 🎉" : "Not quite…",
      html: `<p>f(${gx}) = <strong>₱${expected.toFixed(2)}</strong></p>
             <p style="margin-top:8px">${SCENARIOS[appState.piecewise.scenario].rule}</p>`,
      icon: ok ? "success" : "error",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false
    });
  });

  setTimeout(drawPieceGraph, 60);

  wireNextPhase(t.id, 3, 25, "Activity complete",
    "<p>Now test your piecewise skills in the Assessment!</p>",
    "Activity Complete! 🧩");
}

/* ── Topic 3 Activity: Dynamic graph + Vertex game ── */
function renderActivity3(t) {
  const q = appState.quadratic;
  const vg = q.vGame;

  render(`
    ${topicHeader(t, 3)}
    <div class="phase-card activity">
      <h3>🧩 Activity: Dynamic Quadratic Graph & Vertex Finder</h3>

      <div class="card">
        <h4>GeoGebra-style Graph Engine</h4>
        <div class="slider-group">
          <label>a: <strong>${q.a.toFixed(1)}</strong></label>
          <input type="range" id="sA" min="-5" max="5" step="0.5" value="${q.a}" />
          <label>b: <strong>${q.b.toFixed(1)}</strong></label>
          <input type="range" id="sB" min="-10" max="10" step="0.5" value="${q.b}" />
          <label>c: <strong>${q.c.toFixed(1)}</strong></label>
          <input type="range" id="sC" min="-15" max="15" step="0.5" value="${q.c}" />
        </div>
        <p class="formula-box">f(x) = ${q.a.toFixed(1)}x² ${fmtSigned(q.b)}x ${fmtSigned(q.c)}</p>
        <canvas id="quadCanvas" width="460" height="280" aria-label="Quadratic graph"></canvas>
      </div>

      <div class="card">
        <h4>🎮 Find the Vertex Game</h4>
        <p class="subtitle">Points: <strong>${vg.pts}</strong></p>
        <button id="btnNewVertex">New Round</button>
        <div id="vertexArea"></div>
      </div>

      <div class="btn-row" style="margin-top:10px">
        <button data-go="modules" class="secondary">← Topics</button>
        <button id="btnNextPhase" class="btn-glow">Next: Assessment →</button>
      </div>
    </div>
  `);

  on("sA", "input", e => { q.a = Number(e.target.value); draw(); });
  on("sB", "input", e => { q.b = Number(e.target.value); draw(); });
  on("sC", "input", e => { q.c = Number(e.target.value); draw(); });

  on("btnNewVertex", "click", startVertexRound);

  setTimeout(drawQuadGraph, 60);
  renderVertexArea();

  wireNextPhase(t.id, 3, 25, "Activity complete",
    "<p>You're ready for the final Assessment!</p>",
    "Activity Complete! 🧩");
}

function startVertexRound() {
  const a = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
  const vx = Math.floor(Math.random() * 9) - 4;
  const vy = Math.floor(Math.random() * 11) - 5;
  appState.quadratic.vGame.target = { a, b: -2 * a * vx, c: vy + a * vx * vx, vx, vy };
  appState.quadratic.vGame.guessX = "";
  appState.quadratic.vGame.guessY = "";
  renderVertexArea();
}

function renderVertexArea() {
  const host = byId("vertexArea");
  if (!host) return;
  const g = appState.quadratic.vGame;

  if (!g.target) {
    host.innerHTML = `<p class="hint">Click "New Round" to start.</p>`;
    return;
  }
  const { a, b, c, vx, vy } = g.target;

  host.innerHTML = `
    <div class="detective-box" style="margin-top:8px">
      <p>Find the vertex of:</p>
      <p class="equation-display">f(x) = ${a}x² ${fmtSigned(b)}x ${fmtSigned(c)}</p>
      <div class="quiz-inline">
        <label>Vertex x</label>
        <input type="number" id="vGuessX" value="${esc(g.guessX)}" />
        <label>Vertex y</label>
        <input type="number" id="vGuessY" value="${esc(g.guessY)}" />
      </div>
      <div class="btn-row left" style="margin-top:8px">
        <button id="btnSubmitVertex">Submit</button>
      </div>
      <p id="vertexFb" class="hint">Tip: vx = −b/(2a)</p>
    </div>
  `;

  on("btnSubmitVertex", "click", () => {
    const gx = Number(val("vGuessX"));
    const gy = Number(val("vGuessY"));
    g.guessX = val("vGuessX");
    g.guessY = val("vGuessY");

    const exact = Math.abs(gx - vx) < 0.05 && Math.abs(gy - vy) < 0.05;
    const close = Math.abs(gx - vx) <= 0.6 && Math.abs(gy - vy) <= 0.6;

    const fb = byId("vertexFb");
    if (exact) {
      g.pts += 10;
      recordComp("problemSolving", true);
      grantXp(18, "Exact vertex found");
      fb.textContent = `✅ Perfect! Vertex (${vx}, ${vy}). +10 pts`;
      fb.style.color = "var(--success)";
      swalPop({ title: "Bullseye! 🎯", html: `<p>Exact vertex: <strong>(${vx}, ${vy})</strong>. You earned 10 points!</p>`, icon: "success", timer: 2500, showConfirmButton: false, timerProgressBar: true });
    } else if (close) {
      g.pts += 4;
      recordComp("problemSolving", true);
      grantXp(8, "Close vertex estimate");
      fb.textContent = `🟡 Close! Exact vertex is (${vx}, ${vy}). +4 pts`;
      fb.style.color = "var(--warn)";
    } else {
      recordComp("problemSolving", false);
      fb.textContent = `❌ Exact vertex is (${vx}, ${vy}). Use vx = −b/(2a).`;
      fb.style.color = "var(--danger)";
    }
  });
}

// ─── PHASE 4: Assessment / Quiz ───────────────────────────────────────────────
function renderAssessment(t) {
  const items = shuffle([...QUIZ[t.id]]);
  appState.quizState = { items, index: 0, score: 0, topicId: t.id };
  renderQuizItem(t);
}

function renderQuizItem(t) {
  const qs = appState.quizState;
  if (qs.index >= qs.items.length) return renderQuizResult(t, qs);

  const item = qs.items[qs.index];
  const num = qs.index + 1;
  const total = qs.items.length;
  const pct = Math.round((qs.index / total) * 100);

  render(`
    ${topicHeader(t, 4)}
    <div class="phase-card assessment">
      <div class="quiz-progress">
        <span>Question ${num} of ${total}</span>
        <div class="progress-wrap"><div class="progress-fill" style="width:${pct}%"></div></div>
      </div>
      <h3>${esc(item.q)}</h3>
      <div class="choices" id="qChoices">
        ${item.opts.map(o => `<button class="choice-btn q-btn" data-o="${esc(o)}">${esc(o)}</button>`).join("")}
      </div>
      <p id="qFeedback" class="hint"></p>
      <div class="btn-row" style="margin-top:8px">
        <button data-go="modules" class="secondary">Exit</button>
      </div>
    </div>
  `);

  document.querySelectorAll(".q-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".q-btn").forEach(b => b.disabled = true);
      const chosen = btn.dataset.o;
      const ok = chosen === item.a;
      recordComp(item.competency, ok);
      if (ok) { btn.classList.add("correct"); qs.score += 1; }
      else {
        btn.classList.add("wrong");
        document.querySelectorAll(".q-btn").forEach(b => { if (b.dataset.o === item.a) b.classList.add("correct"); });
      }
      const fb = byId("qFeedback");
      fb.textContent = (ok ? "✅ " : "❌ ") + item.why;
      fb.style.color = ok ? "var(--success)" : "var(--danger)";

      swalPop({
        title: ok ? "Correct! 🎉" : "Incorrect",
        html: `<p>${esc(item.why)}</p>`,
        icon: ok ? "success" : "error",
        timer: 2200,
        timerProgressBar: true,
        showConfirmButton: false
      }).then(() => {
        qs.index += 1;
        renderQuizItem(t);
      });
    });
  });
}

function renderQuizResult(t, qs) {
  const pct = Math.round((qs.score / qs.items.length) * 100);
  const stars = pct === 100 ? "⭐⭐⭐" : pct >= 70 ? "⭐⭐" : "⭐";
  const msg = pct === 100 ? "Perfect Score! Incredible!" : pct >= 70 ? "Well done! Great performance." : "Keep practicing — you're getting there!";

  markPhase(t.id, 4);
  grantXp(30, "Assessment completed");
  checkBadges();
  if (pct >= 70) launchConfetti();

  render(`
    ${topicHeader(t, 4)}
    <div class="phase-card assessment" style="text-align:center">
      <h3>Assessment Complete! 🏁</h3>
      <div class="big-score">${qs.score}/${qs.items.length}</div>
      <div class="stars-row">${stars}</div>
      <p class="subtitle">${msg}</p>
      <div class="btn-row" style="justify-content:center;margin-top:12px">
        <button id="btnRetryQuiz" class="secondary">Retry</button>
        <button data-go="modules">Back to Topics</button>
        <button data-go="analytics" class="secondary">See Analytics</button>
      </div>
    </div>
  `);

  on("btnRetryQuiz", "click", () => renderAssessment(t));

  swalPop({
    title: pct >= 70 ? `${stars} Assessment Complete!` : "Keep it up!",
    html: `<p>Score: <strong>${qs.score}/${qs.items.length} (${pct}%)</strong></p>
           <p style="margin-top:8px">${msg}</p>`,
    icon: pct >= 70 ? "success" : "info",
    confirmButtonText: "Continue",
    timer: pct === 100 ? 3500 : undefined
  });
}

// ─── SCREEN: Analytics ────────────────────────────────────────────────────────
function renderAnalytics() {
  const i = compPct("interpretation");
  const s = compPct("selection");
  const p = compPct("problemSolving");
  const overall = overallCompletionPct();

  render(`
    ${xpPanel()}
    <div class="analytics-page">
      <h2>📊 Results & Analytics</h2>
      <p class="subtitle">Competency-based tracking — stored locally for thesis documentation.</p>

      <div class="stats-result-grid wider">
        <div><strong>Interpretation</strong><span>${i}%</span></div>
        <div><strong>Selection</strong><span>${s}%</span></div>
        <div><strong>Problem-solving</strong><span>${p}%</span></div>
        <div><strong>Overall Completion</strong><span>${overall}%</span></div>
      </div>

      <canvas id="analyticsCanvas" width="480" height="260" aria-label="Competency bar chart"></canvas>

      <div class="callout-box">
        <strong>🤖 Auto Feedback</strong>
        <p>${autoFeedback(i, s, p)}</p>
      </div>

      <div class="card">
        <h3>🏅 Badges Earned</h3>
        <div class="badge-row">
          ${db.badges.length
            ? db.badges.map(b => `<span class="badge-chip">${esc(b)}</span>`).join("")
            : `<span class="hint">No badges yet — complete topic phases to earn them.</span>`}
        </div>
      </div>

      <div class="btn-row" style="margin-top:8px">
        <button data-go="modules" class="secondary">← Back to Topics</button>
        <button id="btnReset" class="secondary">Reset All Progress</button>
      </div>
    </div>
  `);

  setTimeout(() => drawAnalyticsChart(i, s, p), 60);

  on("btnReset", "click", () => {
    swalPop({
      title: "Reset Progress?",
      text: "This will erase all XP, badges, and quiz history.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reset",
      cancelButtonText: "Cancel"
    }).then(r => {
      if (r.isConfirmed) {
        db = structuredClone(DEFAULT_DB);
        saveDb();
        toast("Progress reset.");
        draw();
      }
    });
  });
}

function autoFeedback(i, s, p) {
  const notes = [];
  notes.push(i >= 70 ? "You are interpreting statistical data well." : "Practice interpreting mean, median, mode, and variability more.");
  notes.push(s >= 70 ? "You can select appropriate measures for most data scenarios." : "Work on selecting the right measure — especially when outliers are present.");
  notes.push(p >= 70 ? "Your problem-solving with piecewise and quadratic tasks is strong." : "Continue practicing real-life piecewise and vertex problems.");
  return notes.join(" ");
}

// ─── Charts ───────────────────────────────────────────────────────────────────
function parseNums(raw) {
  return raw.split(/[,\s]+/).map(v => Number(v.trim())).filter(v => Number.isFinite(v));
}

function computeStats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((s, v) => s + v, 0) / n;
  const median = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const freq = {};
  let maxF = 0;
  for (const v of sorted) { freq[v] = (freq[v] || 0) + 1; if (freq[v] > maxF) maxF = freq[v]; }
  const modes = Object.entries(freq).filter(([, f]) => f === maxF && f > 1).map(([v]) => Number(v));
  const range = sorted[n - 1] - sorted[0];
  const variance = sorted.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const sd = Math.sqrt(variance);
  const q1 = quant(sorted, 0.25);
  const q3 = quant(sorted, 0.75);
  return { sorted, mean, median, modes, range, variance, sd, min: sorted[0], max: sorted[n - 1], q1, q3 };
}

function quant(s, p) {
  const pos = (s.length - 1) * p;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (pos - lo);
}

function drawStatsCharts() {
  const c = appState.statsData.computed;
  if (!c) return;
  const bar = byId("barCanvas");
  const box = byId("boxCanvas");
  if (bar) drawBarChart(bar, c);
  if (box) drawBoxPlot(box, c);
}

function drawBarChart(canvas, c) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const pad = 30;
  const w = canvas.width - pad * 2;
  const h = canvas.height - pad * 2;
  const vals = c.sorted;
  const max = Math.max(...vals) * 1.1;

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, pad + h);
  ctx.lineTo(pad + w, pad + h);
  ctx.stroke();

  const bw = w / vals.length - 6;
  vals.forEach((v, i) => {
    const bh = (v / max) * h;
    const x = pad + i * (bw + 6) + 3;
    const y = pad + h - bh;
    const gr = ctx.createLinearGradient(x, y, x, y + bh);
    gr.addColorStop(0, "#26d0ce");
    gr.addColorStop(1, "#1a75c4");
    ctx.fillStyle = gr;
    ctx.fillRect(x, y, bw, bh);
    ctx.fillStyle = "#e8f4ff";
    ctx.font = "11px Trebuchet MS";
    ctx.fillText(String(v), x + 2, y - 3);
  });

  ctx.fillStyle = "#c8e8ff";
  ctx.font = "bold 12px Trebuchet MS";
  ctx.fillText("Bar Chart", 10, 16);
}

function drawBoxPlot(canvas, c) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const pad = 36;
  const midY = canvas.height / 2 + 18;
  const toX = v => pad + ((v - c.min) / ((c.max - c.min) || 1)) * (canvas.width - pad * 2);

  ctx.fillStyle = "#c8e8ff";
  ctx.font = "bold 12px Trebuchet MS";
  ctx.fillText("Box Plot", 10, 16);

  ctx.strokeStyle = "#e8f4ff";
  ctx.lineWidth = 1.5;
  const xMin = toX(c.min), xQ1 = toX(c.q1), xMed = toX(c.median), xQ3 = toX(c.q3), xMax = toX(c.max);

  ctx.beginPath();
  ctx.moveTo(xMin, midY); ctx.lineTo(xQ1, midY);
  ctx.moveTo(xQ3, midY); ctx.lineTo(xMax, midY);
  ctx.stroke();

  ctx.fillStyle = "rgba(38,208,206,0.3)";
  ctx.strokeStyle = "#26d0ce";
  ctx.lineWidth = 2;
  ctx.fillRect(xQ1, midY - 28, xQ3 - xQ1, 56);
  ctx.strokeRect(xQ1, midY - 28, xQ3 - xQ1, 56);

  ctx.strokeStyle = "#ffd166";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(xMed, midY - 28); ctx.lineTo(xMed, midY + 28);
  ctx.stroke();

  ctx.strokeStyle = "#e8f4ff";
  ctx.lineWidth = 1.5;
  [xMin, xMax].forEach(x => {
    ctx.beginPath();
    ctx.moveTo(x, midY - 16); ctx.lineTo(x, midY + 16);
    ctx.stroke();
  });

  ctx.fillStyle = "#d0e8ff";
  ctx.font = "10px Trebuchet MS";
  [["min", c.min, xMin], ["Q1", c.q1, xQ1], ["Md", c.median, xMed], ["Q3", c.q3, xQ3], ["max", c.max, xMax]]
    .forEach(([lbl, v, x]) => ctx.fillText(`${lbl}:${Number(v).toFixed(1)}`, x - 18, midY + 46));
}

function drawPieceGraph() {
  const canvas = byId("pieceCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const s = SCENARIOS[appState.piecewise.scenario];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pad = 36;
  const w = canvas.width - pad * 2;
  const h = canvas.height - pad * 2;
  const maxX = s.maxX;
  const ys = Array.from({ length: maxX + 1 }, (_, x) => s.fn(x));
  const maxY = Math.max(...ys) * 1.1;

  const toX = x => pad + (x / maxX) * w;
  const toY = y => pad + h - (y / maxY) * h;

  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  [0, maxX / 4, maxX / 2, (maxX * 3) / 4, maxX].forEach(gx => {
    ctx.beginPath(); ctx.moveTo(toX(gx), pad); ctx.lineTo(toX(gx), pad + h); ctx.stroke();
  });

  ctx.fillStyle = "rgba(255,209,102,0.1)";
  const bk = s.fn === SCENARIOS.taxi.fn ? 2 : s.fn === SCENARIOS.electricity.fn ? 100 : 10;
  ctx.fillRect(toX(0), pad, toX(bk) - toX(0), h);

  ctx.strokeStyle = "#26d0ce";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = 0; x <= maxX; x += 0.1) {
    const px = toX(x), py = toY(s.fn(x));
    x === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();

  const mx = Number(appState.piecewise.x);
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(toX(mx), toY(s.fn(mx)), 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f0faff";
  ctx.font = "11px Trebuchet MS";
  ctx.fillText(`x=${mx}`, toX(mx) + 6, toY(s.fn(mx)) - 6);
  ctx.fillText(s.title, 10, 16);
}

function drawQuadGraph() {
  const canvas = byId("quadCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { a, b, c } = appState.quadratic;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const pad = 28;
  const w = canvas.width - pad * 2;
  const h = canvas.height - pad * 2;
  const minX = -10, maxX = 10, minY = -20, maxY = 20;
  const toX = x => pad + ((x - minX) / (maxX - minX)) * w;
  const toY = y => pad + h - ((y - minY) / (maxY - minY)) * h;

  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1;
  for (let gx = -10; gx <= 10; gx += 2) { ctx.beginPath(); ctx.moveTo(toX(gx), toY(minY)); ctx.lineTo(toX(gx), toY(maxY)); ctx.stroke(); }
  for (let gy = -20; gy <= 20; gy += 4) { ctx.beginPath(); ctx.moveTo(toX(minX), toY(gy)); ctx.lineTo(toX(maxX), toY(gy)); ctx.stroke(); }

  ctx.strokeStyle = "rgba(240,250,255,0.6)";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(toX(minX), toY(0)); ctx.lineTo(toX(maxX), toY(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(toX(0), toY(minY)); ctx.lineTo(toX(0), toY(maxY)); ctx.stroke();

  ctx.strokeStyle = "#7af0d7";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let x = minX; x <= maxX; x += 0.05) {
    const y = a * x * x + b * x + c;
    const px = toX(x), py = toY(y);
    x === minX ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();

  if (Math.abs(a) > 1e-9) {
    const vx = -b / (2 * a);
    const vy = a * vx * vx + b * vx + c;
    if (vx >= minX && vx <= maxX && vy >= minY && vy <= maxY) {
      ctx.fillStyle = "#ffd166";
      ctx.beginPath();
      ctx.arc(toX(vx), toY(vy), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f0faff";
      ctx.font = "11px Trebuchet MS";
      ctx.fillText(`V(${vx.toFixed(1)},${vy.toFixed(1)})`, toX(vx) + 7, toY(vy) - 6);
    }
  }
}

function drawAnalyticsChart(i, s, p) {
  const canvas = byId("analyticsCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const labels = ["Interpretation", "Selection", "Problem-solving"];
  const vals = [i, s, p];
  const pad = 40;
  const w = canvas.width - pad * 2;
  const h = canvas.height - pad * 2;
  const bw = 90;

  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.beginPath(); ctx.moveTo(pad, pad); ctx.lineTo(pad, pad + h); ctx.lineTo(pad + w, pad + h); ctx.stroke();

  [0, 25, 50, 75, 100].forEach(pct => {
    const y = pad + h - (pct / 100) * h;
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(pad + w, y); ctx.stroke();
    ctx.fillStyle = "#a0b8cc";
    ctx.font = "10px Trebuchet MS";
    ctx.fillText(pct + "%", 4, y + 4);
  });

  vals.forEach((v, idx) => {
    const x = pad + 30 + idx * 130;
    const bh = (v / 100) * h;
    const y = pad + h - bh;
    const gr = ctx.createLinearGradient(x, y, x, y + bh);
    gr.addColorStop(0, "#ffd166");
    gr.addColorStop(1, "#26d0ce");
    ctx.fillStyle = gr;
    ctx.fillRect(x, y, bw, bh);
    ctx.fillStyle = "#f0faff";
    ctx.font = "bold 12px Trebuchet MS";
    ctx.fillText(`${v}%`, x + 28, y - 6);
    ctx.font = "11px Trebuchet MS";
    ctx.fillText(labels[idx], x + 2, pad + h + 18);
  });
}

// ─── Gamification ─────────────────────────────────────────────────────────────
function launchConfetti() {
  const canvas = byId("confettiCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const bits = Array.from({ length: 110 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * 80,
    r: 3 + Math.random() * 5,
    v: 1.5 + Math.random() * 2.5,
    drift: -1 + Math.random() * 2,
    hue: Math.floor(Math.random() * 360)
  }));
  let frame = 0;
  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bits.forEach(b => { b.y += b.v; b.x += b.drift; ctx.fillStyle = `hsl(${b.hue},95%,65%)`; ctx.fillRect(b.x, b.y, b.r, b.r); });
    if (++frame < 160) requestAnimationFrame(step);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  step();
}

function toast(message) {
  const old = byId("toast");
  if (old) old.remove();
  const el = document.createElement("div");
  el.id = "toast";
  el.className = "toast";
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add("show"), 10);
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 220); }, 2000);
}

// ─── Theme ────────────────────────────────────────────────────────────────────
function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("sirjayson_theme", next);
  const btn = byId("themeToggle");
  if (btn) btn.textContent = next === "light" ? "☀" : "☾";
}
function loadTheme() {
  const t = localStorage.getItem("sirjayson_theme") || "dark";
  document.documentElement.setAttribute("data-theme", t);
  const btn = byId("themeToggle");
  if (btn) btn.textContent = t === "light" ? "☀" : "☾";
}

// ─── Utils ────────────────────────────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; }
  return arr;
}
function fmtSigned(v) { return v >= 0 ? `+ ${v}` : `− ${Math.abs(v)}`; }

// ─── Init ─────────────────────────────────────────────────────────────────────
initVoiceEngine();
loadTheme();
on("themeToggle", "click", toggleTheme);
draw();
