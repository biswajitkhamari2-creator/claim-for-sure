<?php
require_once __DIR__ . '/../config/bootstrap.php';
try {
    $pdo = Database::getConnection();
    $sql = file_get_contents(__DIR__ . '/schema_leads.sql');
    $pdo->exec($sql);
    echo "Leads schema updates applied successfully!\n";
} catch (Exception $e) {
    echo "Error applying leads schema: " . $e->getMessage() . "\n";
}
