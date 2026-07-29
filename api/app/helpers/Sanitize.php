<?php
declare(strict_types=1);
/** Output escaping helper (XSS protection for any HTML output). */
final class Sanitize
{
    public static function html(string $v): string
    {
        return htmlspecialchars($v, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }
    public static function array(array $data): array
    {
        $out = [];
        foreach ($data as $k => $v) {
            $out[$k] = is_string($v) ? self::html($v) : (is_array($v) ? self::array($v) : $v);
        }
        return $out;
    }
}
