<?php
declare(strict_types=1);

// Confirms Razorpay payments server-side before anything is marked paid.
// The browser only reports a payment id; amount, currency and status are
// checked against Razorpay's API using the secret key, and the expected
// amount (including promo discounts) is recomputed here.
final class PaymentService
{
    private const CLAIM_FEE_PAISE = 177000; // INR 1,500 + 18% GST
    private const RAZORPAY_API = 'https://api.razorpay.com/v1';

    public function __construct(private PDO $db) {}

    private static function env(string $key): string
    {
        $v = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
        return is_string($v) ? $v : '';
    }

    // Lets staging run end-to-end without real money. Requires PAYMENTS_TEST_MODE=1
    // on the server; payment ids must look like "TEST-...".
    private static function isTestPayment(string $paymentId): bool
    {
        return self::env('PAYMENTS_TEST_MODE') === '1' && str_starts_with($paymentId, 'TEST-');
    }

    public function verifyClaimFee(array $args, int $userId, bool $isAdmin): array
    {
        $claimId = (int)($args['_claim_id'] ?? 0);
        $paymentId = trim((string)($args['_razorpay_payment_id'] ?? ''));
        $promoInput = trim((string)($args['_promo_code'] ?? ''));

        $stmt = $this->db->prepare('SELECT id, user_id, payment_status, payment_amount_paise FROM claims WHERE id = ?');
        $stmt->execute([$claimId]);
        $claim = $stmt->fetch();
        if (!$claim || (!$isAdmin && (int)$claim['user_id'] !== $userId)) {
            Response::error('Claim not found', 404);
        }
        if (($claim['payment_status'] ?? '') === 'paid') {
            Response::error('This claim has already been paid for', 409);
        }

        $original = (int)($claim['payment_amount_paise'] ?: self::CLAIM_FEE_PAISE);
        $promo = null;
        if ($promoInput !== '') {
            $promo = $this->findUsablePromo($promoInput);
            if (!$promo) Response::error('Invalid or expired promo code', 400);
        }
        $discount = $promo ? self::discountPaise($promo, $original) : 0;
        $total = max(0, $original - $discount);

        if ($total === 0) {
            $paymentId = 'PROMO-' . $promo['code'];
        } elseif (!self::isTestPayment($paymentId)) {
            $this->assertPaymentUnused($paymentId);
            $this->captureAndVerify($paymentId, $total);
        }

        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare("UPDATE claims SET payment_status = 'paid', payment_id = ?, payment_paid_at = NOW(),
                promo_code_applied = ?, discount_paise = ? WHERE id = ? AND (payment_status IS NULL OR payment_status <> 'paid')");
            $stmt->execute([$paymentId, $promo['code'] ?? null, $discount, $claimId]);
            if ($stmt->rowCount() === 0) {
                $this->db->rollBack();
                Response::error('This claim has already been paid for', 409);
            }
            if ($promo) {
                $this->db->prepare('UPDATE promo_codes SET times_used = times_used + 1 WHERE id = ?')->execute([(int)$promo['id']]);
            }
            $this->db->commit();
        } catch (PDOException $e) {
            $this->db->rollBack();
            Logger::error('payment.claim_fee_update', ['claim_id' => $claimId, 'payment_id' => $paymentId, 'error' => $e->getMessage()]);
            Response::error('Payment received but could not be recorded. Please contact support.', 500);
        }

        Logger::audit('payment.claim_fee', ['claim_id' => $claimId, 'user_id' => $userId, 'payment_id' => $paymentId, 'amount_paise' => $total]);
        return ['paid' => true, 'payment_id' => $paymentId, 'amount_paise' => $total, 'discount_paise' => $discount];
    }

    public function verifyInvoice(array $args, int $userId, bool $isAdmin): array
    {
        $invoiceId = (int)($args['_invoice_id'] ?? 0);
        $paymentId = trim((string)($args['_razorpay_payment_id'] ?? ''));

        $stmt = $this->db->prepare('SELECT id, user_id, total_paise, status FROM invoices WHERE id = ?');
        $stmt->execute([$invoiceId]);
        $invoice = $stmt->fetch();
        if (!$invoice || (!$isAdmin && (int)$invoice['user_id'] !== $userId)) {
            Response::error('Invoice not found', 404);
        }
        if ($invoice['status'] === 'paid') {
            Response::error('This invoice has already been paid', 409);
        }

        $total = (int)$invoice['total_paise'];
        if (!self::isTestPayment($paymentId)) {
            $this->assertPaymentUnused($paymentId);
            $this->captureAndVerify($paymentId, $total);
        }

        $stmt = $this->db->prepare("UPDATE invoices SET status = 'paid', paid_at = NOW(), payment_reference = ? WHERE id = ? AND status <> 'paid'");
        $stmt->execute([$paymentId, $invoiceId]);
        if ($stmt->rowCount() === 0) {
            Response::error('This invoice has already been paid', 409);
        }

        Logger::audit('payment.invoice', ['invoice_id' => $invoiceId, 'user_id' => $userId, 'payment_id' => $paymentId, 'amount_paise' => $total]);
        return ['paid' => true, 'payment_id' => $paymentId, 'amount_paise' => $total];
    }

    private function findUsablePromo(string $code): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM promo_codes WHERE UPPER(code) = UPPER(?) AND active = 1
            AND (expires_at IS NULL OR expires_at > NOW()) AND (max_uses IS NULL OR times_used < max_uses) LIMIT 1');
        $stmt->execute([$code]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    // Mirrors the calculation shown on the pay page: percent off, or a flat amount in paise.
    private static function discountPaise(array $promo, int $originalPaise): int
    {
        $value = max(0, (int)$promo['discount_value']);
        $discount = $promo['discount_type'] === 'percent'
            ? intdiv($originalPaise * min($value, 100), 100)
            : $value;
        return min($discount, $originalPaise);
    }

    private function assertPaymentUnused(string $paymentId): void
    {
        if (!preg_match('/^pay_[A-Za-z0-9]{6,40}$/', $paymentId)) {
            Response::error('Invalid payment id', 400);
        }
        $stmt = $this->db->prepare('SELECT 1 FROM claims WHERE payment_id = ? UNION SELECT 1 FROM invoices WHERE payment_reference = ? LIMIT 1');
        $stmt->execute([$paymentId, $paymentId]);
        if ($stmt->fetchColumn()) {
            Response::error('This payment has already been used', 409);
        }
    }

    private function captureAndVerify(string $paymentId, int $expectedPaise): void
    {
        $payment = $this->razorpay('GET', '/payments/' . $paymentId);

        if (($payment['currency'] ?? '') !== 'INR' || (int)($payment['amount'] ?? -1) !== $expectedPaise) {
            Logger::error('payment.amount_mismatch', ['payment_id' => $paymentId, 'expected' => $expectedPaise, 'got' => $payment['amount'] ?? null]);
            Response::error('Payment amount does not match the amount due', 400);
        }

        // Payments made without a Razorpay order may stay "authorized" until captured.
        if (($payment['status'] ?? '') === 'authorized') {
            $payment = $this->razorpay('POST', '/payments/' . $paymentId . '/capture', ['amount' => $expectedPaise, 'currency' => 'INR']);
        }

        if (($payment['status'] ?? '') !== 'captured') {
            Response::error('Payment has not been completed', 402);
        }
    }

    private function razorpay(string $method, string $path, ?array $body = null): array
    {
        $keyId = self::env('RAZORPAY_KEY_ID');
        $secret = self::env('RAZORPAY_KEY_SECRET');
        if ($keyId === '' || $secret === '') {
            Logger::error('payment.not_configured');
            Response::error('Payment verification is not configured. Please contact support.', 503);
        }

        $headers = [
            'Authorization: Basic ' . base64_encode($keyId . ':' . $secret),
            'Content-Type: application/json',
        ];
        $payload = $body !== null ? json_encode($body) : null;

        if (!function_exists('curl_init')) {
            Logger::error('payment.curl_missing');
            Response::error('Payment verification is not configured. Please contact support.', 503);
        }
        $ch = curl_init(self::RAZORPAY_API . $path);
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15,
        ]);
        if ($payload !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        $raw = curl_exec($ch);
        $status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);

        $data = is_string($raw) ? json_decode($raw, true) : null;
        if ($status < 200 || $status >= 300 || !is_array($data)) {
            Logger::error('payment.razorpay_error', ['path' => $path, 'status' => $status, 'body' => is_string($raw) ? substr($raw, 0, 500) : null]);
            Response::error('Could not verify the payment with Razorpay', 502);
        }
        return $data;
    }
}
