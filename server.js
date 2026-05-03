"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "jmath-dev-secret-change-me";

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, "jmath.db");

const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS children (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      child_name TEXT NOT NULL,
      grade_level TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS child_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_id INTEGER NOT NULL UNIQUE,
      snapshot_json TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(child_id) REFERENCES children(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS assessment_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      child_id INTEGER NOT NULL,
      topic_id INTEGER NOT NULL,
      topic_title TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      pct INTEGER NOT NULL,
      competency_json TEXT,
      xp INTEGER,
      level INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY(child_id) REFERENCES children(id)
    )
  `);

  await run("CREATE INDEX IF NOT EXISTS idx_children_user ON children(user_id)");
  await run("CREATE INDEX IF NOT EXISTS idx_results_child ON assessment_results(child_id)");
}

function makeToken(user) {
  return jwt.sign(
    { uid: user.id, email: user.email, name: user.full_name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (_) {
    res.status(401).json({ error: "Invalid token" });
  }
}

async function findChildForUser(childId, userId) {
  return get("SELECT * FROM children WHERE id = ? AND user_id = ?", [childId, userId]);
}

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "fullName, email, and password are required" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const result = await run(
      "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)",
      [String(fullName).trim(), String(email).trim().toLowerCase(), passwordHash]
    );
    const user = await get("SELECT id, full_name, email FROM users WHERE id = ?", [result.lastID]);
    const token = makeToken(user);
    res.json({ token, user: { id: user.id, fullName: user.full_name, email: user.email } });
  } catch (err) {
    if (String(err.message || "").includes("UNIQUE")) {
      return res.status(409).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await get("SELECT * FROM users WHERE email = ?", [String(email).trim().toLowerCase()]);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(String(password), user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = makeToken(user);
    res.json({ token, user: { id: user.id, fullName: user.full_name, email: user.email } });
  } catch (_) {
    res.status(500).json({ error: "Failed to login" });
  }
});

app.get("/api/me", auth, async (req, res) => {
  const user = await get("SELECT id, full_name, email FROM users WHERE id = ?", [req.user.uid]);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ id: user.id, fullName: user.full_name, email: user.email });
});

app.get("/api/children", auth, async (req, res) => {
  const rows = await all(
    "SELECT id, child_name, grade_level, created_at FROM children WHERE user_id = ? ORDER BY id DESC",
    [req.user.uid]
  );
  res.json(rows.map(r => ({
    id: r.id,
    childName: r.child_name,
    gradeLevel: r.grade_level,
    createdAt: r.created_at
  })));
});

app.post("/api/children", auth, async (req, res) => {
  try {
    const { childName, gradeLevel } = req.body || {};
    if (!childName) return res.status(400).json({ error: "childName is required" });

    const result = await run(
      "INSERT INTO children (user_id, child_name, grade_level) VALUES (?, ?, ?)",
      [req.user.uid, String(childName).trim(), gradeLevel ? String(gradeLevel).trim() : null]
    );

    const row = await get("SELECT id, child_name, grade_level, created_at FROM children WHERE id = ?", [result.lastID]);
    res.json({
      id: row.id,
      childName: row.child_name,
      gradeLevel: row.grade_level,
      createdAt: row.created_at
    });
  } catch (_) {
    res.status(500).json({ error: "Failed to create child" });
  }
});

app.get("/api/children/:childId/progress", auth, async (req, res) => {
  const childId = Number(req.params.childId);
  if (!Number.isInteger(childId)) return res.status(400).json({ error: "Invalid childId" });

  const child = await findChildForUser(childId, req.user.uid);
  if (!child) return res.status(404).json({ error: "Child not found" });

  const row = await get("SELECT snapshot_json, updated_at FROM child_progress WHERE child_id = ?", [childId]);
  if (!row) return res.json({ snapshot: null, updatedAt: null });

  let snapshot = null;
  try {
    snapshot = JSON.parse(row.snapshot_json);
  } catch (_) {
    snapshot = null;
  }
  res.json({ snapshot, updatedAt: row.updated_at });
});

app.put("/api/children/:childId/progress", auth, async (req, res) => {
  const childId = Number(req.params.childId);
  if (!Number.isInteger(childId)) return res.status(400).json({ error: "Invalid childId" });

  const child = await findChildForUser(childId, req.user.uid);
  if (!child) return res.status(404).json({ error: "Child not found" });

  const snapshot = req.body && req.body.snapshot;
  if (!snapshot || typeof snapshot !== "object") {
    return res.status(400).json({ error: "snapshot object is required" });
  }

  const snapJson = JSON.stringify(snapshot);
  await run(
    `INSERT INTO child_progress (child_id, snapshot_json, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(child_id) DO UPDATE SET snapshot_json = excluded.snapshot_json, updated_at = datetime('now')`,
    [childId, snapJson]
  );

  res.json({ ok: true });
});

app.post("/api/children/:childId/results", auth, async (req, res) => {
  const childId = Number(req.params.childId);
  if (!Number.isInteger(childId)) return res.status(400).json({ error: "Invalid childId" });

  const child = await findChildForUser(childId, req.user.uid);
  if (!child) return res.status(404).json({ error: "Child not found" });

  const {
    topicId,
    topicTitle,
    score,
    total,
    pct,
    competency,
    xp,
    level
  } = req.body || {};

  if (![topicId, score, total, pct].every(v => Number.isFinite(Number(v))) || !topicTitle) {
    return res.status(400).json({ error: "topicId, topicTitle, score, total, pct are required" });
  }

  await run(
    `INSERT INTO assessment_results
      (child_id, topic_id, topic_title, score, total, pct, competency_json, xp, level)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      childId,
      Number(topicId),
      String(topicTitle),
      Number(score),
      Number(total),
      Number(pct),
      JSON.stringify(competency || {}),
      Number.isFinite(Number(xp)) ? Number(xp) : null,
      Number.isFinite(Number(level)) ? Number(level) : null
    ]
  );

  res.json({ ok: true });
});

app.get("/api/children/:childId/results", auth, async (req, res) => {
  const childId = Number(req.params.childId);
  if (!Number.isInteger(childId)) return res.status(400).json({ error: "Invalid childId" });

  const child = await findChildForUser(childId, req.user.uid);
  if (!child) return res.status(404).json({ error: "Child not found" });

  const rows = await all(
    `SELECT id, topic_id, topic_title, score, total, pct, competency_json, xp, level, created_at
     FROM assessment_results
     WHERE child_id = ?
     ORDER BY id DESC
     LIMIT 100`,
    [childId]
  );

  res.json(rows.map(r => ({
    id: r.id,
    topicId: r.topic_id,
    topicTitle: r.topic_title,
    score: r.score,
    total: r.total,
    pct: r.pct,
    competency: (() => {
      try { return JSON.parse(r.competency_json || "{}"); }
      catch (_) { return {}; }
    })(),
    xp: r.xp,
    level: r.level,
    createdAt: r.created_at
  })));
});

app.use(express.static(__dirname));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`jmath server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
