<?php
require_once __DIR__ . '/../config/bootstrap.php';
try {
    $pdo = Database::getConnection();
    $sql = file_get_contents(__DIR__ . '/admin_schema.sql');
    $pdo->exec($sql);
    echo "Admin schema updates applied successfully!\n";
} catch (Exception $e) {
    echo "Error applying admin schema: " . $e->getMessage() . "\n";
}
