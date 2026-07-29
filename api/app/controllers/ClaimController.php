<?php
declare(strict_types=1);
final class ClaimController
{
    private ClaimService $service;
    public function __construct() { $this->service = new ClaimService(Database::getConnection()); }
    public function create(): void
    {
        $auth = AuthMiddleware::authenticate();
        Response::success($this->service->create((int)$auth['sub'], Request::body()), 'Claim created', 201);
    }
    public function view(int $id): void
    {
        $auth = AuthMiddleware::authenticate();
        Response::success($this->service->view($auth, $id), 'Claim fetched');
    }
    public function listMine(): void
    {
        $auth = AuthMiddleware::authenticate();
        $page = max(1, (int)($_GET['page'] ?? 1));
        Response::success($this->service->listMine((int)$auth['sub'], $page, $_GET['status'] ?? null), 'Claims fetched');
    }
    public function updateStatus(int $id): void
    {
        $auth = AuthMiddleware::authenticate();
        AuthMiddleware::authorize($auth, ['admin', 'moderator']);
        Response::success($this->service->updateStatus($auth, $id, Request::body()['status'] ?? ''), 'Status updated');
    }
    public function delete(int $id): void
    {
        $auth = AuthMiddleware::authenticate();
        $this->service->delete($auth, $id);
        Response::success(null, 'Claim deleted');
    }
}