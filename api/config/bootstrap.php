<?php
declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');

$envPath = dirname(__DIR__) . '/.env';
if (file_exists($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$k, $v] = array_map('trim', explode('=', $line, 2));
        $_ENV[$k] = $v; putenv("{$k}={$v}");
    }
}
require_once __DIR__ . '/constants.php';

spl_autoload_register(function (string $class): void {
    $paths = [
        __DIR__ . '/',
        APP_ROOT . '/app/helpers/',
        APP_ROOT . '/app/services/',
        APP_ROOT . '/app/repositories/',
        APP_ROOT . '/app/models/',
        APP_ROOT . '/app/middleware/',
        APP_ROOT . '/app/controllers/',
        APP_ROOT . '/app/admin/',
    ];
    foreach ($paths as $p) {
        $f = $p . $class . '.php';
        if (file_exists($f)) { require_once $f; return; }
    }
});

if (file_exists(APP_ROOT . '/vendor/autoload.php')) {
    require_once APP_ROOT . '/vendor/autoload.php';
}

set_error_handler(function (int $severity, string $message, string $file, int $line): void {
    if (!(error_reporting() & $severity)) {
        return;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(function (Throwable $e): void {
    Logger::error($e->getMessage(), ['trace' => $e->getTraceAsString()]);
    Response::error($e->getMessage(), 500);
});

register_shutdown_function(function (): void {
    $error = error_get_last();
    if ($error !== null && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        Logger::error($error['message'], ['file' => $error['file'], 'line' => $error['line']]);
        while (ob_get_level() > 0) {
            ob_end_clean();
        }
        Response::error($error['message'], 500);
    }
});