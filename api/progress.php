<?php
require __DIR__ . '/config.php';

$authUser = require_auth();
$childId  = isset($_GET['child_id']) ? (int)$_GET['child_id'] : 0;

if (!$childId) {
    respond(['error' => 'child_id query parameter is required'], 400);
}

$db   = get_db();
$chk  = $db->prepare('SELECT id FROM children WHERE id = ? AND user_id = ?');
$chk->execute([$childId, $authUser['uid']]);
if (!$chk->fetch()) {
    respond(['error' => 'Child not found'], 404);
}

// GET /api/progress.php?child_id=X  – load saved progress snapshot
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare(
        'SELECT snapshot_json, updated_at FROM child_progress WHERE child_id = ?'
    );
    $stmt->execute([$childId]);
    $row = $stmt->fetch();

    if (!$row) {
        respond(['snapshot' => null, 'updatedAt' => null]);
    }

    respond([
        'snapshot'  => json_decode($row['snapshot_json'], true),
        'updatedAt' => $row['updated_at'],
    ]);
}

// PUT /api/progress.php?child_id=X  – save / update progress snapshot
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data     = body();
    $snapshot = $data['snapshot'] ?? null;

    if (!$snapshot || !is_array($snapshot)) {
        respond(['error' => 'snapshot object is required'], 400);
    }

    $json = json_encode($snapshot, JSON_UNESCAPED_UNICODE);

    $stmt = $db->prepare(
        'INSERT INTO child_progress (child_id, snapshot_json, updated_at)
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE
           snapshot_json = VALUES(snapshot_json),
           updated_at    = NOW()'
    );
    $stmt->execute([$childId, $json]);

    respond(['ok' => true]);
}

respond(['error' => 'Method not allowed'], 405);
