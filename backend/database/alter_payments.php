<?php
// Adds the claim payment columns used by PaymentService (verify_claim_payment RPC).
// Safe to run more than once: php database/alter_payments.php
require_once __DIR__ . '/../config/bootstrap.php';
try {
    $pdo = Database::getConnection();

    $columnsToAdd = [
        'payment_status' => "VARCHAR(20) NULL DEFAULT 'pending'",
        'payment_id' => 'VARCHAR(100) NULL',
        'payment_paid_at' => 'TIMESTAMP NULL DEFAULT NULL',
        'payment_amount_paise' => 'BIGINT UNSIGNED NULL',
        'promo_code_applied' => 'VARCHAR(50) NULL',
        'discount_paise' => 'BIGINT UNSIGNED NOT NULL DEFAULT 0',
    ];

    foreach ($columnsToAdd as $col => $definition) {
        // Check if column exists
        $stmt = $pdo->query("SHOW COLUMNS FROM claims LIKE '$col'");
        if ($stmt->rowCount() === 0) {
            $pdo->exec("ALTER TABLE claims ADD COLUMN $col $definition");
            echo "Added column $col to claims table.\n";
        } else {
            echo "Column $col already exists in claims table.\n";
        }
    }

    echo "Claims payment columns ready!\n";
} catch (Exception $e) {
    echo "Error altering claims table: " . $e->getMessage() . "\n";
}
