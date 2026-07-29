<?php
declare(strict_types=1);
final class DocumentService
{
    private DocumentRepository $docs;
    private ClaimRepository $claims;
    public function __construct(private PDO $db)
    {
        $this->docs = new DocumentRepository($db);
        $this->claims = new ClaimRepository($db);
    }
    public function upload(array $actor, int $claimId, array $file): array
    {
        $claim = $this->claims->findById($claimId);
        if (!$claim) Response::error('Claim not found', 404);
        if ($actor['role'] === 'customer' && (int)$claim['user_id'] !== (int)$actor['sub']) Response::error('Forbidden', 403);
        if (!isset($file['error']) || is_array($file['error'])) Response::error('Invalid upload', 422);
        if ($file['error'] !== UPLOAD_ERR_OK) Response::error('Upload failed code ' . $file['error'], 422);
        if ($file['size'] > MAX_UPLOAD_SIZE) Response::error('File exceeds max size of 5MB', 422);
        $mime = $file['type'] ?? 'application/octet-stream';
        if (class_exists('finfo')) {
            try {
                $finfo = new finfo(FILEINFO_MIME_TYPE);
                $detected = $finfo->file($file['tmp_name']);
                if ($detected) {
                    $mime = $detected;
                }
            } catch (Exception $e) {
                // Ignore finfo errors and use fallback
            }
        }
        if (!isset(ALLOWED_MIME[$mime])) {
            Response::error('File type not allowed: ' . $mime, 422);
        }
        $ext = ALLOWED_MIME[$mime];
        $storedName = bin2hex(random_bytes(16)) . '.' . $ext;
        $targetDir = UPLOAD_DIR . '/' . $claimId;
        if (!is_dir($targetDir)) { @mkdir($targetDir, 0755, true); }
        $targetPath = $targetDir . '/' . $storedName;
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) Response::error('Could not store file', 500);
        $id = $this->docs->create([
            'claim_id' => $claimId, 'uploaded_by' => (int)$actor['sub'],
            'original_name' => substr(basename($file['name']), 0, 255), 'stored_name' => $storedName,
            'mime_type' => $mime, 'file_size' => (int)$file['size'], 'is_private' => 1,
        ]);
        Logger::audit('document.upload', ['doc_id' => $id, 'claim_id' => $claimId, 'by' => $actor['sub']]);
        return ['id' => $id, 'name' => $file['name'], 'stored_name' => $storedName];
    }
    public function download(array $actor, int $docId): never
    {
        $doc = $this->docs->findById($docId);
        if (!$doc) Response::error('Document not found', 404);
        $claim = $this->claims->findById((int)$doc['claim_id']);
        if ($actor['role'] === 'customer' && (int)$claim['user_id'] !== (int)$actor['sub']) Response::error('Forbidden', 403);
        $path = UPLOAD_DIR . '/' . $doc['claim_id'] . '/' . $doc['stored_name'];
        $real = realpath($path);
        if ($real === false || !str_starts_with($real, realpath(UPLOAD_DIR))) Response::error('File not found', 404);
        Logger::audit('document.download', ['doc_id' => $docId, 'by' => $actor['sub']]);
        header('Content-Type: ' . $doc['mime_type']);
        header('Content-Disposition: attachment; filename="' . basename($doc['original_name']) . '"');
        header('Content-Length: ' . filesize($real));
        header('X-Content-Type-Options: nosniff');
        readfile($real);
        exit;
    }
    public function listForClaim(array $actor, int $claimId): array
    {
        $claim = $this->claims->findById($claimId);
        if (!$claim) Response::error('Claim not found', 404);
        if ($actor['role'] === 'customer' && (int)$claim['user_id'] !== (int)$actor['sub']) Response::error('Forbidden', 403);
        return $this->docs->forClaim($claimId);
    }
    public function delete(array $actor, int $docId): void
    {
        $doc = $this->docs->findById($docId);
        if (!$doc) Response::error('Document not found', 404);
        $claim = $this->claims->findById((int)$doc['claim_id']);
        if ($actor['role'] === 'customer' && (int)$claim['user_id'] !== (int)$actor['sub']) Response::error('Forbidden', 403);
        $path = UPLOAD_DIR . '/' . $doc['claim_id'] . '/' . $doc['stored_name'];
        if (is_file($path)) @unlink($path);
        $this->docs->delete($docId);
        Logger::audit('document.delete', ['doc_id' => $docId, 'by' => $actor['sub']]);
    }
}