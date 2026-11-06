# Context: Portfolio website

**Date:** 2026-11-07

## Requests so far
1. Unique personal portfolio website: credentials, digital arts, applications developed, photos taken, certifications.
2. Make it more unique: add the user's picture, a unique hover effect on it, and make everything monochrome.
3. Use the uploaded portrait and make it so that pulling a rope drops the picture down.
4. Portrait was not visible enough; the project must have PHP lines inside the HTML; make the rope look better; make the site a little more interactive.
5. Remove the "send me a message" contact form and replace it with hyperlinks to socials (Facebook, email, GitHub). For apps, show only how they look, in video format.
6. Keep context.md updated on every prompt. Remove the themes and keep only the dark theme. Remove the digital art section. Add a skill sets section.
7. Separate the CSS and PHP files so it is not confusing. Add a landing page before the main page with a start button labeled "meet Lenuel".
8. Added new picture (`portrait_alt.jpg`) and configured rope pull to swap pictures on every pull. Fixed landing page alignment and centering.

## Current structure (folder `portfolio/`)
- `index.php`: landing page (the front door). Button "meet Lenuel" links to `portfolio.php?start=1`.
- `portfolio.php`: main page markup only. Redirects to index.php until the start button was pressed (session flag `met`).
- `portrait.jpg`: default portrait image.
- `portrait_alt.jpg`: secondary uploaded picture toggled on rope pull.
- `includes/bootstrap.php`: defines ROOT, starts session, sets Manila timezone, loads data and functions.
- `includes/data.php`: all editable content arrays ($me, $education, $experience, $skills, $apps, $photos, $certs).
- `includes/functions.php`: helper functions (e(), greeting(), ver(), count_visit()).
- `assets/css/landing.css`: landing page stylesheet.
- `assets/css/portfolio.css`: main portfolio stylesheet.
- `assets/js/landing.js`: landing page interaction script.
- `assets/js/portfolio.js`: main portfolio interaction script (physics, rope pull, picture swapping).

9. Updated the rope portrait sequence so the first pull reveals `portrait.jpg` (the main portrait), and the next pull reveals `portrait_alt.jpg`.
10. Replaced the Photos section's placeholder gradient tiles with the five uploaded photographs from `pitik.zip`; the existing lightbox navigation remains available.
11. Added all four uploaded Cisco Networking Academy certificates as image previews in the Certifications section. Each certificate preview opens the full image in a new tab.
