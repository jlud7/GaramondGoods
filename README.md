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
- `catalog.html` — filterable affiliate catalog (the shop)
- `styles.css` — atelier styles (EB Garamond + Inter)
- `palette.js` — twelve-season palette + hero cycle order + landing catalog preview data
- `app.js` — specimen grid render, hero cycle, landing catalog preview render
- `catalog.js` — full product catalog data model + garment categories
- `shop.js` — catalog filtering (season + garment), shareable URL state

The catalog filters by season and garment and reflects state in the URL
(`catalog.html?season=True+Autumn&garment=Knitwear`), so a future analysis
step can deep-link a visitor straight into their palette. Affiliate `url`
fields in `catalog.js` are placeholders (`#`) until real deep-links are added.

Built in Miami. Shop coming later this year.
