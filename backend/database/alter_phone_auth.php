<?php
// Prepares the database for phone + OTP sign-in (OtpService).
// Safe to run more than once: php database/alter_phone_auth.php
require_once __DIR__ . '/../config/bootstrap.php';
try {
    $pdo = Database::getConnection();

    $pdo->exec("CREATE TABLE IF NOT EXISTS otps (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        identifier VARCHAR(100) NOT NULL,
        otp_code VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        verified TINYINT(1) NOT NULL DEFAULT 0,
        attempts INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_identifier (identifier)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
    echo "otps table ready.\n";

    // OTP codes are stored as password hashes, which need more than 10 characters.
    $pdo->exec("ALTER TABLE otps MODIFY otp_code VARCHAR(255) NOT NULL");
    if ($pdo->query("SHOW COLUMNS FROM otps LIKE 'attempts'")->rowCount() === 0) {
        $pdo->exec("ALTER TABLE otps ADD COLUMN attempts INT NOT NULL DEFAULT 0");
        echo "Added column attempts to otps table.\n";
    }

    // Customers who sign up by phone have no email address.
    $pdo->exec("ALTER TABLE users MODIFY email VARCHAR(190) NULL");
    echo "users.email is now optional.\n";

    $userColumns = [
        'terms_accepted_at' => 'TIMESTAMP NULL DEFAULT NULL',
        'agreement_version' => 'VARCHAR(10) NULL',
    ];
    foreach ($userColumns as $col => $definition) {
        if ($pdo->query("SHOW COLUMNS FROM users LIKE '$col'")->rowCount() === 0) {
            $pdo->exec("ALTER TABLE users ADD COLUMN $col $definition");
            echo "Added column $col to users table.\n";
        } else {
            echo "Column $col already exists in users table.\n";
        }
    }

    if ($pdo->query("SHOW INDEX FROM users WHERE Key_name = 'idx_phone'")->rowCount() === 0) {
        $pdo->exec("ALTER TABLE users ADD INDEX idx_phone (phone)");
        echo "Added index idx_phone to users table.\n";
    }

    // Sign-in looks a user up by phone; duplicates would make the oldest account win.
    $dupes = $pdo->query("SELECT phone, COUNT(*) AS n FROM users WHERE phone IS NOT NULL AND phone <> ''
        GROUP BY phone HAVING n > 1")->fetchAll();
    foreach ($dupes as $d) {
        echo "WARNING: phone {$d['phone']} is shared by {$d['n']} accounts; OTP sign-in will use the oldest one.\n";
    }

    echo "Phone OTP sign-in schema ready!\n";
} catch (Exception $e) {
    echo "Error preparing phone auth schema: " . $e->getMessage() . "\n";
}
