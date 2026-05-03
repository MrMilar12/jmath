<?php
require __DIR__ . '/config.php';

$authUser = require_auth();
$childId  = isset($_GET['child_id']) ? (int)$_GET['child_id'] : 0;

if (!$childId) {
    respond(['error' => 'child_id query parameter is required'], 400);
}

$db  = get_db();
$chk = $db->prepare('SELECT id FROM children WHERE id = ? AND user_id = ?');
$chk->execute([$childId, $authUser['uid']]);
if (!$chk->fetch()) {
    respond(['error' => 'Child not found'], 404);
}

// GET /api/results.php?child_id=X  – fetch all assessment results for a child
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare(
        'SELECT id, topic_id, topic_title, score, total, pct,
                competency_json, xp, level, created_at
         FROM assessment_results
         WHERE child_id = ?
         ORDER BY id DESC
         LIMIT 100'
    );
    $stmt->execute([$childId]);
    $rows = $stmt->fetchAll();

    $result = [];
    foreach ($rows as $r) {
        $competency = [];
        if (!empty($r['competency_json'])) {
            $competency = json_decode($r['competency_json'], true) ?: [];
        }
        $result[] = [
            'id'         => (int)$r['id'],
            'topicId'    => (int)$r['topic_id'],
            'topicTitle' => $r['topic_title'],
            'score'      => (int)$r['score'],
            'total'      => (int)$r['total'],
            'pct'        => (int)$r['pct'],
            'competency' => $competency,
            'xp'         => $r['xp'] !== null ? (int)$r['xp'] : null,
            'level'      => $r['level'] !== null ? (int)$r['level'] : null,
            'createdAt'  => $r['created_at'],
        ];
    }
    respond($result);
}

// POST /api/results.php?child_id=X  – record a new assessment result
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data       = body();
    $topicId    = isset($data['topicId'])    ? (int)$data['topicId']    : null;
    $topicTitle = $data['topicTitle'] ?? null;
    $score      = isset($data['score'])      ? (int)$data['score']      : null;
    $total      = isset($data['total'])      ? (int)$data['total']      : null;
    $pct        = isset($data['pct'])        ? (int)$data['pct']        : null;
    $competency = $data['competency'] ?? [];
    $xp         = isset($data['xp'])    ? (int)$data['xp']    : null;
    $level      = isset($data['level']) ? (int)$data['level'] : null;

    if ($topicId === null || !$topicTitle || $score === null || $total === null || $pct === null) {
        respond(['error' => 'topicId, topicTitle, score, total, and pct are required'], 400);
    }

    $stmt = $db->prepare(
        'INSERT INTO assessment_results
           (child_id, topic_id, topic_title, score, total, pct, competency_json, xp, level)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    $stmt->execute([
        $childId,
        $topicId,
        $topicTitle,
        $score,
        $total,
        $pct,
        json_encode($competency, JSON_UNESCAPED_UNICODE),
        $xp,
        $level,
    ]);

    respond(['ok' => true]);
}

respond(['error' => 'Method not allowed'], 405);
