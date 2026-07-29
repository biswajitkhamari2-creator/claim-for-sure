<?php
declare(strict_types=1);
/**
 * CSRF protection for cookie/session based browser forms.
 * NOTE: Pure JWT Bearer APIs are not CSRF-vulnerable (no ambient credentials),
 * but this is provided for the admin panel forms / session flows.
 */
final class Csrf
{
    public static function start(): void
    {
        if (session_status() !== PHP_SESSION_ACTIVE) {
            session_start([
                'cookie_httponly' => true,
                'cookie_samesite' => 'Strict',
                'cookie_secure'   => (($_SERVER['HTTPS'] ?? '') === 'on'),
            ]);
        }
    }
    public static function token(): string
    {
        self::start();
        if (empty($_SESSION['csrf'])) {
            $_SESSION['csrf'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf'];
    }
    public static function verify(?string $token): void
    {
        self::start();
        if (empty($_SESSION['csrf']) || !is_string($token) || !hash_equals($_SESSION['csrf'], $token)) {
            Response::error('Invalid CSRF token', 419);
        }
    }
}
