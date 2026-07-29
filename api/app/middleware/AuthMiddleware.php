<?php
declare(strict_types=1);
final class AuthMiddleware
{
    public static function authenticate(): array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
        if (empty($header) && function_exists('getallheaders')) {
            $headers = getallheaders();
            foreach ($headers as $k => $v) {
                if (strtolower($k) === 'authorization') {
                    $header = $v;
                    break;
                }
            }
        }
        if (!preg_match('/Bearer\s+(\S+)/i', $header, $m))
            Response::error('Missing authorization token', 401);
        $payload = Jwt::decode($m[1]);
        if ($payload === null) Response::error('Invalid or expired token', 401);
        return $payload;
    }
    public static function authorize(array $payload, array $roles): void
    {
        if (!in_array($payload['role'] ?? '', $roles, true))
            Response::error('Forbidden: insufficient permissions', 403);
    }
}