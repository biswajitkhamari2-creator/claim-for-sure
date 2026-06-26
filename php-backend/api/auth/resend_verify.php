<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('POST');
$u = require_user();
if ((int)$u['email_verified'] === 1) json_response(['ok' => true]);

$token = bin2hex(random_bytes(32));
db()->prepare(
    'INSERT INTO email_verification_tokens (id,user_id,token_hash,expires_at) VALUES (?,?,?, DATE_ADD(NOW(), INTERVAL 24 HOUR))'
)->execute([uuid(), $u['id'], hash('sha256', $token)]);

json_response(['ok' => true, 'verify_link' => FRONTEND_URL . '/auth/verify?token=' . $token]);
