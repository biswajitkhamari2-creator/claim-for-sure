<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
$u = require_user();

if ($_SERVER['REQUEST_METHOD'] === 'GET') json_response(['user' => $u]);

require_method('PUT', 'PATCH');
$in    = json_input();
$name  = sanitize_string($in['full_name'] ?? $u['full_name'], 150);
$phone = sanitize_string($in['phone'] ?? $u['phone'], 20);
if ($phone !== '' && !preg_match('/^\d{10}$/', $phone)) json_response(['error' => 'invalid_phone'], 422);

db()->prepare('UPDATE users SET full_name = ?, phone = ? WHERE id = ?')
    ->execute([$name, $phone, $u['id']]);

log_activity($u['id'], 'profile_updated');
json_response(['ok' => true]);
