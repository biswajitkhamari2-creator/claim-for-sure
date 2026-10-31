<?php
declare(strict_types=1);

// Customer sign-in / sign-up with a mobile number. The MSG91 OTP widget sends and checks
// the SMS code in the browser and hands back an access token:
//   verify()   → confirms that token with MSG91 (server-side, secret auth key) and checks it
//                was issued for this number; returns a session for known numbers, or a
//                short-lived signup token for new ones
//   complete() → creates the account for a new number (name + agreement acceptance)
final class OtpService
{
    private const SIGNUP_TOKEN_TTL = 900;
    private const AGREEMENT_VERSION = '1.0';
    private const MSG91_VERIFY_URL = 'https://control.msg91.com/api/v5/widget/verifyAccessToken';
    // Only accepted when the server runs with OTP_TEST_MODE=1 (local / staging).
    private const TEST_ACCESS_TOKEN = 'test-mode-token';

    public function __construct(private PDO $db)
    {
        PhoneAuthSchema::ensure($db);
    }

    private static function env(string $key): string
    {
        $v = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
        return is_string($v) ? $v : '';
    }

    // Accepts "9876543210", "+91 98765 43210", "919876543210"; returns the 10-digit number.
    private static function phone(mixed $raw): string
    {
        $digits = preg_replace('/\D/', '', (string)$raw);
        if (strlen($digits) === 12 && str_starts_with($digits, '91')) {
            $digits = substr($digits, 2);
        }
        if (!preg_match('/^[6-9]\d{9}$/', $digits)) {
            Response::error('Enter a valid 10-digit Indian mobile number', 422);
        }
        return $digits;
    }

    public function verify(array $in): array
    {
        $phone = self::phone($in['phone'] ?? '');
        $token = trim((string)($in['access_token'] ?? ''));
        RateLimitMiddleware::check('otp-verify-ip:' . Request::clientIp(), 30, 3600);
        if ($token === '' || strlen($token) > 2048) {
            Response::error('OTP verification failed. Please try again.', 400);
        }

        if (!(self::env('OTP_TEST_MODE') === '1' && $token === self::TEST_ACCESS_TOKEN)) {
            $this->assertTokenUnused($token);
            $this->confirmWithMsg91($token, $phone);
            // Remember the token so it cannot be replayed.
            $this->db->prepare('INSERT INTO otps (identifier, otp_code, expires_at, verified, attempts) VALUES (?, ?, ?, 1, 0)')
                ->execute([$phone, hash('sha256', $token), date('Y-m-d H:i:s')]);
        }
        Logger::audit('otp.verified', ['phone' => $phone, 'ip' => Request::clientIp()]);

        $user = $this->findUserByPhone($phone);
        if ($user) {
            return $this->session($user);
        }
        return [
            'new_user' => true,
            'signup_token' => Jwt::encode(['purpose' => 'phone_signup', 'phone' => $phone], self::SIGNUP_TOKEN_TTL),
        ];
    }

    public function complete(array $in): array
    {
        $payload = Jwt::decode((string)($in['signup_token'] ?? ''));
        if (!$payload || ($payload['purpose'] ?? '') !== 'phone_signup' || empty($payload['phone'])) {
            Response::error('Verification expired. Please request a new OTP.', 401);
        }
        $phone = self::phone($payload['phone']);

        $name = trim((string)($in['full_name'] ?? ''));
        if (strlen($name) < 2 || strlen($name) > 150) {
            Response::error('Enter your full name', 422);
        }
        if (empty($in['accept_terms']) || empty($in['accept_agreement'])) {
            Response::error('Please accept the Privacy Policy and the Service Agreement', 422);
        }

        // Double submit, or the number was registered meanwhile: just sign in.
        $existing = $this->findUserByPhone($phone);
        if ($existing) {
            return $this->session($existing);
        }

        $this->db->prepare("INSERT INTO users (uuid, full_name, email, phone, password_hash, role, terms_accepted_at, agreement_version)
            VALUES (?, ?, NULL, ?, '!otp-only', 'customer', ?, ?)")
            ->execute([self::uuid4(), $name, $phone, date('Y-m-d H:i:s'), self::AGREEMENT_VERSION]);
        $user = $this->findUserByPhone($phone);
        Logger::audit('user.register_otp', ['user_id' => $user['id'] ?? null, 'ip' => Request::clientIp()]);
        return $this->session($user);
    }

    private function assertTokenUnused(string $token): void
    {
        $stmt = $this->db->prepare('SELECT 1 FROM otps WHERE otp_code = ? LIMIT 1');
        $stmt->execute([hash('sha256', $token)]);
        if ($stmt->fetchColumn()) {
            Response::error('This OTP has already been used. Please request a new one.', 400);
        }
    }

    // Asks MSG91 whether the widget's access token is genuine, and requires the number it
    // verified to be the number being signed in. Fails closed on any unexpected reply.
    private function confirmWithMsg91(string $token, string $phone): void
    {
        $authKey = self::env('MSG91_AUTH_KEY');
        if ($authKey === '' || !function_exists('curl_init')) {
            Logger::error('otp.msg91_not_configured');
            Response::error('OTP service is not configured. Please contact support.', 503);
        }

        // MSG91_VERIFY_URL is only for pointing tests at a stub; production uses the default.
        $ch = curl_init(self::env('MSG91_VERIFY_URL') ?: self::MSG91_VERIFY_URL);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode(['authkey' => $authKey, 'access-token' => $token]),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Accept: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
        ]);
        $raw = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

        $data = is_string($raw) ? json_decode($raw, true) : null;
        if ($status < 200 || $status >= 300 || !is_array($data) || ($data['type'] ?? '') !== 'success') {
            Logger::error('otp.msg91_rejected', ['status' => $status, 'body' => is_string($raw) ? substr($raw, 0, 300) : null]);
            Response::error('OTP verification failed. Please request a new OTP.', 401);
        }

        // MSG91 reports the verified identifier (e.g. "919876543210") in "message".
        $verified = preg_replace('/\D/', '', (string)($data['message'] ?? ''));
        if ($verified !== $phone && $verified !== '91' . $phone) {
            Logger::error('otp.msg91_number_mismatch', ['phone' => $phone, 'body' => substr((string)$raw, 0, 300)]);
            Response::error('OTP verification failed. Please request a new OTP.', 401);
        }
    }

    private function findUserByPhone(string $phone): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE phone IN (?, ?, ?) ORDER BY id LIMIT 1');
        $stmt->execute([$phone, '91' . $phone, '+91' . $phone]);
        return $stmt->fetch() ?: null;
    }

    private function session(array $user): array
    {
        // Staff accounts keep the separate email + password login.
        if ($user['role'] !== 'customer') {
            Response::error('Please use the admin login page.', 403);
        }
        if ((int)$user['is_active'] !== 1) {
            Response::error('This account has been disabled. Please contact support.', 403);
        }
        Logger::audit('user.login_otp', ['user_id' => $user['id'], 'ip' => Request::clientIp()]);
        return [
            'token' => Jwt::encode(['sub' => (int)$user['id'], 'role' => $user['role'], 'phone' => $user['phone']]),
            'user' => [
                'id' => (int)$user['id'], 'uuid' => $user['uuid'] ?? null, 'email' => $user['email'] ?? null,
                'full_name' => $user['full_name'], 'phone' => $user['phone'], 'role' => $user['role'],
            ],
        ];
    }

    private static function uuid4(): string
    {
        $d = random_bytes(16);
        $d[6] = chr((ord($d[6]) & 0x0f) | 0x40);
        $d[8] = chr((ord($d[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($d), 4));
    }
}
