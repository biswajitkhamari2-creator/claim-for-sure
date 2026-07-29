<?php
declare(strict_types=1);
final class RateLimitMiddleware
{
    public static function check(string $key, int $max = 60, int $window = 60): void
    {
        $dir = APP_ROOT . '/storage/ratelimit';
        if (!is_dir($dir)) {
            @mkdir($dir, 0777, true);
        }
        if (is_dir($dir) && !is_writable($dir)) {
            @chmod($dir, 0777);
        }
        
        $file = $dir . '/' . md5($key) . '.json';
        $now = time();
        $data = ['count' => 0, 'reset' => $now + $window];
        
        if (is_readable($file)) {
            $content = @file_get_contents($file);
            if ($content !== false) {
                $s = json_decode($content, true);
                if (is_array($s) && isset($s['reset']) && $s['reset'] > $now) {
                    $data = $s;
                }
            }
        }
        
        $data['count']++;
        
        if (is_writable($dir) || is_writable($file)) {
            @file_put_contents($file, json_encode($data), LOCK_EX);
        }
        
        if ($data['count'] > $max) {
            header('Retry-After: ' . max(1, $data['reset'] - $now));
            Response::error('Too many requests. Please slow down.', 429);
        }
    }
}