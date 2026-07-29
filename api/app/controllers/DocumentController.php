<?php
declare(strict_types=1);
final class DocumentController
{
    private DocumentService $service;
    public function __construct() { $this->service = new DocumentService(Database::getConnection()); }
    public function upload(int $claimId): void
    {
        $auth = AuthMiddleware::authenticate();
        if (empty($_FILES['file'])) Response::error('No file provided', 422);
        Response::success($this->service->upload($auth, $claimId, $_FILES['file']), 'Uploaded', 201);
    }
    public function download(int $docId): void
    {
        $auth = AuthMiddleware::authenticate();
        $this->service->download($auth, $docId);
    }
    public function listForClaim(int $claimId): void
    {
        $auth = AuthMiddleware::authenticate();
        Response::success($this->service->listForClaim($auth, $claimId), 'Documents fetched');
    }
    public function delete(int $docId): void
    {
        $auth = AuthMiddleware::authenticate();
        $this->service->delete($auth, $docId);
        Response::success(null, 'Document deleted');
    }
}