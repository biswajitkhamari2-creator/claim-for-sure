<?php
// CLI: php scripts/create_admin.php admin@example.com 'StrongPass1!' 'Admin Name'
declare(strict_types=1);
require_once __DIR__ . '/../lib/helpers.php';
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../lib/db.php';

[$_, $email, $password, $name] = array_pad($argv, 4, null);
if (!$email || !$password) { fwrite(STDERR, "Usage: php create_admin.php <email> <password> [name]\n"); exit(1); }

$pdo  = db();
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([strtolower($email)]);
$u = $stmt->fetch();

if ($u) {
    $userId = $u['id'];
    $pdo->prepare('UPDATE users SET password_hash = ?, email_verified = 1 WHERE id = ?')
        ->execute([password_hash($password, PASSWORD_BCRYPT), $userId]);
} else {
    $userId = uuid();
    $pdo->prepare('INSERT INTO users (id,email,password_hash,full_name,email_verified) VALUES (?,?,?,?,1)')
        ->execute([$userId, strtolower($email), password_hash($password, PASSWORD_BCRYPT), $name ?? 'Admin']);
}

$pdo->prepare('INSERT IGNORE INTO admins (id,user_id,role) VALUES (?,?, "superadmin")')
    ->execute([uuid(), $userId]);

echo "Admin ready: $email\n";
