<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('GET');
require_admin();

$pdo = db();
$stats = [
    'users'           => (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn(),
    'claims_total'    => (int)$pdo->query('SELECT COUNT(*) FROM claims')->fetchColumn(),
    'claims_pending'  => (int)$pdo->query("SELECT COUNT(*) FROM claims WHERE status='pending'")->fetchColumn(),
    'claims_approved' => (int)$pdo->query("SELECT COUNT(*) FROM claims WHERE status='approved'")->fetchColumn(),
    'claims_rejected' => (int)$pdo->query("SELECT COUNT(*) FROM claims WHERE status='rejected'")->fetchColumn(),
];
json_response($stats);
