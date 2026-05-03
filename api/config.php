<?php
// ─── Database configuration ───────────────────────────────────────────────────
// Change these values to match your MySQL / XAMPP setup.
define('DB_HOST', 'localhost');
define('DB_NAME', 'jmath_db');
define('DB_USER', 'root');
define('DB_PASS', '');          // blank by default in XAMPP

// Change this to a long random string in production.
define('JWT_SECRET', 'jmath-secret-change-me-before-deploying');

// ─── CORS + JSON headers ──────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── Database connection ──────────────────────────────────────────────────────
function get_db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    try {
        $pdo = new PDO(
            'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ]
        );
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed. Check api/config.php settings.']);
        exit;
    }
    return $pdo;
}

// ─── Base64url helpers (for token) ───────────────────────────────────────────
function b64u_encode(string $data): string {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function b64u_decode(string $data): string {
    return base64_decode(strtr($data, '-_', '+/'));
}

// ─── Minimal JWT (no composer required) ──────────────────────────────────────
function make_token(array $payload): string {
    $payload['iat'] = time();
    $payload['exp'] = time() + 7 * 86400; // 7 days
    $h   = b64u_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $p   = b64u_encode(json_encode($payload));
    $sig = b64u_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    return "$h.$p.$sig";
}

function verify_token(?string $token): ?array {
    if (!$token) return null;
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$h, $p, $sig] = $parts;
    $expected = b64u_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    if (!hash_equals($expected, $sig)) return null;
    $payload = json_decode(b64u_decode($p), true);
    if (!$payload || ($payload['exp'] ?? 0) < time()) return null;
    return $payload;
}

// ─── Auth middleware ──────────────────────────────────────────────────────────
function require_auth(): array {
    // Apache/nginx may or may not expose Authorization in $_SERVER
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!$header && function_exists('getallheaders')) {
        $all = getallheaders();
        $header = $all['Authorization'] ?? $all['authorization'] ?? '';
    }
    $token = (strpos($header, 'Bearer ') === 0) ? substr($header, 7) : '';
    $user  = verify_token($token);
    if (!$user) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    return $user;
}

// ─── Response helpers ─────────────────────────────────────────────────────────
function respond(array $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function body(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
