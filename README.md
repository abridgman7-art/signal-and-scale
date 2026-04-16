# Signal &amp; Scale

Landing page for **Signal &amp; Scale** — an AI-powered marketing &amp; growth agency for small businesses and SMEs.

Built as a static site (HTML / CSS / JS). No build step, no dependencies.

## Local preview

Open `index.html` directly in a browser, or run a simple local server:

```bash
# Python 3 (built in to macOS)
python3 -m http.server 5173
# then open http://localhost:5173
```

## Deploy

Hosted via **GitHub Pages** from the `main` branch.

## Structure

```
index.html        # markup and content
styles.css        # all styles
script.js         # small interactions (mobile nav, lead form)
assets/           # images, favicon
```

## Editing content

All copy lives in `index.html`. Colors and spacing live at the top of `styles.css` (`:root`).
