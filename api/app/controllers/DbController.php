<?php
declare(strict_types=1);

final class DbController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function query(): void
    {
        // Authenticate request (must be signed in)
        $payload = AuthMiddleware::authenticate();
        $userId = (int)$payload['sub'];
        $userRole = $payload['role'] ?? 'customer';

        $body = Request::body();
        $action = $body['action'] ?? 'select';
        $table = $body['table'] ?? '';
        $allowedTables = ['claims', 'notices', 'invoices', 'defaulters', 'promo_codes', 'rewards', 'rewards_config', 'rewards_audit_log', 'profiles', 'users'];

        if (!in_array($table, $allowedTables, true)) {
            Response::error('Invalid table', 400);
        }

        // Apply basic RLS-like protection based on user role and user_id
        $isAdmin = ($userRole === 'admin');

        // Let's build the query
        switch ($action) {
            case 'select':
                $this->handleSelect($table, $body, $userId, $isAdmin);
                break;
            case 'insert':
                $this->handleInsert($table, $body, $userId, $isAdmin);
                break;
            case 'update':
                $this->handleUpdate($table, $body, $userId, $isAdmin);
                break;
            case 'delete':
                $this->handleDelete($table, $body, $userId, $isAdmin);
                break;
            default:
                Response::error('Invalid action', 400);
        }
    }

    private function handleSelect(string $table, array $body, int $userId, bool $isAdmin): void
    {
        $sql = "SELECT * FROM `$table` WHERE 1=1";
        $params = [];

        // RLS rules
        if (!$isAdmin) {
            if ($table === 'claims' || $table === 'rewards' || $table === 'invoices') {
                $sql .= " AND user_id = ?";
                $params[] = $userId;
            } elseif ($table === 'profiles') {
                $sql .= " AND user_id = ?";
                $params[] = $userId;
            } elseif ($table === 'users') {
                $sql .= " AND id = ?";
                $params[] = $userId;
            } elseif ($table === 'defaulters' || $table === 'rewards_audit_log') {
                Response::error('Access denied', 403);
            }
        }

        // Parse filters
        if (!empty($body['where'])) {
            foreach ($body['where'] as $w) {
                $col = preg_replace('/[^a-zA-Z0-9_]/', '', $w['col']);
                $op = $w['op'] ?? '=';
                if (!in_array($op, ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'is'], true)) {
                    $op = '=';
                }
                
                if ($op === 'is' && $w['val'] === null) {
                    $sql .= " AND `$col` IS NULL";
                } else {
                    $sql .= " AND `$col` $op ?";
                    $params[] = $w['val'];
                }
            }
        }

        // Parse order
        if (!empty($body['order'])) {
            $sql .= " ORDER BY ";
            $orders = [];
            foreach ($body['order'] as $o) {
                $col = preg_replace('/[^a-zA-Z0-9_]/', '', $o['col']);
                $dir = strtoupper($o['dir'] ?? 'ASC') === 'DESC' ? 'DESC' : 'ASC';
                $orders[] = "`$col` $dir";
            }
            $sql .= implode(', ', $orders);
        }

        // Parse limit
        if (!empty($body['limit'])) {
            $sql .= " LIMIT " . (int)$body['limit'];
        }

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Handle json fields formatting for response
            foreach ($data as &$row) {
                if (isset($row['documents']) && is_string($row['documents'])) {
                    $row['documents'] = json_decode($row['documents'], true);
                }
                if (isset($row['eligibility_rules']) && is_string($row['eligibility_rules'])) {
                    $row['eligibility_rules'] = json_decode($row['eligibility_rules'], true);
                }
                if (isset($row['metadata']) && is_string($row['metadata'])) {
                    $row['metadata'] = json_decode($row['metadata'], true);
                }
                if (isset($row['before_state']) && is_string($row['before_state'])) {
                    $row['before_state'] = json_decode($row['before_state'], true);
                }
                if (isset($row['after_state']) && is_string($row['after_state'])) {
                    $row['after_state'] = json_decode($row['after_state'], true);
                }
                // Compatibility mapping for user UUIDs vs integer IDs
                if (isset($row['user_id'])) {
                    $row['user_id'] = (string)$row['user_id'];
                }
                if (isset($row['id'])) {
                    $row['id'] = (string)$row['id'];
                }
                if (isset($row['claim_number'])) {
                    $row['claim_id'] = (string)$row['claim_number'];
                } elseif (isset($row['claim_id'])) {
                    $row['claim_number'] = (string)$row['claim_id'];
                }
            }

            // Dynamically populate documents list from documents table if query is claims
            if ($table === 'claims') {
                foreach ($data as &$row) {
                    $stmtDocs = $this->db->prepare("SELECT id, original_name FROM documents WHERE claim_id = ?");
                    $stmtDocs->execute([(int)$row['id']]);
                    $claimDocs = $stmtDocs->fetchAll(PDO::FETCH_ASSOC);
                    $rowDocs = [];
                    foreach ($claimDocs as $d) {
                        $rowDocs[] = "doc:" . $d['id'] . ":" . $d['original_name'];
                    }
                    // Merge payout proof path if exists
                    if (!empty($row['payout_proof_path'])) {
                        $rowDocs[] = $row['payout_proof_path'];
                    }
                    $row['documents'] = $rowDocs;
                }
            }

            Response::success($data);
        } catch (Exception $e) {
            Response::error('Database select query error: ' . $e->getMessage(), 500);
        }
    }

    private function handleInsert(string $table, array $body, int $userId, bool $isAdmin): void
    {
        if (!$isAdmin && !in_array($table, ['claims', 'rewards', 'profiles'], true)) {
            Response::error('Access denied', 403);
        }

        $data = $body['data'] ?? [];
        if (empty($data)) {
            Response::error('Missing data for insert', 400);
        }

        // Force owner on customer-initiated inserts
        if (!$isAdmin) {
            $data['user_id'] = $userId;
        }

        // Handle json columns encoding
        if (isset($data['documents']) && is_array($data['documents'])) {
            $data['documents'] = json_encode($data['documents']);
        }
        if (isset($data['eligibility_rules']) && is_array($data['eligibility_rules'])) {
            $data['eligibility_rules'] = json_encode($data['eligibility_rules']);
        }
        if (isset($data['before_state']) && is_array($data['before_state'])) {
            $data['before_state'] = json_encode($data['before_state']);
        }
        if (isset($data['after_state']) && is_array($data['after_state'])) {
            $data['after_state'] = json_encode($data['after_state']);
        }

        // Map user_id correctly
        if (isset($data['user_id'])) {
            $data['user_id'] = (int)$data['user_id'];
        }

        // Automatically generate claim_id if missing for claims
        if ($table === 'claims' && empty($data['claim_id'])) {
            $data['claim_id'] = 'CFS-' . strtoupper(bin2hex(random_bytes(4)));
        }

        $cols = array_keys($data);
        $escapedCols = array_map(fn($c) => "`" . preg_replace('/[^a-zA-Z0-9_]/', '', $c) . "`", $cols);
        $placeholders = array_fill(0, count($cols), '?');

        $sql = "INSERT INTO `$table` (" . implode(', ', $escapedCols) . ") VALUES (" . implode(', ', $placeholders) . ")";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute(array_values($data));
            $insertId = $this->db->lastInsertId();
            
            Response::success(['id' => (string)$insertId]);
        } catch (Exception $e) {
            Response::error('Database insert error: ' . $e->getMessage(), 500);
        }
    }

    private function handleUpdate(string $table, array $body, int $userId, bool $isAdmin): void
    {
        if (!$isAdmin && !in_array($table, ['profiles', 'claims', 'promo_codes', 'notices'], true)) {
            Response::error('Access denied', 403);
        }

        $data = $body['data'] ?? [];
        if (empty($data)) {
            Response::error('Missing update data', 400);
        }

        $where = $body['where'] ?? [];
        if (empty($where)) {
            Response::error('Missing target filters for update', 400);
        }

        // Handle json columns encoding
        if (isset($data['documents']) && is_array($data['documents'])) {
            $data['documents'] = json_encode($data['documents']);
        }
        if (isset($data['eligibility_rules']) && is_array($data['eligibility_rules'])) {
            $data['eligibility_rules'] = json_encode($data['eligibility_rules']);
        }

        $sets = [];
        $params = [];
        foreach ($data as $col => $val) {
            $c = preg_replace('/[^a-zA-Z0-9_]/', '', $col);
            $sets[] = "`$c` = ?";
            $params[] = $val;
        }

        $sql = "UPDATE `$table` SET " . implode(', ', $sets) . " WHERE 1=1";

        // RLS
        if (!$isAdmin) {
            $sql .= " AND user_id = ?";
            $params[] = $userId;
        }

        foreach ($where as $w) {
            $col = preg_replace('/[^a-zA-Z0-9_]/', '', $w['col']);
            $op = $w['op'] ?? '=';
            $sql .= " AND `$col` $op ?";
            $params[] = $w['val'];
        }

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            Response::success(['affected_rows' => $stmt->rowCount()]);
        } catch (Exception $e) {
            Response::error('Database update error: ' . $e->getMessage(), 500);
        }
    }

    private function handleDelete(string $table, array $body, int $userId, bool $isAdmin): void
    {
        if (!$isAdmin) {
            Response::error('Access denied', 403);
        }

        $where = $body['where'] ?? [];
        if (empty($where)) {
            Response::error('Missing filters for delete', 400);
        }

        $sql = "DELETE FROM `$table` WHERE 1=1";
        $params = [];

        foreach ($where as $w) {
            $col = preg_replace('/[^a-zA-Z0-9_]/', '', $w['col']);
            $op = $w['op'] ?? '=';
            $sql .= " AND `$col` $op ?";
            $params[] = $w['val'];
        }

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            Response::success(['affected_rows' => $stmt->rowCount()]);
        } catch (Exception $e) {
            Response::error('Database delete error: ' . $e->getMessage(), 500);
        }
    }

    public function rpc(): void
    {
        $payload = AuthMiddleware::authenticate();
        $userId = (int)$payload['sub'];
        $userRole = $payload['role'] ?? 'customer';

        $body = Request::body();
        $fn = $body['fn'] ?? '';
        $args = $body['args'] ?? [];

        switch ($fn) {
            case 'has_role':
                $this->rpcHasRole($args);
                break;
            case 'mark_invoice_paid':
                $this->rpcMarkInvoicePaid($args);
                break;
            case 'mark_invoice_overdue':
                $this->rpcMarkInvoiceOverdue($args);
                break;
            case 'issue_success_fee_invoice':
                $this->rpcIssueSuccessFeeInvoice($args);
                break;
            case 'get_appreciation_enabled':
                $this->rpcGetAppreciationEnabled();
                break;
            default:
                Response::error("Unknown RPC function '$fn'", 400);
        }
    }

    private function rpcHasRole(array $args): void
    {
        $targetUserId = $args['_user_id'] ?? '';
        $targetRole = $args['_role'] ?? '';

        $stmt = $this->db->prepare('SELECT role FROM users WHERE id = ? OR uuid = ? LIMIT 1');
        $stmt->execute([$targetUserId, $targetUserId]);
        $row = $stmt->fetch();

        $hasRole = ($row && $row['role'] === $targetRole);
        Response::success($hasRole);
    }

    private function rpcMarkInvoicePaid(array $args): void
    {
        $invoiceId = (int)($args['_invoice_id'] ?? 0);
        $paymentRef = $args['_razorpay_payment_id'] ?? 'manual';

        $stmt = $this->db->prepare("UPDATE invoices SET status = 'paid', paid_at = NOW(), payment_reference = ? WHERE id = ?");
        $stmt->execute([$paymentRef, $invoiceId]);

        Response::success(true);
    }

    private function rpcMarkInvoiceOverdue(array $args): void
    {
        $invoiceId = (int)($args['_invoice_id'] ?? 0);

        // Get the invoice to find the user
        $stmt = $this->db->prepare("SELECT user_id, total_paise FROM invoices WHERE id = ?");
        $stmt->execute([$invoiceId]);
        $invoice = $stmt->fetch();
        if (!$invoice) {
            Response::error('Invoice not found', 404);
        }

        $userId = (int)$invoice['user_id'];

        // Mark invoice overdue
        $stmt = $this->db->prepare("UPDATE invoices SET status = 'overdue' WHERE id = ?");
        $stmt->execute([$invoiceId]);

        // Calculate total outstanding overdue + issued invoices
        $stmt = $this->db->prepare("SELECT SUM(total_paise) as outstanding FROM invoices WHERE user_id = ? AND status IN ('issued', 'overdue')");
        $stmt->execute([$userId]);
        $outstanding = (int)($stmt->fetch()['outstanding'] ?? 0);

        // Upsert defaulter entry
        $stmt = $this->db->prepare("INSERT INTO defaulters (user_id, total_outstanding_paise, status) VALUES (?, ?, 'active') 
            ON CONFLICT(user_id) DO UPDATE SET total_outstanding_paise = ?, status = 'active'");
        $stmt->execute([$userId, $outstanding, $outstanding]);

        Response::success(true);
    }

    private function rpcIssueSuccessFeeInvoice(array $args): void
    {
        $claimId = (int)($args['_claim_id'] ?? 0);

        $stmt = $this->db->prepare("SELECT * FROM claims WHERE id = ?");
        $stmt->execute([$claimId]);
        $claim = $stmt->fetch();
        if (!$claim) {
            Response::error('Claim not found', 404);
        }

        $payoutPaise = (int)($claim['declared_payout_paise'] ?? 0);
        if ($payoutPaise <= 0) {
            Response::error('No declared payout on this claim to bill against', 400);
        }

        // Calculate GST and Total (20% fee + 18% GST)
        $base = (int)($payoutPaise * 0.20);
        $gst = (int)($base * 0.18);
        $total = $base + $gst;

        // Generate CFS invoice number
        $year = date('y');
        $invoiceNo = 'CFS-' . $year . '-' . str_pad((string)$claimId, 4, '0', STR_PAD_LEFT);

        // Insert Invoice
        $stmt = $this->db->prepare("INSERT INTO invoices (invoice_no, claim_id, user_id, base_amount_paise, gst_paise, total_paise, status, due_date) 
            VALUES (?, ?, ?, ?, ?, ?, 'issued', DATE_ADD(NOW(), INTERVAL 14 DAY))");
        $stmt->execute([$invoiceNo, $claimId, (int)$claim['user_id'], $base, $gst, $total]);
        $invoiceId = $this->db->lastInsertId();

        // Update Claim status to approved
        $stmt = $this->db->prepare("UPDATE claims SET payout_verification_status = 'approved', success_fee_invoice_no = ? WHERE id = ?");
        $stmt->execute([$invoiceNo, $claimId]);

        // Return the created invoice
        $stmt = $this->db->prepare("SELECT * FROM invoices WHERE id = ?");
        $stmt->execute([$invoiceId]);
        $invoice = $stmt->fetch();

        Response::success($invoice);
    }

    private function rpcGetAppreciationEnabled(): void
    {
        $stmt = $this->db->prepare("SELECT appreciation_enabled FROM rewards_config LIMIT 1");
        $stmt->execute();
        $enabled = (bool)($stmt->fetch()['appreciation_enabled'] ?? false);
        Response::success($enabled);
    }

    public function uploadStorage(): void
    {
        $payload = AuthMiddleware::authenticate();
        $path = $_GET['path'] ?? $_POST['path'] ?? '';
        if (empty($path)) {
            Response::error('Missing path parameter', 400);
        }

        if (empty($_FILES['file'])) {
            Response::error('No file uploaded', 400);
        }

        $file = $_FILES['file'];
        
        // Sanitize path to prevent directory traversal
        $sanitizedPath = str_replace('..', '', $path);
        $sanitizedPath = ltrim($sanitizedPath, '/\\');

        $targetPath = UPLOAD_DIR . '/' . $sanitizedPath;
        $targetDir = dirname($targetPath);

        if (!is_dir($targetDir)) {
            @mkdir($targetDir, 0755, true);
        }

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            Response::success(['path' => $path]);
        } else {
            Response::error('Failed to save file in storage', 500);
        }
    }

    public function downloadStorage(): void
    {
        $payload = AuthMiddleware::authenticate();
        $path = $_GET['path'] ?? '';
        if (empty($path)) {
            Response::error('Missing path parameter', 400);
        }

        // Detect if it is doc:DOC_ID format
        if (str_starts_with($path, 'doc:')) {
            $parts = explode(':', $path);
            $docId = (int)($parts[1] ?? 0);
            
            $stmt = $this->db->prepare("SELECT * FROM documents WHERE id = ?");
            $stmt->execute([$docId]);
            $doc = $stmt->fetch();
            if (!$doc) {
                Response::error('Document not found', 404);
            }

            $filePath = UPLOAD_DIR . '/' . $doc['claim_id'] . '/' . $doc['stored_name'];
            $fileName = $doc['original_name'];
            $mimeType = $doc['mime_type'];
        } else {
            // General storage file
            $sanitizedPath = str_replace('..', '', $path);
            $sanitizedPath = ltrim($sanitizedPath, '/\\');
            $filePath = UPLOAD_DIR . '/' . $sanitizedPath;
            $fileName = basename($filePath);
            $mimeType = mime_content_type($filePath) ?: 'application/octet-stream';
        }

        if (!file_exists($filePath)) {
            Response::error('File not found', 404);
        }

        header('Content-Type: ' . $mimeType);
        header('Content-Disposition: inline; filename="' . basename($fileName) . '"');
        header('Content-Length: ' . filesize($filePath));
        header('X-Content-Type-Options: nosniff');
        
        readfile($filePath);
        exit;
    }
}
