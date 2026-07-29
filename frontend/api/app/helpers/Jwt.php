<?php
declare(strict_types=1);
final class Jwt
{
    private static function b64(string $d): string { return rtrim(strtr(base64_encode($d), '+/', '-_'), '='); }
    private static function b64d(string $d): string { return base64_decode(strtr($d, '-_', '+/')); }
    private static function getSecret(): string
    {
        $secret = $_ENV['JWT_SECRET'] ?? $_SERVER['JWT_SECRET'] ?? getenv('JWT_SECRET') ?? '';
        if ($secret === '') {
            return 'claimforsure_default_jwt_secret_key_2026_super_secure';
        }
        return $secret;
    }
    public static function encode(array $payload, int $ttl = JWT_TTL): string
    {
        $secret = self::getSecret();
        $header = self::b64(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
        $now = time();
        $payload['iat'] = $now; $payload['exp'] = $now + $ttl;
        $body = self::b64(json_encode($payload));
        $sig = self::b64(hash_hmac('sha256', "{$header}.{$body}", $secret, true));
        return "{$header}.{$body}.{$sig}";
    }
    public static function decode(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;
        [$h, $b, $s] = $parts;
        try {
            $secret = self::getSecret();
        } catch (RuntimeException $e) {
            return null;
        }
        $expected = self::b64(hash_hmac('sha256', "{$h}.{$b}", $secret, true));
        if (!hash_equals($expected, $s)) return null;
        $payload = json_decode(self::b64d($b), true);
        if (!is_array($payload) || ($payload['exp'] ?? 0) < time()) return null;
        return $payload;
    }
}