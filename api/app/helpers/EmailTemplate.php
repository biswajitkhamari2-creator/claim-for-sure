<?php
declare(strict_types=1);
final class EmailTemplate
{
    public static function render(string $template, array $vars): string
    {
        $esc = fn($v) => htmlspecialchars((string)$v, ENT_QUOTES, 'UTF-8');
        $wrap = fn(string $inner) =>
            '<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:8px;padding:24px">'
            . '<h2 style="color:#1a73e8">' . APP_NAME . '</h2>' . $inner
            . '<hr><p style="color:#888;font-size:12px">Automated message. Do not reply.</p></div>';

        switch ($template) {
            case 'welcome':
                return $wrap('<p>Hi ' . $esc($vars['name']) . ',</p><p>Welcome to ' . APP_NAME
                    . '! Your account is ready. You can now file and track insurance claims securely.</p>');
            case 'reset':
                return $wrap('<p>Hi ' . $esc($vars['name']) . ',</p>'
                    . '<p>Click below to reset your password. This link expires in 30 minutes.</p>'
                    . '<p><a href="' . $esc($vars['link']) . '" style="background:#1a73e8;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Reset Password</a></p>'
                    . '<p>If you did not request this, you can safely ignore this email.</p>');
            case 'claim_update':
                return $wrap('<p>Hi ' . $esc($vars['name']) . ',</p>'
                    . '<p>Your claim <strong>' . $esc($vars['claim']) . '</strong> status is now: <strong>'
                    . $esc($vars['status']) . '</strong>.</p>');
            default:
                return $wrap('<p>' . $esc($vars['message'] ?? '') . '</p>');
        }
    }
}
