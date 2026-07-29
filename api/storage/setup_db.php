<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';

try {
    // Connect without specifying DB to create it
    $pdo = new PDO(
        "mysql:host={$host};charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    
    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `claimforsure` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database 'claimforsure' created/verified\n";
    
    // Switch to the database
    $pdo->exec("USE `claimforsure`");
    
    // Apply schema
    $sql = file_get_contents(__DIR__ . '/../database/schema.sql');
    
    // Execute each statement
    $statements = explode(';', $sql);
    $applied = 0;
    foreach ($statements as $stmt) {
        $stmt = trim($stmt);
        if (!empty($stmt)) {
            try {
                $pdo->exec($stmt);
                $applied++;
            } catch (PDOException $e) {
                echo "  Warning on statement: " . $e->getMessage() . "\n";
            }
        }
    }
    echo "Schema applied ({$applied} statements)\n";
    
    // Verify tables
    $tables = $pdo->query('SHOW TABLES FROM `claimforsure`')->fetchAll(PDO::FETCH_COLUMN);
    echo "Tables created: " . implode(', ', $tables) . "\n";
    echo "Table count: " . count($tables) . "\n";
    echo "\nDB SETUP: SUCCESS\n";
    
} catch (PDOException $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
