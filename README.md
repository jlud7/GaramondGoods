# Garamond Goods

Twelve-season menswear color analysis paired with a curated catalog of
solid-color basics. Phase 1 is a software-first MVP: analysis + filtered
catalog + wardrobe audit + weekly digest. Built in Miami.

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Files

- `index.html` — pre-rendered static markup for nav, hero, how-it-works,
  methodology, footer, and modal shell. Mounts the seasons grid and
  catalog into named `<div>` hosts.
- `styles.css` — full design system: cream paper over warm ink, EB
  Garamond + JetBrains Mono, editorial-spread layout, hover-reveal hex
  strips on the seasons grid. One mobile breakpoint at 880px.
- `palette.js` — single source of truth: 12 seasons × 6 swatches each,
  family/sub-season taxonomy, six tee styles. Hangs off `window.SEASONS`,
  `window.FAMILIES`, `window.SUB_BY_FAMILY`, `window.TEE_STYLES`.
- `app.js` — vanilla JS: renders the seasons grid and catalog, wires
  family/sub/color filter state, scroll fade-in via IntersectionObserver,
  upload-modal open/close + drop-zone counter.

## Image generation (next)

Catalog and hero "shot" placeholder cards display the GPT Image prompt
they will be replaced by. The plate labels (`Plate 01 — Hero`,
`Plate 02 — Artifact`, `Plate 03..N — products`) are stable identifiers
for swapping in generated images later.

## Deploy

GitHub Actions deploys to Pages on push to `main`. The workflow is at
`.github/workflows/pages.yml` — it uploads the repo root as the Pages
artifact, so no build step is needed.

Shop opens fall 2026.
