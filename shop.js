(function () {
  const seasons = window.GG_SEASONS || [];
  const garments = window.GG_GARMENTS || [];
  const catalog = window.GG_CATALOG || [];

  const seasonSelect = document.getElementById('season-select');
  const garmentChips = document.getElementById('garment-chips');
  const grid = document.getElementById('product-grid');
  const emptyState = document.getElementById('empty-state');
  const resultCount = document.getElementById('result-count');
  const clearBtn = document.getElementById('clear-filters');

  if (!grid) return;

  // ---------- State (seeded from the URL so filters are shareable) ----------
  const params = new URLSearchParams(window.location.search);
  const validSeason = (v) => v && seasons.some(s => s.name === v);
  const validGarment = (v) => v && garments.indexOf(v) !== -1;

  const state = {
    season: validSeason(params.get('season')) ? params.get('season') : 'all',
    garment: validGarment(params.get('garment')) ? params.get('garment') : 'all'
  };

  // ---------- Build the season select (grouped by family) ----------
  const families = [];
  seasons.forEach(s => {
    let fam = families.find(f => f.group === s.group);
    if (!fam) { fam = { group: s.group, names: [] }; families.push(fam); }
    fam.names.push(s.name);
  });
  families.forEach(fam => {
    const og = document.createElement('optgroup');
    og.label = fam.group;
    fam.names.forEach(name => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      og.appendChild(opt);
    });
    seasonSelect.appendChild(og);
  });
  seasonSelect.value = state.season;

  // ---------- Build the garment chips ----------
  const makeChip = (value, label) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.dataset.value = value;
    btn.textContent = label;
    btn.setAttribute('aria-pressed', String(state.garment === value));
    btn.addEventListener('click', () => {
      state.garment = value;
      sync();
    });
    return btn;
  };
  garmentChips.appendChild(makeChip('all', 'All'));
  garments.forEach(g => garmentChips.appendChild(makeChip(g, g)));

  // ---------- Card rendering ----------
  const card = (item) => {
    const matchLabel = state.season !== 'all'
      ? `${state.season} match`
      : (item.seasons.length === 1
          ? item.seasons[0]
          : `${item.seasons.length} seasons`);
    return `
      <a class="product" href="${item.url}" target="_blank" rel="noopener sponsored"
         ${item.url === '#' ? 'aria-disabled="true"' : ''}>
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
          ${item.hex.toLowerCase()} · ${matchLabel}
        </span>
      </a>`;
  };

  // ---------- Filter + render ----------
  const render = () => {
    const items = catalog.filter(item => {
      const seasonOk = state.season === 'all' || item.seasons.indexOf(state.season) !== -1;
      const garmentOk = state.garment === 'all' || item.garment === state.garment;
      return seasonOk && garmentOk;
    });

    grid.innerHTML = items.map(card).join('');
    const has = items.length > 0;
    emptyState.hidden = has;
    grid.hidden = !has;

    const noun = items.length === 1 ? 'piece' : 'pieces';
    resultCount.textContent = `${items.length} ${noun}`;
    clearBtn.hidden = state.season === 'all' && state.garment === 'all';
  };

  // ---------- Keep UI, URL, and state in step ----------
  const sync = () => {
    seasonSelect.value = state.season;
    Array.from(garmentChips.querySelectorAll('.chip')).forEach(chip => {
      chip.setAttribute('aria-pressed', String(chip.dataset.value === state.garment));
    });

    const q = new URLSearchParams();
    if (state.season !== 'all') q.set('season', state.season);
    if (state.garment !== 'all') q.set('garment', state.garment);
    const qs = q.toString();
    history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);

    render();
  };

  seasonSelect.addEventListener('change', () => {
    state.season = seasonSelect.value;
    sync();
  });
  clearBtn.addEventListener('click', () => {
    state.season = 'all';
    state.garment = 'all';
    sync();
  });

  sync();
})();
