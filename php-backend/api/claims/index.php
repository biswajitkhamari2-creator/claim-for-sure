<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
$u = require_user();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = db()->prepare(
        'SELECT id, claim_id, insurance_company, insurance_type, claim_amount, status, created_at
         FROM claims WHERE user_id = ? ORDER BY created_at DESC'
    );
    $stmt->execute([$u['id']]);
    json_response(['claims' => $stmt->fetchAll()]);
}

require_method('POST');
$in = json_input();

$required = [
    'full_name','phone','email','city','state','insurance_type','insurance_company',
    'policy_number','claim_amount','rejection_date','rejection_reason',
];
foreach ($required as $k) {
    if (!isset($in[$k]) || $in[$k] === '' || $in[$k] === null) {
        json_response(['error' => 'missing_field', 'field' => $k], 422);
    }
}
if (!valid_email((string)$in['email']))                  json_response(['error' => 'invalid_email'], 422);
if (!preg_match('/^\d{10}$/', (string)$in['phone']))     json_response(['error' => 'invalid_phone'], 422);
if (!is_numeric($in['claim_amount']) || $in['claim_amount'] <= 0) json_response(['error' => 'invalid_amount'], 422);
if (!DateTime::createFromFormat('Y-m-d', (string)$in['rejection_date'])) json_response(['error' => 'invalid_date'], 422);

$id      = uuid();
$claimId = 'CFS-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 8));

db()->prepare(
    'INSERT INTO claims
       (id,claim_id,user_id,full_name,phone,email,city,state,insurance_type,insurance_company,
        policy_number,claim_amount,rejection_date,rejection_reason)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
)->execute([
    $id, $claimId, $u['id'],
    sanitize_string($in['full_name'], 150),
    sanitize_string($in['phone'], 20),
    strtolower(sanitize_string($in['email'], 255)),
    sanitize_string($in['city'], 100),
    sanitize_string($in['state'], 100),
    sanitize_string($in['insurance_type'], 80),
    sanitize_string($in['insurance_company'], 150),
    sanitize_string($in['policy_number'], 80),
    (float)$in['claim_amount'],
    (string)$in['rejection_date'],
    sanitize_string($in['rejection_reason'], 4000),
]);

log_activity($u['id'], 'claim_created', ['claim_id' => $claimId]);
json_response(['id' => $id, 'claim_id' => $claimId], 201);
