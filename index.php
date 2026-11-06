<?php

declare(strict_types=1);
require __DIR__ . '/includes/bootstrap.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title><?= e($me['first']) ?> — Welcome</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=Instrument+Sans:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/landing.css?v=<?= ver('assets/css/landing.css') ?>">
</head>

<body>
  <main class="stage" id="stage">
    <div class="ghost" style="background-image:url('portrait.jpg?v=<?= ver('portrait.jpg') ?>')" aria-hidden="true"></div>
    <div class="glow" aria-hidden="true"></div>

    <div class="copy">
      <p class="hi"><?= e(greeting()) ?> · <?= e(date('l, F j')) ?> · Manila</p>
      <h1 class="name" aria-label="<?= e($me['first']) ?>"><span aria-hidden="true"><?= e($me['first']) ?></span></h1>
      <p class="roles"><?= e(implode('  /  ', $me['roles'])) ?></p>

      <a class="go" id="go" href="portfolio.php?start=1">
        <span class="label">meet <?= e($me['first']) ?></span>
        <span class="arrow" aria-hidden="true">→</span>
      </a>
      <p class="hint">Hover the button to bring him into focus.</p>
    </div>

    <div class="curtain" id="curtain" aria-hidden="true"></div>
  </main>

  <script src="assets/js/landing.js?v=<?= ver('assets/js/landing.js') ?>"></script>
</body>

</html>
