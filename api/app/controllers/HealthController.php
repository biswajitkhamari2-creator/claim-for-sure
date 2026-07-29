<?php
declare(strict_types=1);

final class HealthController
{
    public function check(): void
    {
        Response::json([
            'success' => true,
            'status' => 'ok'
        ]);
    }
}
