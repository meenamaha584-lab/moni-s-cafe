# Moni Cafe — 3D Animation + Sound Edition

Responsive coffee-shop website built with HTML, CSS, JavaScript and GSAP.

## Files
- `index.html` — website sections and 3D coffee cup markup
- `css/style.css` — responsive UI, CSS 3D cup, steam, beans and animations
- `js/script.js` — GSAP motion, navigation and optional sound effects

## Run locally
Open `index.html` in a browser, or use VS Code Live Server.

## GitHub Pages
1. Create a repository, e.g. `moni-cafe`.
2. Extract this ZIP and upload the folder contents, not the ZIP itself.
3. Keep `index.html` at the repository root.
4. Commit to `main`.
5. Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save.

No npm install, build step, backend or environment variables are required.

## 3D animation and sound
The hero coffee cup is constructed using CSS 3D transforms: rotating ceramic body, handle, saucer, floating coffee beans, rising steam and a moving shadow. Click SOUND OFF to enable a welcome chime, generated coffee-pour sound, cup chime and subtle UI sounds. Sound uses the Web Audio API and requires a user click due to browser autoplay restrictions.

## Before publishing
Replace sample menu prices, opening hours, social handle and map link with the cafe's actual details. Photos, Google Fonts and GSAP load from external sources and need an internet connection.
