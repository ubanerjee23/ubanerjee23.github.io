# Upasana Banerjee — Portfolio

A single-page portfolio for **Upasana Banerjee**, AI/ML engineer. Built as a static
site with hand-written HTML, CSS and JavaScript, animated with
[anime.js v4](https://animejs.com/).

## Live site

Once GitHub Pages is enabled, the site will be available at:

```
https://ubanerjee23.github.io/website/
```

> If the repository is renamed to `ubanerjee23.github.io`, the site will be served at
> `https://ubanerjee23.github.io/` instead.

## Stack

- Plain HTML/CSS/JS — no build step, no framework
- [anime.js v4.5.0](https://animejs.com/) via `esm.sh` (pinned CDN import)
- Google Fonts: Space Grotesk, Inter, JetBrains Mono
- Fully responsive, keyboard accessible and `prefers-reduced-motion` friendly

## Project structure

```
.
├── index.html                  # All page content
├── css/
│   └── styles.css              # Design system, layout and responsive rules
├── js/
│   ├── animations.js           # anime.js intro timeline, scroll reveals, counters
│   └── ui.js                   # Nav, scroll progress, scroll spy, copy, spotlight
├── assets/
│   ├── favicon.svg
│   └── Upasana-Banerjee-Resume.pdf
├── .nojekyll                   # Tells GitHub Pages not to run Jekyll
└── README.md
```

## Local preview

No installation required. From the project root:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>. A local server is recommended because ES modules
and the CDN import do not work reliably from `file://`.

## Deploy to GitHub Pages

1. Push the site to the `main` branch of `github.com/ubanerjee23/website`.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/ (root)**, then **Save**.
5. Wait for the first deployment (usually under a minute) and visit
   `https://ubanerjee23.github.io/website/`.

The `.nojekyll` file is already included, so files and folders beginning with an
underscore are served correctly.

## Customising

- **Content:** edit the sections in `index.html` (`#about`, `#experience`,
  `#projects`, `#skills`, `#education`, `#contact`).
- **Projects:** add a `.project-card` inside `.projects-grid`. When you have public
  URLs, wrap the card title in an `<a>` or add a "View project" link at the bottom.
- **Resume:** replace `assets/Upasana-Banerjee-Resume.pdf` with an updated file of
  the same name, or update the download link in the hero.
- **Colours and type:** all design tokens live at the top of `css/styles.css`
  under `:root`.
- **Animations:** `js/animations.js` contains the hero timeline, ambient orbs,
  scroll-triggered reveals and animated counters. Keep the CDN version pinned.
- **Contact details:** the email, phone, GitHub and LinkedIn links are in the
  `#contact` section and in the structured-data block in `<head>`.

## Accessibility notes

- Content is visible without JavaScript; animation styles only activate after the
  anime.js module loads.
- Users with `prefers-reduced-motion: reduce` get the static page, with no hidden
  content.
- Includes a skip link, visible focus styles, semantic landmarks and descriptive
  labels.
