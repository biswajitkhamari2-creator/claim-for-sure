<?php
declare(strict_types=1);
return [
    'POST /api/auth/forgot-password' => ['PasswordController', 'forgot'],
    'POST /api/auth/reset-password'  => ['PasswordController', 'reset'],
    'GET /api/admin/dashboard'       => ['AdminController', 'dashboard'],
    'GET /api/admin/users'           => ['AdminController', 'users'],
    'PATCH /api/admin/users/{id}'    => ['AdminController', 'toggleUser'],
    'GET /api/admin/claims'          => ['AdminController', 'claims'],
    'POST /api/admin/send-mail'      => ['AdminController', 'sendMail'],
];
