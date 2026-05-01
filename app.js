/* ================================================================
   Garamond Goods — page interactions
   ================================================================
   Renders into the static index.html shell:
     • The 12-season specimen grid (#season-grid)
     • The catalog filters + product grid (#family-filters, #sub-filters,
       #color-filters, #catalog-grid, #catalog-counter)
   Wires up:
     • Scroll fade-in via IntersectionObserver
     • Upload modal open/close + ESC + drop-zone counter
   Reads from palette.js: SEASONS, FAMILIES, SUB_BY_FAMILY, TEE_STYLES.
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
        // CSS custom properties (--foo) need setProperty; everything else
        // can use direct assignment for the camelCase ergonomics.
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
  // Seasons specimen grid
  // ---------------------------------------------------------------
  function renderSeasons() {
    const host = $("#season-grid");
    if (!host || !window.SEASONS) return;

    host.replaceChildren(...window.SEASONS.map((season, i) => {
      const [family, ...rest] = season.name.split(" ");
      const head = el("div", { class: "season-head" }, [
        el("div", { class: "name" }, [
          family + " ",
          el("em", {}, rest.join(" ")),
        ]),
        el("div", { class: "ref" }, "No. " + String(i + 1).padStart(2, "0")),
      ]);

      const swatches = el(
        "div",
        { class: "swatches" },
        season.swatches.map((s) =>
          el("div", {
            class: "sw",
            style: { background: s.hex },
            title: s.label + " · " + s.hex,
          }, [
            el("span", { class: "hex" }, s.hex.toUpperCase()),
          ])
        )
      );

      const note = el("div", { class: "season-note-wrap" }, [
        el("div", { class: "season-note" }, season.note),
      ]);

      return el("div", { class: "season" }, [head, swatches, note]);
    }));
  }

  // ---------------------------------------------------------------
  // Catalog — family/sub/color filter state + product grid
  // ---------------------------------------------------------------
  const catalog = {
    family: "Autumn",
    sub: "True",
    colorIdx: null, // null = all
  };

  function activeSeason() {
    const key = `${catalog.sub.toLowerCase()}-${catalog.family.toLowerCase()}`;
    return (window.SEASONS || []).find((s) => s.key === key) || null;
  }

  function renderFamilyChips() {
    const host = $("#family-filters");
    if (!host) return;
    // Keep the leading <span class="label"> and replace siblings.
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
        renderCatalog();
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
          renderCatalog();
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

  function renderProducts() {
    const host = $("#catalog-grid");
    if (!host) return;

    const season = activeSeason();
    const palette = season ? season.swatches : [];

    host.replaceChildren(...window.TEE_STYLES.map((p, i) => {
      const sw = palette[p.swatchIdx] || palette[0] || { hex: "#999", label: "" };
      const dimmed = catalog.colorIdx !== null && catalog.colorIdx !== p.swatchIdx;

      const photo = el("div", { class: "photo" }, [
        el("span", { class: "plabel" }, "Plate " + String(i + 3).padStart(2, "0")),
        el("span", { class: "swatch-dot", style: { background: sw.hex } }),
        el("div", { class: "pprompt" }, [
          el("span", { class: "k" }, "prompt: "),
          `men's ${p.cut} tee, folded flat on cream paper, ${sw.label.toLowerCase()} (${sw.hex}), soft daylight, no label`,
        ]),
        el("div", { class: "alt" }, "ALT · ON MODEL"),
      ]);

      const meta = el("div", { class: "meta" }, [
        el("div", {}, [
          el("div", { class: "name" }, p.name),
          el("div", { class: "sub" }, "in " + sw.label),
        ]),
        el("div", { class: "price" }, p.price),
      ]);

      return el("div", { class: "product" + (dimmed ? " dimmed" : "") }, [photo, meta]);
    }));
  }

  function renderCounter() {
    const host = $("#catalog-counter");
    if (!host) return;
    const season = activeSeason();
    const palette = season ? season.swatches : [];
    const seasonLabel = `${catalog.sub} ${catalog.family}`.toLowerCase();
    const colorLabel = (catalog.colorIdx !== null && palette[catalog.colorIdx])
      ? ` · ${palette[catalog.colorIdx].label.toLowerCase()}`
      : "";
    const showing = catalog.colorIdx === null ? "6 of 22" : "3 of 6";
    host.textContent = `showing ${showing} · ${seasonLabel}${colorLabel} · tees`;
  }

  function renderCatalog() {
    renderFamilyChips();
    renderSubChips();
    renderColorFilters();
    renderProducts();
    renderCounter();
  }

  // ---------------------------------------------------------------
  // Upload modal
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

    // Render 10 placeholder slots once.
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

    // Drop-zone — UI demo only, no upload yet.
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
