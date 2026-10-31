<?php
declare(strict_types=1);

// Customer sign-in / sign-up with a mobile number and a one-time code sent by SMS (MSG91).
//   send()     → texts a 6-digit code to the number
//   verify()   → checks the code; returns a session for known numbers, or a short-lived
//                signup token for new ones
//   complete() → creates the account for a new number (name + agreement acceptance)
final class OtpService
{
    private const TTL = 300;            // code lifetime, seconds
    private const MAX_ATTEMPTS = 5;     // wrong guesses allowed per code
    private const RESEND_GAP = 30;      // seconds between sends to one number
    private const SIGNUP_TOKEN_TTL = 900;
    private const AGREEMENT_VERSION = '1.0';
    private const MSG91_OTP_URL = 'https://control.msg91.com/api/v5/otp';

    public function __construct(private PDO $db) {}

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

    public function send(array $in): array
    {
        $phone = self::phone($in['phone'] ?? '');
        RateLimitMiddleware::check('otp-send-ip:' . Request::clientIp(), 20, 3600);
        RateLimitMiddleware::check('otp-send-phone:' . $phone, 5, 3600);

        $stmt = $this->db->prepare('SELECT expires_at FROM otps WHERE identifier = ? ORDER BY id DESC LIMIT 1');
        $stmt->execute([$phone]);
        $lastExpiry = $stmt->fetchColumn();
        if ($lastExpiry && strtotime((string)$lastExpiry) - self::TTL > time() - self::RESEND_GAP) {
            Response::error('Please wait ' . self::RESEND_GAP . ' seconds before requesting another OTP', 429);
        }

        $code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Only the newest code for a number is ever valid.
        $this->db->prepare('UPDATE otps SET verified = 1 WHERE identifier = ? AND verified = 0')->execute([$phone]);
        $this->db->prepare('INSERT INTO otps (identifier, otp_code, expires_at, attempts) VALUES (?, ?, ?, 0)')
            ->execute([$phone, password_hash($code, PASSWORD_DEFAULT), date('Y-m-d H:i:s', time() + self::TTL)]);

        $testMode = self::env('OTP_TEST_MODE') === '1';
        if ($testMode) {
            Logger::info('otp.test_mode_send', ['phone' => $phone]);
        } else {
            $this->sendSms($phone, $code);
        }
        Logger::audit('otp.sent', ['phone' => $phone, 'ip' => Request::clientIp()]);

        $out = ['sent' => true, 'expires_in' => self::TTL, 'resend_in' => self::RESEND_GAP];
        if ($testMode) $out['dev_otp'] = $code;
        return $out;
    }

    public function verify(array $in): array
    {
        $phone = self::phone($in['phone'] ?? '');
        $code = preg_replace('/\D/', '', (string)($in['otp'] ?? ''));
        RateLimitMiddleware::check('otp-verify-ip:' . Request::clientIp(), 30, 3600);

        $stmt = $this->db->prepare('SELECT id, otp_code, expires_at, attempts FROM otps WHERE identifier = ? AND verified = 0 ORDER BY id DESC LIMIT 1');
        $stmt->execute([$phone]);
        $row = $stmt->fetch();
        if (!$row || strtotime((string)$row['expires_at']) < time()) {
            Response::error('OTP expired. Please request a new one.', 400);
        }
        if ((int)$row['attempts'] >= self::MAX_ATTEMPTS) {
            Response::error('Too many wrong attempts. Please request a new OTP.', 429);
        }
        if (strlen($code) !== 6 || !password_verify($code, (string)$row['otp_code'])) {
            $this->db->prepare('UPDATE otps SET attempts = attempts + 1 WHERE id = ?')->execute([(int)$row['id']]);
            Logger::audit('otp.failed', ['phone' => $phone, 'ip' => Request::clientIp()]);
            Response::error('Incorrect OTP. Please try again.', 400);
        }

        // Consume the code; a parallel request with the same code gets nothing.
        $stmt = $this->db->prepare('UPDATE otps SET verified = 1 WHERE id = ? AND verified = 0');
        $stmt->execute([(int)$row['id']]);
        if ($stmt->rowCount() === 0) {
            Response::error('OTP expired. Please request a new one.', 400);
        }

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

    private function sendSms(string $phone, string $code): void
    {
        $authKey = self::env('MSG91_AUTH_KEY');
        $templateId = self::env('MSG91_OTP_TEMPLATE_ID');
        if ($authKey === '' || $templateId === '' || !function_exists('curl_init')) {
            Logger::error('otp.sms_not_configured');
            Response::error('SMS service is not configured. Please contact support.', 503);
        }

        $url = self::MSG91_OTP_URL . '?' . http_build_query([
            'template_id' => $templateId,
            'mobile' => '91' . $phone,
            'otp' => $code,
            'otp_expiry' => (int)(self::TTL / 60),
        ]);
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => '{}',
            CURLOPT_HTTPHEADER => ['authkey: ' . $authKey, 'Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
        ]);
        $raw = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

        $data = is_string($raw) ? json_decode($raw, true) : null;
        if ($status < 200 || $status >= 300 || !is_array($data) || ($data['type'] ?? '') !== 'success') {
            Logger::error('otp.sms_failed', ['status' => $status, 'body' => is_string($raw) ? substr($raw, 0, 300) : null]);
            Response::error('Could not send the OTP right now. Please try again shortly.', 502);
        }
    }

    private static function uuid4(): string
    {
        $d = random_bytes(16);
        $d[6] = chr((ord($d[6]) & 0x0f) | 0x40);
        $d[8] = chr((ord($d[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($d), 4));
    }
}
