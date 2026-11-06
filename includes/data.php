<?php

declare(strict_types=1);

/* ---------- DATA: edit these arrays, the pages update themselves ---------- */
$me = [
  'name'  => 'John Lenuel Alcantara', // full name shown throughout the portfolio
  'first' => 'Lenuel',               // used on the landing page
  'email' => 'aljohnlenuel@gmail.com',
  'roles' => ['BSIT student', 'developer', 'photographer'],
  'socials' => [ // label, url  (replace with your real links)
    ['Facebook', 'https://www.facebook.com/johnlenuel.alcantara.10/'],
    ['GitHub',   'https://github.com/lenn91'],
  ],
];
$education = [
  ['Bachelor of Science in Information Technology (BSIT)', 'Pamantasan ng Lungsod ng Valenzuela · 3rd Year · 2024 – present'],
  ['Senior High School — ICT Strand', 'Vicente P. Trinidad National High School · Graduated'],
];
$experience = [
  ['Adaptable', 'Willing to learn new tools, skills, and ways of working.'],
  ['Problem-solving', 'Enjoys analyzing challenges and finding practical solutions.'],
  ['Team-oriented', 'Values collaboration, clear communication, and shared goals.'],
  ['Responsible', 'Aims to complete tasks carefully and meet expectations.'],
  ['Eager to learn', 'Open to feedback and continuous improvement.'],
];
$skills = [ // group => [name, level 0-100]
  ['Programming',  [['PHP', 80], ['JavaScript', 85], ['Java', 75], ['Python', 70]]],
  ['Web',          [['HTML & CSS', 90], ['React', 70], ['Node.js', 65], ['MySQL', 75]]],
  ['Tools',        [['Git & GitHub', 80], ['Figma', 70], ['Android Studio', 70], ['Photo editing', 85]]],
  ['People',       [['Teamwork', 90], ['Communication', 85], ['Time management', 80], ['Problem solving', 85]]],
];
$apps = [ // name, description, screenshots [title, image path, caption, aspect ratio]
  ['My Calculator', 'A simple calculator for basic arithmetic, with addition, subtraction, multiplication and division.', [
    ['Calculator screen', 'assets/images/apps/calculator.png', 'My Calculator — main screen', '362 / 577'],
  ]],
  ['Quiz App', 'A multiple-choice quiz app with a start screen and a five-question quiz flow.', [
    ['Quiz start screen', 'assets/images/apps/quiz-start.png', 'Quiz App — welcome screen', '367 / 493'],
    ['Quiz question screen', 'assets/images/apps/quiz-question.png', 'Quiz App — question 1 of 5', '370 / 485'],
  ]],
];
$photos = [ // title, image path, description
  ['Sunset Reflection', 'assets/images/photos/sunset-reflection.jpg', 'A calm sunset reflected on the water'],
  ['Stadium at Night', 'assets/images/photos/stadium-night.jpg', 'A stadium illuminated after dark'],
  ['Golden Hour', 'assets/images/photos/golden-hour.jpg', 'Warm evening light over the landscape'],
  ['Behind the Lens', 'assets/images/photos/behind-the-lens.jpg', 'A moment while taking photographs'],
  ['Evening Sky', 'assets/images/photos/evening-sky.jpg', 'A colorful sky reflected across the water'],
];
$certs = [ // title, issuer and completion date, certificate image
  ['Introduction to Packet Tracer Exam', 'Cisco Networking Academy · 02 Sep 2025', 'assets/images/certificates/introduction-packet-tracer-exam.png'],
  ['Exploring Internet of Things with Cisco Packet Tracer', 'Cisco Networking Academy · 02 Sep 2025', 'assets/images/certificates/exploring-iot-packet-tracer.png'],
  ['Exploring Networking with Cisco Packet Tracer', 'Cisco Networking Academy · 26 Aug 2025', 'assets/images/certificates/exploring-networking-packet-tracer.png'],
  ['Getting Started with Cisco Packet Tracer', 'Cisco Networking Academy · 26 Aug 2025', 'assets/images/certificates/getting-started-packet-tracer.png'],
];
