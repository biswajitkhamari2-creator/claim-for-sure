<?php
declare(strict_types=1);
final class PasswordResetService
{
    private UserRepository $users;
    private PasswordResetRepository $resets;
    private MailService $mail;

    public function __construct(private PDO $db)
    {
        $this->users  = new UserRepository($db);
        $this->resets = new PasswordResetRepository($db);
        $this->mail   = new MailService();
    }

    public function requestReset(array $in): void
    {
        RateLimitMiddleware::check('forgot:' . Request::clientIp(), 5, 900);
        $v = (new Validator($in))->required('email', 'Email')->email('email');
        if ($v->fails()) Response::error('Validation failed', 422, $v->errors());

        $user = $this->users->findByEmail(strtolower(trim($in['email'])));
        // Always return success to prevent user enumeration
        if ($user) {
            $this->resets->invalidateForUser((int)$user['id']);
            $rawToken  = bin2hex(random_bytes(32));
            $tokenHash = hash('sha256', $rawToken);
            $this->resets->create((int)$user['id'], $tokenHash, date('Y-m-d H:i:s', time() + 1800));
            $base = rtrim($_ENV['APP_URL'] ?? 'http://localhost:8000', '/');
            $link = $base . '/reset-password?token=' . $rawToken;
            $this->mail->passwordReset($user['email'], $user['full_name'], $link);
            Logger::audit('password.reset_requested', ['user_id' => $user['id']]);
        }
    }

    public function resetPassword(array $in): void
    {
        $v = (new Validator($in))
            ->required('token', 'Token')
            ->required('password', 'Password')->minLen('password', 8, 'Password');
        if ($v->fails()) Response::error('Validation failed', 422, $v->errors());

        $tokenHash = hash('sha256', (string)$in['token']);
        $row = $this->resets->findValid($tokenHash);
        if (!$row) Response::error('Invalid or expired reset token', 400);

        $newHash = password_hash($in['password'], PASSWORD_BCRYPT, ['cost' => 12]);
        $s = $this->db->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
        $s->execute([$newHash, (int)$row['user_id']]);

        $this->resets->markUsed((int)$row['id']);
        Logger::audit('password.reset_done', ['user_id' => $row['user_id']]);
    }
}
