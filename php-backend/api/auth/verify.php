<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('POST', 'GET');

$token = (string)($_GET['token'] ?? json_input()['token'] ?? '');
if ($token === '') json_response(['error' => 'missing_token'], 422);

$hash = hash('sha256', $token);
$pdo  = db();
$stmt = $pdo->prepare(
    'SELECT id, user_id FROM email_verification_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()'
);
$stmt->execute([$hash]);
$row = $stmt->fetch();
if (!$row) json_response(['error' => 'invalid_or_expired_token'], 400);

$pdo->beginTransaction();
$pdo->prepare('UPDATE users SET email_verified = 1 WHERE id = ?')->execute([$row['user_id']]);
$pdo->prepare('UPDATE email_verification_tokens SET used_at = NOW() WHERE id = ?')->execute([$row['id']]);
$pdo->commit();

log_activity($row['user_id'], 'email_verified');
json_response(['ok' => true]);
