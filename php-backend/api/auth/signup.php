<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('POST');

$in       = json_input();
$email    = strtolower(sanitize_string($in['email'] ?? '', 255));
$password = (string)($in['password'] ?? '');
$name     = sanitize_string($in['full_name'] ?? '', 150);
$phone    = sanitize_string($in['phone'] ?? '', 20);

if (!valid_email($email))                      json_response(['error' => 'invalid_email'], 422);
if (strlen($password) < 8)                     json_response(['error' => 'weak_password'], 422);
if ($phone !== '' && !preg_match('/^\d{10}$/', $phone)) json_response(['error' => 'invalid_phone'], 422);

$pdo = db();
$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) json_response(['error' => 'email_taken'], 409);

$id   = uuid();
$hash = password_hash($password, PASSWORD_BCRYPT);
$pdo->prepare(
    'INSERT INTO users (id,email,password_hash,full_name,phone) VALUES (?,?,?,?,?)'
)->execute([$id, $email, $hash, $name, $phone]);

// email verification token
$token = bin2hex(random_bytes(32));
$pdo->prepare(
    'INSERT INTO email_verification_tokens (id,user_id,token_hash,expires_at) VALUES (?,?,?, DATE_ADD(NOW(), INTERVAL 24 HOUR))'
)->execute([uuid(), $id, hash('sha256', $token)]);

log_activity($id, 'signup');

json_response([
    'token'  => jwt_encode(['sub' => $id, 'email' => $email]),
    'user'   => ['id' => $id, 'email' => $email, 'full_name' => $name, 'phone' => $phone, 'email_verified' => 0],
    // In production: email this link instead of returning it.
    'verify_link' => FRONTEND_URL . '/auth/verify?token=' . $token,
], 201);
