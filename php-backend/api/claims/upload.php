<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('POST');
$u = require_user();

$claimId = $_POST['claim_id']      ?? '';
$docType = $_POST['doc_type']      ?? 'other';
if (!in_array($docType, ['policy','hospital','other'], true)) $docType = 'other';

$stmt = db()->prepare('SELECT id FROM claims WHERE id = ? AND user_id = ?');
$stmt->execute([$claimId, $u['id']]);
if (!$stmt->fetch()) json_response(['error' => 'claim_not_found'], 404);

if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    json_response(['error' => 'upload_failed'], 400);
}
$f = $_FILES['file'];
if ($f['size'] > MAX_UPLOAD) json_response(['error' => 'file_too_large'], 413);

$ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
if (!in_array($ext, ALLOWED_EXTS, true)) json_response(['error' => 'bad_extension'], 415);

$dir = UPLOAD_DIR . '/' . $u['id'] . '/' . $claimId;
if (!is_dir($dir) && !mkdir($dir, 0775, true)) json_response(['error' => 'mkdir_failed'], 500);

$storedName = uuid() . '.' . $ext;
$dest       = $dir . '/' . $storedName;
if (!move_uploaded_file($f['tmp_name'], $dest)) json_response(['error' => 'move_failed'], 500);

$id   = uuid();
$rel  = $u['id'] . '/' . $claimId . '/' . $storedName;
$mime = mime_content_type($dest) ?: 'application/octet-stream';

db()->prepare(
    'INSERT INTO claim_documents (id,claim_id,user_id,doc_type,file_name,stored_path,mime_type,size_bytes)
     VALUES (?,?,?,?,?,?,?,?)'
)->execute([$id, $claimId, $u['id'], $docType, $f['name'], $rel, $mime, (int)$f['size']]);

log_activity($u['id'], 'document_uploaded', ['claim_id' => $claimId, 'doc_id' => $id]);
json_response(['id' => $id, 'path' => $rel], 201);
