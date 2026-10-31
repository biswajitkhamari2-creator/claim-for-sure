<?php
declare(strict_types=1);

final class DbController
{
    private const ALLOWED_TABLES = ['claims', 'notices', 'invoices', 'defaulters', 'promo_codes', 'rewards', 'rewards_config', 'rewards_audit_log', 'profiles', 'users'];
    private const ALLOWED_OPS = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'is'];

    // Columns a customer may write through the generic proxy. Everything else
    // (status, payment fields, verification outcomes, ownership) is server-controlled.
    private const CUSTOMER_INSERT_COLUMNS = [
        'claims' => ['claim_id', 'full_name', 'phone', 'email', 'city', 'state', 'insurance_type', 'insurance_company',
                     'policy_number', 'claim_amount', 'rejection_date', 'rejection_reason', 'documents',
                     'title', 'description', 'category', 'insurer_name'],
        'profiles' => ['full_name', 'phone', 'email', 'avatar_url'],
        'rewards' => ['policy_reference', 'claim_id', 'eligibility_snapshot'],
    ];
    private const CUSTOMER_UPDATE_COLUMNS = [
        'claims' => ['documents', 'declared_payout_paise', 'payout_declared_at', 'payout_proof_path',
                     'payout_insurer_name', 'payout_verification_status'],
        'profiles' => ['full_name', 'phone', 'avatar_url'],
    ];
    private const PAYOUT_COLUMNS = ['declared_payout_paise', 'payout_declared_at', 'payout_proof_path', 'payout_insurer_name', 'payout_verification_status'];
    private const MAX_STORAGE_UPLOAD = 10 * 1024 * 1024;

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

        if (!in_array($table, self::ALLOWED_TABLES, true)) {
            Response::error('Invalid table', 400);
        }

        // Apply basic RLS-like protection based on user role and user_id
        $isAdmin = ($userRole === 'admin');

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

    private static function column(mixed $name): string
    {
        $col = preg_replace('/[^a-zA-Z0-9_]/', '', (string)$name);
        if ($col === '') {
            Response::error('Invalid column name', 400);
        }
        return $col;
    }

    // Appends validated WHERE filters. Operators are whitelisted because they are
    // concatenated into the SQL text; values always go through bound parameters.
    private static function appendWhere(string &$sql, array &$params, mixed $where): void
    {
        if (empty($where)) return;
        if (!is_array($where)) {
            Response::error('Invalid filters', 400);
        }
        foreach ($where as $w) {
            if (!is_array($w) || !array_key_exists('col', $w)) {
                Response::error('Invalid filter', 400);
            }
            $col = self::column($w['col']);
            $op = $w['op'] ?? '=';
            if (!in_array($op, self::ALLOWED_OPS, true)) {
                Response::error('Invalid filter operator', 400);
            }
            $val = $w['val'] ?? null;
            if ($op === 'is') {
                if ($val !== null) Response::error('Only IS NULL filters are supported', 400);
                $sql .= " AND `$col` IS NULL";
                continue;
            }
            if (!is_scalar($val) && $val !== null) {
                Response::error('Invalid filter value', 400);
            }
            $sql .= " AND `$col` $op ?";
            $params[] = $val;
        }
    }

    private static function dbError(string $context, Throwable $e): never
    {
        Logger::error("db.$context", ['error' => $e->getMessage()]);
        Response::error('Database error', 500);
    }

    private static function assertCustomerColumns(string $table, array $data, array $allowed): void
    {
        $cols = $allowed[$table] ?? [];
        $denied = array_diff(array_keys($data), $cols, ['user_id']);
        if ($denied) {
            Response::error('Not allowed to set: ' . implode(', ', array_map('strval', $denied)), 403);
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

        self::appendWhere($sql, $params, $body['where'] ?? []);

        // Parse order
        if (!empty($body['order']) && is_array($body['order'])) {
            $orders = [];
            foreach ($body['order'] as $o) {
                $col = self::column($o['col'] ?? '');
                $dir = strtoupper((string)($o['dir'] ?? 'ASC')) === 'DESC' ? 'DESC' : 'ASC';
                $orders[] = "`$col` $dir";
            }
            $sql .= " ORDER BY " . implode(', ', $orders);
        }

        // Parse limit
        if (!empty($body['limit'])) {
            $sql .= " LIMIT " . max(1, (int)$body['limit']);
        }

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Handle json fields formatting for response
            foreach ($data as &$row) {
                unset($row['password_hash']);
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
            unset($row);

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
                unset($row);
            }

            Response::success($data);
        } catch (PDOException $e) {
            self::dbError('select', $e);
        }
    }

    private function handleInsert(string $table, array $body, int $userId, bool $isAdmin): void
    {
        if (!$isAdmin && !isset(self::CUSTOMER_INSERT_COLUMNS[$table])) {
            Response::error('Access denied', 403);
        }

        $data = $body['data'] ?? [];
        if (empty($data) || !is_array($data)) {
            Response::error('Missing data for insert', 400);
        }

        if (!$isAdmin) {
            self::assertCustomerColumns($table, $data, self::CUSTOMER_INSERT_COLUMNS);
            // Force owner on customer-initiated inserts
            $data['user_id'] = $userId;

            if ($table === 'rewards') {
                // Reward terms come from the admin-managed config, never from the client.
                $cfg = $this->db->query("SELECT enabled, reward_type, reward_value, currency FROM rewards_config LIMIT 1")->fetch();
                if (!$cfg || !(int)$cfg['enabled']) {
                    Response::error('Rewards programme is not open', 403);
                }
                $data['reward_type'] = $cfg['reward_type'];
                $data['reward_value'] = $cfg['reward_value'];
                $data['currency'] = $cfg['currency'];
                $data['status'] = 'pending';
            }
        }

        // Handle json columns encoding
        foreach (['documents', 'eligibility_rules', 'eligibility_snapshot', 'before_state', 'after_state'] as $jsonCol) {
            if (isset($data[$jsonCol]) && is_array($data[$jsonCol])) {
                $data[$jsonCol] = json_encode($data[$jsonCol]);
            }
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
        $escapedCols = array_map(fn($c) => "`" . self::column($c) . "`", $cols);
        $placeholders = array_fill(0, count($cols), '?');

        $sql = "INSERT INTO `$table` (" . implode(', ', $escapedCols) . ") VALUES (" . implode(', ', $placeholders) . ")";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute(array_values($data));
            $insertId = $this->db->lastInsertId();

            Response::success(['id' => (string)$insertId]);
        } catch (PDOException $e) {
            self::dbError('insert', $e);
        }
    }

    private function handleUpdate(string $table, array $body, int $userId, bool $isAdmin): void
    {
        if (!$isAdmin && !isset(self::CUSTOMER_UPDATE_COLUMNS[$table])) {
            Response::error('Access denied', 403);
        }

        $data = $body['data'] ?? [];
        if (empty($data) || !is_array($data)) {
            Response::error('Missing update data', 400);
        }

        $where = $body['where'] ?? [];
        if (empty($where)) {
            Response::error('Missing target filters for update', 400);
        }

        $extraSql = '';
        if (!$isAdmin) {
            unset($data['user_id']);
            self::assertCustomerColumns($table, $data, self::CUSTOMER_UPDATE_COLUMNS);

            if ($table === 'claims' && array_intersect(array_keys($data), self::PAYOUT_COLUMNS)) {
                // Customers can only (re)submit a payout for review, never approve it.
                if (isset($data['payout_verification_status']) && $data['payout_verification_status'] !== 'pending') {
                    Response::error('Not allowed to set payout verification status', 403);
                }
                if (isset($data['payout_proof_path'])
                    && !str_starts_with((string)$data['payout_proof_path'], 'payouts/' . $userId . '/')) {
                    Response::error('Invalid payout proof path', 403);
                }
                $extraSql = " AND (payout_verification_status IS NULL OR payout_verification_status <> 'approved')";
            }
        }

        // Handle json columns encoding
        foreach (['documents', 'eligibility_rules'] as $jsonCol) {
            if (isset($data[$jsonCol]) && is_array($data[$jsonCol])) {
                $data[$jsonCol] = json_encode($data[$jsonCol]);
            }
        }

        $sets = [];
        $params = [];
        foreach ($data as $col => $val) {
            $c = self::column($col);
            $sets[] = "`$c` = ?";
            $params[] = $val;
        }

        $sql = "UPDATE `$table` SET " . implode(', ', $sets) . " WHERE 1=1";

        // RLS
        if (!$isAdmin) {
            $sql .= " AND user_id = ?" . $extraSql;
            $params[] = $userId;
        }

        self::appendWhere($sql, $params, $where);

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            Response::success(['affected_rows' => $stmt->rowCount()]);
        } catch (PDOException $e) {
            self::dbError('update', $e);
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
        self::appendWhere($sql, $params, $where);

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            Response::success(['affected_rows' => $stmt->rowCount()]);
        } catch (PDOException $e) {
            self::dbError('delete', $e);
        }
    }

    public function rpc(): void
    {
        $payload = AuthMiddleware::authenticate();
        $userId = (int)$payload['sub'];
        $isAdmin = ($payload['role'] ?? 'customer') === 'admin';

        $body = Request::body();
        $fn = (string)($body['fn'] ?? '');
        $args = is_array($body['args'] ?? null) ? $body['args'] : [];

        $adminOnly = ['mark_invoice_paid', 'mark_invoice_overdue', 'issue_success_fee_invoice'];
        if (in_array($fn, $adminOnly, true) && !$isAdmin) {
            Response::error('Forbidden: insufficient permissions', 403);
        }

        switch ($fn) {
            case 'has_role':
                $this->rpcHasRole($args, $userId, $isAdmin);
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
            case 'verify_claim_payment':
                Response::success((new PaymentService($this->db))->verifyClaimFee($args, $userId, $isAdmin));
            case 'verify_invoice_payment':
                Response::success((new PaymentService($this->db))->verifyInvoice($args, $userId, $isAdmin));
            default:
                Response::error('Unknown RPC function', 400);
        }
    }

    private function rpcHasRole(array $args, int $userId, bool $isAdmin): void
    {
        $targetUserId = (string)($args['_user_id'] ?? '');
        $targetRole = (string)($args['_role'] ?? '');

        // Non-admins may only ask about themselves.
        $sql = 'SELECT role FROM users WHERE (id = ? OR uuid = ?)';
        $params = [$targetUserId, $targetUserId];
        if (!$isAdmin) {
            $sql .= ' AND id = ?';
            $params[] = $userId;
        }
        $stmt = $this->db->prepare($sql . ' LIMIT 1');
        $stmt->execute($params);
        $row = $stmt->fetch();

        $hasRole = ($row && $row['role'] === $targetRole);
        Response::success($hasRole);
    }

    private function rpcMarkInvoicePaid(array $args): void
    {
        $invoiceId = (int)($args['_invoice_id'] ?? 0);
        $paymentRef = substr((string)($args['_razorpay_payment_id'] ?? 'manual'), 0, 100);

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

        // Upsert defaulter entry (MySQL syntax; defaulters.user_id is the primary key)
        $stmt = $this->db->prepare("INSERT INTO defaulters (user_id, total_outstanding_paise, status) VALUES (?, ?, 'active')
            ON DUPLICATE KEY UPDATE total_outstanding_paise = VALUES(total_outstanding_paise), status = 'active'");
        $stmt->execute([$userId, $outstanding]);

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
        if (!empty($claim['success_fee_invoice_no'])) {
            Response::error('An invoice has already been issued for this claim', 409);
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
        $row = $stmt->fetch();
        Response::success((bool)($row['appreciation_enabled'] ?? false));
    }

    // Storage paths are relative to UPLOAD_DIR. Every segment must start with an
    // alphanumeric character, which rules out "..", "." and dotfiles like .htaccess.
    private static function cleanPath(mixed $path): ?string
    {
        $path = ltrim(str_replace('\\', '/', (string)$path), '/');
        if ($path === '' || strlen($path) > 255) return null;
        if (!preg_match('#^[A-Za-z0-9][A-Za-z0-9._-]*(/[A-Za-z0-9][A-Za-z0-9._-]*)*$#', $path)) return null;
        return $path;
    }

    // Customers may only touch files under one of their own claims:
    //   payouts/<their user id>/<their claim id>/...   (payout proofs)
    //   <their claim number>/...                       (claim documents)
    // Anyone signed in may upload a lead attachment under leads/, but only admins read them.
    private function canAccessPath(string $path, int $userId, bool $isAdmin, bool $forWrite): bool
    {
        if ($isAdmin) return true;
        $seg = explode('/', $path);
        if (count($seg) < 2) return false;

        if ($seg[0] === 'leads') {
            return $forWrite && count($seg) === 2;
        }
        if ($seg[0] === 'payouts') {
            if (count($seg) < 4 || $seg[1] !== (string)$userId || !ctype_digit($seg[2])) return false;
            $stmt = $this->db->prepare('SELECT 1 FROM claims WHERE id = ? AND user_id = ? LIMIT 1');
            $stmt->execute([(int)$seg[2], $userId]);
            return (bool)$stmt->fetchColumn();
        }
        $stmt = $this->db->prepare('SELECT 1 FROM claims WHERE (claim_id = ? OR claim_number = ?) AND user_id = ? LIMIT 1');
        $stmt->execute([$seg[0], $seg[0], $userId]);
        return (bool)$stmt->fetchColumn();
    }

    public function uploadStorage(): void
    {
        $payload = AuthMiddleware::authenticate();
        $userId = (int)$payload['sub'];
        $isAdmin = ($payload['role'] ?? 'customer') === 'admin';

        $path = self::cleanPath($_GET['path'] ?? $_POST['path'] ?? '');
        if ($path === null) {
            Response::error('Invalid path parameter', 400);
        }

        $file = $_FILES['file'] ?? null;
        if (!is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_uploaded_file($file['tmp_name'])) {
            Response::error('No file uploaded', 400);
        }
        if ((int)$file['size'] > self::MAX_STORAGE_UPLOAD) {
            Response::error('File too large (max 10MB)', 413);
        }

        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) ?: '';
        $allowedExt = array_merge(array_values(ALLOWED_MIME), ['jpeg']);
        if (!isset(ALLOWED_MIME[$mime]) || !in_array($ext, $allowedExt, true)) {
            Response::error('Unsupported file type', 415);
        }

        if (!$this->canAccessPath($path, $userId, $isAdmin, true)) {
            Response::error('Forbidden', 403);
        }

        $targetPath = UPLOAD_DIR . '/' . $path;
        if (file_exists($targetPath)) {
            Response::error('A file already exists at this path', 409);
        }
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
        $userId = (int)$payload['sub'];
        $isAdmin = ($payload['role'] ?? 'customer') === 'admin';

        $rawPath = (string)($_GET['path'] ?? '');
        if ($rawPath === '') {
            Response::error('Missing path parameter', 400);
        }

        // Detect if it is doc:DOC_ID format
        if (str_starts_with($rawPath, 'doc:')) {
            $parts = explode(':', $rawPath);
            $docId = (int)($parts[1] ?? 0);

            $stmt = $this->db->prepare("SELECT d.*, c.user_id AS claim_owner FROM documents d JOIN claims c ON c.id = d.claim_id WHERE d.id = ?");
            $stmt->execute([$docId]);
            $doc = $stmt->fetch();
            if (!$doc || (!$isAdmin && (int)$doc['claim_owner'] !== $userId)) {
                Response::error('Document not found', 404);
            }

            $filePath = UPLOAD_DIR . '/' . (int)$doc['claim_id'] . '/' . basename((string)$doc['stored_name']);
            $fileName = $doc['original_name'];
            $mimeType = $doc['mime_type'];
        } else {
            // General storage file
            $path = self::cleanPath($rawPath);
            if ($path === null || !$this->canAccessPath($path, $userId, $isAdmin, false)) {
                Response::error('File not found', 404);
            }
            $filePath = UPLOAD_DIR . '/' . $path;
            $fileName = basename($filePath);
            $mimeType = is_file($filePath) ? (mime_content_type($filePath) ?: 'application/octet-stream') : '';
        }

        if (!is_file($filePath)) {
            Response::error('File not found', 404);
        }

        // Only render PDFs and images inline; anything else is forced to download.
        $inline = $mimeType === 'application/pdf' || str_starts_with((string)$mimeType, 'image/');
        $safeName = str_replace(['"', "\r", "\n"], '', basename((string)$fileName));
        header('Content-Type: ' . ($inline ? $mimeType : 'application/octet-stream'));
        header('Content-Disposition: ' . ($inline ? 'inline' : 'attachment') . '; filename="' . $safeName . '"');
        header('Content-Length: ' . filesize($filePath));
        header('X-Content-Type-Options: nosniff');
        header('Cache-Control: private, no-store');

        readfile($filePath);
        exit;
    }
}
