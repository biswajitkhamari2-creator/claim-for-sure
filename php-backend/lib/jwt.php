<?php
declare(strict_types=1);

// Minimal HS256 JWT (no dependencies)

function b64url_encode(string $s): string {
    return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
}
function b64url_decode(string $s): string {
    return base64_decode(strtr($s, '-_', '+/') . str_repeat('=', (4 - strlen($s) % 4) % 4));
}

function jwt_encode(array $payload, ?int $ttl = null): string {
    $ttl  = $ttl ?? JWT_TTL;
    $now  = time();
    $body = array_merge(['iat' => $now, 'exp' => $now + $ttl, 'iss' => env('JWT_ISSUER', 'app')], $payload);
    $h    = b64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $p    = b64url_encode(json_encode($body));
    $sig  = b64url_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    return "$h.$p.$sig";
}

function jwt_decode(string $token): ?array {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;
    [$h, $p, $s] = $parts;
    $expected = b64url_encode(hash_hmac('sha256', "$h.$p", JWT_SECRET, true));
    if (!hash_equals($expected, $s)) return null;
    $payload = json_decode(b64url_decode($p), true);
    if (!is_array($payload)) return null;
    if (($payload['exp'] ?? 0) < time()) return null;
    return $payload;
}
