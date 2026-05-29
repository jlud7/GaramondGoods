// Tinted tee mockup for the catalog hover preview.
// Returns an inline SVG of a folded crew-tee silhouette filled with `hex`,
// shown on hover so a card reads as the actual garment in its real colour.
// Used at runtime by app.js (homepage) and baked into season pages by build-seo.js.
(function () {
  "use strict";
  window.ggTeeSVG = function (hex) {
    return (
      '<svg class="tee" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M40,20 Q50,27 60,20 L68,23 L86,33 L79,47 L70,42 L70,86 L30,86 L30,42 L21,47 L14,33 L32,23 Z" ' +
      'fill="' + hex + '" stroke="rgba(26,23,20,0.18)" stroke-width="1" stroke-linejoin="round"/>' +
      '<path d="M40,20 Q50,27 60,20" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5"/>' +
      "</svg>"
    );
  };
})();
