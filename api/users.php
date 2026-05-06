<?php
require __DIR__ . '/config.php';

$authUser = require_auth();

if (!in_array($authUser['role'], ['teacher', 'admin'], true)) {
    respond(['error' => 'Forbidden'], 403);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['error' => 'Method not allowed'], 405);
}

$db = get_db();

if ($authUser['role'] === 'admin') {
    // Admin: see all users with their child/student count
    $stmt = $db->query(
        'SELECT u.id, u.full_name, u.email, u.role, u.created_at,
                COUNT(c.id) AS child_count
         FROM users u
         LEFT JOIN children c ON c.user_id = u.id
         GROUP BY u.id
         ORDER BY u.created_at DESC'
    );
    $rows = $stmt->fetchAll();
    respond(array_map(fn($r) => [
        'id'         => (int)$r['id'],
        'fullName'   => $r['full_name'],
        'email'      => $r['email'],
        'role'       => $r['role'],
        'childCount' => (int)$r['child_count'],
        'createdAt'  => $r['created_at'],
    ], $rows));
}

// Teacher: see their enrolled children with progress snapshot
$stmt = $db->prepare(
    'SELECT c.id, c.child_name, c.grade_level, c.created_at,
            cp.snapshot_json, cp.updated_at AS progress_updated
     FROM children c
     LEFT JOIN child_progress cp ON cp.child_id = c.id
     WHERE c.user_id = ?
     ORDER BY c.created_at DESC'
);
$stmt->execute([$authUser['uid']]);
$rows = $stmt->fetchAll();

respond(array_map(function ($r) {
    $snapshot = null;
    if ($r['snapshot_json']) {
        $snapshot = json_decode($r['snapshot_json'], true);
    }
    return [
        'id'              => (int)$r['id'],
        'childName'       => $r['child_name'],
        'gradeLevel'      => $r['grade_level'],
        'createdAt'       => $r['created_at'],
        'progressUpdated' => $r['progress_updated'],
        'xp'              => $snapshot ? (int)($snapshot['xp'] ?? 0) : 0,
        'level'           => $snapshot ? (int)($snapshot['level'] ?? 1) : 1,
        'badges'          => $snapshot ? count($snapshot['badges'] ?? []) : 0,
    ];
}, $rows));
