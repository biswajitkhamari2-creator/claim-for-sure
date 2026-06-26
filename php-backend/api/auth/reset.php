<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('POST');

$in       = json_input();
$token    = (string)($in['token'] ?? '');
$password = (string)($in['password'] ?? '');
if ($token === '' || strlen($password) < 8) json_response(['error' => 'invalid_input'], 422);

$hash = hash('sha256', $token);
$pdo  = db();
$stmt = $pdo->prepare(
    'SELECT id, user_id FROM password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()'
);
$stmt->execute([$hash]);
$row = $stmt->fetch();
if (!$row) json_response(['error' => 'invalid_or_expired_token'], 400);

$pdo->beginTransaction();
$pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
    ->execute([password_hash($password, PASSWORD_BCRYPT), $row['user_id']]);
$pdo->prepare('UPDATE password_resets SET used_at = NOW() WHERE id = ?')
    ->execute([$row['id']]);
$pdo->commit();

log_activity($row['user_id'], 'password_reset_completed');
json_response(['ok' => true]);
