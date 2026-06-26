<?php
// Front controller for pretty URLs like /api/auth/login
declare(strict_types=1);

require_once __DIR__ . '/../lib/helpers.php';
bootstrap();

$uri  = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$path = trim(preg_replace('#^/api/?#', '', $uri), '/');

$routes = [
    'auth/signup'          => 'auth/signup.php',
    'auth/login'           => 'auth/login.php',
    'auth/logout'          => 'auth/logout.php',
    'auth/me'              => 'auth/me.php',
    'auth/forgot'          => 'auth/forgot.php',
    'auth/reset'           => 'auth/reset.php',
    'auth/verify'          => 'auth/verify.php',
    'auth/resend-verify'   => 'auth/resend_verify.php',
    'profile'              => 'profile/index.php',
    'claims'               => 'claims/index.php',
    'claims/upload'        => 'claims/upload.php',
    'admin/claims'         => 'admin/claims.php',
    'admin/users'          => 'admin/users.php',
    'admin/stats'          => 'admin/stats.php',
];

// /api/claims/{id}
if (preg_match('#^claims/([0-9a-f-]{36})$#', $path, $m)) {
    $_GET['id'] = $m[1];
    require __DIR__ . '/../api/claims/show.php';
    exit;
}
if (preg_match('#^admin/claims/([0-9a-f-]{36})$#', $path, $m)) {
    $_GET['id'] = $m[1];
    require __DIR__ . '/../api/admin/claim_update.php';
    exit;
}

if (isset($routes[$path])) {
    require __DIR__ . '/../api/' . $routes[$path];
    exit;
}

json_response(['error' => 'not_found', 'path' => $path], 404);
