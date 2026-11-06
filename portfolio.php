<?php

declare(strict_types=1);
require __DIR__ . '/includes/bootstrap.php';

/* The landing page (index.php) is the front door. Its start button comes here with ?start=1 */
if (isset($_GET['start'])) {
  $_SESSION['met'] = true;
  header('Location: portfolio.php');
  exit;
}
if (empty($_SESSION['met'])) {
  header('Location: index.php');
  exit;
}

$visits = count_visit();
?>
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title><?= e($me['name']) ?> — Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=Instrument+Sans:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/portfolio.css?v=<?= ver('assets/css/portfolio.css') ?>">
</head>

<body>
  <div id="bar"></div>
  <header class="nav">
    <div class="wrap"><b><?= e($me['name']) ?></b>
      <nav aria-label="Sections">
        <?php foreach (['credentials' => 'Credentials', 'skills' => 'Skills', 'apps' => 'Apps', 'photos' => 'Photos', 'certs' => 'Certifications', 'contact' => 'Contact'] as $id => $label): ?>
          <a href="#<?= $id ?>"><?= e($label) ?></a>
        <?php endforeach; ?>
      </nav>
    </div>
  </header>

  <main>
    <div class="wrap hero">
      <div class="wrap2">
        <div>
          <p class="hi"><?= e(greeting()) ?>, and welcome. It is <?= e(date('l, F j')) ?> in Manila.</p>
          <h1 class="reg" id="name" data-t="<?= e($me['name']) ?>" aria-label="<?= e($me['name']) ?>"><span aria-hidden="true"><?= e($me['name']) ?></span></h1>
          <p class="lede">I am a <span class="role" id="role" data-roles='<?= e(json_encode($me['roles'])) ?>'><?= e($me['roles'][0]) ?></span><span class="caret"></span>. I build apps, take photos, and keep my work in one place.
            <small>Move your pointer over the name and the ink layers drift. Pull the rope to drop my portrait, then point at it to reveal a halftone print.</small>
          </p>
          <div class="stats"><span><?= count($apps) ?> apps</span><span><?= array_sum(array_map(fn($g) => count($g[1]), $skills)) ?> skills</span><span><?= count($photos) ?> photos</span><span><?= count($certs) ?> certificates</span><span>Visitor no. <?= number_format($visits) ?></span></div>
        </div>
        <figure class="pf">
          <div class="rig" id="rig">
            <div class="stage">
              <div class="swing">
                <div class="tilt">
                  <div class="portrait" id="portrait" data-img="portrait.jpg?v=<?= ver('portrait.jpg') ?>" data-alt-img="portrait_alt.jpg?v=<?= ver('portrait_alt.jpg') ?>" tabindex="0" role="img" aria-label="Portrait of <?= e($me['name']) ?>">
                    <div class="l base"></div>
                    <div class="l ht"></div>
                  </div>
                </div>
              </div>
              <svg class="cords" aria-hidden="true">
                <line id="cordA" x1="0" y1="0" x2="0" y2="0" />
                <line id="cordB" x1="0" y1="0" x2="0" y2="0" />
              </svg>
            </div>
            <svg id="rope" viewBox="0 0 64 340" aria-hidden="false">
              <g class="mount">
                <rect x="-2" y="2" width="66" height="10" fill="var(--ink)" />
                <circle cx="32" cy="12" r="9" fill="var(--paper)" stroke="var(--ink)" stroke-width="3" />
                <circle cx="32" cy="12" r="2.6" fill="var(--ink)" />
              </g>
              <g transform="translate(0 12)">
                <path id="rCore" class="r-core" fill="none" />
                <path id="rBackA" class="r-a" fill="none" />
                <path id="rBackB" class="r-b" fill="none" />
                <path id="rEdge" class="r-edge" fill="none" />
                <path id="rFrontA" class="r-a" fill="none" />
                <path id="rFrontB" class="r-b" fill="none" />
                <g id="handle" tabindex="0" role="button" aria-pressed="false" aria-label="Pull the rope to drop the portrait">
                  <rect x="-26" y="-14" width="52" height="116" fill="transparent" />
                  <path d="M-5 -2Q0 -6 5 -2L9 12Q0 19 -9 12Z" fill="var(--ink)" />
                  <rect x="-10" y="13" width="20" height="40" rx="9" fill="var(--paper)" stroke="var(--ink)" stroke-width="3" />
                  <path d="M-6 24H6M-6 32H6M-6 40H6" stroke="var(--ink)" stroke-width="2" stroke-linecap="round" />
                  <rect x="-8" y="52" width="16" height="6" rx="2" fill="var(--ink)" />
                  <path d="M-6 58L-9 84M-3 58L-4 90M0 58V93M3 58L4 90M6 58L9 84" stroke="var(--ink)" stroke-width="2.4" stroke-linecap="round" />
                </g>
              </g>
            </svg>
          </div>
          <figcaption class="cap2" id="cap2">Pull the rope down to drop the portrait.</figcaption>
        </figure>
      </div>
    </div>

    <section id="credentials" class="rv">
      <div class="wrap">
        <h2>Credentials</h2>
        <p class="sub">My education and the personal qualities I bring to learning and projects.</p>
        <div class="cols">
          <div>
            <h3>Education</h3>
            <ul class="tl"><?php foreach ($education as [$t, $s]): ?><li><b><?= e($t) ?></b><span><?= e($s) ?></span></li><?php endforeach; ?></ul>
          </div>
          <div>
            <h3>Qualities</h3>
            <ul class="tl"><?php foreach ($experience as [$t, $s]): ?><li><b><?= e($t) ?></b><span><?= e($s) ?></span></li><?php endforeach; ?></ul>
          </div>
        </div>
      </div>
    </section>

    <section id="skills" class="rv">
      <div class="wrap">
        <h2>Skill sets</h2>
        <p class="sub">What I work with, and how comfortable I am with it. Hover a skill to see its level.</p>
        <div class="skills">
          <?php foreach ($skills as [$grp, $list]): ?>
            <div class="sk">
              <h3><?= e($grp) ?></h3>
              <?php foreach ($list as [$n, $lv]): ?>
                <div class="bar" style="--w:<?= (int)$lv ?>%" title="<?= e($n) ?>: <?= (int)$lv ?>%"><span><?= e($n) ?></span><em><?= (int)$lv ?>%</em><i></i></div>
              <?php endforeach; ?>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
    </section>

    <section id="apps" class="rv">
      <div class="wrap">
        <h2>Applications</h2>
        <p class="sub">A look at my two Android apps. Select any screenshot to enlarge it.</p>
        <ul class="apps" id="appList">
          <?php foreach ($apps as [$n, $d, $screenshots]): ?>
            <li class="app">
              <b><?= e($n) ?></b>
              <p><?= e($d) ?></p>
              <div class="grid app-gallery" aria-label="<?= e($n) ?> screenshots">
                <?php foreach ($screenshots as [$shotTitle, $img, $caption, $ratio]):
                  $bg = "url('" . $img . "') center/contain no-repeat"; ?>
                  <button class="tile" type="button" data-bg="<?= e($bg) ?>" data-r="<?= e($ratio) ?>" data-cap="<?= e($caption) ?>" aria-label="Enlarge <?= e($shotTitle) ?>">
                    <div class="art" style="background:<?= e($bg) ?>;--r:<?= e($ratio) ?>"></div>
                    <span class="cap"><?= e($shotTitle) ?><em>Click to enlarge</em></span>
                  </button>
                <?php endforeach; ?>
              </div>
            </li>
          <?php endforeach; ?>
        </ul>
      </div>
    </section>

    <section id="photos" class="rv">
      <div class="wrap">
        <h2>Photos</h2>
        <p class="sub">A contact sheet of frames I have taken. Select one, then use the arrow keys to move through them.</p>
        <div class="film">
          <div class="grid" id="photoGrid">
            <?php foreach ($photos as [$t, $img, $desc]):
              $bg = "url('" . $img . "') center/cover no-repeat"; ?>
              <button class="tile" type="button" data-bg="<?= e($bg) ?>" data-r="1.5" data-cap="<?= e("$t — $desc") ?>">
                <div class="art" style="background:<?= e($bg) ?>;--r:1.5"></div><span class="cap"><?= e($t) ?><em><?= e($desc) ?></em></span>
              </button>
            <?php endforeach; ?>
          </div>
        </div>
      </div>
    </section>

    <section id="certs" class="rv">
      <div class="wrap">
        <h2>Certifications</h2>
        <p class="sub">Verified training and credentials.</p>
        <div class="certs"><?php foreach ($certs as [$n, $meta, $img]): ?>
          <article class="cert">
            <a class="cert-preview" href="<?= e($img) ?>" target="_blank" rel="noopener noreferrer" aria-label="View <?= e($n) ?> certificate">
              <img src="<?= e($img) ?>" alt="<?= e($n) ?> certificate" loading="lazy">
            </a>
            <b><?= e($n) ?></b><span><?= e($meta) ?></span>
          </article>
          <?php endforeach; ?></div>
      </div>
    </section>

    <section id="contact" class="rv">
      <div class="wrap">
        <h2>Contact</h2>
        <p class="sub">Open to projects, collaborations and internships. Find me here:</p>
        <ul class="social">
          <li class="email-card"><div class="email-details"><b>Email</b><span><?= e($me['email']) ?></span></div><button class="copy-email" type="button" data-copy-email="<?= e($me['email']) ?>" aria-label="Copy email address">Copy link</button><span class="copy-status" aria-live="polite"></span></li>
          <?php foreach ($me['socials'] as [$l, $u]): ?>
            <li><a href="<?= e($u) ?>" target="_blank" rel="noopener noreferrer"><b><?= e($l) ?></b><span>Open ↗</span></a></li>
          <?php endforeach; ?>
        </ul>
      </div>
    </section>
  </main>
  <footer>
    <div class="wrap">© <?= date('Y') ?> <?= e($me['name']) ?>.</div>
  </footer>

  <dialog id="dlg" aria-label="Enlarged view">
    <div class="art" id="dArt"></div>
    <div class="meta"><span id="dCap"></span><span><button id="dPrev" type="button" aria-label="Previous">←</button> <button id="dNext" type="button" aria-label="Next">→</button> <button id="dClose" type="button">Close</button></span></div>
  </dialog>


  <script src="assets/js/portfolio.js?v=<?= ver('assets/js/portfolio.js') ?>"></script>
</body>

</html>
