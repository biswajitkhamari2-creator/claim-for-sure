<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
$u  = require_user();
$id = $_GET['id'] ?? '';

$stmt = db()->prepare('SELECT * FROM claims WHERE id = ? AND user_id = ?');
$stmt->execute([$id, $u['id']]);
$claim = $stmt->fetch();
if (!$claim) json_response(['error' => 'not_found'], 404);

$docs = db()->prepare(
    'SELECT id, doc_type, file_name, mime_type, size_bytes, created_at FROM claim_documents WHERE claim_id = ?'
);
$docs->execute([$id]);
$claim['documents'] = $docs->fetchAll();

json_response(['claim' => $claim]);
