<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('POST');

$in    = json_input();
$email = strtolower(sanitize_string($in['email'] ?? '', 255));
if (!valid_email($email)) json_response(['ok' => true]); // don't leak

$stmt = db()->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
$u = $stmt->fetch();
if (!$u) json_response(['ok' => true]);

$token = bin2hex(random_bytes(32));
db()->prepare(
    'INSERT INTO password_resets (id,user_id,token_hash,expires_at) VALUES (?,?,?, DATE_ADD(NOW(), INTERVAL 1 HOUR))'
)->execute([uuid(), $u['id'], hash('sha256', $token)]);

log_activity($u['id'], 'password_reset_requested');

// TODO: send email with this link via SMTP/PHPMailer
json_response(['ok' => true, 'reset_link' => FRONTEND_URL . '/auth/reset?token=' . $token]);
