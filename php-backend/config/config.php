<?php
declare(strict_types=1);

// Tiny .env loader (no Composer required)
(function (): void {
    $path = __DIR__ . '/../.env';
    if (!is_file($path)) return;
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$k, $v] = array_map('trim', explode('=', $line, 2));
        $v = trim($v, "\"'");
        if (getenv($k) === false) {
            putenv("$k=$v");
            $_ENV[$k] = $v;
        }
    }
})();

function env(string $key, ?string $default = null): ?string {
    $v = getenv($key);
    return ($v === false || $v === '') ? $default : $v;
}

define('APP_ENV',        env('APP_ENV', 'production'));
define('APP_URL',        env('APP_URL', ''));
define('FRONTEND_URL',   env('FRONTEND_URL', ''));
define('JWT_SECRET',     env('JWT_SECRET', ''));
define('JWT_TTL',        (int) env('JWT_TTL_SECONDS', '86400'));
define('UPLOAD_DIR',     rtrim(env('UPLOAD_DIR', __DIR__ . '/../uploads'), '/'));
define('MAX_UPLOAD',     (int) env('MAX_UPLOAD_BYTES', '10485760'));
define('ALLOWED_EXTS',   array_map('strtolower', explode(',', env('ALLOWED_UPLOAD_EXTS', 'pdf,jpg,jpeg,png'))));
define('CORS_ORIGINS',   array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', '*'))));

if (APP_ENV === 'production') {
    ini_set('display_errors', '0');
    error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
} else {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
}
