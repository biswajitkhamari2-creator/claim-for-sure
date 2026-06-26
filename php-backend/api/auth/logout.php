<?php
require_once __DIR__ . '/../../lib/helpers.php'; bootstrap();
require_method('POST');
// Stateless JWT — client just deletes the token. Logged for audit.
$u = current_user();
log_activity($u['id'] ?? null, 'logout');
json_response(['ok' => true]);
