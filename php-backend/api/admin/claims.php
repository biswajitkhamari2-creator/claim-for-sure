<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('GET');
require_admin();

$status = $_GET['status'] ?? null;
$limit  = max(1, min(200, (int)($_GET['limit'] ?? 50)));
$offset = max(0, (int)($_GET['offset'] ?? 0));

$sql = 'SELECT c.*, u.email AS user_email FROM claims c JOIN users u ON u.id = c.user_id';
$args = [];
if ($status) { $sql .= ' WHERE c.status = ?'; $args[] = $status; }
$sql .= ' ORDER BY c.created_at DESC LIMIT ' . $limit . ' OFFSET ' . $offset;

$stmt = db()->prepare($sql);
$stmt->execute($args);
json_response(['claims' => $stmt->fetchAll()]);
