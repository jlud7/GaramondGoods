(function () {
  // ---------- Twelve-season specimen grid -----------------------
  const grid = document.getElementById('season-grid');
  if (grid) {
    const html = window.GG_SEASONS.map(season => {
      const tiles = season.swatches.map(hex => (
        `<div class="swatch" style="background:${hex}" data-hex="${hex.toLowerCase()}"></div>`
      )).join('');
      return `
        <article class="season-card">
          <div class="season-card-head">
            <span class="name">${season.name}</span>
            <span class="group">${season.group}</span>
          </div>
          <div class="swatches">${tiles}</div>
        </article>`;
    }).join('');
    grid.innerHTML = html;
  }

  // ---------- Hero specimen cycle -------------------------------
  const specimen = document.getElementById('hero-specimen');
  const seasonName = document.getElementById('hero-season');
  const dotsEl = document.getElementById('hero-dots');

  if (specimen && seasonName) {
    const order = window.GG_HERO_ORDER
      .map(n => window.GG_SEASONS.find(s => s.name === n))
      .filter(Boolean);

    // Build dot indicators
    if (dotsEl) {
      dotsEl.innerHTML = order.map(() => '<span class="dot"></span>').join('');
    }
    const dots = dotsEl ? Array.from(dotsEl.querySelectorAll('.dot')) : [];
    const tiles = Array.from(specimen.querySelectorAll('.tile'));

    let i = 0;
    const apply = (idx) => {
      const s = order[idx];
      tiles.forEach((tile, k) => {
        const hex = s.swatches[k] || s.swatches[0];
        tile.style.backgroundColor = hex;
        const label = tile.querySelector('.hex');
        if (label) label.textContent = hex.toLowerCase();
      });
      // Caption fade
      seasonName.style.opacity = '0';
      setTimeout(() => {
        seasonName.textContent = s.name;
        seasonName.style.opacity = '1';
      }, 280);
      dots.forEach((d, k) => d.classList.toggle('on', k === idx));
    };

    apply(0);
    setInterval(() => {
      i = (i + 1) % order.length;
      apply(i);
    }, 4200);
  }

  // ---------- Catalog preview -----------------------------------
  const productGrid = document.getElementById('product-grid');
  if (productGrid && window.GG_CATALOG) {
    productGrid.innerHTML = window.GG_CATALOG.map(item => `
      <article class="product">
        <div class="swatch-block" style="background:${item.hex}">
          <span class="garment-tag">${item.garment}</span>
        </div>
        <div class="product-meta">
          <span class="name">${item.name}</span>
          <span class="price">${item.price}</span>
        </div>
        <span class="retailer">${item.retailer}</span>
        <span class="hex-line">
          <span class="hex-chip" style="background:${item.hex}"></span>
          ${item.hex.toLowerCase()} · True Autumn match
        </span>
      </article>
    `).join('');
  }
})();
