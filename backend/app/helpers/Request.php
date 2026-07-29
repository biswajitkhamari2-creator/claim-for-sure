<?php
declare(strict_types=1);
final class Request
{
    public static function body(): array
    {
        $raw = file_get_contents('php://input');
        if (!empty($raw)) {
            $data = json_decode($raw, true);
            if (is_array($data)) return $data;
        }
        return $_POST ?: [];
    }
    public static function clientIp(): string
    {
        return $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
    public static function userAgent(): string
    {
        return substr($_SERVER['HTTP_USER_AGENT'] ?? 'unknown', 0, 255);
    }
}