<?php
declare(strict_types=1);
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as MailException;

final class MailService
{
    public function send(string $toEmail, string $toName, string $subject, string $htmlBody): bool
    {
        // Graceful degradation if PHPMailer not installed yet
        if (!class_exists(PHPMailer::class)) {
            Logger::error('mail.phpmailer_missing', ['to' => $toEmail]);
            return false;
        }
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = $_ENV['SMTP_HOST'] ?? '';
            $mail->SMTPAuth   = true;
            $mail->Username   = $_ENV['SMTP_USER'] ?? '';
            $mail->Password   = $_ENV['SMTP_PASS'] ?? '';
            $port             = (int)($_ENV['SMTP_PORT'] ?? 465);
            $mail->Port       = $port;
            $mail->SMTPSecure = ($port === 587) ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
            $mail->setFrom($_ENV['MAIL_FROM'] ?? 'no-reply@claimforsure.com', APP_NAME);
            $mail->addAddress($toEmail, $toName);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlBody;
            $mail->AltBody = strip_tags($htmlBody);
            $mail->send();
            Logger::info('mail.sent', ['to' => $toEmail, 'subject' => $subject]);
            return true;
        } catch (MailException $e) {
            Logger::error('mail.failed', ['to' => $toEmail, 'error' => $mail->ErrorInfo]);
            return false;
        }
    }

    public function welcome(string $email, string $name): void
    {
        $this->send($email, $name, 'Welcome to ' . APP_NAME,
            EmailTemplate::render('welcome', ['name' => $name]));
    }

    public function passwordReset(string $email, string $name, string $link): void
    {
        $this->send($email, $name, 'Reset your password',
            EmailTemplate::render('reset', ['name' => $name, 'link' => $link]));
    }

    public function claimUpdate(string $email, string $name, string $claimNo, string $status): void
    {
        $this->send($email, $name, "Update on claim {$claimNo}",
            EmailTemplate::render('claim_update', ['name' => $name, 'claim' => $claimNo, 'status' => $status]));
    }
}
