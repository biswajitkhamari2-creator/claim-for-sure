<?php
$hosts = ['127.0.0.1', 'localhost'];
foreach ($hosts as $host) {
    try {
        $pdo = new PDO("mysql:host=$host;dbname=claimforsure;charset=utf8mb4", 'root', '');
        echo "✓ Connected to MySQL at $host\n";
    } catch (Exception $e) {
        echo "✗ Failed at $host: " . $e->getMessage() . "\n";
    }
}
