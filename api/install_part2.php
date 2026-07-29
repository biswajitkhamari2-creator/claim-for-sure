<?php
/**
 * ClaimForSure Backend Auto-Builder - PART 2
 * Adds: Password Reset, Email (PHPMailer), CSRF protection, Admin Panel APIs, .env.example
 *
 * RUN AFTER install.php (Part 1):
 *   php install_part2.php
 *
 * It writes into the SAME ./claimforsure folder created by Part 1.
 */
declare(strict_types=1);

$root = __DIR__ . '/claimforsure';

if (!is_dir($root)) {
    fwrite(STDERR, "ERROR: ./claimforsure not found. Run install.php (Part 1) first.\n");
    exit(1);
}

/* ---- extra folders ---- */
$dirs = ['/app/admin', '/templates'];
foreach ($dirs as $d) {
    $p = $root . $d;
    if (!is_dir($p)) { mkdir($p, 0755, true); echo "[DIR]  $p\n"; }
}

$files = [];

/* ===== .env.example ===== */
$files['/.env.example'] = <<<'EOF'
DB_HOST=127.0.0.1
DB_NAME=claimforsure
DB_USER=root
DB_PASS=
JWT_SECRET=CHANGE_ME_LONG_RANDOM_SECRET_MIN_32_CHARS
APP_URL=http://localhost:8000
SMTP_HOST=smtp.hostinger.com
SMTP_USER=no-reply@yourdomain.com
SMTP_PASS=your_mailbox_password
SMTP_PORT=465
MAIL_FROM=no-reply@yourdomain.com
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
EOF;

/* ===== app/helpers/Csrf.php ===== */
$files['/app/helpers/Csrf.php'] = <<<'EOF'
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
EOF;

/* ===== app/helpers/Sanitize.php ===== */
$files['/app/helpers/Sanitize.php'] = <<<'EOF'
<?php
declare(strict_types=1);
/** Output escaping helper (XSS protection for any HTML output). */
final class Sanitize
{
    public static function html(string $v): string
    {
        return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
    public static function array(array $data): array
    {
        $out = [];
        foreach ($data as $k => $v) {
            $out[$k] = is_string($v) ? self::html($v) : (is_array($v) ? self::array($v) : $v);
        }
        return $out;
    }
}
EOF;

/* ===== app/repositories/PasswordResetRepository.php ===== */
$files['/app/repositories/PasswordResetRepository.php'] = <<<'EOF'
<?php
declare(strict_types=1);
final class PasswordResetRepository
{
    public function __construct(private PDO $db) {}

    public function create(int $userId, string $tokenHash, string $expiresAt): void
    {
        $s = $this->db->prepare(
            'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
        );
        $s->execute([$userId, $tokenHash, $expiresAt]);
    }

    public function findValid(string $tokenHash): ?array
    {
        $s = $this->db->prepare(
            'SELECT * FROM password_resets
             WHERE token_hash = ? AND used = 0 AND expires_at > NOW() LIMIT 1'
        );
        $s->execute([$tokenHash]);
        return $s->fetch() ?: null;
    }

    public function markUsed(int $id): void
    {
        $s = $this->db->prepare('UPDATE password_resets SET used = 1 WHERE id = ?');
        $s->execute([$id]);
    }

    public function invalidateForUser(int $userId): void
    {
        $s = $this->db->prepare('UPDATE password_resets SET used = 1 WHERE user_id = ? AND used = 0');
        $s->execute([$userId]);
    }
}
EOF;

/* ===== app/helpers/EmailTemplate.php ===== */
$files['/app/helpers/EmailTemplate.php'] = <<<'EOF'
<?php
declare(strict_types=1);
final class EmailTemplate
{
    public static function render(string $template, array $vars): string
    {
        $esc = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
        $wrap = fn(string $inner) =>
            '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;padding:24px">'
            . '<h2 style="color:#1a73e8">' . APP_NAME . '</h2>' . $inner
            . '<hr><p style="color:#888;font-size:12px">Automated message. Do not reply.</p></div>';

        switch ($template) {
            case 'welcome':
                return $wrap('<p>Hi ' . $esc($vars['name']) . ',</p><p>Welcome to ' . APP_NAME
                    . '! Your account is ready. You can now file and track insurance claims securely.</p>');
            case 'reset':
                return $wrap('<p>Hi ' . $esc($vars['name']) . ',</p>'
                    . '<p>Click below to reset your password. This link expires in 30 minutes.</p>'
                    . '<p><a href="' . $esc($vars['link']) . '" style="background:#1a73e8;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Reset Password</a></p>'
                    . '<p>If you did not request this, you can safely ignore this email.</p>');
            case 'claim_update':
                return $wrap('<p>Hi ' . $esc($vars['name']) . ',</p>'
                    . '<p>Your claim <strong>' . $esc($vars['claim']) . '</strong> status is now: <strong>'
                    . $esc($vars['status']) . '</strong>.</p>');
            default:
                return $wrap('<p>' . $esc($vars['message'] ?? '') . '</p>');
        }
    }
}
EOF;

/* ===== app/services/MailService.php ===== */
$files['/app/services/MailService.php'] = <<<'EOF'
<?php
declare(strict_types=1);
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

final class MailService
{
    public function send(string $toEmail, string $toName, string $subject, string $htmlBody): bool
    {
        // Graceful degradation if PHPMailer not installed yet
        if (!class_exists(PHPMailer::class)) {
            Logger::error('mail.phpmailer_missing', ['to' => $toEmail]);
            return false;
        }
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = $_ENV['SMTP_HOST'] ?? '';
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV['SMTP_USER'] ?? '';
            $mail->Password   = $_ENV['SMTP_PASS'] ?? '';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port       = (int)($_ENV['SMTP_PORT'] ?? 465);
            $mail->setFrom($_ENV['MAIL_FROM'] ?? 'no-reply@claimforsure.com', APP_NAME);
            $mail->addAddress($toEmail, $toName);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody);
            $mail->send();
            Logger::info('mail.sent', ['to' => $toEmail, 'subject' => $subject]);
            return true;
        } catch (MailException $e) {
            Logger::error('mail.failed', ['to' => $toEmail, 'error' => $mail->ErrorInfo]);
            return false;
        }
    }

    public function welcome(string $email, string $name): void
    {
        $this->send($email, $name, 'Welcome to ' . APP_NAME,
            EmailTemplate::render('welcome', ['name' => $name]));
    }

    public function passwordReset(string $email, string $name, string $link): void
    {
        $this->send($email, $name, 'Reset your password',
            EmailTemplate::render('reset', ['name' => $name, 'link' => $link]));
    }

    public function claimUpdate(string $email, string $name, string $claimNo, string $status): void
    {
        $this->send($email, $name, "Update on claim {$claimNo}",
            EmailTemplate::render('claim_update', ['name' => $name, 'claim' => $claimNo, 'status' => $status]));
    }
}
EOF;

/* ===== app/services/PasswordResetService.php ===== */
$files['/app/services/PasswordResetService.php'] = <<<'EOF'
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
EOF;

/* ===== app/controllers/PasswordController.php ===== */
$files['/app/controllers/PasswordController.php'] = <<<'EOF'
<?php
declare(strict_types=1);
final class PasswordController
{
    private PasswordResetService $service;
    public function __construct() { $this->service = new PasswordResetService(Database::getConnection()); }

    public function forgot(): void
    {
        $this->service->requestReset(Request::body());
        Response::success(null, 'If that email exists, a reset link has been sent');
    }

    public function reset(): void
    {
        $this->service->resetPassword(Request::body());
        Response::success(null, 'Password reset successful');
    }
}
EOF;

/* ===== app/admin/AdminService.php ===== */
$files['/app/admin/AdminService.php'] = <<<'EOF'
<?php
declare(strict_types=1);
final class AdminService
{
    public function __construct(private PDO $db) {}

    public function dashboard(): array
    {
        $stats = [];
        $stats['total_users']    = (int)$this->db->query('SELECT COUNT(*) c FROM users')->fetch()['c'];
        $stats['total_claims']   = (int)$this->db->query('SELECT COUNT(*) c FROM claims')->fetch()['c'];
        $stats['open_claims']    = (int)$this->db->query(
            "SELECT COUNT(*) c FROM claims WHERE status NOT IN ('resolved','rejected','closed')")->fetch()['c'];
        $stats['resolved_claims']= (int)$this->db->query(
            "SELECT COUNT(*) c FROM claims WHERE status = 'resolved'")->fetch()['c'];
        $byStatus = $this->db->query(
            'SELECT status, COUNT(*) total FROM claims GROUP BY status')->fetchAll();
        $stats['claims_by_status'] = $byStatus;
        return $stats;
    }

    public function listUsers(int $page, ?string $search): array
    {
        $repo = new UserRepository($this->db);
        $limit = 20; $offset = max(0, ($page - 1) * $limit);
        return $repo->paginate($limit, $offset, $search);
    }

    public function toggleUserActive(int $userId, int $isActive): void
    {
        $s = $this->db->prepare('UPDATE users SET is_active = ? WHERE id = ?');
        $s->execute([$isActive ? 1 : 0, $userId]);
        Logger::audit('admin.user_toggle', ['user_id' => $userId, 'active' => $isActive]);
    }

    public function allClaims(int $page, ?string $status): array
    {
        $limit = 20; $offset = max(0, ($page - 1) * $limit);
        $sql = 'SELECT c.*, u.full_name, u.email FROM claims c JOIN users u ON u.id = c.user_id';
        $params = [];
        if ($status) { $sql .= ' WHERE c.status = ?'; $params[] = $status; }
        $sql .= ' ORDER BY c.id DESC LIMIT ? OFFSET ?';
        $s = $this->db->prepare($sql);
        foreach ($params as $i => $v) $s->bindValue($i + 1, $v);
        $s->bindValue(count($params) + 1, $limit, PDO::PARAM_INT);
        $s->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
        $s->execute();
        return $s->fetchAll();
    }
}
EOF;

/* ===== app/controllers/AdminController.php ===== */
$files['/app/controllers/AdminController.php'] = <<<'EOF'
<?php
declare(strict_types=1);
final class AdminController
{
    private AdminService $service;
    public function __construct() { $this->service = new AdminService(Database::getConnection()); }

    private function guard(): array
    {
        $auth = AuthMiddleware::authenticate();
        AuthMiddleware::authorize($auth, ['admin']);
        return $auth;
    }

    public function dashboard(): void
    {
        $this->guard();
        Response::success($this->service->dashboard(), 'Dashboard stats');
    }

    public function users(): void
    {
        $this->guard();
        $page = max(1, (int)($_GET['page'] ?? 1));
        Response::success($this->service->listUsers($page, $_GET['search'] ?? null), 'Users fetched');
    }

    public function toggleUser(int $id): void
    {
        $this->guard();
        $active = (int)(Request::body()['is_active'] ?? 1);
        $this->service->toggleUserActive($id, $active);
        Response::success(null, 'User status updated');
    }

    public function claims(): void
    {
        $this->guard();
        $page = max(1, (int)($_GET['page'] ?? 1));
        Response::success($this->service->allClaims($page, $_GET['status'] ?? null), 'Claims fetched');
    }
}
EOF;

/* ===== routes/admin.php ===== */
$files['/routes/admin.php'] = <<<'EOF'
<?php
declare(strict_types=1);
return [
    'POST /api/auth/forgot-password' => ['PasswordController', 'forgot'],
    'POST /api/auth/reset-password'  => ['PasswordController', 'reset'],
    'GET /api/admin/dashboard'       => ['AdminController', 'dashboard'],
    'GET /api/admin/users'           => ['AdminController', 'users'],
    'PATCH /api/admin/users/{id}'    => ['AdminController', 'toggleUser'],
    'GET /api/admin/claims'          => ['AdminController', 'claims'],
];
EOF;

/* ===== public/index.php (updated to merge both route files + autoload admin) ===== */
$files['/public/index.php'] = <<<'EOF'
<?php
declare(strict_types=1);
require_once dirname(__DIR__) . '/config/bootstrap.php';
RateLimitMiddleware::check('global:' . Request::clientIp(), 120, 60);

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rtrim($uri, '/') ?: '/';

$routes = require dirname(__DIR__) . '/routes/api.php';
$adminRoutesFile = dirname(__DIR__) . '/routes/admin.php';
if (file_exists($adminRoutesFile)) {
    $routes = array_merge($routes, require $adminRoutesFile);
}

foreach ($routes as $pattern => $handler) {
    [$rMethod, $rPath] = preg_split('/\s+/', trim($pattern));
    if (strtoupper($rMethod) !== $method) continue;
    $regex = '#^' . preg_replace('#\{[a-z]+\}#', '(\d+)', $rPath) . '$#';
    if (preg_match($regex, $uri, $matches)) {
        array_shift($matches);
        [$class, $fn] = $handler;
        (new $class())->$fn(...array_map('intval', $matches));
        exit;
    }
}
Response::error('Route not found', 404);
EOF;

/* ===== config/bootstrap.php (updated autoloader to include /app/admin) ===== */
$files['/config/bootstrap.php'] = <<<'EOF'
<?php
declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');

$envPath = dirname(__DIR__) . '/.env';
if (file_exists($envPath)) {
    foreach (file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#')) continue;
        if (!str_contains($line, '=')) continue;
        [$k, $v] = array_map('trim', explode('=', $line, 2));
        $_ENV[$k] = $v; putenv("{$k}={$v}");
    }
}
require_once __DIR__ . '/constants.php';

spl_autoload_register(function (string $class): void {
    $paths = [
        __DIR__ . '/',
        APP_ROOT . '/app/helpers/',
        APP_ROOT . '/app/services/',
        APP_ROOT . '/app/repositories/',
        APP_ROOT . '/app/models/',
        APP_ROOT . '/app/middleware/',
        APP_ROOT . '/app/controllers/',
        APP_ROOT . '/app/admin/',
    ];
    foreach ($paths as $p) {
        $f = $p . $class . '.php';
        if (file_exists($f)) { require_once $f; return; }
    }
});

if (file_exists(APP_ROOT . '/vendor/autoload.php')) {
    require_once APP_ROOT . '/vendor/autoload.php';
}

set_exception_handler(function (Throwable $e): void {
    Logger::error($e->getMessage(), ['trace' => $e->getTraceAsString()]);
    Response::error('Internal server error', 500);
});
EOF;

/* ===== composer.json (updated with full deps) ===== */
$files['/composer.json'] = <<<'EOF'
{
    "name": "claimforsure/backend",
    "description": "ClaimForSure insurance claim management backend",
    "type": "project",
    "require": {
        "php": ">=8.3",
        "phpmailer/phpmailer": "^6.9",
        "razorpay/razorpay": "^2.9"
    },
    "config": {
        "optimize-autoloader": true
    }
}
EOF;

/* ---- write ---- */
foreach ($files as $rel => $content) {
    $path = $root . $rel;
    if (!is_dir(dirname($path))) mkdir(dirname($path), 0755, true);
    file_put_contents($path, $content);
    echo "[FILE] $path\n";
}

echo "\n============================================\n";
echo "DONE! ClaimForSure PART 2 modules added.\n";
echo "============================================\n\n";
echo "NEW FEATURES ADDED:\n";
echo " - Password Reset (forgot + reset endpoints)\n";
echo " - Email notifications (PHPMailer)\n";
echo " - CSRF + Sanitize helpers\n";
echo " - Admin Panel APIs (dashboard, users, claims)\n";
echo " - .env.example\n\n";
echo "NEXT STEPS:\n";
echo "1. cd claimforsure\n";
echo "2. composer require phpmailer/phpmailer razorpay/razorpay\n";
echo "3. Ensure .env has SMTP + APP_URL set\n";
echo "4. php -S localhost:8000 -t public\n\n";
echo "NEW ENDPOINTS:\n";
echo "  POST /api/auth/forgot-password\n";
echo "  POST /api/auth/reset-password\n";
echo "  GET  /api/admin/dashboard   (admin only)\n";
echo "  GET  /api/admin/users       (admin only)\n";
echo "  PATCH /api/admin/users/{id} (admin only)\n";
echo "  GET  /api/admin/claims      (admin only)\n";
