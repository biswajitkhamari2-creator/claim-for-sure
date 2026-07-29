<?php
declare(strict_types=1);
final class Logger
{
    private static function write(string $level, string $msg, array $ctx = []): void
    {
        if (!is_dir(LOG_DIR)) { @mkdir(LOG_DIR, 0755, true); }
        $line = sprintf("[%s] %s: %s %s\n", date('Y-m-d H:i:s'),
            strtoupper($level), $msg, $ctx ? json_encode($ctx) : '');
        @file_put_contents(LOG_DIR . '/app-' . date('Y-m-d') . '.log', $line, FILE_APPEND | LOCK_EX);
    }
    public static function info(string $m, array $c = []): void  { self::write('info', $m, $c); }
    public static function error(string $m, array $c = []): void { self::write('error', $m, $c); }
    public static function audit(string $m, array $c = []): void { self::write('audit', $m, $c); }
}