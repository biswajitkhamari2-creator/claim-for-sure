<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/config/bootstrap.php';

// ── CORS — allow any origin (Vite, local dev, Vercel, Rocket web preview) ──────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// Handle preflight OPTIONS request — return 200 immediately
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

RateLimitMiddleware::check('global:' . Request::clientIp(), 120, 60);

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rtrim($uri, '/') ?: '/';

$routes = require dirname(__DIR__) . '/routes/api.php';
$adminRoutesFile = dirname(__DIR__) . '/routes/admin.php';
if (file_exists($adminRoutesFile)) {
    $routes = array_merge($routes, require $adminRoutesFile);
}

foreach ($routes as $pattern => $handler) {
    [$rMethod, $rPath] = preg_split('/\s+/', trim($pattern));
    if (strtoupper($rMethod) !== $method) continue;
    $regex = '#^' . preg_replace('#\{[a-z]+\}#', '(\d+)', $rPath) . '$#';
    if (preg_match($regex, $uri, $matches)) {
        array_shift($matches);
        [$class, $fn] = $handler;
        (new $class())->$fn(...array_map('intval', $matches));
        exit;
    }
}
Response::error('Route not found', 404);