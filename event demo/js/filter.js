/* ============================================================
   EventVerse — Filter & Search
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initFilterOptions();
  initFilterPills();
  initSearchBar();
  initPriceRange();
});

/* ── Checkbox Filters (Events sidebar) ── */
function initFilterOptions() {
  document.querySelectorAll('.filter-option').forEach(option => {
    option.addEventListener('click', () => {
      option.classList.toggle('active');
      applyFilters();
    });
  });
}

/* ── Filter Pills (Venues/Vendors) ── */
function initFilterPills() {
  const pillGroups = document.querySelectorAll('.venues-filters, .vendors-filters');

  pillGroups.forEach(group => {
    const pills = group.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        // Toggle active — "All" deactivates others
        if (pill.getAttribute('data-filter') === 'all') {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
        } else {
          group.querySelector('[data-filter="all"]')?.classList.remove('active');
          pill.classList.toggle('active');
          // If none active, reactivate All
          if (!group.querySelector('.filter-pill.active')) {
            group.querySelector('[data-filter="all"]')?.classList.add('active');
          }
        }
        applyCardFilter(group);
      });
    });
  });
}

/* ── Search Bar ── */
function initSearchBar() {
  const searchInputs = document.querySelectorAll('.search-bar input');

  searchInputs.forEach(input => {
    input.addEventListener('input', debounce(() => {
      const query = input.value.toLowerCase().trim();
      const targetGrid = input.closest('.section, .events-page, .venues-page, .vendors-page')
        ?.querySelector('.events-grid, .venues-grid, .vendors-grid');

      if (!targetGrid) return;

      targetGrid.querySelectorAll('.card, .event-card, .venue-card, .vendor-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
      });
    }, 250));
  });
}

/* ── Price Range Slider ── */
function initPriceRange() {
  const slider = document.querySelector('.range-slider');
  if (!slider) return;

  const maxDisplay = document.querySelector('.price-max-val');

  slider.addEventListener('input', () => {
    if (maxDisplay) {
      maxDisplay.textContent = `$${slider.value}`;
    }
    applyFilters();
  });
}

/* ── Apply Filters Logic ── */
function applyFilters() {
  const activeFilters = [];
  document.querySelectorAll('.filter-option.active').forEach(opt => {
    activeFilters.push(opt.getAttribute('data-category')?.toLowerCase());
  });

  const grid = document.querySelector('.events-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.card, .event-card');

  cards.forEach(card => {
    if (activeFilters.length === 0) {
      card.style.display = '';
      return;
    }
    const category = card.getAttribute('data-category')?.toLowerCase();
    card.style.display = activeFilters.includes(category) ? '' : 'none';
  });
}

/* ── Card Filter by pills ── */
function applyCardFilter(group) {
  const activeFilters = [];
  group.querySelectorAll('.filter-pill.active').forEach(p => {
    activeFilters.push(p.getAttribute('data-filter')?.toLowerCase());
  });

  const page = group.closest('.venues-page, .vendors-page');
  if (!page) return;

  const cards = page.querySelectorAll('.venue-card, .vendor-card');

  cards.forEach(card => {
    if (activeFilters.includes('all') || activeFilters.length === 0) {
      card.style.display = '';
      return;
    }
    const category = card.getAttribute('data-category')?.toLowerCase();
    card.style.display = activeFilters.includes(category) ? '' : 'none';
  });
}

/* ── Debounce Utility ── */
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
