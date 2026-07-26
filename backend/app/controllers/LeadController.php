<?php
declare(strict_types=1);

final class LeadController
{
    private PDO $db;
    private MailService $mail;

    public function __construct()
    {
        $this->db = Database::getConnection();
        $this->mail = new MailService();
    }

    private function guardAdmin(): void
    {
        $auth = AuthMiddleware::authenticate();
        AuthMiddleware::authorize($auth, ['admin']);
    }

    public function submit(): void
    {
        $body = Request::body();
        $fullName = $body['full_name'] ?? '';
        $mobileNumber = $body['mobile_number'] ?? '';
        
        if (empty($fullName) || empty($mobileNumber)) {
            Response::error('Full name and mobile number are required', 400);
        }

        $id = bin2hex(random_bytes(16)); // UUID-like 32 chars
        
        $sql = "INSERT INTO leads (id, full_name, mobile_number, email, insurance_company, claim_type, claim_status, description, rejection_letter_path) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                $id,
                $fullName,
                $mobileNumber,
                $body['email'] ?? null,
                $body['insurance_company'] ?? null,
                $body['claim_type'] ?? null,
                $body['claim_status'] ?? null,
                $body['description'] ?? null,
                $body['rejection_letter_path'] ?? null
            ]);
            
            // Send admin notification
            $adminEmail = $_ENV['ADMIN_EMAIL'] ?? 'support@claimforsure.in';
            $subject = "New Claim Assessment Lead: " . $fullName;
            $htmlBody = "<h3>New Free Claim Assessment Request</h3>
                         <p><strong>Name:</strong> " . htmlspecialchars($fullName) . "</p>
                         <p><strong>Mobile:</strong> " . htmlspecialchars($mobileNumber) . "</p>
                         <p><strong>Company:</strong> " . htmlspecialchars($body['insurance_company'] ?? 'N/A') . "</p>
                         <p>Please log in to the admin panel to view full details.</p>";
            
            // Use MailService if available (it might fail if SMTP not configured, but won't crash)
            $this->mail->send($adminEmail, 'ClaimForSure Admin', $subject, $htmlBody);
            
            Response::success(['id' => $id], 'Lead submitted successfully');
        } catch (Exception $e) {
            Response::error('Database error: ' . $e->getMessage(), 500);
        }
    }

    public function getLeads(): void
    {
        $this->guardAdmin();
        
        $page = max(1, (int)($_GET['page'] ?? 1));
        $limit = 50; 
        $offset = max(0, ($page - 1) * $limit);
        
        $status = $_GET['status'] ?? null;
        $search = $_GET['search'] ?? null;
        
        $sql = "SELECT * FROM leads WHERE 1=1";
        $params = [];
        
        if ($status) {
            $sql .= " AND status = ?";
            $params[] = $status;
        }
        
        if ($search) {
            $sql .= " AND (full_name LIKE ? OR mobile_number LIKE ? OR email LIKE ?)";
            $searchTerm = "%$search%";
            array_push($params, $searchTerm, $searchTerm, $searchTerm);
        }
        
        $sql .= " ORDER BY created_at DESC LIMIT ? OFFSET ?";
        
        try {
            $stmt = $this->db->prepare($sql);
            foreach ($params as $i => $v) {
                $stmt->bindValue($i + 1, $v);
            }
            $stmt->bindValue(count($params) + 1, $limit, PDO::PARAM_INT);
            $stmt->bindValue(count($params) + 2, $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            Response::success($stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (Exception $e) {
            Response::error('Database error: ' . $e->getMessage(), 500);
        }
    }

    public function updateStatus(int|string $id): void
    {
        $this->guardAdmin();
        $body = Request::body();
        $status = $body['status'] ?? '';
        
        if (!in_array($status, ['New', 'Contacted', 'In Progress', 'Closed'], true)) {
            Response::error('Invalid status', 400);
        }
        
        try {
            $stmt = $this->db->prepare("UPDATE leads SET status = ? WHERE id = ?");
            $stmt->execute([$status, (string)$id]);
            Response::success(null, 'Status updated');
        } catch (Exception $e) {
            Response::error('Database error: ' . $e->getMessage(), 500);
        }
    }
}
