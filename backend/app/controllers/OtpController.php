<?php
declare(strict_types=1);
final class OtpController
{
    private OtpService $service;
    public function __construct() { $this->service = new OtpService(Database::getConnection()); }
    public function verify(): void { Response::success($this->service->verify(Request::body()), 'OTP verified'); }
    public function complete(): void { Response::success($this->service->complete(Request::body()), 'Account created', 201); }
}
