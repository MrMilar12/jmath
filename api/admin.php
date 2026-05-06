<?php
require __DIR__ . '/config.php';

$authUser = require_auth();

if ($authUser['role'] !== 'admin') {
    respond(['error' => 'Admin access required'], 403);
}

$db     = get_db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'stats';

    if ($action === 'stats') {
        $totalUsers       = (int)$db->query('SELECT COUNT(*) FROM users')->fetchColumn();
        $totalStudents    = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'student'")->fetchColumn();
        $totalTeachers    = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'teacher'")->fetchColumn();
        $totalAdmins      = (int)$db->query("SELECT COUNT(*) FROM users WHERE role = 'admin'")->fetchColumn();
        $totalAssessments = (int)$db->query('SELECT COUNT(*) FROM assessment_results')->fetchColumn();
        $totalChildren    = (int)$db->query('SELECT COUNT(*) FROM children')->fetchColumn();
        respond([
            'totalUsers'       => $totalUsers,
            'totalStudents'    => $totalStudents,
            'totalTeachers'    => $totalTeachers,
            'totalAdmins'      => $totalAdmins,
            'totalAssessments' => $totalAssessments,
            'totalChildren'    => $totalChildren,
        ]);
    }

    if ($action === 'users') {
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

    respond(['error' => 'Unknown action'], 400);
}

if ($method === 'DELETE') {
    $targetId = (int)($_GET['id'] ?? 0);
    if (!$targetId) {
        respond(['error' => 'id is required'], 400);
    }
    if ($targetId === (int)$authUser['uid']) {
        respond(['error' => 'Cannot delete your own account'], 400);
    }

    // Cascade delete: assessment results → child progress → children → user
    $db->prepare(
        'DELETE FROM assessment_results WHERE child_id IN (SELECT id FROM children WHERE user_id = ?)'
    )->execute([$targetId]);
    $db->prepare(
        'DELETE FROM child_progress WHERE child_id IN (SELECT id FROM children WHERE user_id = ?)'
    )->execute([$targetId]);
    $db->prepare('DELETE FROM children WHERE user_id = ?')->execute([$targetId]);
    $db->prepare('DELETE FROM users WHERE id = ?')->execute([$targetId]);

    respond(['ok' => true]);
}

if ($method === 'PUT') {
    $data     = body();
    $targetId = (int)($data['id'] ?? 0);
    $newRole  = $data['role'] ?? '';
    if (!$targetId) {
        respond(['error' => 'id is required'], 400);
    }
    if (!in_array($newRole, ['teacher', 'student', 'admin'], true)) {
        respond(['error' => 'role must be teacher, student, or admin'], 400);
    }
    $db->prepare('UPDATE users SET role = ? WHERE id = ?')->execute([$newRole, $targetId]);
    respond(['ok' => true]);
}

respond(['error' => 'Method not allowed'], 405);
