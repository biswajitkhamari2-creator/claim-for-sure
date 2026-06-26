<?php
declare(strict_types=1);

function cors(): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = CORS_ORIGINS;
    if (in_array('*', $allowed, true)) {
        header('Access-Control-Allow-Origin: *');
    } elseif ($origin && in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
        header('Access-Control-Allow-Credentials: true');
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function json_response($data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function json_input(): array {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function require_method(string ...$methods): void {
    if (!in_array($_SERVER['REQUEST_METHOD'] ?? '', $methods, true)) {
        json_response(['error' => 'method_not_allowed'], 405);
    }
}

function bearer_token(): ?string {
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (stripos($h, 'Bearer ') === 0) return trim(substr($h, 7));
    return null;
}

function current_user(): ?array {
    $tok = bearer_token();
    if (!$tok) return null;
    $p = jwt_decode($tok);
    if (!$p || empty($p['sub'])) return null;
    $stmt = db()->prepare('SELECT id, email, full_name, phone, avatar_url, email_verified FROM users WHERE id = ?');
    $stmt->execute([$p['sub']]);
    $u = $stmt->fetch();
    return $u ?: null;
}

function require_user(): array {
    $u = current_user();
    if (!$u) json_response(['error' => 'unauthorized'], 401);
    return $u;
}

function require_admin(): array {
    $u = require_user();
    $stmt = db()->prepare('SELECT role FROM admins WHERE user_id = ?');
    $stmt->execute([$u['id']]);
    if (!$stmt->fetch()) json_response(['error' => 'forbidden'], 403);
    return $u;
}

function log_activity(?string $userId, string $action, array $meta = []): void {
    try {
        $stmt = db()->prepare(
            'INSERT INTO activity_logs (user_id, action, ip_address, user_agent, metadata) VALUES (?,?,?,?,?)'
        );
        $stmt->execute([
            $userId,
            $action,
            $_SERVER['REMOTE_ADDR'] ?? null,
            substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 255),
            $meta ? json_encode($meta) : null,
        ]);
    } catch (Throwable $e) { /* swallow */ }
}

function sanitize_string(?string $v, int $max = 255): string {
    $v = trim((string)$v);
    if (function_exists('mb_substr')) $v = mb_substr($v, 0, $max);
    else $v = substr($v, 0, $max);
    return $v;
}

function valid_email(string $e): bool {
    return (bool) filter_var($e, FILTER_VALIDATE_EMAIL);
}

function bootstrap(): void {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/db.php';
    require_once __DIR__ . '/jwt.php';
    cors();
}
