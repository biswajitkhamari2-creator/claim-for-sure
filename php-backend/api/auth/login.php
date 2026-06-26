<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('POST');

$in       = json_input();
$email    = strtolower(sanitize_string($in['email'] ?? '', 255));
$password = (string)($in['password'] ?? '');

if (!valid_email($email) || $password === '') json_response(['error' => 'invalid_credentials'], 401);

$stmt = db()->prepare('SELECT id, email, password_hash, full_name, phone, avatar_url, email_verified FROM users WHERE email = ?');
$stmt->execute([$email]);
$u = $stmt->fetch();

if (!$u || !password_verify($password, $u['password_hash'])) {
    log_activity(null, 'login_failed', ['email' => $email]);
    json_response(['error' => 'invalid_credentials'], 401);
}

log_activity($u['id'], 'login');
unset($u['password_hash']);

json_response([
    'token' => jwt_encode(['sub' => $u['id'], 'email' => $u['email']]),
    'user'  => $u,
]);
