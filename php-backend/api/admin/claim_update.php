<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('PATCH', 'PUT');
$admin = require_admin();

$id  = $_GET['id'] ?? '';
$in  = json_input();
$st  = $in['status'] ?? '';
if (!in_array($st, ['pending','in_review','approved','rejected','closed'], true)) {
    json_response(['error' => 'invalid_status'], 422);
}

db()->prepare('UPDATE claims SET status = ? WHERE id = ?')->execute([$st, $id]);
log_activity($admin['id'], 'admin_claim_status', ['claim' => $id, 'status' => $st]);
json_response(['ok' => true]);
