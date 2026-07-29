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
