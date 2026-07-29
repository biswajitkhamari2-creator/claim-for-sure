<?php
$host = '127.0.0.1';
$db   = 'claimforsure';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$db};charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    echo "DB CONNECTION: OK\n";
    $tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    if (empty($tables)) {
        echo "No tables found — running schema.sql...\n";
        $sql = file_get_contents(__DIR__ . '/../database/schema.sql');
        // Split on semicolons (simple approach for DDL)
        $statements = array_filter(array_map('trim', explode(';', $sql)));
        foreach ($statements as $stmt) {
            if (!empty($stmt)) {
                $pdo->exec($stmt);
            }
        }
        echo "Schema applied!\n";
        $tables = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    }
    echo "Tables: " . implode(', ', $tables) . "\n";
    echo "Table count: " . count($tables) . "\n";
} catch (PDOException $e) {
    echo "DB ERROR: " . $e->getMessage() . "\n";
    echo "Check MySQL is running and database 'claimforsure' exists.\n";
    echo "Run: CREATE DATABASE claimforsure CHARACTER SET utf8mb4;\n";
}
