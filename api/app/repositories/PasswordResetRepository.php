<?php
declare(strict_types=1);
final class PasswordResetRepository
{
    public function __construct(private PDO $db) {}

    public function create(int $userId, string $tokenHash, string $expiresAt): void
    {
        $s = $this->db->prepare(
            'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
        );
        $s->execute([$userId, $tokenHash, $expiresAt]);
    }

    public function findValid(string $tokenHash): ?array
    {
        $s = $this->db->prepare(
            'SELECT * FROM password_resets
             WHERE token_hash = ? AND used = 0 AND expires_at > NOW() LIMIT 1'
        );
        $s->execute([$tokenHash]);
        return $s->fetch() ?: null;
    }

    public function markUsed(int $id): void
    {
        $s = $this->db->prepare('UPDATE password_resets SET used = 1 WHERE id = ?');
        $s->execute([$id]);
    }

    public function invalidateForUser(int $userId): void
    {
        $s = $this->db->prepare('UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0');
        $s->execute([$userId]);
    }
}
