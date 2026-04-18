/* =====================================================================
   Chardon PT — Blog index: search, filter, sort, empty-state
   ===================================================================== */
(function () {
  'use strict';

  const searchInput = document.getElementById('blogSearch');
  const clearBtn = document.querySelector('.blog-search__clear');
  const filterBtns = document.querySelectorAll('.blog-filter');
  const sortBtn = document.getElementById('sortBtn');
  const sortLabel = document.getElementById('sortLabel');
  const resetBtn = document.getElementById('resetBtn');
  const emptyState = document.getElementById('emptyState');
  const resultsCount = document.getElementById('resultsCount');
  const archiveGrid = document.getElementById('archiveGrid');
  const featuredGrid = document.getElementById('featuredGrid');

  if (!archiveGrid) return;

  const archiveCards = Array.from(archiveGrid.querySelectorAll('.blog-card'));
  const featuredCards = featuredGrid ? Array.from(featuredGrid.querySelectorAll('.blog-card')) : [];
  const allCards = archiveCards.concat(featuredCards);

  let activeFilter = 'all';
  let activeQuery = '';
  let sortOrder = 'newest';

  function normalize(str) {
    return (str || '').toString().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  }

  function cardMatches(card) {
    if (activeFilter !== 'all') {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase().split(/\s+/);
      if (!tags.includes(activeFilter)) return false;
    }
    if (activeQuery) {
      const hay = normalize(
        (card.getAttribute('data-title') || '') + ' ' +
        (card.getAttribute('data-tags') || '') + ' ' +
        (card.textContent || '')
      );
      if (hay.indexOf(activeQuery) === -1) return false;
    }
    return true;
  }

  function updateCards() {
    let visible = 0;
    archiveCards.forEach(function (card) {
      const match = cardMatches(card);
      card.classList.toggle('is-hidden', !match);
      if (match) visible++;
    });

    // Featured cards show only when filter/search is inactive
    featuredCards.forEach(function (card) {
      const showFeatured = activeFilter === 'all' && !activeQuery;
      card.classList.toggle('is-hidden', !showFeatured);
    });

    if (resultsCount) {
      if (activeQuery || activeFilter !== 'all') {
        const filterName = activeFilter === 'all' ? '' : getFilterLabel(activeFilter);
        let msg = 'Showing ' + visible + ' article' + (visible === 1 ? '' : 's');
        if (filterName) msg += ' in ' + filterName;
        if (activeQuery) msg += ' matching "' + searchInput.value + '"';
        resultsCount.textContent = msg;
      } else {
        resultsCount.textContent = 'Showing all articles';
      }
    }

    if (emptyState) emptyState.hidden = visible !== 0;
  }

  function getFilterLabel(key) {
    const btn = document.querySelector('.blog-filter[data-filter="' + key + '"]');
    return btn ? btn.textContent.trim() : key;
  }

  function applySort() {
    const sorted = archiveCards.slice().sort(function (a, b) {
      const da = a.getAttribute('data-date') || '';
      const db = b.getAttribute('data-date') || '';
      if (sortOrder === 'newest') return db.localeCompare(da);
      return da.localeCompare(db);
    });
    sorted.forEach(function (card) { archiveGrid.appendChild(card); });
  }

  /* ---------- Search ---------- */
  if (searchInput) {
    let t;
    searchInput.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        activeQuery = normalize(searchInput.value.trim());
        if (clearBtn) clearBtn.hidden = !searchInput.value;
        updateCards();
      }, 90);
    });
  }
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      if (!searchInput) return;
      searchInput.value = '';
      activeQuery = '';
      clearBtn.hidden = true;
      searchInput.focus();
      updateCards();
    });
  }

  /* ---------- Filter chips ---------- */
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      activeFilter = btn.getAttribute('data-filter') || 'all';
      updateCards();
    });
  });

  /* ---------- Sort toggle ---------- */
  if (sortBtn) {
    sortBtn.addEventListener('click', function () {
      sortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
      if (sortLabel) sortLabel.textContent = sortOrder === 'newest' ? 'Newest first' : 'Oldest first';
      applySort();
    });
  }

  /* ---------- Reset button (empty state) ---------- */
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      if (searchInput) { searchInput.value = ''; }
      if (clearBtn) clearBtn.hidden = true;
      activeQuery = '';
      activeFilter = 'all';
      filterBtns.forEach(function (b) {
        const isAll = b.getAttribute('data-filter') === 'all';
        b.classList.toggle('is-active', isAll);
        b.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });
      updateCards();
      window.scrollTo({ top: document.querySelector('.blog-toolbar').offsetTop - 80, behavior: 'smooth' });
    });
  }

  /* ---------- Initial sort (newest first) ---------- */
  applySort();
  updateCards();

  /* ---------- Scroll reveal for dynamically appended cards ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    allCards.forEach(function (card) {
      if (!card.classList.contains('is-visible')) io.observe(card);
    });
  } else {
    allCards.forEach(function (card) { card.classList.add('is-visible'); });
  }
})();
