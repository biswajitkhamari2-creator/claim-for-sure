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

    public function sendMail(): void
    {
        $this->guard();
        $body = Request::body();
        $to = $body['to'] ?? '';
        $subject = $body['subject'] ?? 'SMTP test';
        $html = $body['html'] ?? '';

        if (empty($to)) {
            Response::error('Recipient email required', 400);
        }

        $mailer = new MailService();
        $ok = $mailer->send($to, 'Test Recipient', $subject, $html);

        if ($ok) {
            Response::success(null, 'Email sent successfully');
        } else {
            Response::error('Failed to send email via SMTP configuration', 500);
        }
    }
}
