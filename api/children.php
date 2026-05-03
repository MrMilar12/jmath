<?php
require __DIR__ . '/config.php';

$authUser = require_auth();
$db       = get_db();

// GET /api/children.php  – list all children for the logged-in user
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare(
        'SELECT id, child_name, grade_level, created_at
         FROM children
         WHERE user_id = ?
         ORDER BY id DESC'
    );
    $stmt->execute([$authUser['uid']]);
    $rows = $stmt->fetchAll();

    $result = [];
    foreach ($rows as $r) {
        $result[] = [
            'id'         => (int)$r['id'],
            'childName'  => $r['child_name'],
            'gradeLevel' => $r['grade_level'],
            'createdAt'  => $r['created_at'],
        ];
    }
    respond($result);
}

// POST /api/children.php  – add a new child profile
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data      = body();
    $childName = trim($data['childName'] ?? '');
    $grade     = trim($data['gradeLevel'] ?? '');

    if (!$childName) {
        respond(['error' => 'childName is required'], 400);
    }

    $stmt = $db->prepare(
        'INSERT INTO children (user_id, child_name, grade_level) VALUES (?, ?, ?)'
    );
    $stmt->execute([$authUser['uid'], $childName, $grade ?: null]);
    $id = (int)$db->lastInsertId();

    $s2 = $db->prepare(
        'SELECT id, child_name, grade_level, created_at FROM children WHERE id = ?'
    );
    $s2->execute([$id]);
    $child = $s2->fetch();

    respond([
        'id'         => (int)$child['id'],
        'childName'  => $child['child_name'],
        'gradeLevel' => $child['grade_level'],
        'createdAt'  => $child['created_at'],
    ]);
}

respond(['error' => 'Method not allowed'], 405);
