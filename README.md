# Garamond Goods

Menswear color analysis tool and curated catalog of solid-color basics.
Phase 1: software-first MVP — analysis + filtered catalog + wardrobe audit + weekly digest.

This repository currently holds the static landing page. Deployed via GitHub Pages.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

GitHub Actions deploys to Pages on push to `main` or `claude/create-website-design-4N8Jd`.
Enable Pages in repo Settings → Pages → Source: **GitHub Actions** to activate.

## Files

- `index.html` — landing page
- `styles.css` — atelier styles (EB Garamond + Inter)
- `palette.js` — twelve-season palette + hero cycle order + catalog preview data
- `app.js` — specimen grid render, hero cycle, catalog render

Built in Miami. Shop coming later this year.
