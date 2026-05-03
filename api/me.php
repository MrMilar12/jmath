<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    respond(['error' => 'Method not allowed'], 405);
}

$authUser = require_auth();

$db   = get_db();
$stmt = $db->prepare('SELECT id, full_name, email FROM users WHERE id = ?');
$stmt->execute([$authUser['uid']]);
$user = $stmt->fetch();

if (!$user) {
    respond(['error' => 'User not found'], 404);
}

respond(['id' => (int)$user['id'], 'fullName' => $user['full_name'], 'email' => $user['email']]);
