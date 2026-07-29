<?php
declare(strict_types=1);
final class AuthService
{
    private UserRepository $users;
    public function __construct(private PDO $db) { $this->users = new UserRepository($db); }
    public function register(array $in): array
    {
        $v = (new Validator($in))
            ->required('full_name', 'Full name')
            ->required('email', 'Email')->email('email')
            ->required('password', 'Password')->minLen('password', 8, 'Password')
            ->indianMobile('phone');
        if ($v->fails()) Response::error('Validation failed', 422, $v->errors());
        $email = strtolower(trim($in['email']));

        $existing = $this->users->findByEmail($email);
        if ($existing !== null && !empty($existing['id'])) {
            Response::error('Email already registered', 409);
        }
        $id = $this->users->create([
            'uuid' => self::uuid4(), 'full_name' => trim($in['full_name']), 'email' => $email,
            'phone' => !empty($in['phone']) ? $in['phone'] : null,
            'password_hash' => password_hash($in['password'], PASSWORD_BCRYPT, ['cost' => 12]),
            'role' => 'customer',
        ]);
        Logger::audit('user.register', ['user_id' => $id, 'ip' => Request::clientIp()]);
        return ['token' => Jwt::encode(['sub' => $id, 'role' => 'customer', 'email' => $email]),
                'user' => ['id' => $id, 'uuid' => $in['uuid'] ?? null, 'email' => $email, 'full_name' => trim($in['full_name']), 'phone' => !empty($in['phone']) ? $in['phone'] : null, 'role' => 'customer']];
    }
    public function login(array $in): array
    {
        RateLimitMiddleware::check('login:' . Request::clientIp(), 10, 300);
        $v = (new Validator($in))->required('email', 'Email')->email('email')->required('password', 'Password');
        if ($v->fails()) Response::error('Validation failed', 422, $v->errors());
        $user = $this->users->findByEmail(strtolower(trim($in['email'])));
        $ok = $user && password_verify($in['password'], $user['password_hash']);
        if (!$ok || (int)$user['is_active'] !== 1) {
            Logger::audit('user.login_failed', ['email' => $in['email'], 'ip' => Request::clientIp()]);
            Response::error('Invalid credentials', 401);
        }
        Logger::audit('user.login', ['user_id' => $user['id'], 'ip' => Request::clientIp()]);
        return ['token' => Jwt::encode(['sub' => (int)$user['id'], 'role' => $user['role'], 'email' => $user['email']]),
                'user' => ['id' => (int)$user['id'], 'uuid' => $user['uuid'] ?? null, 'email' => $user['email'], 'full_name' => $user['full_name'], 'phone' => $user['phone'] ?? null, 'role' => $user['role']]];
    }
    private static function uuid4(): string
    {
        $d = random_bytes(16);
        $d[6] = chr((ord($d[6]) & 0x0f) | 0x40);
        $d[8] = chr((ord($d[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($d), 4));
    }
}