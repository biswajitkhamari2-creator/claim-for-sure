<?php
declare(strict_types=1);
final class ClaimService
{
    private ClaimRepository $claims;
    public function __construct(private PDO $db) { $this->claims = new ClaimRepository($db); }
    public function create(int $userId, array $in): array
    {
        $v = (new Validator($in))
            ->required('title', 'Title')->minLen('title', 3, 'Title')
            ->required('description', 'Description')->minLen('description', 10, 'Description')
            ->required('category', 'Category');
        if ($v->fails()) Response::error('Validation failed', 422, $v->errors());
        $claimNumber = 'CFS-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
        $id = $this->claims->create([
            'claim_number' => $claimNumber, 'user_id' => $userId, 'title' => trim($in['title']),
            'description' => trim($in['description']), 'category' => trim($in['category']),
            'insurer_name' => $in['insurer_name'] ?? null, 'policy_number' => $in['policy_number'] ?? null,
            'claim_amount' => isset($in['claim_amount']) ? (float)$in['claim_amount'] : null,
            'priority' => in_array($in['priority'] ?? '', ['low','medium','high','urgent'], true) ? $in['priority'] : 'medium',
        ]);
        $this->claims->addTimeline($id, $userId, 'created', null, 'submitted', 'Claim submitted');
        Logger::audit('claim.create', ['claim_id' => $id, 'user_id' => $userId]);
        return ['id' => $id, 'claim_number' => $claimNumber, 'status' => 'submitted'];
    }
    public function updateStatus(array $actor, int $claimId, string $status): array
    {
        $allowed = ['submitted','under_review','pending_docs','escalated','resolved','rejected','closed'];
        if (!in_array($status, $allowed, true)) Response::error('Invalid status value', 422);
        $claim = $this->claims->findById($claimId);
        if (!$claim) Response::error('Claim not found', 404);
        $this->claims->updateStatus($claimId, $status);
        $this->claims->addTimeline($claimId, (int)$actor['sub'], 'status_change', $claim['status'], $status, "Status changed to {$status}");
        Logger::audit('claim.status_update', ['claim_id' => $claimId, 'by' => $actor['sub'], 'to' => $status]);
        return ['id' => $claimId, 'status' => $status];
    }
    public function view(array $actor, int $claimId): array
    {
        $claim = $this->claims->findById($claimId);
        if (!$claim) Response::error('Claim not found', 404);
        if ($actor['role'] === 'customer' && (int)$claim['user_id'] !== (int)$actor['sub']) Response::error('Forbidden', 403);
        $claim['timeline'] = $this->claims->timeline($claimId);
        return $claim;
    }
    public function listMine(int $userId, int $page, ?string $status): array
    {
        $limit = 10; $offset = max(0, ($page - 1) * $limit);
        return $this->claims->forUser($userId, $limit, $offset, $status);
    }
    public function delete(array $actor, int $claimId): void
    {
        $claim = $this->claims->findById($claimId);
        if (!$claim) Response::error('Claim not found', 404);
        if ($actor['role'] === 'customer' && (int)$claim['user_id'] !== (int)$actor['sub']) Response::error('Forbidden', 403);
        $this->claims->delete($claimId);
        Logger::audit('claim.delete', ['claim_id' => $claimId, 'by' => $actor['sub']]);
    }
}