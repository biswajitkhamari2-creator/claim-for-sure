<?php
require_once __DIR__ . '/../config/bootstrap.php';
try {
    $pdo = Database::getConnection();
    
    // Add columns to claims table to support frontend structure perfectly
    $columnsToAdd = [
        'claim_id' => 'VARCHAR(50) NULL UNIQUE',
        'full_name' => 'VARCHAR(150) NULL',
        'phone' => 'VARCHAR(15) NULL',
        'email' => 'VARCHAR(190) NULL',
        'city' => 'VARCHAR(100) NULL',
        'state' => 'VARCHAR(100) NULL',
        'insurance_type' => 'VARCHAR(100) NULL',
        'insurance_company' => 'VARCHAR(150) NULL',
        'rejection_date' => 'DATE NULL',
        'rejection_reason' => 'TEXT NULL',
        'documents' => 'JSON NULL',
        'payout_insurer_name' => 'VARCHAR(150) NULL',
        'declared_payout_paise' => 'BIGINT UNSIGNED NULL',
        'payout_declared_at' => 'TIMESTAMP NULL DEFAULT NULL',
        'payout_proof_path' => 'VARCHAR(255) NULL',
        'payout_verification_status' => "VARCHAR(50) NULL DEFAULT 'pending'",
        'success_fee_invoice_no' => 'VARCHAR(50) NULL'
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

    echo "Claims table altered successfully!\n";
} catch (Exception $e) {
    echo "Error altering claims table: " . $e->getMessage() . "\n";
}
