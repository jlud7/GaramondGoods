/* ================================================================
   Garamond Goods — page interactions
   ================================================================
   Renders into the static index.html shell:
     • The 12-season specimen grid (#season-grid) — cards are clickable and
       jump into the catalog filtered to that season
     • The catalog: real products (catalog.js) tagged to seasons by the ΔE
       classifier (classify.js), filtered to the active season, rendered as
       outbound affiliate links that log a click to Supabase
   Wires up:
     • Scroll fade-in via IntersectionObserver
     • Upload modal (photo-analysis preview) open/close
   Reads: window.SEASONS, FAMILIES, SUB_BY_FAMILY (palette.js),
          window.CATALOG (catalog.js), window.classifySeason (classify.js).
   ============================================================== */

(function () {
  "use strict";

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const el = (tag, attrs = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v == null) continue;
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on") && typeof v === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), v);
      } else if (k === "style" && typeof v === "object") {
        for (const [prop, val] of Object.entries(v)) {
          if (prop.startsWith("--")) node.style.setProperty(prop, val);
          else node.style[prop] = val;
        }
      } else if (v === true) {
        node.setAttribute(k, "");
      } else {
        node.setAttribute(k, String(v));
      }
    }
    for (const c of [].concat(children)) {
      if (c == null || c === false) continue;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    return node;
  };

  // ---------------------------------------------------------------
  // Intent logging — fire-and-forget click event to Supabase.
  // keepalive lets the request finish even as a new tab opens.
  // ---------------------------------------------------------------
  function logClick(p) {
    const season = activeSeason();
    if (window.ggLogClick) {
      window.ggLogClick({
        product_id: p.id,
        brand: p.brand,
        season: season ? season.key : null,
        color_hex: p.hex,
        href: p.url,
      });
    }
  }

  // ---------------------------------------------------------------
  // Tag every product to its season(s) once, via the ΔE classifier.
  // ---------------------------------------------------------------
  function tagCatalog() {
    if (!window.CATALOG || !window.classifySeason) return;
    for (const p of window.CATALOG) {
      if (p._seasons) continue;
      const r = window.classifySeason(p.hex);
      p._seasons = r.seasons;
      p._dist = {};
      r.all.forEach((s) => { p._dist[s.key] = s.distance; });
    }
  }

  // ---------------------------------------------------------------
  // Seasons specimen grid — each card jumps into the catalog
  // ---------------------------------------------------------------
  function renderSeasons() {
    const host = $("#season-grid");
    if (!host || !window.SEASONS) return;

    // 4×3 family layout: True across the top, the two variants beneath each.
    const GRID_ORDER = [
      "true-spring", "true-summer", "true-autumn", "true-winter",
      "bright-spring", "light-summer", "soft-autumn", "dark-winter",
      "light-spring", "soft-summer", "dark-autumn", "bright-winter",
    ];
    const byKey = Object.fromEntries(window.SEASONS.map((s) => [s.key, s]));
    const ordered = GRID_ORDER.map((k) => byKey[k]).filter(Boolean);

    host.replaceChildren(...ordered.map((season) => {
      const [family, ...rest] = season.name.split(" ");
      const head = el("div", { class: "season-head" }, [
        el("div", { class: "name" }, [
          family + " ",
          el("em", {}, rest.join(" ")),
        ]),
      ]);

      const note = el("div", { class: "season-note-wrap" }, [
        el("div", { class: "season-note" }, "Shop " + season.name + " →"),
      ]);

      // The flat-lay photo IS the palette — no color chips. Card = photo + name.
      const photo = el("div", { class: "season-photo" }, [
        el("img", {
          src: "img/swatch-" + season.key + ".jpg",
          alt: season.name + " — six tees in its palette",
          loading: "lazy",
          onerror: (e) => {
            const w = e.target.closest(".season-photo");
            if (w) w.remove();
          },
        }),
      ]);

      return el("a", {
        class: "season",
        href: "/seasons/" + season.key,
        "aria-label": season.name + " — palette and tees",
      }, [photo, head, note]);
    }));
  }

  // ---------------------------------------------------------------
  // Catalog — family/sub/color filter state + product grid
  // ---------------------------------------------------------------
  const catalog = {
    family: "Autumn",
    sub: "True",
    colorIdx: null, // null = all colors in season
  };

  function activeSeason() {
    const key = `${catalog.sub.toLowerCase()}-${catalog.family.toLowerCase()}`;
    return (window.SEASONS || []).find((s) => s.key === key) || null;
  }

  function renderFamilyChips() {
    const host = $("#family-filters");
    if (!host) return;
    $$(".chip", host).forEach((n) => n.remove());
    for (const f of window.FAMILIES) {
      host.appendChild(el("button", {
        class: "chip" + (f === catalog.family ? " on" : ""),
        type: "button",
        onclick: () => {
          if (catalog.family === f) return;
          catalog.family = f;
          catalog.sub = "True";
          catalog.colorIdx = null;
          renderCatalog();
        },
      }, f));
    }
  }

  function renderSubChips() {
    const host = $("#sub-filters");
    if (!host) return;
    $$(".chip", host).forEach((n) => n.remove());
    for (const s of window.SUB_BY_FAMILY[catalog.family]) {
      host.appendChild(el("button", {
        class: "chip" + (s === catalog.sub ? " on" : ""),
        type: "button",
        onclick: () => {
          if (catalog.sub === s) return;
          catalog.sub = s;
          catalog.colorIdx = null;
          renderCatalog();
        },
      }, `${s} ${catalog.family}`));
    }
  }

  function renderColorFilters() {
    const host = $("#color-filters");
    if (!host) return;
    $$(".color-all, .color-swatch", host).forEach((n) => n.remove());

    const season = activeSeason();
    const palette = season ? season.swatches : [];

    host.appendChild(el("button", {
      class: "color-all" + (catalog.colorIdx === null ? " on" : ""),
      type: "button",
      onclick: () => {
        catalog.colorIdx = null;
        renderProducts();
        renderColorFilters();
        renderCounter();
      },
    }, "All"));

    palette.forEach((c, i) => {
      host.appendChild(el("button", {
        class: "color-swatch" + (catalog.colorIdx === i ? " on" : ""),
        type: "button",
        style: { "--fill": c.hex },
        "aria-label": `${c.label} ${c.hex}`,
        onclick: () => {
          catalog.colorIdx = (catalog.colorIdx === i) ? null : i;
          renderProducts();
          renderColorFilters();
          renderCounter();
        },
      }, [
        el("span", { class: "cs-fill" }),
        el("span", { class: "cs-tip" }, [
          el("span", { class: "cs-name" }, c.label),
          c.hex.toUpperCase(),
        ]),
      ]));
    });
  }

  // Products matching the active season (+ optional color narrowing).
  function filteredProducts() {
    const season = activeSeason();
    if (!season) return [];
    let list = (window.CATALOG || []).filter(
      (p) => p._seasons && p._seasons.includes(season.key)
    );
    if (catalog.colorIdx !== null && window.deltaE2000 && window.hexToLab) {
      const target = season.swatches[catalog.colorIdx];
      if (target) {
        const tLab = window.hexToLab(target.hex);
        list = list.filter(
          (p) => window.deltaE2000(window.hexToLab(p.hex), tLab) <= 13
        );
      }
    }
    list.sort((a, b) => (a._dist[season.key] ?? 99) - (b._dist[season.key] ?? 99));
    return list;
  }

  function productCard(p) {
    const photo = el("div", { class: "photo", style: { background: p.hex } }, [
      el("span", { class: "plabel" }, p.brand),
      el("div", { class: "preview" }, [
        el("div", { class: "tee-wrap", html: window.ggTeeSVG ? window.ggTeeSVG(p.hex) : "" }),
        el("span", { class: "preview-cta" }, "Shop at " + p.brand + " →"),
      ]),
    ]);
    const meta = el("div", { class: "meta" }, [
      el("div", {}, [
        el("div", { class: "name" }, p.name),
        el("div", { class: "sub" }, p.brand + " — " + p.colorName),
      ]),
      el("div", { class: "price" }, p.priceText),
    ]);
    return el("a", {
      class: "product",
      href: p.url,
      target: "_blank",
      rel: "sponsored noopener nofollow",
      onclick: () => logClick(p),
    }, [photo, meta]);
  }

  function renderProducts() {
    const host = $("#catalog-grid");
    if (!host) return;
    const list = filteredProducts();
    if (!list.length) {
      host.replaceChildren(el("div", { class: "catalog-empty" }, [
        "No tees in this color yet. ",
        el("button", {
          class: "linkish",
          type: "button",
          onclick: () => {
            catalog.colorIdx = null;
            renderCatalog();
          },
        }, "View the whole season →"),
      ]));
      return;
    }
    host.replaceChildren(...list.map(productCard));
  }

  function renderCounter() {
    const host = $("#catalog-counter");
    if (!host) return;
    const season = activeSeason();
    const palette = season ? season.swatches : [];
    const n = filteredProducts().length;
    const total = (window.CATALOG || []).length;
    const seasonLabel = `${catalog.sub} ${catalog.family}`.toLowerCase();
    const colorLabel = (catalog.colorIdx !== null && palette[catalog.colorIdx])
      ? ` · ${palette[catalog.colorIdx].label.toLowerCase()}`
      : "";
    host.textContent = `showing ${n} of ${total} · ${seasonLabel}${colorLabel}`;
  }

  function renderCatalog() {
    renderFamilyChips();
    renderSubChips();
    renderColorFilters();
    renderProducts();
    renderCounter();
  }

  // ---------------------------------------------------------------
  // Upload modal — photo-analysis preview (not yet wired to a model)
  // ---------------------------------------------------------------
  function initUploadModal() {
    const backdrop = $("#upload-backdrop");
    const close    = $("#upload-close");
    const drop     = $("#upload-drop");
    const browse   = $("#upload-browse");
    const thumbs   = $("#upload-thumbs");
    const countV   = $("#upload-count-v");
    if (!backdrop) return;

    let count = 0;

    if (thumbs && thumbs.children.length === 0) {
      for (let i = 0; i < 10; i++) {
        thumbs.appendChild(el("div", { class: "thumb" }, String(i + 1).padStart(2, "0")));
      }
    }

    function refresh() {
      $$(".thumb", thumbs).forEach((t, i) => {
        t.classList.toggle("filled", i < count);
        t.textContent = i < count ? "" : String(i + 1).padStart(2, "0");
      });
      const remaining = Math.max(0, 5 - count);
      const status = count >= 5 ? "ready" : `${remaining} more to begin`;
      countV.textContent = `${count} of 10 (${status})`;
    }

    function open() {
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function closeModal() {
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-open-upload]");
      if (trigger) {
        e.preventDefault();
        open();
      }
    });
    close.addEventListener("click", closeModal);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && backdrop.classList.contains("open")) closeModal();
    });

    drop.addEventListener("dragover", (e) => {
      e.preventDefault();
      drop.classList.add("hover");
    });
    drop.addEventListener("dragleave", () => drop.classList.remove("hover"));
    drop.addEventListener("drop", (e) => {
      e.preventDefault();
      drop.classList.remove("hover");
      const n = Math.min(10, e.dataTransfer?.files?.length || 3);
      count = Math.min(10, count + n);
      refresh();
    });
    browse.addEventListener("click", () => {
      count = Math.min(10, count + 3);
      refresh();
    });

    refresh();
  }

  // ---------------------------------------------------------------
  // Scroll fade-in
  // ---------------------------------------------------------------
  function initFadeIn() {
    const els = $$(".fade-in");
    if (!("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    els.forEach((e) => io.observe(e));
  }

  // ---------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------
  function boot() {
    tagCatalog();
    renderSeasons();
    renderCatalog();
    initUploadModal();
    initFadeIn();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
