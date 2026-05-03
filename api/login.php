<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

$data     = body();
$email    = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';

if (!$email || !$password) {
    respond(['error' => 'email and password are required'], 400);
}

$db   = get_db();
$stmt = $db->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    respond(['error' => 'Invalid credentials'], 401);
}

$token = make_token(['uid' => (int)$user['id'], 'email' => $user['email']]);
respond([
    'token' => $token,
    'user'  => ['id' => (int)$user['id'], 'fullName' => $user['full_name'], 'email' => $user['email']]
]);
