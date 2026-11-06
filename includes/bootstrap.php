<?php

declare(strict_types=1);

/* Loaded first by every page: session, timezone, data and helpers. */
define('ROOT', dirname(__DIR__));
session_start();
date_default_timezone_set('Asia/Manila');

require __DIR__ . '/data.php';
require __DIR__ . '/functions.php';
