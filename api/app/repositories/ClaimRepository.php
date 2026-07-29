<?php
declare(strict_types=1);
final class ClaimRepository
{
    public function __construct(private PDO $db) {}
    public function create(array $c): int
    {
        $s = $this->db->prepare('INSERT INTO claims (claim_number, user_id, title, description, category,
            insurer_name, policy_number, claim_amount, priority) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $s->execute([$c['claim_number'], $c['user_id'], $c['title'], $c['description'], $c['category'],
            $c['insurer_name'], $c['policy_number'], $c['claim_amount'], $c['priority']]);
        return (int)$this->db->lastInsertId();
    }
    public function findById(int $id): ?array
    {
        $s = $this->db->prepare('SELECT * FROM claims WHERE id = ? LIMIT 1');
        $s->execute([$id]);
        return $s->fetch() ?: null;
    }
    public function updateStatus(int $id, string $status): void
    {
        $s = $this->db->prepare('UPDATE claims SET status = ? WHERE id = ?');
        $s->execute([$status, $id]);
    }
    public function delete(int $id): void
    {
        $s = $this->db->prepare('DELETE FROM claims WHERE id = ?');
        $s->execute([$id]);
    }
    public function forUser(int $userId, int $limit, int $offset, ?string $status = null): array
    {
        $sql = 'SELECT * FROM claims WHERE user_id = ?';
        $params = [$userId];
        if ($status) { $sql .= ' AND status = ?'; $params[] = $status; }
        $sql .= ' ORDER BY id DESC LIMIT ? OFFSET ?';
        $s = $this->db->prepare($sql);
        foreach ($params as $i => $v) $s->bindValue($i + 1, $v);
        $s->bindValue(count($params) + 1, $limit, PDO::PARAM_INT);
        $s->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
        $s->execute();
        return $s->fetchAll();
    }
    public function addTimeline(int $claimId, ?int $actorId, string $event, ?string $old, ?string $new, ?string $note): void
    {
        $s = $this->db->prepare('INSERT INTO claim_timeline (claim_id, actor_id, event_type, old_status, new_status, note)
            VALUES (?, ?, ?, ?, ?, ?)');
        $s->execute([$claimId, $actorId, $event, $old, $new, $note]);
    }
    public function timeline(int $claimId): array
    {
        $s = $this->db->prepare('SELECT * FROM claim_timeline WHERE claim_id = ? ORDER BY id ASC');
        $s->execute([$claimId]);
        return $s->fetchAll();
    }
}