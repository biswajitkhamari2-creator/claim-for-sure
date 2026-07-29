<?php
ini_set('display_errors', '1');
error_reporting(E_ALL);
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['REQUEST_URI'] = '/api/auth/me';
$_SERVER['REMOTE_ADDR'] = '127.0.0.1';
require 'public/index.php';
