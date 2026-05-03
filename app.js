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
      formula: "Sorted data → find the middle value (not affected by outliers)",
      steps: [
        "Sort: 65, 70, 72, 74, 95",
        "Mean = (65+70+72+74+95) ÷ 5 = 376 ÷ 5 = 75.2 — inflated by outlier 95",
        "Median = 3rd value (middle) = 72 — not affected by outlier",
        "Outlier 95 inflates the mean; Median is the more honest measure"
      ],
      why: "The outlier (95) inflates the mean. Median is more robust.",
      competency: "interpretation"
    },
    {
      q: "Dataset: 8, 8, 9, 10, 10, 10, 11. You want the most common value.",
      opts: ["Mean", "Median", "Mode"],
      a: "Mode",
      formula: "Mode = the value with the highest frequency",
      steps: [
        "Count frequencies: 8 appears 2 times, 9 appears 1 time, 10 appears 3 times, 11 appears 1 time",
        "10 has the highest frequency (3 times)",
        "Mode = 10"
      ],
      why: "Mode captures the most frequent observation, which is 10.",
      competency: "selection"
    },
    {
      q: "What does a LARGE standard deviation indicate?",
      opts: ["Data is close together", "Data is spread out", "No outliers exist"],
      a: "Data is spread out",
      formula: "σ = √[Σ(x − μ)² ÷ n]",
      steps: [
        "Standard deviation (σ) measures how far values stray from the mean",
        "Large σ → values are far from the mean → data is SPREAD OUT",
        "Small σ → values cluster near the mean → data is TIGHT",
        "Example: σ=1 means tight cluster; σ=50 means wide spread"
      ],
      why: "Standard deviation measures spread — larger value means more variation.",
      competency: "interpretation"
    },
    {
      q: "Temps: 22, 21, 23, 22, 150. Which measure is MOST affected by the outlier?",
      opts: ["Mean", "Median", "Mode"],
      a: "Mean",
      formula: "μ = (Σx) ÷ n",
      steps: [
        "Mean = (22+21+23+22+150) ÷ 5 = 238 ÷ 5 = 47.6 — skewed by 150",
        "Median: sorted [21,22,22,23,150] → 3rd value = 22 (stable)",
        "Mode = 22 (most frequent, also stable)",
        "Only the Mean changes dramatically due to the outlier 150"
      ],
      why: "Mean adds all values, so extreme outliers shift it significantly.",
      competency: "selection"
    },
    {
      q: "Grades: 88, 92, 85, 90, 95. What is the mean?",
      opts: ["88", "90", "92", "95"],
      a: "90",
      formula: "μ = (Σx) ÷ n",
      steps: [
        "Sum all values: 88 + 92 + 85 + 90 + 95 = 450",
        "Count of values: n = 5",
        "Mean = 450 ÷ 5 = 90"
      ],
      why: "μ = (88+92+85+90+95)÷5 = 450÷5 = 90.",
      competency: "interpretation"
    },
    {
      q: "Dataset: 14, 17, 11, 13, 15, 17, 18. What is the median?",
      opts: ["13", "15", "17", "14"],
      a: "15",
      formula: "Sort data → middle position = (n+1) ÷ 2",
      steps: [
        "Sort ascending: 11, 13, 14, 15, 17, 17, 18",
        "n = 7 (odd) → middle position = (7+1)÷2 = 4th value",
        "4th value = 15",
        "Median = 15"
      ],
      why: "Sorted: [11,13,14,15,17,17,18] → 4th value = 15.",
      competency: "interpretation"
    },
    {
      q: "Test scores: 70, 72, 74. What is the variance?",
      opts: ["2.67", "4", "1.63", "8"],
      a: "2.67",
      formula: "Variance (σ²) = Σ(x − μ)² ÷ n",
      steps: [
        "Mean μ = (70+72+74) ÷ 3 = 216 ÷ 3 = 72",
        "Squared deviations: (70−72)²=4, (72−72)²=0, (74−72)²=4",
        "Sum of squared deviations = 4 + 0 + 4 = 8",
        "Variance = 8 ÷ 3 ≈ 2.67"
      ],
      why: "μ=72; Σ(x−μ)²=4+0+4=8; Variance=8÷3≈2.67.",
      competency: "problemSolving"
    },
    {
      q: "Most students scored 85 but one scored 15. Which measure is LEAST appropriate?",
      opts: ["Median", "Mode", "Mean"],
      a: "Mean",
      formula: "Choose the measure resistant to extreme values",
      steps: [
        "The score of 15 is a severe outlier far from the rest",
        "Mean: (85×n + 15) ÷ (n+1) — the mean is dragged far below 85 by the single 15",
        "Median and Mode remain near 85 — capturing the true performance",
        "Mean is least appropriate when strong outliers distort the center"
      ],
      why: "The outlier (15) heavily distorts the mean, making it unrepresentative.",
      competency: "selection"
    }
  ],
  2: [
    {
      q: "f(x)= {50 if x≤2; 50+12(x-2) if x>2}. Find f(5).",
      opts: ["74", "80", "86", "96"],
      a: "86",
      formula: "Identify interval → apply matching rule → substitute",
      steps: [
        "x = 5; check conditions: 5 ≤ 2? No. 5 > 2? Yes ✓",
        "Use rule: 50 + 12(x − 2)",
        "Substitute: 50 + 12(5 − 2) = 50 + 12(3)",
        "= 50 + 36 = 86"
      ],
      why: "x=5>2, so: 50+12(5−2)=50+36=86.",
      competency: "problemSolving"
    },
    {
      q: "f(x)= {2x if x<0; x² if x≥0}. Find f(-3).",
      opts: ["-6", "9", "6", "-9"],
      a: "-6",
      formula: "Check which condition x satisfies, then apply that rule",
      steps: [
        "x = −3; check: −3 < 0? Yes ✓ → use rule: 2x",
        "f(−3) = 2(−3)",
        "= −6"
      ],
      why: "x=−3<0, use 2x: 2(−3)=−6.",
      competency: "problemSolving"
    },
    {
      q: "Electricity: f(x)={300 if x≤100; 300+9(x-100) if x>100}. Find f(120).",
      opts: ["318", "480", "420", "300"],
      a: "480",
      formula: "300 + 9(x − 100) when x > 100",
      steps: [
        "x = 120; check: 120 > 100? Yes ✓ → use: 300 + 9(x − 100)",
        "= 300 + 9(120 − 100)",
        "= 300 + 9(20)",
        "= 300 + 180 = 480"
      ],
      why: "x=120>100: 300+9(120−100)=300+180=480.",
      competency: "problemSolving"
    },
    {
      q: "Which real-life situation is BEST modeled by a piecewise function?",
      opts: ["Constant salary", "Progressive tax brackets", "Flat-rate shipping"],
      a: "Progressive tax brackets",
      formula: "Piecewise = different rules for different x-intervals",
      steps: [
        "Constant salary → one flat rule for all hours (not piecewise)",
        "Flat-rate shipping → same cost regardless of weight (not piecewise)",
        "Progressive tax → different rates apply to different income ranges",
        "Each tax bracket uses a different formula → classic piecewise model!"
      ],
      why: "Tax rates change at different income intervals — classic piecewise.",
      competency: "selection"
    },
    {
      q: "f(x)= {x+3 if x<2; 2x-1 if x≥2}. Find f(2).",
      opts: ["3", "5", "4", "1"],
      a: "3",
      formula: "Check boundary: x=2 satisfies which condition?",
      steps: [
        "x = 2; check conditions:",
        "x < 2? No. x ≥ 2? Yes ✓",
        "Use rule: 2x − 1",
        "f(2) = 2(2) − 1 = 4 − 1 = 3"
      ],
      why: "x=2 satisfies x≥2, so: 2(2)−1=3.",
      competency: "problemSolving"
    },
    {
      q: "Mobile data: f(x)={0 if x≤1; 20(x-1) if x>1} GB. A user used 3.5 GB. Charge?",
      opts: ["₱50", "₱70", "₱40", "₱60"],
      a: "₱50",
      formula: "20(x − 1) when x > 1 GB",
      steps: [
        "x = 3.5 GB; check: 3.5 > 1? Yes ✓ → use: 20(x − 1)",
        "= 20(3.5 − 1)",
        "= 20(2.5)",
        "= 50 → charge is ₱50"
      ],
      why: "3.5>1: 20(3.5−1)=20(2.5)=₱50.",
      competency: "problemSolving"
    },
    {
      q: "f(x)= {3 if x<-1; x²+1 if -1≤x≤2; 5 if x>2}. Find f(0).",
      opts: ["3", "5", "1", "0"],
      a: "1",
      formula: "x=0 falls in the interval −1 ≤ x ≤ 2",
      steps: [
        "x = 0; check intervals:",
        "0 < −1? No.  −1 ≤ 0 ≤ 2? Yes ✓ → use: x² + 1",
        "f(0) = (0)² + 1 = 0 + 1 = 1"
      ],
      why: "x=0 is in [−1,2]: x²+1=0+1=1.",
      competency: "problemSolving"
    },
    {
      q: "In a piecewise graph, an OPEN circle (∘) at a boundary means the point is:",
      opts: ["Included in the function", "Excluded from the function", "The function stops there"],
      a: "Excluded from the function",
      formula: "Open circle ∘ → strict inequality (< or >); Closed dot • → (≤ or ≥)",
      steps: [
        "Closed dot (•) = endpoint IS included → used with ≤ or ≥",
        "Open circle (∘) = endpoint is NOT included → used with < or >",
        "Example: rule 'f(x)=2x for x<3' uses an open circle at x=3",
        "The next rule (if any) may start with a closed dot at x=3"
      ],
      why: "Open circle means the boundary point is excluded (strict inequality).",
      competency: "interpretation"
    }
  ],
  3: [
    {
      q: "f(x) = 2x² - 8x + 6. What is the x-coordinate of the vertex?",
      opts: ["2", "-2", "4", "-4"],
      a: "2",
      formula: "x_vertex = −b ÷ (2a)",
      steps: [
        "Identify coefficients: a = 2, b = −8, c = 6",
        "x_v = −b ÷ (2a) = −(−8) ÷ (2 × 2)",
        "= 8 ÷ 4",
        "= 2"
      ],
      why: "vx = −(−8)÷(2×2) = 8÷4 = 2.",
      competency: "problemSolving"
    },
    {
      q: "f(x) = -3x² + 12x - 5. Does the parabola open upward or downward?",
      opts: ["Upward", "Downward", "Neither"],
      a: "Downward",
      formula: "a > 0 → opens UP (∪);   a < 0 → opens DOWN (∩)",
      steps: [
        "Identify leading coefficient: a = −3",
        "Check sign: a = −3 < 0",
        "Negative a → parabola opens DOWNWARD ∩",
        "Vertex is the MAXIMUM point of this parabola"
      ],
      why: "a = −3 < 0, so the parabola opens downward.",
      competency: "interpretation"
    },
    {
      q: "For f(x) = x² - 4x + 4, what is the vertex?",
      opts: ["(2, 0)", "(0, 4)", "(-2, 0)", "(4, 0)"],
      a: "(2, 0)",
      formula: "x_v = −b ÷ (2a);   y_v = f(x_v)",
      steps: [
        "Identify: a=1, b=−4, c=4",
        "x_v = −(−4) ÷ (2×1) = 4 ÷ 2 = 2",
        "y_v = f(2) = (2)² − 4(2) + 4 = 4 − 8 + 4 = 0",
        "Vertex = (2, 0)"
      ],
      why: "vx=4÷2=2; vy=4−8+4=0. Vertex: (2, 0).",
      competency: "problemSolving"
    },
    {
      q: "Ball height: h(t) = -5t² + 20t. What is the maximum height?",
      opts: ["15 m", "20 m", "25 m", "10 m"],
      a: "20 m",
      formula: "t_max = −b ÷ (2a);   h_max = h(t_max)",
      steps: [
        "a = −5, b = 20",
        "t_max = −20 ÷ (2 × −5) = −20 ÷ −10 = 2 seconds",
        "h_max = h(2) = −5(2²) + 20(2) = −5(4) + 40",
        "= −20 + 40 = 20 m"
      ],
      why: "t=2s; h(2)=−5(4)+40=20 m.",
      competency: "problemSolving"
    },
    {
      q: "What is the y-intercept of f(x) = 3x² - 5x + 7?",
      opts: ["3", "5", "7", "-5"],
      a: "7",
      formula: "y-intercept: set x = 0 → f(0) = c",
      steps: [
        "Substitute x = 0 into f(x)",
        "f(0) = 3(0)² − 5(0) + 7",
        "= 0 − 0 + 7 = 7",
        "The y-intercept is always equal to c (the constant term)"
      ],
      why: "f(0)=3(0)²−5(0)+7=7. y-intercept is always c.",
      competency: "interpretation"
    },
    {
      q: "The axis of symmetry of f(x) = x² - 6x + 5 is:",
      opts: ["x = 3", "x = -3", "x = 6", "x = 5"],
      a: "x = 3",
      formula: "Axis of symmetry: x = −b ÷ (2a)",
      steps: [
        "Identify: a = 1, b = −6, c = 5",
        "x = −(−6) ÷ (2 × 1)",
        "= 6 ÷ 2 = 3",
        "Axis of symmetry: x = 3"
      ],
      why: "Axis: x = −(−6)÷(2×1) = 3.",
      competency: "interpretation"
    },
    {
      q: "f(x) = -2x² + 8x - 5. The vertex is a ___ point.",
      opts: ["minimum", "maximum", "zero"],
      a: "maximum",
      formula: "a < 0 → opens DOWN ∩ → vertex is a MAXIMUM",
      steps: [
        "Identify leading coefficient: a = −2",
        "a = −2 < 0 → parabola opens downward ∩",
        "A downward-opening parabola has its peak at the TOP",
        "Therefore the vertex is a MAXIMUM point"
      ],
      why: "a = −2 < 0 → opens down → vertex is a maximum.",
      competency: "interpretation"
    },
    {
      q: "A ball: h(t) = −4.9t² + 14.7t. After how many seconds does it reach max height?",
      opts: ["1 s", "1.5 s", "2 s", "3 s"],
      a: "1.5 s",
      formula: "t_max = −b ÷ (2a)",
      steps: [
        "Identify: a = −4.9, b = 14.7",
        "t_max = −14.7 ÷ (2 × −4.9)",
        "= −14.7 ÷ (−9.8)",
        "= 1.5 seconds"
      ],
      why: "t = −14.7÷(2×−4.9) = −14.7÷−9.8 = 1.5 s.",
      competency: "problemSolving"
    }
  ]
};

// ─── State ────────────────────────────────────────────────────────────────────
const appState = {
  screen: "auth",
  topicId: 1,
  topicPhase: 1,
  quizState: null,
  statsData: { raw: "", computed: null },
  piecewise: { scenario: "taxi", x: 5, guessX: 0, guessY: "" },
  quadratic: { a: 1, b: 0, c: 0, vGame: { round: 0, target: null, pts: 0, guessX: "", guessY: "" } },
  detective: { set: null, answered: false },
  discussSlide: {}
};

const authState = {
  loading: true,
  token: "",
  user: null,
  children: [],
  childId: null,
  mode: "login"
};

const voiceState = {
  rate: 0.95,
  pitch: 1,
  volume: 1
};

const voiceRuntime = {
  voicesReady: false,
  queue: [],
  isQuirky: false,
  unlocked: false,
  pending: null
};

const coachRuntime = {
  key: "",
  step: 0,
  corner: "right",
  dismissed: false,
  lastTypedToken: "",
  lastSpokenToken: "",
  typingTimer: null,
  autoTimer: null,
  autoKey: ""
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

// ─── Local storage + backend session ─────────────────────────────────────────
const STORAGE_KEY = "sirjayson_gm_v1";
const SESSION_KEY = "sirjayson_session_v1";
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

function normalizeDb(p) {
  return {
    ...structuredClone(DEFAULT_DB),
    ...(p || {}),
    competency: { ...DEFAULT_DB.competency, ...((p && p.competency) || {}) },
    phaseComplete: (p && p.phaseComplete) || {},
    badges: Array.isArray(p && p.badges) ? p.badges : []
  };
}

function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DB);
    return normalizeDb(JSON.parse(raw));
  } catch (_) {
    return structuredClone(DEFAULT_DB);
  }
}

function saveSession() {
  const payload = {
    token: authState.token,
    user: authState.user,
    childId: authState.childId
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;
    const p = JSON.parse(raw);
    authState.token = p.token || "";
    authState.user = p.user || null;
    authState.childId = Number.isFinite(Number(p.childId)) ? Number(p.childId) : null;
  } catch (_) {
    authState.token = "";
    authState.user = null;
    authState.childId = null;
  }
}

function clearSession() {
  authState.token = "";
  authState.user = null;
  authState.children = [];
  authState.childId = null;
  localStorage.removeItem(SESSION_KEY);
}

function apiUrl(path) {
  // Map Node-style route strings to PHP file paths
  const m = path.match(/^\/api\/children\/(\d+)\/(\w+)$/);
  if (m) return `/api/${m[2]}.php?child_id=${m[1]}`;
  if (path === "/api/children")  return "/api/children.php";
  if (path === "/api/register")  return "/api/register.php";
  if (path === "/api/login")     return "/api/login.php";
  if (path === "/api/me")        return "/api/me.php";
  return path;
}

async function api(path, opts = {}) {
  const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
  if (authState.token) headers.Authorization = `Bearer ${authState.token}`;
  const res = await fetch(apiUrl(path), { ...opts, headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Request failed");
  return body;
}

async function syncProgressToServer() {
  if (!authState.token || !authState.childId) return;
  try {
    await api(`/api/children/${authState.childId}/progress`, {
      method: "PUT",
      body: JSON.stringify({ snapshot: db })
    });
  } catch (_) {
    // Keep local progress even if sync fails.
  }
}

async function refreshChildren() {
  if (!authState.token) return;
  authState.children = await api("/api/children");
}

async function loadChildProgress(childId) {
  const payload = await api(`/api/children/${childId}/progress`);
  if (payload && payload.snapshot) {
    db = normalizeDb(payload.snapshot);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return;
  }
  db = structuredClone(DEFAULT_DB);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

async function recordAssessmentResult(topic, score, total, pct) {
  if (!authState.token || !authState.childId) return;
  await api(`/api/children/${authState.childId}/results`, {
    method: "POST",
    body: JSON.stringify({
      topicId: topic.id,
      topicTitle: topic.title,
      score,
      total,
      pct,
      competency: db.competency,
      xp: db.xp,
      level: db.level
    })
  });
}

let db = loadDb();
function saveDb() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  void syncProgressToServer();
}

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
  wireAccountButtons();
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

function flushPendingSpeech() {
  if (!voiceRuntime.pending) return;
  const { text, mode } = voiceRuntime.pending;
  voiceRuntime.pending = null;
  speakText(text, mode || "normal");
}

function bootstrapVoiceAutoplay() {
  const unlock = () => {
    voiceRuntime.unlocked = true;
    flushPendingSpeech();
  };
  ["pointerdown", "touchstart", "keydown", "click"].forEach(evt => {
    window.addEventListener(evt, unlock, { once: true, passive: true });
  });
}

function requestAutoSpeech(text, mode = "normal") {
  if (!("speechSynthesis" in window)) return;
  const msg = (text || "").trim();
  if (!msg) return;
  if (voiceRuntime.unlocked) {
    speakText(msg, mode);
    return;
  }
  voiceRuntime.pending = { text: msg, mode };
  // Best effort attempt before unlock; some browsers will allow this.
  speakText(msg, mode);
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

function setTeacherSpeaking(active) {
  document.querySelectorAll(".teacher-css-anim").forEach(el => {
    el.classList.toggle("is-speaking", !!active);
  });
  const overlay = byId("teacherCoachOverlay");
  if (overlay) overlay.classList.toggle("is-speaking", !!active);
}

function speakQueueNext() {
  if (!("speechSynthesis" in window)) return;
  if (!voiceRuntime.queue.length) {
    setTeacherSpeaking(false);
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
    setTeacherSpeaking(true);
    const lead = voiceRuntime.isQuirky ? "Sir Jayson (quirky): " : "Sir Jayson: ";
    setVoiceSubtitle(lead + part);
  };
  utter.onend = () => {
    if (voiceRuntime.queue.length) speakQueueNext();
    else {
      setTeacherSpeaking(false);
      clearVoiceSubtitle();
    }
  };
  utter.onerror = () => {
    if (voiceRuntime.queue.length) speakQueueNext();
    else {
      setTeacherSpeaking(false);
      clearVoiceSubtitle();
    }
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
  setTeacherSpeaking(false);
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
  setTeacherSpeaking(false);
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
  if (s === "auth") return renderAuth();
  if (s === "landing") return renderLanding();
  if (s === "preface") return renderPreface();
  if (s === "modules") return renderModules();
  if (s === "topic") return renderTopic();
  if (s === "analytics") return renderAnalytics();
  renderAuth();
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
      "Welcome, Math Explorer. I am here to guide you step by step as you learn.",
      "Take your time, enjoy the activities, and trust your progress one lesson at a time.",
      "When you are ready, press Start Learning and begin your General Mathematics adventure with confidence."
    ];
  }

  if (screen === "preface") {
    return [
      "This preface is your map. It shows what you will learn and why each topic matters.",
      "You are not expected to be perfect right away. Learn, practice, and improve with every phase.",
      "Keep a growth mindset, enjoy the games, and let mathematics become a skill you can use in real life."
    ];
  }

  if (screen === "modules") {
    return [
      "Choose one topic first. We will move step by step so learning stays clear and manageable.",
      "Each topic has 4 parts: Motivation, Discussion, Activity, and Assessment.",
      "Stay curious, do your best in each phase, and celebrate every improvement you make."
    ];
  }

  return [
    moduleTeacherLine(topicId, phase),
    "Watch the clues inside the game and examples. They are important parts of our lesson discussion.",
    "Keep going. You are doing great. Apply this tip now, and build your confidence one step at a time."
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
  if (appState.screen === "preface") {
    return {
      topicId: 1,
      phase: 1,
      label: "Preface guide"
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

function clearCoachAuto() {
  if (coachRuntime.autoTimer) {
    clearTimeout(coachRuntime.autoTimer);
    coachRuntime.autoTimer = null;
  }
  coachRuntime.autoKey = "";
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

  if (coachRuntime.lastSpokenToken !== token) {
    requestAutoSpeech(current, "normal");
    coachRuntime.lastSpokenToken = token;
  }

  if (appState.screen !== "landing") clearCoachAuto();

  on("btnCoachNext", "click", () => {
    if (coachRuntime.step >= lines.length - 1) return;
    fadeCoachBubble(() => {
      coachRuntime.step += 1;
      coachRuntime.corner = coachRuntime.corner === "right" ? "left" : "right";
      applyCoachCornerClass();
      const nxt = lines[coachRuntime.step] || "";
      const nextToken = `${coachRuntime.key}_${coachRuntime.step}`;
      setCoachLine(nxt, nextToken);
      requestAutoSpeech(nxt, "normal");
      coachRuntime.lastSpokenToken = nextToken;
      updateCoachButtons(lines);
    });
  });

  on("btnCoachOk", "click", () => {
    fadeCoachBubble(() => {
      coachRuntime.dismissed = true;
      const overlay = byId("teacherCoachOverlay");
      if (overlay) overlay.remove();
      document.body.classList.remove("has-coach");
      clearCoachAuto();
      clearCoachTyping();
    });
  });

  if (appState.screen === "landing") {
    const nextBtn = byId("btnCoachNext");
    const okBtn = byId("btnCoachOk");
    if (nextBtn) nextBtn.style.display = "none";
    if (okBtn) okBtn.textContent = coachRuntime.step >= lines.length - 1 ? "OK" : "Skip Intro";

    const autoKey = `${coachRuntime.key}_${coachRuntime.step}`;
    if (coachRuntime.autoKey !== autoKey) {
      coachRuntime.autoKey = autoKey;
      const waitMs = Math.max(2200, Math.round(current.length * 78));
      clearCoachAuto();
      coachRuntime.autoKey = autoKey;
      coachRuntime.autoTimer = setTimeout(() => {
        if (appState.screen !== "landing" || coachRuntime.dismissed) return;
        if (coachRuntime.step < lines.length - 1) {
          fadeCoachBubble(() => {
            coachRuntime.step += 1;
            coachRuntime.corner = coachRuntime.corner === "right" ? "left" : "right";
            applyCoachCornerClass();
            wireTeacherCoach(ctx);
          });
        } else {
          updateCoachButtons(lines);
          const ok = byId("btnCoachOk");
          if (ok) ok.textContent = "OK";
        }
      }, waitMs);
    }
  }
}

function syncTeacherCoach() {
  const ctx = getCoachContext();
  const old = byId("teacherCoachOverlay");
  if (!ctx) {
    if (old) old.remove();
    document.body.classList.remove("has-coach");
    clearCoachAuto();
    return;
  }

  const key = coachContextKey(ctx);
  if (coachRuntime.key !== key) {
    coachRuntime.key = key;
    coachRuntime.step = 0;
    coachRuntime.corner = "right";
    coachRuntime.dismissed = false;
    coachRuntime.lastTypedToken = "";
    coachRuntime.lastSpokenToken = "";
  }

  if (coachRuntime.dismissed) {
    if (old) old.remove();
    document.body.classList.remove("has-coach");
    clearCoachAuto();
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
  const child = authState.children.find(c => c.id === authState.childId);
  const childLabel = child ? `${child.childName}${child.gradeLevel ? ` (Grade ${child.gradeLevel})` : ""}` : "No child selected";
  return `
    <div class="xp-panel">
      <span class="xp-chip">⚡ ${db.xp} XP</span>
      <span class="xp-chip">Level ${db.level}</span>
      <span class="xp-chip">🏅 ${db.badges.length}</span>
      <span class="xp-chip">👧 ${esc(childLabel)}</span>
      <button id="btnSwitchChild" class="secondary" type="button">Switch Child</button>
      <button id="btnLogout" class="secondary" type="button">Logout</button>
      <div class="xp-bar-outer"><div class="xp-bar-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

function wireAccountButtons() {
  on("btnSwitchChild", "click", () => {
    appState.screen = "auth";
    draw();
  });
  on("btnLogout", "click", () => {
    clearSession();
    db = structuredClone(DEFAULT_DB);
    saveDb();
    appState.screen = "auth";
    draw();
  });
}

// ─── SCREEN: Auth ─────────────────────────────────────────────────────────────
function renderAuth() {
  if (authState.loading) {
    render(`
      <div class="preface-page">
        <div class="preface-card"><h2>Loading...</h2><p class="subtitle">Checking user session and child records.</p></div>
      </div>
    `);
    return;
  }

  const cOptions = authState.children.map(c => {
    const active = c.id === authState.childId ? "selected" : "";
    const grade = c.gradeLevel ? `• Grade ${esc(c.gradeLevel)}` : "";
    return `<button class="topic-card ${active}" data-child="${c.id}"><div class="tc-icon">👧</div><div class="tc-meta"><strong>${esc(c.childName)}</strong><span class="tc-sub">${grade}</span></div><span class="tc-badge ${active ? "done" : ""}">${active ? "Active" : "Select"}</span></button>`;
  }).join("");

  const showLogin = authState.mode === "login";
  const title = showLogin ? "Teacher/Parent Login" : "Create User Account";

  render(`
    <div class="preface-page">
      <div class="gm-title-wrap">
        <h1 class="gm-title">Student Records Setup</h1>
        <div class="gm-subtitle">Database-backed progress by user and child profile</div>
      </div>
      <div class="preface-card">
        <h2>🔐 ${title}</h2>
        <div class="btn-row" style="margin-bottom:8px">
          <button id="btnModeLogin" class="${showLogin ? "" : "secondary"}">Login</button>
          <button id="btnModeRegister" class="${showLogin ? "secondary" : ""}">Register</button>
        </div>
        <div class="stats-result-grid wider" style="grid-template-columns:1fr">
          ${showLogin ? `
            <label>Email<input id="authEmail" class="input" type="email" placeholder="teacher@email.com"></label>
            <label>Password<input id="authPassword" class="input" type="password" placeholder="Enter password"></label>
            <button id="btnLoginUser" class="btn-glow">Login</button>
          ` : `
            <label>Full Name<input id="regName" class="input" type="text" placeholder="Teacher name"></label>
            <label>Email<input id="regEmail" class="input" type="email" placeholder="teacher@email.com"></label>
            <label>Password<input id="regPassword" class="input" type="password" placeholder="Minimum 6 characters"></label>
            <button id="btnRegisterUser" class="btn-glow">Create Account</button>
          `}
        </div>
      </div>

      ${authState.user ? `
        <div class="preface-card">
          <h2>👨‍🏫 Logged in as ${esc(authState.user.fullName)}</h2>
          <p class="subtitle">Add children and select one profile so quiz statistics are recorded per child.</p>
          <div class="btn-row" style="margin-bottom:8px">
            <input id="childName" class="input" type="text" placeholder="Child name">
            <input id="childGrade" class="input" type="text" placeholder="Grade level">
            <button id="btnAddChild" class="secondary">Add Child</button>
          </div>
          <div class="topic-list">${cOptions || `<p class="hint">No child profile yet. Add one to continue.</p>`}</div>
          <div class="btn-row" style="justify-content:center;margin-top:10px">
            <button id="btnContinueLearning" class="btn-glow" ${authState.childId ? "" : "disabled"}>Continue to Learning</button>
          </div>
        </div>
      ` : ""}
    </div>
  `);

  on("btnModeLogin", "click", () => { authState.mode = "login"; draw(); });
  on("btnModeRegister", "click", () => { authState.mode = "register"; draw(); });

  on("btnRegisterUser", "click", async () => {
    try {
      const fullName = val("regName").trim();
      const email = val("regEmail").trim();
      const password = val("regPassword");
      const out = await api("/api/register", {
        method: "POST",
        body: JSON.stringify({ fullName, email, password })
      });
      authState.token = out.token;
      authState.user = out.user;
      saveSession();
      await refreshChildren();
      toast("Account created.");
      draw();
    } catch (err) {
      swalPop({ title: "Cannot register", text: err.message, icon: "error" });
    }
  });

  on("btnLoginUser", "click", async () => {
    try {
      const email = val("authEmail").trim();
      const password = val("authPassword");
      const out = await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      authState.token = out.token;
      authState.user = out.user;
      saveSession();
      await refreshChildren();
      toast("Login successful.");
      draw();
    } catch (err) {
      swalPop({ title: "Login failed", text: err.message, icon: "error" });
    }
  });

  on("btnAddChild", "click", async () => {
    try {
      const childName = val("childName").trim();
      const gradeLevel = val("childGrade").trim();
      if (!childName) return toast("Enter child name first.");
      const child = await api("/api/children", {
        method: "POST",
        body: JSON.stringify({ childName, gradeLevel })
      });
      authState.childId = child.id;
      saveSession();
      await refreshChildren();
      await loadChildProgress(child.id);
      toast("Child profile added.");
      draw();
    } catch (err) {
      swalPop({ title: "Cannot add child", text: err.message, icon: "error" });
    }
  });

  document.querySelectorAll("[data-child]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const childId = Number(btn.dataset.child);
      authState.childId = childId;
      saveSession();
      await loadChildProgress(childId);
      toast("Child selected.");
      draw();
    });
  });

  on("btnContinueLearning", "click", () => {
    if (!authState.childId) return;
    appState.screen = "landing";
    draw();
  });
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
          <div id="teacherCss" class="teacher-css-anim landing-teacher">
            <div class="chalkboard-anim landing-board">
              <div class="board-doodles" aria-hidden="true">
                <span class="bd d1"></span>
                <span class="bd d2"></span>
                <span class="bd d3"></span>
                <span class="bd d4"></span>
              </div>
            </div>
            <div class="sir-figure landing-sir">
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
          Progress is saved automatically to your selected child profile.
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

      <div class="preface-card preface-fun">
        <h2>🎮 Today's Mission</h2>
        <div class="mission-chips">
          <span class="mission-chip">🧠 Think Critically</span>
          <span class="mission-chip">🎯 Solve with Strategy</span>
          <span class="mission-chip">📈 Explain Your Reasoning</span>
          <span class="mission-chip">🏅 Earn XP & Badges</span>
        </div>
        <p class="subtitle">Every correct answer is progress. Every mistake is feedback. Keep going!</p>
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
// ─── Slide helpers ────────────────────────────────────────────────────────────
function slideCardHtml(slide) {
  const bodyHtml = slide.body ? `<div class="slide-body">${slide.body}</div>` : "";
  const formulaHtml = slide.formula
    ? `<div class="slide-formula-block">${slide.formula}</div>` : "";
  const exHtml = slide.example ? buildExampleHtml(slide.example) : "";
  const kpHtml = slide.keyPoints
    ? `<ul class="slide-key-points">${slide.keyPoints.map(p => `<li>${p}</li>`).join("")}</ul>` : "";
  const tblHtml = slide.table ? buildSlideTableHtml(slide.table) : "";
  const practHtml = slide.practice
    ? `<div class="slide-practice-wrap"><button id="btnSlidePractice" class="secondary">${slide.practice.btn}</button></div>` : "";
  return `
    <div class="slide-card">
      <div class="slide-badge-row"><span class="slide-badge">${slide.label}</span></div>
      <div class="slide-icon-title">
        <span class="slide-big-icon">${slide.icon}</span>
        <h3 class="slide-title">${slide.title}</h3>
      </div>
      ${bodyHtml}${formulaHtml}${exHtml}${kpHtml}${tblHtml}${practHtml}
    </div>`;
}

function buildExampleHtml(ex) {
  const dataH  = ex.data  ? `<p class="slide-example-data">${ex.data}</p>` : "";
  const stepsH = ex.steps ? `<div class="slide-example-steps">${ex.steps.map((s, i) =>
    `<div class="slide-step"><span class="step-num">${i + 1}</span><span>${s}</span></div>`).join("")}</div>` : "";
  const ansH   = ex.answer ? `<div class="slide-answer">✅ ${ex.answer}</div>` : "";
  return `<div class="slide-example"><div class="slide-example-label">📝 Worked Example</div>${dataH}${stepsH}${ansH}</div>`;
}

function buildSlideTableHtml(rows) {
  const [hdr, ...body] = rows;
  return `<div class="slide-table-wrap"><table class="slide-table">
    <thead><tr>${hdr.map(h => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${body.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
  </table></div>`;
}

function renderSlideDiscussion(t, topicTitle, slides) {
  if (!appState.discussSlide) appState.discussSlide = {};
  const idx   = appState.discussSlide[t.id] || 0;
  const total = slides.length;
  const slide = slides[Math.min(idx, total - 1)];

  render(`
    ${topicHeader(t, 2)}
    <div class="phase-card discussion">
      <div class="slide-show-header">
        <h3>📽️ ${topicTitle}</h3>
        <div class="slide-progress-row">
          <span class="slide-counter">Slide ${idx + 1} / ${total}</span>
          <div class="slide-dots-row">
            ${slides.map((_, i) => `<span class="slide-dot${i === idx ? " active" : ""}"></span>`).join("")}
          </div>
        </div>
      </div>
      <div id="slideStage" class="slide-stage">${slideCardHtml(slide)}</div>
      <div class="slide-nav-row">
        <button id="btnSlidePrev" class="secondary"${idx === 0 ? " disabled" : ""}>◀ Prev Slide</button>
        <span style="flex:1"></span>
        <button id="btnSlideNext" class="${idx >= total - 1 ? "hidden-btn" : ""}">Next Slide ▶</button>
        <button id="btnNextPhase" class="btn-glow${idx < total - 1 ? " hidden-btn" : ""}">Next: Activity →</button>
      </div>
      <div class="btn-row" style="margin-top:6px">
        <button data-go="modules" class="secondary">← Topics</button>
      </div>
    </div>
  `);

  function updateSlide(newIdx) {
    appState.discussSlide[t.id] = newIdx;
    const ns = slides[newIdx];
    const stageEl = byId("slideStage");
    if (stageEl) stageEl.innerHTML = slideCardHtml(ns);
    const prevBtn = byId("btnSlidePrev");
    const nextBtn = byId("btnSlideNext");
    const finBtn  = byId("btnNextPhase");
    const counter = document.querySelector(".slide-counter");
    if (prevBtn) prevBtn.disabled = newIdx === 0;
    if (nextBtn) nextBtn.className = newIdx >= total - 1 ? "hidden-btn" : "";
    if (finBtn)  finBtn.className  = newIdx < total - 1 ? "btn-glow hidden-btn" : "btn-glow";
    if (counter) counter.textContent = `Slide ${newIdx + 1} / ${total}`;
    document.querySelectorAll(".slide-dot").forEach((d, i) => d.classList.toggle("active", i === newIdx));
    wirePracticeBtn(ns);
    const spk = ns.title + ". " + (ns.body ? ns.body.replace(/<[^>]+>/g, " ") : "") + " " +
                (ns.formula ? ns.formula.replace(/\n/g, ". ") : "");
    requestAutoSpeech(spk.replace(/\s+/g, " ").trim(), "normal");
    stageEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function wirePracticeBtn(sl) {
    on("btnSlidePractice", "click", () => {
      swalPop({ title: sl.practice.title, html: sl.practice.html, icon: "info", confirmButtonText: "Got it! ✔" });
    });
  }

  on("btnSlidePrev", "click", () => updateSlide(Math.max(0, (appState.discussSlide[t.id] || 0) - 1)));
  on("btnSlideNext", "click", () => updateSlide(Math.min(total - 1, (appState.discussSlide[t.id] || 0) + 1)));
  wirePracticeBtn(slide);
  wireNextPhase(t.id, 2, 20, "Discussion complete",
    "<p>Time for the hands-on activity! Apply what you have learned.</p>",
    "Discussion Done! 🧠");
}

// ─── PHASE 2: Discussion ──────────────────────────────────────────────────────
function renderDiscussion(t) {
  if (!appState.discussSlide) appState.discussSlide = {};
  appState.discussSlide[t.id] = 0;
  if (t.id === 1) renderDiscussion1(t);
  else if (t.id === 2) renderDiscussion2(t);
  else renderDiscussion3(t);
}

function renderDiscussion1(t) {
  const slides = [
    {
      icon: "📊", label: "Statistics · Slide 1 of 6",
      title: "Central Tendency &amp; Variability",
      body: "Statistics helps us make sense of large amounts of data by summarizing them with a few <strong>meaningful numbers</strong>. In this lesson, you will master the three measures of center and the measures of spread.",
      keyPoints: [
        "<strong>Mean</strong> — the arithmetic average of all values",
        "<strong>Median</strong> — the middle value when data is sorted",
        "<strong>Mode</strong> — the most frequently occurring value",
        "<strong>Variability</strong> — how spread out the data is (Range, Variance, Std Dev)"
      ]
    },
    {
      icon: "μ", label: "Statistics · Slide 2 of 6",
      title: "The Mean — Arithmetic Average",
      body: "The <strong>mean</strong> (μ) adds all values and divides by the count. It uses every data point, making it powerful — but sensitive to outliers.",
      formula: "μ = (x₁ + x₂ + ··· + xₙ) ÷ n   =   (Σx) ÷ n",
      example: {
        data: "Find the mean of: 70, 75, 80, 85, 90",
        steps: [
          "Add all values: 70 + 75 + 80 + 85 + 90 = 400",
          "Count of values: n = 5",
          "Mean = 400 ÷ 5 = <strong>80</strong>"
        ],
        answer: "Mean = 80"
      },
      keyPoints: [
        "Works best when data has <strong>no extreme outliers</strong>",
        "Can be distorted by very large or very small values — called outliers"
      ]
    },
    {
      icon: "📍", label: "Statistics · Slide 3 of 6",
      title: "The Median — Middle Value",
      body: "The <strong>median</strong> is the middle value of a <em>sorted</em> dataset. It is <strong>not affected by outliers</strong>, making it ideal for skewed data.",
      formula: "Sort the data → Middle position = (n+1) ÷ 2\nFor even n: average the two middle values",
      example: {
        data: "Find the median of: 65, 70, 72, 74, 150",
        steps: [
          "Sort (already sorted): 65, 70, 72, 74, 150",
          "n = 5 (odd) → middle position = (5+1)÷2 = 3rd value",
          "3rd value = <strong>72</strong>"
        ],
        answer: "Median = 72 (not pulled by outlier 150!)"
      },
      practice: {
        btn: "Why not Mean here? 🤔",
        title: "Mean vs Median with Outlier",
        html: "<p>Mean = (65+70+72+74+150)÷5 = 431÷5 = <strong>86.2</strong></p><p>But 4 of 5 values are below 80! The outlier 150 inflates the mean.</p><p>Median = <strong>72</strong> — a much more honest picture of the typical value.</p>"
      }
    },
    {
      icon: "🔢", label: "Statistics · Slide 4 of 6",
      title: "The Mode — Most Frequent Value",
      body: "The <strong>mode</strong> is the value that appears most often. A dataset can have <em>no mode</em>, <em>one mode</em>, or <em>multiple modes</em> (bimodal). It is the only measure that works for <strong>categorical data</strong>.",
      formula: "Mode = the value(s) with the highest frequency",
      example: {
        data: "Find the mode of: 70, 80, 80, 85, 90, 90, 90",
        steps: [
          "Count frequencies: 70→1, 80→2, 85→1, 90→3",
          "90 appears 3 times — highest frequency",
          "Mode = <strong>90</strong>"
        ],
        answer: "Mode = 90"
      },
      keyPoints: [
        "Best for <strong>categorical data</strong> (favorite subject, shirt size, grade level)",
        "<strong>Bimodal</strong> example: [2, 2, 5, 5, 7] → two modes: 2 and 5",
        "If all values appear once, there is <strong>no mode</strong>"
      ]
    },
    {
      icon: "📏", label: "Statistics · Slide 5 of 6",
      title: "Measuring Spread: Variability",
      body: "Variability tells us <em>how spread out</em> the data is. Two datasets can have the same mean but very different spreads! We measure this with Range, Variance, and Standard Deviation.",
      formula: "Range    = Max − Min\nVariance (σ²) = Σ(x − μ)² ÷ n\nStd Dev  (σ)  = √Variance",
      example: {
        data: "Dataset: 70, 72, 74   →   Mean (μ) = 72",
        steps: [
          "Range = 74 − 70 = <strong>4</strong>",
          "Squared deviations: (70−72)²=4, (72−72)²=0, (74−72)²=4",
          "Variance = (4+0+4) ÷ 3 = 8÷3 ≈ <strong>2.67</strong>",
          "Std Dev = √2.67 ≈ <strong>1.63</strong>"
        ],
        answer: "Range=4  |  Variance≈2.67  |  Std Dev≈1.63"
      }
    },
    {
      icon: "🎯", label: "Statistics · Slide 6 of 6",
      title: "Choosing the Right Measure",
      body: "Picking the right measure depends on your data's shape and purpose. Use this guide to decide:",
      table: [
        ["Measure", "Best When…", "Weakness"],
        ["Mean (μ)", "Symmetric data, no outliers", "Distorted by outliers"],
        ["Median", "Skewed data, outliers present", "Ignores most values"],
        ["Mode", "Categorical data, finding patterns", "May not be unique"],
        ["Std Dev (σ)", "Measuring consistency/spread", "Same units as data"]
      ],
      practice: {
        btn: "📝 Test Yourself!",
        title: "Quick Self-Check",
        html: "<p><strong>Dataset: 50, 52, 53, 54, 200</strong></p><p>Which measure best represents the typical value?</p><hr style='margin:10px 0;border-color:rgba(255,255,255,.2)'><p><strong>✅ Answer: Median = 53</strong></p><p>Mean = (50+52+53+54+200)÷5 = 409÷5 = 81.8 — heavily distorted by 200.</p><p>Sorted [50,52,53,54,200] → 3rd value = <strong>53</strong>. Most representative!</p>"
      }
    }
  ];
  renderSlideDiscussion(t, "Discussion: Measures of Central Tendency &amp; Variability", slides);
}

function renderDiscussion2(t) {
  const slides = [
    {
      icon: "🔀", label: "Piecewise Functions · Slide 1 of 7",
      title: "What is a Piecewise Function?",
      body: "A <strong>piecewise function</strong> is a function defined by <em>different rules</em> for different parts of its domain. Think of it like different contracts that activate under different conditions.",
      keyPoints: [
        "Different formula for each x-interval",
        "Real-world: taxi fare, electricity billing, progressive tax, mobile data",
        "The domain is split into 'pieces', each with its own rule",
        "Only <strong>one rule</strong> is ever active for any specific input value x"
      ]
    },
    {
      icon: "📝", label: "Piecewise Functions · Slide 2 of 7",
      title: "Writing a Piecewise Function",
      body: "A piecewise function uses a <strong>curly bracket { }</strong> to list all the rules and the conditions under which each rule applies.",
      formula: "f(x) = {  Rule₁    if  Condition₁\n         {  Rule₂    if  Condition₂\n         {  Rule₃    if  Condition₃",
      example: {
        data: "Taxi Fare Function:",
        steps: [
          "Rule 1: ₱50 flat rate if distance ≤ 2 km (base fare)",
          "Rule 2: ₱50 + ₱12(x−2) for each km above 2 km, if distance > 2 km"
        ],
        answer: "f(x) = {  50             if x ≤ 2\n         {  50 + 12(x−2)  if x > 2"
      }
    },
    {
      icon: "🔍", label: "Piecewise Functions · Slide 3 of 7",
      title: "Evaluating: The 3-Step Process",
      body: "Follow these <strong>3 steps</strong> every time you evaluate a piecewise function. Always check the condition <em>first</em> before substituting!",
      keyPoints: [
        "<strong>Step 1:</strong> Write down the value of x",
        "<strong>Step 2:</strong> Test EACH condition — find which interval x belongs to",
        "<strong>Step 3:</strong> Substitute x into the matching rule and calculate"
      ],
      example: {
        data: "f(x) = {50 if x≤2;  50+12(x−2) if x>2}.   Find f(7).",
        steps: [
          "x = 7.  Test: 7 ≤ 2? No.  7 > 2? Yes ✓",
          "Use the second rule: 50 + 12(x − 2)",
          "Substitute: 50 + 12(7−2) = 50 + 12(5) = 50 + 60",
          "= <strong>₱110</strong>"
        ],
        answer: "f(7) = ₱110"
      }
    },
    {
      icon: "⚡", label: "Piecewise Functions · Slide 4 of 7",
      title: "Real Example: Electricity Bill",
      body: "Electric companies charge at different rates based on consumption. Below a threshold you pay a flat fee; above it, extra charges apply — a real piecewise function!",
      formula: "f(x) = {  ₱300                  if x ≤ 100 kWh\n         {  300 + 9(x − 100)   if x > 100 kWh",
      example: {
        data: "A household consumed 150 kWh. Compute the monthly bill.",
        steps: [
          "x = 150; test: 150 > 100? Yes ✓ → use second rule",
          "f(150) = 300 + 9(150 − 100)",
          "= 300 + 9(50)",
          "= 300 + 450 = <strong>₱750</strong>"
        ],
        answer: "Electricity bill = ₱750"
      }
    },
    {
      icon: "🏛️", label: "Piecewise Functions · Slide 5 of 7",
      title: "Real Example: Progressive Tax Brackets",
      body: "Tax systems are the <strong>classic piecewise model</strong> — higher income earns a higher rate, but only on the portion above each threshold. This is why it is called <em>progressive</em>.",
      formula: "Tax = {  0                        if income ≤ ₱250,000\n       {  20%(x − 250,000)      if ₱250,001 ≤ x ≤ ₱400,000\n       {  30,000 + 25%(x−400,000)  if x > ₱400,000",
      keyPoints: [
        "Only the income <strong>above</strong> each threshold is taxed at the higher rate",
        "Income ≤ ₱250,000 is completely <strong>tax-exempt</strong>",
        "Crossing a bracket boundary changes which rule you apply"
      ],
      practice: {
        btn: "Compute: Income ₱500,000 💰",
        title: "Tax Computation: ₱500,000",
        html: "<p>x = ₱500,000 → x > ₱400,000 ✓</p><p>Tax = 30,000 + 25%(500,000 − 400,000)</p><p>= 30,000 + 0.25 × 100,000</p><p>= 30,000 + 25,000 = <strong>₱55,000</strong></p>"
      }
    },
    {
      icon: "📈", label: "Piecewise Functions · Slide 6 of 7",
      title: "Graphing Piecewise Functions",
      body: "Each piece of the function is graphed <em>only within its own interval</em>. Boundary points use open or closed circles to show whether that endpoint is included.",
      formula: "Closed dot  (•) = endpoint IS included    →  uses  ≤  or  ≥\nOpen circle (∘) = endpoint NOT included  →  uses  <  or  >",
      keyPoints: [
        "Draw each piece <strong>only in its own x-range</strong> — never extend beyond its boundary",
        "At each boundary, check which rule is active to determine dot type",
        "If both pieces give the same y at a boundary → function is <strong>continuous</strong> there"
      ],
      practice: {
        btn: "Open vs Closed Dot Example 🔵",
        title: "Boundary Dot Type",
        html: "<p>f(x) = { x+1 if x &lt; 2;  3x−3 if x ≥ 2 }</p><p>At x = 2:</p><p>Left piece: 2+1=3 → <strong>open circle at (2, 3)</strong></p><p>Right piece: 3(2)−3=3 → <strong>closed dot at (2, 3)</strong></p><p>Both give y=3 → the function is <strong>continuous</strong> at x=2!</p>"
      }
    },
    {
      icon: "🎯", label: "Piecewise Functions · Slide 7 of 7",
      title: "Summary: Piecewise Functions",
      body: "You now know how to read, write, evaluate, and graph piecewise functions. Here is your complete reference:",
      keyPoints: [
        "Identify which <strong>interval</strong> x belongs to first — this is the most critical step",
        "Apply <strong>only the matching rule</strong> for that interval",
        "At boundaries: ≤ or ≥ means closed dot; &lt; or &gt; means open circle",
        "Graph each piece <strong>separately in its own interval</strong>",
        "Real-world uses: taxi, electricity, tax, mobile data, tiered shipping"
      ],
      practice: {
        btn: "📝 Final Review Problem",
        title: "Complete Evaluation",
        html: "<p>f(x) = { 2x+1 if x&lt;0 ;  x²−1 if x≥0 }</p><p><strong>Find f(−2), f(0), and f(3):</strong></p><hr style='margin:10px 0;border-color:rgba(255,255,255,.2)'><p>f(−2): −2 &lt; 0 → 2(−2)+1 = <strong>−3</strong></p><p>f(0): 0 ≥ 0 → (0)²−1 = <strong>−1</strong></p><p>f(3): 3 ≥ 0 → (3)²−1 = <strong>8</strong></p>"
      }
    }
  ];
  renderSlideDiscussion(t, "Discussion: Piecewise Functions", slides);
}

function renderDiscussion3(t) {
  const slides = [
    {
      icon: "📈", label: "Quadratic Functions · Slide 1 of 7",
      title: "What is a Quadratic Function?",
      body: "A <strong>quadratic function</strong> is a polynomial of degree 2. Its graph is a <strong>parabola</strong> — a smooth symmetric U-shape (∪) or arch (∩). Quadratics appear in projectile motion, bridges, satellite dishes, and business profit models.",
      formula: "f(x) = ax² + bx + c     where  a ≠ 0",
      keyPoints: [
        "<strong>a</strong> — controls direction (up or down) and the width of the parabola",
        "<strong>b</strong> — shifts the axis of symmetry left or right",
        "<strong>c</strong> — the y-intercept (the value of f when x = 0)"
      ]
    },
    {
      icon: "⬆️", label: "Quadratic Functions · Slide 2 of 7",
      title: "Opening Direction: Controlled by 'a'",
      body: "The <strong>leading coefficient a</strong> determines whether the parabola opens up (∪) or down (∩), and whether the vertex is a minimum or maximum point.",
      formula: "a > 0  →  opens UPWARD  ∪  →  minimum vertex\na < 0  →  opens DOWNWARD  ∩  →  maximum vertex\n|a| large = narrow;   |a| small = wide parabola",
      example: {
        data: "Identify the direction and vertex type:",
        steps: [
          "f(x) = 2x² − 5x + 1 → a=2 &gt; 0 → opens UP ∪ → <strong>minimum</strong> vertex",
          "f(x) = −3x² + 4x − 1 → a=−3 &lt; 0 → opens DOWN ∩ → <strong>maximum</strong> vertex",
          "f(x) = 0.5x² + x → a=0.5 &gt; 0 → opens UP ∪ → wide parabola, minimum"
        ],
        answer: "Positive a → upward cup ∪ (minimum);  Negative a → downward arch ∩ (maximum)"
      }
    },
    {
      icon: "⭐", label: "Quadratic Functions · Slide 3 of 7",
      title: "The Vertex — The Turning Point",
      body: "The <strong>vertex</strong> is the most important point on the parabola — it is where the curve changes direction. It is the <em>minimum</em> if a&gt;0, or the <em>maximum</em> if a&lt;0.",
      formula: "x_vertex = −b ÷ (2a)\ny_vertex = f(x_vertex)   ← substitute back into f(x)",
      example: {
        data: "Find the vertex of f(x) = 2x² − 8x + 6:",
        steps: [
          "Identify: a=2, b=−8, c=6",
          "x_v = −(−8) ÷ (2×2) = 8 ÷ 4 = <strong>2</strong>",
          "y_v = f(2) = 2(4) − 8(2) + 6 = 8 − 16 + 6 = <strong>−2</strong>",
          "Vertex = (2, −2) — minimum point since a=2&gt;0"
        ],
        answer: "Vertex = (2, −2)"
      }
    },
    {
      icon: "📐", label: "Quadratic Functions · Slide 4 of 7",
      title: "Axis of Symmetry &amp; Intercepts",
      body: "The parabola is perfectly symmetric about a vertical line through the vertex. The <strong>axis of symmetry</strong> and <strong>intercepts</strong> are essential for graphing.",
      formula: "Axis of symmetry:  x = −b ÷ (2a)\ny-intercept:  f(0) = c   (always equal to c — no calculation needed!)\nx-intercepts:  solve ax² + bx + c = 0 by factoring or quadratic formula",
      keyPoints: [
        "The axis of symmetry passes through the vertex and is the same x as the vertex",
        "y-intercept is <strong>always c</strong> — just read it from the standard form equation",
        "x-intercepts (roots/zeros) — where the parabola crosses the x-axis"
      ],
      practice: {
        btn: "Find axis &amp; intercepts of f(x)=x²−4x+3 💡",
        title: "Axis of Symmetry & Intercepts",
        html: "<p>f(x) = x² − 4x + 3 → a=1, b=−4, c=3</p><p><strong>Axis of symmetry:</strong> x = −(−4)÷(2×1) = 4÷2 = <strong>x = 2</strong></p><p><strong>y-intercept:</strong> f(0) = c = <strong>(0, 3)</strong></p><p><strong>x-intercepts:</strong> x²−4x+3=0 → (x−1)(x−3)=0 → <strong>x=1 and x=3</strong></p><p><strong>Vertex:</strong> y=f(2)=4−8+3=−1 → Vertex <strong>(2, −1)</strong></p>"
      }
    },
    {
      icon: "⛹️", label: "Quadratic Functions · Slide 5 of 7",
      title: "Application: Projectile Motion",
      body: "When you throw a ball upward, its height follows a <strong>quadratic function</strong>! The vertex gives the maximum height, and the x-intercepts tell you when it lands.",
      formula: "h(t) = −(g/2)t² + v₀t + h₀\nFor Earth (g = 10 m/s²):  h(t) = −5t² + v₀t + h₀",
      example: {
        data: "A ball is thrown upward: h(t) = −5t² + 30t (meters, seconds)",
        steps: [
          "a = −5 &lt; 0 → opens down ∩ → vertex is the MAXIMUM height",
          "t_max = −30 ÷ (2 × −5) = −30 ÷ −10 = <strong>3 seconds</strong>",
          "Max height = h(3) = −5(9) + 30(3) = −45 + 90 = <strong>45 m</strong>",
          "Lands when h=0: −5t²+30t=0 → t(−5t+30)=0 → t=0 or <strong>t=6 s</strong>"
        ],
        answer: "Maximum height = 45 m at t = 3 s;  lands at t = 6 s"
      }
    },
    {
      icon: "🔄", label: "Quadratic Functions · Slide 6 of 7",
      title: "Vertex Form — Graphing Made Easy",
      body: "The <strong>vertex form</strong> directly reveals the vertex (h, k), making it easy to sketch the parabola quickly without computing.",
      formula: "Vertex form:  f(x) = a(x − h)² + k\nwhere  (h, k)  is the vertex  and  a  determines the opening",
      example: {
        data: "Convert f(x) = x² − 6x + 5 to vertex form:",
        steps: [
          "Find vertex: h = −(−6) ÷ (2×1) = 3",
          "k = f(3) = 9 − 18 + 5 = <strong>−4</strong>",
          "Vertex form: f(x) = (x − 3)² − 4",
          "Vertex (3, −4), opens upward (a=1&gt;0)"
        ],
        answer: "f(x) = (x−3)² − 4,   Vertex: (3, −4)"
      }
    },
    {
      icon: "🎯", label: "Quadratic Functions · Slide 7 of 7",
      title: "Key Concepts: Quadratic Functions",
      body: "You have now learned the complete toolkit for analyzing quadratic functions. Use this reference:",
      table: [
        ["Concept", "Formula", "Meaning"],
        ["Direction", "Sign of a", "a&gt;0 → UP ∪ (min);  a&lt;0 → DOWN ∩ (max)"],
        ["Vertex x", "−b ÷ (2a)", "x-coordinate of the turning point"],
        ["Vertex y", "f(vertex x)", "y-coordinate of the turning point"],
        ["Axis of symmetry", "x = −b ÷ (2a)", "Vertical line through the vertex"],
        ["y-intercept", "(0, c)", "Always equal to c"],
        ["Vertex form", "a(x−h)²+k", "(h, k) is the vertex"]
      ],
      practice: {
        btn: "📝 Full Analysis Practice",
        title: "Complete Analysis: f(x) = −2x² + 4x + 6",
        html: "<p>a=−2, b=4, c=6</p><p><strong>Direction:</strong> a&lt;0 → opens DOWN ∩ → vertex is MAXIMUM</p><p><strong>Vertex:</strong> x_v = −4÷(2×−2) = −4÷−4 = 1;  y_v = f(1) = −2+4+6 = <strong>8</strong> → Vertex (1, 8)</p><p><strong>Axis of symmetry:</strong> x = 1</p><p><strong>y-intercept:</strong> (0, 6)</p><p><strong>Maximum value:</strong> 8 (at x = 1)</p>"
      }
    }
  ];
  renderSlideDiscussion(t, "Discussion: Quadratic Functions", slides);
}

// ─── PHASE 3: Activity ────────────────────────────────────────────────────────
function renderActivity(t) {
  if (t.id === 1) renderActivity1(t);
  else if (t.id === 2) renderActivity2(t);
  else renderActivity3(t);
}

/* ── Topic 1 Activity: Stats calculator + Data Detective ── */
function renderActivity1(t) {
  // Auto-load sample data so charts are visible on first open
  if (!appState.statsData.computed) {
    appState.statsData.raw = "65, 70, 72, 74, 95";
    appState.statsData.computed = computeStats(parseNums(appState.statsData.raw));
  }
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

      if (ok) {
        swalPop({
          title: "Correct! 🎉",
          html: `<p style="font-size:.95rem">${esc(item.why)}</p>`,
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        }).then(() => { qs.index += 1; renderQuizItem(t); });
      } else {
        swalPop({
          title: "📚 Let's Learn This!",
          html: quizWrongHtml(item, chosen),
          icon: "error",
          confirmButtonText: "I understand! 📖",
          allowOutsideClick: false,
          customClass: { popup: "swal-wide-popup" }
        }).then(() => { qs.index += 1; renderQuizItem(t); });
      }
    });
  });
}

function quizWrongHtml(item, chosen) {
  const stepsHtml = (item.steps || []).map((s, i) =>
    `<div class="swal-step"><span class="swal-step-num">${i + 1}</span><span>${s}</span></div>`
  ).join("");
  return `<div class="swal-solution">
    <div class="swal-wrong-badge">❌ Your answer: ${esc(chosen)}</div>
    <p style="font-size:.88rem;font-weight:700;margin:8px 0 4px">📐 Formula / Rule:</p>
    <div class="swal-formula-box">${esc(item.formula || "")}</div>
    <p style="font-size:.88rem;font-weight:700;margin:10px 0 6px">📝 Step-by-step Solution:</p>
    <div class="swal-steps">${stepsHtml}</div>
    <div class="swal-correct-box">✅ Correct Answer: ${esc(item.a)}</div>
    <p class="swal-insight">${esc(item.why)}</p>
  </div>`;
}

function renderQuizResult(t, qs) {
  const pct = Math.round((qs.score / qs.items.length) * 100);
  const stars = pct === 100 ? "⭐⭐⭐" : pct >= 70 ? "⭐⭐" : "⭐";
  const msg = pct === 100 ? "Perfect Score! Incredible!" : pct >= 70 ? "Well done! Great performance." : "Keep practicing — you're getting there!";

  markPhase(t.id, 4);
  grantXp(30, "Assessment completed");
  checkBadges();
  if (pct >= 70) launchConfetti();
  recordAssessmentResult(t, qs.score, qs.items.length, pct).catch(() => {
    // Keep learner flow smooth even if network is temporarily unavailable.
  });

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
async function bootstrapAuth() {
  loadSession();
  if (!authState.token) {
    authState.loading = false;
    appState.screen = "auth";
    return;
  }

  try {
    const me = await api("/api/me");
    authState.user = me;
    await refreshChildren();
    if (authState.childId) {
      const exists = authState.children.some(c => c.id === authState.childId);
      if (exists) await loadChildProgress(authState.childId);
      else authState.childId = null;
    }
    saveSession();
    appState.screen = authState.childId ? "landing" : "auth";
  } catch (_) {
    clearSession();
    appState.screen = "auth";
  } finally {
    authState.loading = false;
  }
}

initVoiceEngine();
bootstrapVoiceAutoplay();
loadTheme();
on("themeToggle", "click", toggleTheme);
bootstrapAuth().finally(draw);
