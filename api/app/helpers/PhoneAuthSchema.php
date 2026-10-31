<?php
declare(strict_types=1);

// Brings an existing MySQL database up to what phone OTP sign-in needs, the first time it is
// used. Same changes as database/alter_phone_auth.php, so nobody has to run that by hand.
// Only adds or widens: no table, column or row is ever dropped. Each step checks
// information_schema first, so after the first run this is a few cheap reads per cold start.
final class PhoneAuthSchema
{
    private static bool $checked = false;

    public static function ensure(PDO $db): void
    {
        if (self::$checked) return;
        self::$checked = true;
        if ($db->getAttribute(PDO::ATTR_DRIVER_NAME) !== 'mysql') return;

        $steps = [
            'create otps table' => function () use ($db) {
                $db->exec("CREATE TABLE IF NOT EXISTS otps (
                    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                    identifier VARCHAR(100) NOT NULL,
                    otp_code VARCHAR(255) NOT NULL,
                    expires_at TIMESTAMP NOT NULL,
                    verified TINYINT(1) NOT NULL DEFAULT 0,
                    attempts INT NOT NULL DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_identifier (identifier)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
            },
            'widen otps.otp_code' => function () use ($db) {
                $col = self::column($db, 'otps', 'otp_code');
                if ($col && (int)$col['CHARACTER_MAXIMUM_LENGTH'] < 255) {
                    $db->exec('ALTER TABLE otps MODIFY otp_code VARCHAR(255) NOT NULL');
                }
            },
            'add otps.attempts' => function () use ($db) {
                if (!self::column($db, 'otps', 'attempts')) {
                    $db->exec('ALTER TABLE otps ADD COLUMN attempts INT NOT NULL DEFAULT 0');
                }
            },
            'make users.email optional' => function () use ($db) {
                $col = self::column($db, 'users', 'email');
                if ($col && $col['IS_NULLABLE'] === 'NO') {
                    $db->exec('ALTER TABLE users MODIFY email ' . $col['COLUMN_TYPE'] . ' NULL');
                }
            },
            'add users.terms_accepted_at' => function () use ($db) {
                if (!self::column($db, 'users', 'terms_accepted_at')) {
                    $db->exec('ALTER TABLE users ADD COLUMN terms_accepted_at TIMESTAMP NULL DEFAULT NULL');
                }
            },
            'add users.agreement_version' => function () use ($db) {
                if (!self::column($db, 'users', 'agreement_version')) {
                    $db->exec('ALTER TABLE users ADD COLUMN agreement_version VARCHAR(10) NULL');
                }
            },
            'index users.phone' => function () use ($db) {
                $stmt = $db->prepare("SELECT 1 FROM information_schema.STATISTICS
                    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'phone' LIMIT 1");
                $stmt->execute();
                if (!$stmt->fetchColumn()) {
                    $db->exec('ALTER TABLE users ADD INDEX idx_phone (phone)');
                }
            },
        ];

        foreach ($steps as $name => $step) {
            try {
                $step();
            } catch (Throwable $e) {
                // Keep going: a later step may still succeed, and the request reports its own error.
                Logger::error('schema.phone_auth', ['step' => $name, 'error' => $e->getMessage()]);
            }
        }
    }

    private static function column(PDO $db, string $table, string $column): ?array
    {
        $stmt = $db->prepare('SELECT COLUMN_TYPE, IS_NULLABLE, CHARACTER_MAXIMUM_LENGTH FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1');
        $stmt->execute([$table, $column]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}
