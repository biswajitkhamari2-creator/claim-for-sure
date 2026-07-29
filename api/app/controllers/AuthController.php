<?php
declare(strict_types=1);
final class AuthController
{
    private AuthService $service;
    public function __construct() { $this->service = new AuthService(Database::getConnection()); }
    public function register(): void { Response::success($this->service->register(Request::body()), 'Registration successful', 201); }
    public function login(): void { Response::success($this->service->login(Request::body()), 'Login successful'); }
    public function me(): void
    {
        $payload = AuthMiddleware::authenticate();
        $user = (new UserRepository(Database::getConnection()))->findById((int)$payload['sub']);
        if (!$user) Response::error('User not found', 404);
        unset($user['password_hash']);
        Response::success(['user' => $user], 'Profile fetched');
    }
    public function updateProfile(): void
    {
        $payload = AuthMiddleware::authenticate();
        $userId = (int)$payload['sub'];
        $body = Request::body();
        $repo = new UserRepository(Database::getConnection());
        $user = $repo->findById($userId);
        if (!$user) Response::error('User not found', 404);
        
        $fullName = isset($body['full_name']) ? trim((string)$body['full_name']) : $user['full_name'];
        $phone    = isset($body['phone']) ? trim((string)$body['phone']) : $user['phone'];
        
        $db = Database::getConnection();
        $stmt = $db->prepare('UPDATE users SET full_name = ?, phone = ?, updated_at = NOW() WHERE id = ?');
        $stmt->execute([$fullName, $phone, $userId]);
        
        $updated = $repo->findById($userId);
        unset($updated['password_hash']);
        Response::success(['user' => $updated], 'Profile updated successfully');
    }
    public function logout(): void
    {
        $payload = AuthMiddleware::authenticate();
        Logger::audit('user.logout', ['user_id' => $payload['sub']]);
        Response::success(null, 'Logged out');
    }
}