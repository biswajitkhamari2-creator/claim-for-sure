<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('GET');
$u = require_user();
$stmt = db()->prepare('SELECT 1 FROM admins WHERE user_id = ?');
$stmt->execute([$u['id']]);
$u['is_admin'] = (bool) $stmt->fetchColumn();
json_response(['user' => $u]);
