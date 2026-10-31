<?php
declare(strict_types=1);
return [
    'GET /api/health'                => ['HealthController', 'check'],
    'POST /api/auth/otp/send'        => ['OtpController', 'send'],
    'POST /api/auth/otp/verify'      => ['OtpController', 'verify'],
    'POST /api/auth/otp/complete'    => ['OtpController', 'complete'],
    'POST /api/auth/login'           => ['AuthController', 'login'],
    'POST /api/auth/logout'          => ['AuthController', 'logout'],
    'GET /api/auth/me'               => ['AuthController', 'me'],
    'POST /api/auth/me'              => ['AuthController', 'me'],
    'PATCH /api/auth/me'             => ['AuthController', 'updateProfile'],
    
    // Generic Database & RPC Proxy
    'POST /api/db/query'             => ['DbController', 'query'],
    'POST /api/db/rpc'               => ['DbController', 'rpc'],
    'POST /api/storage/upload'       => ['DbController', 'uploadStorage'],
    'GET /api/storage/download'      => ['DbController', 'downloadStorage'],

    'POST /api/claims'               => ['ClaimController', 'create'],
    'GET /api/claims'                => ['ClaimController', 'listMine'],
    'GET /api/claims/{id}'           => ['ClaimController', 'view'],
    'PATCH /api/claims/{id}/status'  => ['ClaimController', 'updateStatus'],
    'DELETE /api/claims/{id}'        => ['ClaimController', 'delete'],
    'POST /api/claims/{id}/documents'=> ['DocumentController', 'upload'],
    'GET /api/claims/{id}/documents' => ['DocumentController', 'listForClaim'],
    'GET /api/documents/{id}'        => ['DocumentController', 'download'],
    'DELETE /api/documents/{id}'     => ['DocumentController', 'delete'],
];