<?php
declare(strict_types=1);
final class UserRepository
{
    public function __construct(private PDO $db) {}
    public function findByEmail(string $email): ?array
    {
        $s = $this->db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $s->execute([$email]);
        $row = $s->fetch();
        return $row === false ? null : $row;
    }
    public function findById(int $id): ?array
    {
        $s = $this->db->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
        $s->execute([$id]);
        return $s->fetch() ?: null;
    }
    public function create(array $u): int
    {
        $s = $this->db->prepare('INSERT INTO users (uuid, full_name, email, phone, password_hash, role)
            VALUES (?, ?, ?, ?, ?, ?)');
        $s->execute([$u['uuid'], $u['full_name'], $u['email'], $u['phone'], $u['password_hash'], $u['role']]);
        return (int)$this->db->lastInsertId();
    }
    public function paginate(int $limit, int $offset, ?string $search = null): array
    {
        $sql = 'SELECT id, uuid, full_name, email, phone, role, is_active, created_at FROM users';
        $params = [];
        if ($search) { $sql .= ' WHERE full_name LIKE ? OR email LIKE ?'; $params[] = "%{$search}%"; $params[] = "%{$search}%"; }
        $sql .= ' ORDER BY id DESC LIMIT ? OFFSET ?';
        $s = $this->db->prepare($sql);
        foreach ($params as $i => $v) $s->bindValue($i + 1, $v);
        $s->bindValue(count($params) + 1, $limit, PDO::PARAM_INT);
        $s->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
        $s->execute();
        return $s->fetchAll();
    }
}