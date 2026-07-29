<?php
declare(strict_types=1);
define('APP_NAME', 'ClaimForSure');
define('APP_ROOT', dirname(__DIR__));
$isVercel = getenv('VERCEL') || getenv('NOW_BUILDER') || !is_writable(APP_ROOT);
define('UPLOAD_DIR', $isVercel ? '/tmp/uploads' : APP_ROOT . '/storage/uploads');
define('LOG_DIR', $isVercel ? '/tmp/logs' : APP_ROOT . '/storage/logs');
define('MAX_UPLOAD_SIZE', 5 * 1024 * 1024);
define('ALLOWED_MIME', [
    'application/pdf' => 'pdf',
    'image/jpeg'      => 'jpg',
    'image/jpg'       => 'jpg',
    'image/png'       => 'png',
    'image/webp'      => 'webp',
    'application/zip' => 'zip',
]);
define('JWT_TTL', 3600);