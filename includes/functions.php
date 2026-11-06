<?php

declare(strict_types=1);

/* ---------- HELPERS ---------- */
function e(string|int|float $s): string
{
  return htmlspecialchars((string)$s, ENT_QUOTES, 'UTF-8');
}

function greeting(): string
{
  $h = (int)date('G');
  return $h < 5 ? 'Still up?' : ($h < 12 ? 'Good morning' : ($h < 18 ? 'Good afternoon' : 'Good evening'));
}

/* Cache-busting version for a file in the site root (portrait.jpg, css, js) */
function ver(string $relative): int
{
  $f = ROOT . '/' . $relative;
  return is_file($f) ? (int)filemtime($f) : 0;
}

/* ---------- VISIT COUNTER (once per session) ---------- */
function count_visit(): int
{
  $file = ROOT . '/visits.txt';
  $visits = is_file($file) ? (int)file_get_contents($file) : 0;
  if (empty($_SESSION['counted'])) {
    $visits++;
    @file_put_contents($file, (string)$visits, LOCK_EX);
    $_SESSION['counted'] = true;
  }
  return $visits;
}
