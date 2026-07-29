<?php
/**
 * ClaimForSure API Route Tester
 * Tests all endpoints and reports status
 */

$base = 'http://localhost:8000';
$results = [];

function apiCall(string $method, string $path, array $body = [], string $token = ''): array {
    global $base;
    $url = $base . $path;
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_HTTPHEADER     => array_filter([
            'Content-Type: application/json',
            'Accept: application/json',
            $token ? "Authorization: Bearer {$token}" : null,
        ]),
        CURLOPT_POSTFIELDS     => $body ? json_encode($body) : null,
        CURLOPT_TIMEOUT        => 5,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);
    return [
        'code'     => $httpCode,
        'body'     => $response ? json_decode($response, true) : null,
        'raw'      => $response,
        'error'    => $error,
    ];
}

echo "=================================================\n";
echo " ClaimForSure API Route Test Suite\n";
echo "=================================================\n\n";

$pass = 0; $fail = 0;

function test(string $name, string $method, string $path, array $body = [], string $token = '', int $expectCode = 200): void {
    global $pass, $fail;
    $r = apiCall($method, $path, $body, $token);
    $ok = ($r['code'] === $expectCode);
    $status = $ok ? '[PASS]' : '[FAIL]';
    $msg = $r['body']['message'] ?? ($r['body']['error'] ?? $r['raw']);
    printf("%s %-45s HTTP %d (expected %d) | %s\n", $status, "{$method} {$path}", $r['code'], $expectCode, substr((string)$msg, 0, 60));
    if ($ok) $pass++; else $fail++;
}

// --- Route: 404 for unknown ---
test('Unknown Route 404', 'GET', '/api/unknown-route', [], '', 404);

// --- Auth: Register ---
$uniqueEmail = 'test_' . time() . '@example.com';
$regResult = apiCall('POST', '/api/auth/register', [
    'full_name' => 'Test User',
    'email'     => $uniqueEmail,
    'password'  => 'Password123',
    'phone'     => '9876543210',
]);
$ok = ($regResult['code'] === 201);
printf("%s %-45s HTTP %d | %s\n", $ok ? '[PASS]' : '[FAIL]', 'POST /api/auth/register', $regResult['code'], substr((string)($regResult['body']['message'] ?? $regResult['raw']), 0, 60));
if ($ok) $pass++; else $fail++;

// --- Auth: Login ---
$loginResult = apiCall('POST', '/api/auth/login', [
    'email'    => $uniqueEmail,
    'password' => 'Password123',
]);
$ok = ($loginResult['code'] === 200);
printf("%s %-45s HTTP %d | %s\n", $ok ? '[PASS]' : '[FAIL]', 'POST /api/auth/login', $loginResult['code'], substr((string)($loginResult['body']['message'] ?? $loginResult['raw']), 0, 60));
if ($ok) $pass++; else $fail++;

$token = $loginResult['body']['data']['token'] ?? '';
echo "  Token: " . ($token ? substr($token, 0, 30) . '...' : 'NOT OBTAINED') . "\n\n";

// --- Auth: Me ---
test('GET /api/auth/me', 'GET', '/api/auth/me', [], $token, 200);

// --- Auth: Forgot Password ---
test('POST /api/auth/forgot-password', 'POST', '/api/auth/forgot-password', ['email' => $uniqueEmail], '', 200);

// --- Auth: Reset Password (bad token) ---
test('POST /api/auth/reset-password (bad token)', 'POST', '/api/auth/reset-password', ['token' => 'bad_token', 'password' => 'NewPassword123'], '', 400);

// --- Auth: No token should be 401 ---
test('GET /api/auth/me (no auth)', 'GET', '/api/auth/me', [], '', 401);

// --- Claims: Create ---
$claimResult = apiCall('POST', '/api/claims', [
    'title'       => 'Test Health Claim',
    'description' => 'Testing claim creation via API test',
    'category'    => 'health',
    'insurer_name'=> 'Test Insurance Co',
    'policy_number'=> 'POL-12345',
    'claim_amount' => 50000,
], $token);
$ok = ($claimResult['code'] === 201);
printf("%s %-45s HTTP %d | %s\n", $ok ? '[PASS]' : '[FAIL]', 'POST /api/claims', $claimResult['code'], substr((string)($claimResult['body']['message'] ?? $claimResult['raw']), 0, 60));
if ($ok) $pass++; else $fail++;
$claimId = $claimResult['body']['data']['id'] ?? null;

// --- Claims: List ---
test('GET /api/claims', 'GET', '/api/claims', [], $token, 200);

// --- Claims: View ---
if ($claimId) {
    test("GET /api/claims/{id}", 'GET', "/api/claims/{$claimId}", [], $token, 200);
}

// --- Claims: No auth ---
test('GET /api/claims (no auth)', 'GET', '/api/claims', [], '', 401);

// --- Admin: Dashboard (non-admin should be 403) ---
test('GET /api/admin/dashboard (customer=403)', 'GET', '/api/admin/dashboard', [], $token, 403);
test('GET /api/admin/users (customer=403)', 'GET', '/api/admin/users', [], $token, 403);
test('GET /api/admin/claims (customer=403)', 'GET', '/api/admin/claims', [], $token, 403);

// --- Admin: No auth ---
test('GET /api/admin/dashboard (no auth=401)', 'GET', '/api/admin/dashboard', [], '', 401);

echo "\n=================================================\n";
echo " Results: {$pass} PASSED, {$fail} FAILED\n";
echo "=================================================\n";
if ($fail === 0) {
    echo " ALL TESTS PASSED! Backend is fully operational.\n";
} else {
    echo " Some tests failed. Check above output.\n";
}
echo "=================================================\n";
