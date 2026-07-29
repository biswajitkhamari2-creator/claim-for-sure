<?php
declare(strict_types=1);
final class DocumentRepository
{
    public function __construct(private PDO $db) {}
    public function create(array $d): int
    {
        $s = $this->db->prepare('INSERT INTO documents (claim_id, uploaded_by, original_name, stored_name, mime_type, file_size, is_private)
            VALUES (?, ?, ?, ?, ?, ?, ?)');
        $s->execute([$d['claim_id'], $d['uploaded_by'], $d['original_name'], $d['stored_name'], $d['mime_type'], $d['file_size'], $d['is_private']]);
        return (int)$this->db->lastInsertId();
    }
    public function findById(int $id): ?array
    {
        $s = $this->db->prepare('SELECT * FROM documents WHERE id = ? LIMIT 1');
        $s->execute([$id]);
        return $s->fetch() ?: null;
    }
    public function forClaim(int $claimId): array
    {
        $s = $this->db->prepare('SELECT * FROM documents WHERE claim_id = ? ORDER BY id DESC');
        $s->execute([$claimId]);
        return $s->fetchAll();
    }
    public function delete(int $id): void
    {
        $s = $this->db->prepare('DELETE FROM documents WHERE id = ?');
        $s->execute([$id]);
    }
}