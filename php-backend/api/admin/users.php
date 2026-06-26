<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('GET');
require_admin();

$limit  = max(1, min(200, (int)($_GET['limit'] ?? 50)));
$offset = max(0, (int)($_GET['offset'] ?? 0));

$sql  = 'SELECT id,email,full_name,phone,email_verified,created_at FROM users ORDER BY created_at DESC LIMIT ' . $limit . ' OFFSET ' . $offset;
$stmt = db()->query($sql);
json_response(['users' => $stmt->fetchAll()]);
