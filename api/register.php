<?php
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['error' => 'Method not allowed'], 405);
}

$data     = body();
$fullName = trim($data['fullName'] ?? '');
$email    = strtolower(trim($data['email'] ?? ''));
$password = $data['password'] ?? '';
$role     = $data['role'] ?? 'teacher';

if (!$fullName || !$email || !$password) {
    respond(['error' => 'fullName, email, and password are required'], 400);
}
if (strlen($password) < 6) {
    respond(['error' => 'Password must be at least 6 characters'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(['error' => 'Invalid email address'], 400);
}
if (!in_array($role, ['teacher', 'student', 'admin'], true)) {
    respond(['error' => 'role must be teacher, student, or admin'], 400);
}

$db   = get_db();
$hash = password_hash($password, PASSWORD_BCRYPT);

try {
    $stmt = $db->prepare('INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    $stmt->execute([$fullName, $email, $hash, $role]);
    $id = (int)$db->lastInsertId();

    $s2 = $db->prepare('SELECT id, full_name, email, role FROM users WHERE id = ?');
    $s2->execute([$id]);
    $user  = $s2->fetch();
    $token = make_token(['uid' => (int)$user['id'], 'email' => $user['email'], 'role' => $user['role']]);

    $childId = null;
    // Students are their own learning profile — auto-create a child record
    if ($role === 'student') {
        $db->prepare('INSERT INTO children (user_id, child_name, grade_level) VALUES (?, ?, NULL)')
           ->execute([$id, $fullName]);
        $childId = (int)$db->lastInsertId();
    }

    respond([
        'token'   => $token,
        'user'    => [
            'id'       => (int)$user['id'],
            'fullName' => $user['full_name'],
            'email'    => $user['email'],
            'role'     => $user['role'],
        ],
        'childId' => $childId,
    ]);
} catch (PDOException $e) {
    $msg = $e->getMessage();
    if (strpos($msg, '1062') !== false || stripos($msg, 'Duplicate') !== false) {
        respond(['error' => 'Email already exists'], 409);
    }
    respond(['error' => 'Registration failed'], 500);
}
