#!/usr/bin/env node
/* ================================================================
   build-seo.js — generates the per-season SEO pages, sitemap.xml,
   and robots.txt from palette.js / classify.js / catalog.js.

   Run from site/:   node build-seo.js
   Commit the output (seasons/*.html, sitemap.xml, robots.txt).
   Re-run whenever the palette or catalog changes.
   ============================================================== */

const fs = require("fs");
const path = require("path");

global.window = {};
require("./palette.js");
require("./classify.js");
require("./catalog.js");
const { SEASONS, CATALOG, classifySeason } = window;

const ORIGIN = "https://garamondgoods.com";

// --- tag + sort catalog per season (build time) --------------------------
CATALOG.forEach((p) => {
  const r = classifySeason(p.hex);
  p._seasons = r.seasons;
  p._dist = {};
  r.all.forEach((s) => (p._dist[s.key] = s.distance));
});
const productsFor = (key) =>
  CATALOG.filter((p) => p._seasons.includes(key))
    .sort((a, b) => (a._dist[key] ?? 99) - (b._dist[key] ?? 99));

// --- per-season SEO copy --------------------------------------------------
const CONTENT = {
  "bright-spring": {
    lead: "Warm and clear, with the highest contrast of the spring family — colour at full saturation.",
    body: [
      "If clear, bright colours light you up while muted, dusty tones drain you, you likely sit in Bright Spring. The colouring reads warm and vivid — bright eyes, golden or rich hair, skin with a clear warm glow. It borders Bright Winter, so genuine clarity matters as much as warmth.",
      "In menswear, reach for clean, saturated colour against crisp ivory rather than stark white: true blue, clear teal, a confident coral-red, golden yellow. Keep neutrals warm and clean — camel, warm navy — and avoid anything greyed-off or dusty, which reads like it's fighting you.",
    ],
    meta: "Bright Spring for men: the warm, clear, high-contrast palette — which colours suit you, how to wear them, and solid tees matched to the season.",
  },
  "true-spring": {
    lead: "The warmest, most golden spring — clear colour with sunlight in it.",
    body: [
      "True Spring colouring is warm through and through: golden or coppery hair, warm clear eyes, skin with a peach or golden cast. Clear warm colours suit you; cool, ashy, or heavy dark tones don't. Where Bright Spring is about contrast, True Spring is about warmth.",
      "Lean into golden, life-filled colour: camel, honey gold, warm leaf green, teal, coral. Cream beats white and warm brown beats black. The trap is anything cool or muted — true grey, icy pastels, charcoal — which flattens that natural warmth.",
    ],
    meta: "True Spring for men: the warm, golden, clear palette — your best colours, how to wear them, and solid tees matched to the season.",
  },
  "light-spring": {
    lead: "Light and warm — delicate colour with a golden base.",
    body: [
      "Light Spring is the gentlest spring: light hair, soft warm eyes, fair skin with a warm glow. Light, warm, slightly clear colours flatter you; deep or heavy tones overwhelm. Value matters most here — keep things in the lighter half.",
      "Think soft peach, buttercream, light warm green, sky, light camel — colour you could wear in morning light. Pair with paper-cream rather than white, and keep black and any dark, saturated block of colour away from the face.",
    ],
    meta: "Light Spring for men: the light, warm palette — which colours suit you, how to wear them, and solid tees matched to the season.",
  },
  "light-summer": {
    lead: "Light and cool, with a soft, powdery quietness.",
    body: [
      "Light Summer reads cool and gentle: ashy or soft hair, cool light eyes, skin with a cool undertone. Soft, cool, light colours suit you; warm or heavy ones don't. Like Light Spring it lives in the lighter values, but cool rather than golden.",
      "Reach for powder blue, dove grey, soft slate, soft sage, muted periwinkle — colour with a little grey folded in. Off-white and shell beat bright white, and soft navy stands in for black. The enemy is anything warm, dark, or fully saturated.",
    ],
    meta: "Light Summer for men: the light, cool, soft palette — your best colours, how to wear them, and solid tees matched to the season.",
  },
  "true-summer": {
    lead: "Cool and muted, with rosy, grey-based neutrals.",
    body: [
      "True Summer is cool and soft: ashy-brown or cool hair, cool eyes, skin with a rosy or blue undertone. Cool, slightly muted colours flatter; warm, golden, or overly bright ones clash. It's the heart of summer — cool first, soft second.",
      "Build around denim and slate blues, soft teal, mulberry, a muted raspberry, and grey-based neutrals like bone over stark white. Navy reads better than black. Avoid orange-based warmth and high-clarity brights, which look harsh against this soft colouring.",
    ],
    meta: "True Summer for men: the cool, muted, rosy palette — which colours suit you, how to wear them, and solid tees matched to the season.",
  },
  "soft-summer": {
    lead: "Muted and cool-neutral — everything quiet and grey-tinted.",
    body: [
      "Soft Summer is defined by softness: muted colouring with low contrast, cool-leaning but close to neutral. Blended, greyed colours suit you; anything clear or saturated overwhelms. If bright colour seems to 'wear you,' this is often why.",
      "This is a wardrobe of mushroom taupe, steel grey, grey-blue, lichen, ash rose and graphite, with oat in place of white. The whole point is restraint — no high-contrast pairings, no pure brights, nothing that announces itself.",
    ],
    meta: "Soft Summer for men: the muted, cool-neutral palette — your best colours, how to wear them, and solid tees matched to the season.",
  },
  "soft-autumn": {
    lead: "Muted and warm — dusty olives and golden, earthy neutrals.",
    body: [
      "Soft Autumn blends warmth with softness: golden-but-muted colouring, low contrast, a little ashy. Warm, muted, earthy colours suit you; clear brights and cool icy tones don't. It borders Soft Summer — softness is the through-line, warmth the tiebreaker.",
      "Live in wheat, olive grove, caramel, clay, soft brown and sage, with linen and oat over white. These are the most natural menswear colours there are, which makes Soft Autumn one of the easiest seasons to dress — just keep everything gently muted.",
    ],
    meta: "Soft Autumn for men: the muted, warm, earthy palette — which colours suit you, how to wear them, and solid tees matched to the season.",
  },
  "true-autumn": {
    lead: "Warm, rich and earth-saturated — the heart of the autumn family.",
    body: [
      "True Autumn colouring is warm and golden with real depth: rich or coppery hair, warm eyes, golden or olive skin. Warm, saturated, earthy colours suit you; cool, icy, or dusty-pale tones don't. Picture turning leaves — that's the palette.",
      "Reach for rust, mustard gold, deep olive, chestnut, forest and terracotta, with warm cream and brown over white and black. No need to be timid: these colours can run deep and saturated, as long as they stay warm.",
    ],
    meta: "True Autumn for men: the warm, rich, earthy palette — your best colours, how to wear them, and solid tees matched to the season.",
  },
  "dark-autumn": {
    lead: "Deep, warm and dramatic — the darkest end of the warm palettes.",
    body: [
      "Dark Autumn is autumn with the lights turned down: deep warm colouring, dark hair and eyes, the ability to carry rich, heavy colour. Warm and deep suits you; pastel or cool-icy tones wash out. It borders Dark Winter, so warmth is what keeps it autumn.",
      "Build around espresso, oxblood, dark moss, tobacco and deep teal, with old gold for contrast. Chocolate brown beats true black, and deep warm navy works. Keep anything pale or chalky away from the face — depth is your strength, so use it.",
    ],
    meta: "Dark Autumn for men: the deep, warm, dramatic palette — which colours suit you, how to wear them, and solid tees matched to the season.",
  },
  "dark-winter": {
    lead: "Deep, cool and high-contrast — black and jewel tones.",
    body: [
      "Dark Winter carries depth and coolness: dark hair, cool or deep eyes, skin that takes strong contrast well. Deep, cool, clear colours suit you; warm, dusty, or pale-muted tones don't. It borders Dark Autumn — coolness is the deciding line.",
      "This is the season black actually belongs to. Anchor with charcoal, dark navy and jewel tones — bordeaux, spruce, aubergine, deep teal — against true white or icy grey. Keep warmth and softness out; contrast and clarity are the whole game.",
    ],
    meta: "Dark Winter for men: the deep, cool, high-contrast palette — your best colours, how to wear them, and solid tees matched to the season.",
  },
  "true-winter": {
    lead: "Cool and clear — black, white and primary jewels.",
    body: [
      "True Winter is the coolest, clearest season: high contrast, cool undertone, the ability to wear pure colour and stark neutrals. Cool and clear suits you; warm, muted, or dusty tones look muddy against you. Clarity is everything.",
      "Wear true black with pure white, then add primary-strength jewels: royal blue, true red, emerald, icy grey. Avoid earth tones and anything greyed-off — if a colour looks like it has dust in it, it isn't yours.",
    ],
    meta: "True Winter for men: the cool, clear, high-contrast palette — your best colours, how to wear them, and solid tees matched to the season.",
  },
  "bright-winter": {
    lead: "Cool, clear and saturated — the brightest of the cool palettes.",
    body: [
      "Bright Winter is cool with the contrast and clarity turned up: bright eyes, dark hair, skin that can carry vivid colour. Clear, cool, saturated colours suit you; muted or warm tones flatten that brightness. It borders Bright Spring — coolness is the tiebreaker.",
      "Go for cobalt, emerald, clear red and bright teal against obsidian black and icy white, with charcoal and navy holding the base. The mistake is muting anything down — Bright Winter is one of the few seasons that genuinely needs the colour loud.",
    ],
    meta: "Bright Winter for men: the cool, clear, saturated palette — which colours suit you, how to wear them, and solid tees matched to the season.",
  },
};

// --- helpers --------------------------------------------------------------
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const swatchStrip = (season) =>
  `<div class="swatches">` +
  season.swatches
    .map(
      (s) =>
        `<div class="sw" style="background:${s.hex}" title="${esc(s.label)} · ${s.hex}"><span class="hex">${s.hex.toUpperCase()}</span></div>`
    )
    .join("") +
  `</div>`;

const productCard = (p, key) =>
  `<a class="product" href="${esc(p.url)}" target="_blank" rel="sponsored noopener nofollow"` +
  ` data-id="${esc(p.id)}" data-brand="${esc(p.brand)}" data-hex="${p.hex}" data-season="${key}">` +
  `<div class="photo" style="background:${p.hex}"><span class="plabel">${esc(p.brand)}</span>` +
  `<div class="alt">SHOP AT ${esc(p.brand.toUpperCase())} →</div></div>` +
  `<div class="meta"><div><div class="name">${esc(p.name)}</div>` +
  `<div class="sub">${esc(p.brand)} — ${esc(p.colorName)}</div></div>` +
  `<div class="price">${esc(p.priceText)}</div></div></a>`;

const crossLinks = (currentKey) =>
  `<div class="cross-grid">` +
  SEASONS.filter((s) => s.key !== currentKey)
    .map((s) => {
      const sw = s.swatches.slice(0, 5).map((x) => `<span style="background:${x.hex}"></span>`).join("");
      return `<a class="cross" href="/seasons/${s.key}"><span class="cross-sw">${sw}</span><span class="cross-nm">${esc(s.name)}</span></a>`;
    })
    .join("") +
  `</div>`;

const jsonLd = (season, products) =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${season.name} — Men's Color Palette & Tees`,
    url: `${ORIGIN}/seasons/${season.key}`,
    description: CONTENT[season.key].meta,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Garamond Goods", item: ORIGIN + "/" },
        { "@type": "ListItem", position: 2, name: "Seasons", item: ORIGIN + "/#seasons" },
        { "@type": "ListItem", position: 3, name: season.name, item: `${ORIGIN}/seasons/${season.key}` },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@type": "Product", name: `${p.brand} ${p.name} — ${p.colorName}`, url: p.url, category: "Men's T-Shirt" },
      })),
    },
  });

const NAV = `<nav class="top"><div class="wrap inner">
  <a class="brand" href="/">Garamond Goods</a>
  <ul>
    <li><a href="/#catalog" class="sc">Shop</a></li>
    <li><a href="/#seasons" class="sc">Seasons</a></li>
    <li><a href="/#analysis" class="sc">How it works</a></li>
    <li><a href="/#method" class="sc">Method</a></li>
  </ul>
  <div class="status"><span class="dot"></span>Catalog live · house brand soon</div>
</div></nav>`;

const FOOT = `<footer class="foot"><div class="wrap">
  <div class="foot-grid">
    <div>
      <div class="foot-brand">Garamond Goods</div>
      <div class="foot-blurb">The color-aware menswear store. The diagnosis comes first; the catalog follows.</div>
    </div>
    <div><h4 class="sc">Seasons</h4><ul>
      <li><a href="/seasons/true-autumn">True Autumn</a></li>
      <li><a href="/seasons/dark-winter">Dark Winter</a></li>
      <li><a href="/seasons/true-summer">True Summer</a></li>
      <li><a href="/#seasons">All twelve</a></li>
    </ul></div>
    <div><h4 class="sc">The Shop</h4><ul>
      <li><a href="/#catalog">Catalog</a></li>
      <li><a href="/#analysis">How it works</a></li>
      <li><a href="/#method">Method</a></li>
    </ul></div>
    <div><h4 class="sc">Elsewhere</h4><ul>
      <li><a href="/">Home</a></li>
    </ul></div>
  </div>
  <div class="foot-line">
    <div class="tag">Garamond Goods is a menswear project. Built in Miami.</div>
    <div>© MMXXVI</div>
  </div>
</div></footer>`;

const page = (season, idx) => {
  const key = season.key;
  const products = productsFor(key);
  const c = CONTENT[key];
  const [sub, ...rest] = season.name.split(" ");
  const fam = rest.join(" ");
  const title = `${season.name} — Men's Color Palette & Tees · Garamond Goods`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(c.meta)}"/>
<link rel="canonical" href="${ORIGIN}/seasons/${key}"/>
<meta name="theme-color" content="#1a1714"/>
<meta property="og:title" content="${esc(season.name)} — Men's Color Palette & Tees"/>
<meta property="og:description" content="${esc(c.meta)}"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="${ORIGIN}/seasons/${key}"/>
<meta name="twitter:card" content="summary_large_image"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="/styles.css"/>
<script type="application/ld+json">${jsonLd(season, products)}</script>
</head>
<body>
${NAV}
<main class="wrap season-page">
  <nav class="crumb" aria-label="Breadcrumb"><a href="/">Garamond Goods</a> <span>/</span> <a href="/#seasons">Seasons</a> <span>/</span> ${esc(season.name)}</nav>
  <header class="season-hero">
    <div class="kicker sc">Season No. ${String(idx + 1).padStart(2, "0")} · ${esc(fam)}</div>
    <h1 class="display">${esc(sub)} <em>${esc(fam)}</em></h1>
    <p class="subline">${esc(c.lead)}</p>
    <div class="season-strip">${swatchStrip(season)}</div>
  </header>
  <section class="season-prose">
    ${c.body.map((p) => `<p>${esc(p)}</p>`).join("\n    ")}
  </section>
  <section class="season-shop">
    <h2>Tees for <em>${esc(season.name)}</em></h2>
    <p class="deck">${products.length} solid-color basics matched to this palette by color. Links go out to the brand; we may earn a commission.</p>
    <div class="catalog-grid">${products.map((p) => productCard(p, key)).join("")}</div>
    <p class="disclosure">Affiliate links — Garamond Goods may earn a commission on purchases. Prices &amp; availability are set by each brand.</p>
  </section>
  <section class="season-cross">
    <h2>The other eleven</h2>
    ${crossLinks(key)}
  </section>
</main>
${FOOT}
<script src="/log.js"></script>
<script>
document.querySelectorAll('a.product[data-id]').forEach(function(a){
  a.addEventListener('click', function(){
    if(window.ggLogClick) window.ggLogClick({product_id:a.dataset.id,brand:a.dataset.brand,season:a.dataset.season,color_hex:a.dataset.hex,href:a.href});
  });
});
</script>
</body>
</html>`;
};

// --- write everything -----------------------------------------------------
const outDir = path.join(__dirname, "seasons");
fs.mkdirSync(outDir, { recursive: true });
SEASONS.forEach((s, i) => fs.writeFileSync(path.join(outDir, s.key + ".html"), page(s, i)));

const today = new Date().toISOString().slice(0, 10);
const urls = [`${ORIGIN}/`, ...SEASONS.map((s) => `${ORIGIN}/seasons/${s.key}`)];
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${u === ORIGIN + "/" ? "1.0" : "0.8"}</priority></url>`
    )
    .join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(__dirname, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(__dirname, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

console.log(`generated ${SEASONS.length} season pages + sitemap.xml + robots.txt`);
SEASONS.forEach((s) => console.log(`  /seasons/${s.key}  (${productsFor(s.key).length} tees)`));
