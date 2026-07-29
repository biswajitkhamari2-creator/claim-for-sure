<?php
declare(strict_types=1);
final class AdminService
{
    public function __construct(private PDO $db) {}

    public function dashboard(): array
    {
        $stats = [];
        $stats['total_users']    = (int)$this->db->query('SELECT COUNT(*) c FROM users')->fetch()['c'];
        $stats['total_claims']   = (int)$this->db->query('SELECT COUNT(*) c FROM claims')->fetch()['c'];
        $stats['open_claims']    = (int)$this->db->query(
            "SELECT COUNT(*) c FROM claims WHERE status NOT IN ('resolved','rejected','closed')")->fetch()['c'];
        $stats['resolved_claims']= (int)$this->db->query(
            "SELECT COUNT(*) c FROM claims WHERE status = 'resolved'")->fetch()['c'];
        $byStatus = $this->db->query(
            'SELECT status, COUNT(*) total FROM claims GROUP BY status')->fetchAll();
        $stats['claims_by_status'] = $byStatus;
        return $stats;
    }

    public function listUsers(int $page, ?string $search): array
    {
        $repo = new UserRepository($this->db);
        $limit = 20; $offset = max(0, ($page - 1) * $limit);
        return $repo->paginate($limit, $offset, $search);
    }

    public function toggleUserActive(int $userId, int $isActive): void
    {
        $s = $this->db->prepare('UPDATE users SET is_active = ? WHERE id = ?');
        $s->execute([$isActive ? 1 : 0, $userId]);
        Logger::audit('admin.user_toggle', ['user_id' => $userId, 'active' => $isActive]);
    }

    public function allClaims(int $page, ?string $status): array
    {
        $limit = 20; $offset = max(0, ($page - 1) * $limit);
        $sql = 'SELECT c.*, u.full_name, u.email FROM claims c JOIN users u ON u.id = c.user_id';
        $params = [];
        if ($status) { $sql .= ' WHERE c.status = ?'; $params[] = $status; }
        $sql .= ' ORDER BY c.id DESC LIMIT ? OFFSET ?';
        $s = $this->db->prepare($sql);
        foreach ($params as $i => $v) $s->bindValue($i + 1, $v);
        $s->bindValue(count($params) + 1, $limit, PDO::PARAM_INT);
        $s->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
        $s->execute();
        return $s->fetchAll();
    }
}
