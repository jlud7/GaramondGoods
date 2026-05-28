// ΔE color classifier — the engine the aggregator runs on.
// Given a product's hex, returns the season(s) it suits by measuring perceptual
// color distance (CIEDE2000) from the hex to each season's `reference` anchors
// (see palette.js) and matching every season within a tuned threshold.
//
// A product can match several seasons — that's intended (a navy suits the
// Winters and Dark Autumn). Matches are sorted closest-first. If nothing falls
// within the threshold, the single nearest season is returned, flagged
// low-confidence for human review.
//
// Reads window.SEASONS. Exposes window.classifySeason(hex, opts).

(function () {
  "use strict";

  // Default match threshold in ΔE2000 units. Tuned against typical menswear
  // colors; lower = stricter (fewer seasons per product). Override per call.
  const DEFAULT_THRESHOLD = 14;

  // --- sRGB hex → CIELAB (D65) ---------------------------------------------
  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  }
  function srgbToLinear(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function rgbToXyz([r, g, b]) {
    const R = srgbToLinear(r), G = srgbToLinear(g), B = srgbToLinear(b);
    return [
      (0.4124564 * R + 0.3575761 * G + 0.1804375 * B) * 100,
      (0.2126729 * R + 0.7151522 * G + 0.0721750 * B) * 100,
      (0.0193339 * R + 0.1191920 * G + 0.9503041 * B) * 100,
    ];
  }
  function xyzToLab([x, y, z]) {
    // D65 reference white
    const Xn = 95.047, Yn = 100.0, Zn = 108.883;
    const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
    const fx = f(x / Xn), fy = f(y / Yn), fz = f(z / Zn);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  }
  function hexToLab(hex) {
    return xyzToLab(rgbToXyz(hexToRgb(hex)));
  }

  // --- CIEDE2000 ------------------------------------------------------------
  const rad = (d) => (d * Math.PI) / 180;
  function hueAngle(b, ap) {
    if (b === 0 && ap === 0) return 0;
    const h = (Math.atan2(b, ap) * 180) / Math.PI;
    return h >= 0 ? h : h + 360;
  }
  function deltaE2000(lab1, lab2) {
    const [L1, a1, b1] = lab1, [L2, a2, b2] = lab2;
    const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2);
    const Cbar = (C1 + C2) / 2;
    const Cbar7 = Math.pow(Cbar, 7);
    const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + Math.pow(25, 7))));
    const a1p = (1 + G) * a1, a2p = (1 + G) * a2;
    const C1p = Math.hypot(a1p, b1), C2p = Math.hypot(a2p, b2);
    const h1p = hueAngle(b1, a1p), h2p = hueAngle(b2, a2p);

    const dLp = L2 - L1;
    const dCp = C2p - C1p;
    let dhp = 0;
    if (C1p * C2p !== 0) {
      dhp = h2p - h1p;
      if (dhp > 180) dhp -= 360;
      else if (dhp < -180) dhp += 360;
    }
    const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin(rad(dhp) / 2);

    const Lbarp = (L1 + L2) / 2;
    const Cbarp = (C1p + C2p) / 2;
    let hbarp;
    if (C1p * C2p === 0) hbarp = h1p + h2p;
    else if (Math.abs(h1p - h2p) > 180) hbarp = (h1p + h2p + 360) / 2;
    else hbarp = (h1p + h2p) / 2;

    const T = 1 - 0.17 * Math.cos(rad(hbarp - 30)) + 0.24 * Math.cos(rad(2 * hbarp))
      + 0.32 * Math.cos(rad(3 * hbarp + 6)) - 0.20 * Math.cos(rad(4 * hbarp - 63));
    const dTheta = 30 * Math.exp(-Math.pow((hbarp - 275) / 25, 2));
    const Cbarp7 = Math.pow(Cbarp, 7);
    const Rc = 2 * Math.sqrt(Cbarp7 / (Cbarp7 + Math.pow(25, 7)));
    const Sl = 1 + (0.015 * Math.pow(Lbarp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbarp - 50, 2));
    const Sc = 1 + 0.045 * Cbarp;
    const Sh = 1 + 0.015 * Cbarp * T;
    const Rt = -Math.sin(rad(2 * dTheta)) * Rc;

    return Math.sqrt(
      Math.pow(dLp / Sl, 2) +
      Math.pow(dCp / Sc, 2) +
      Math.pow(dHp / Sh, 2) +
      Rt * (dCp / Sc) * (dHp / Sh)
    );
  }

  // --- Reference anchor cache ----------------------------------------------
  let REF = null;
  function buildRef() {
    REF = (window.SEASONS || []).map((s) => ({
      key: s.key,
      name: s.name,
      anchors: s.reference.map((c) => ({ ...c, lab: hexToLab(c.hex) })),
    }));
  }

  // --- Public API -----------------------------------------------------------
  // classifySeason(hex, { threshold }) ->
  //   { seasons:[key], matches:[{key,name,distance,nearest}], best, confident, all }
  function classifySeason(hex, opts = {}) {
    if (!REF) buildRef();
    const threshold = opts.threshold ?? DEFAULT_THRESHOLD;
    const lab = hexToLab(hex);

    const scored = REF.map((s) => {
      let min = Infinity, nearest = null;
      for (const a of s.anchors) {
        const d = deltaE2000(lab, a.lab);
        if (d < min) { min = d; nearest = a; }
      }
      return {
        key: s.key,
        name: s.name,
        distance: Math.round(min * 10) / 10,
        nearest: { hex: nearest.hex, label: nearest.label },
      };
    }).sort((a, b) => a.distance - b.distance);

    const within = scored.filter((x) => x.distance <= threshold);
    const matches = within.length ? within : [scored[0]];
    return {
      seasons: matches.map((m) => m.key),
      matches,
      best: scored[0],
      confident: within.length > 0,
      all: scored,
    };
  }

  window.classifySeason = classifySeason;
  window.deltaE2000 = deltaE2000;
  window.hexToLab = hexToLab;
})();
