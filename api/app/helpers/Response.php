<?php
declare(strict_types=1);
final class Response
{
    public static function json(array $data, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('Referrer-Policy: strict-origin-when-cross-origin');
        header('X-XSS-Protection: 1; mode=block');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
    public static function success(mixed $data = null, string $msg = 'OK', int $code = 200): never
    {
        self::json(['success' => true, 'message' => $msg, 'data' => $data], $code);
    }
    public static function error(string $msg, int $code = 400, array $errors = []): never
    {
        self::json(['success' => false, 'message' => $msg, 'errors' => $errors], $code);
    }
}