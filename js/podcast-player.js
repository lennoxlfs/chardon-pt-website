(function () {
  'use strict';

  var DATA_URL = '/assets/data/podcast-episodes.json';
  var LOGO_URL = '/brand_assets/chardon-biz-podcast.png';

  var episodesBySlug = Object.create(null);
  var dataLoaded = false;
  var pendingSlug = null;
  var currentSlug = null;
  var audio;
  var player;
  var elPlayBtn;
  var elPlayIcon;
  var elTitle;
  var elCurrent;
  var elTotal;
  var elSeek;

  function fmt(t) {
    if (!isFinite(t) || t < 0) return '0:00';
    var s = Math.floor(t % 60);
    var m = Math.floor((t / 60) % 60);
    var h = Math.floor(t / 3600);
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    if (h > 0) return h + ':' + pad(m) + ':' + pad(s);
    return m + ':' + pad(s);
  }

  function buildPlayer() {
    if (player) return;
    player = document.createElement('section');
    player.className = 'podcast-player';
    player.setAttribute('role', 'region');
    player.setAttribute('aria-label', 'Podcast player');
    player.innerHTML = [
      '<div class="podcast-player__inner">',
        '<div class="podcast-player__left">',
          '<div class="podcast-player__logo">',
            '<img src="', LOGO_URL, '" alt="Chardon BIZ Podcast" width="60" height="60" loading="lazy">',
            '<div class="podcast-player__eq" aria-hidden="true">',
              '<span class="podcast-player__bar"></span>',
              '<span class="podcast-player__bar"></span>',
              '<span class="podcast-player__bar"></span>',
              '<span class="podcast-player__bar"></span>',
            '</div>',
          '</div>',
          '<div class="podcast-player__meta">',
            '<span class="podcast-player__eyebrow">Chardon BIZ Podcast</span>',
            '<span class="podcast-player__title" data-pp="title">Select an episode</span>',
          '</div>',
        '</div>',
        '<div class="podcast-player__mid">',
          '<button type="button" class="podcast-player__btn podcast-player__btn--play" data-pp="play" aria-label="Play">',
            '<svg viewBox="0 0 24 24" data-pp="play-icon" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
          '</button>',
          '<div class="podcast-player__progress">',
            '<span class="podcast-player__time" data-pp="current">0:00</span>',
            '<input type="range" class="podcast-player__seek" data-pp="seek" min="0" max="100" value="0" step="0.1" aria-label="Seek" />',
            '<span class="podcast-player__time" data-pp="total">0:00</span>',
          '</div>',
        '</div>',
        '<div class="podcast-player__right">',
          '<button type="button" class="podcast-player__btn" data-pp="back15" aria-label="Back 15 seconds" title="Back 15s">',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z"/><text x="12" y="16" text-anchor="middle" font-size="7" font-family="system-ui" fill="currentColor" font-weight="700">15</text></svg>',
          '</button>',
          '<button type="button" class="podcast-player__btn" data-pp="fwd30" aria-label="Forward 30 seconds" title="Forward 30s">',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5V1l5 5-5 5V7a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8z"/><text x="12" y="16" text-anchor="middle" font-size="7" font-family="system-ui" fill="currentColor" font-weight="700">30</text></svg>',
          '</button>',
          '<button type="button" class="podcast-player__btn" data-pp="close" aria-label="Close player" title="Close">',
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71 12 12.01l-6.3-6.3-1.42 1.42L10.59 13l-6.3 6.29 1.41 1.42 6.3-6.3 6.29 6.3 1.42-1.41-6.3-6.3 6.3-6.29z"/></svg>',
          '</button>',
        '</div>',
      '</div>'
    ].join('');

    audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.playsInline = true;
    audio.setAttribute('playsinline', '');
    player.appendChild(audio);

    document.body.appendChild(player);

    elPlayBtn = player.querySelector('[data-pp="play"]');
    elPlayIcon = player.querySelector('[data-pp="play-icon"]');
    elTitle = player.querySelector('[data-pp="title"]');
    elCurrent = player.querySelector('[data-pp="current"]');
    elTotal = player.querySelector('[data-pp="total"]');
    elSeek = player.querySelector('[data-pp="seek"]');

    elPlayBtn.addEventListener('click', togglePlay);
    player.querySelector('[data-pp="back15"]').addEventListener('click', function () { seekBy(-15); });
    player.querySelector('[data-pp="fwd30"]').addEventListener('click', function () { seekBy(30); });
    player.querySelector('[data-pp="close"]').addEventListener('click', closePlayer);

    elSeek.addEventListener('input', function () {
      if (!isFinite(audio.duration)) return;
      var pct = parseFloat(elSeek.value);
      audio.currentTime = (pct / 100) * audio.duration;
      updateSeekFill(pct);
    });

    audio.addEventListener('loadedmetadata', function () {
      elTotal.textContent = fmt(audio.duration);
    });
    audio.addEventListener('timeupdate', function () {
      if (!isFinite(audio.duration) || audio.duration === 0) return;
      elCurrent.textContent = fmt(audio.currentTime);
      var pct = (audio.currentTime / audio.duration) * 100;
      elSeek.value = String(pct);
      updateSeekFill(pct);
    });
    audio.addEventListener('play', function () {
      player.classList.add('is-playing');
      setPlayIcon(true);
      markCard(currentSlug, true);
    });
    audio.addEventListener('pause', function () {
      player.classList.remove('is-playing');
      setPlayIcon(false);
      markCard(currentSlug, false);
    });
    audio.addEventListener('ended', function () {
      player.classList.remove('is-playing');
      setPlayIcon(false);
      markCard(currentSlug, false);
    });
    audio.addEventListener('error', function () {
      elTitle.textContent = 'Could not load this episode';
      player.classList.remove('is-playing');
      setPlayIcon(false);
    });
  }

  function updateSeekFill(pct) {
    elSeek.style.setProperty('--pp-progress', pct + '%');
  }

  function setPlayIcon(playing) {
    if (playing) {
      elPlayIcon.innerHTML = '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';
      elPlayBtn.setAttribute('aria-label', 'Pause');
    } else {
      elPlayIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
      elPlayBtn.setAttribute('aria-label', 'Play');
    }
  }

  function markCard(slug, on) {
    if (!slug) return;
    var nodes = document.querySelectorAll('[data-podcast-slug="' + cssEscape(slug) + '"]');
    for (var i = 0; i < nodes.length; i++) {
      var wrap = nodes[i].closest('.podcast-card') || nodes[i].closest('.podcast-hero-card') || nodes[i].parentElement;
      if (wrap) wrap.classList.toggle('is-playing', !!on);
    }
  }

  function cssEscape(s) {
    if (window.CSS && CSS.escape) return CSS.escape(s);
    return String(s).replace(/([^a-zA-Z0-9_-])/g, '\\$1');
  }

  function seekBy(delta) {
    if (!isFinite(audio.duration)) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + delta));
  }

  function togglePlay() {
    if (!audio || !audio.src) return;
    if (audio.paused) {
      audio.play().catch(function (err) {
        console.warn('[podcast-player] play blocked:', err);
      });
    } else {
      audio.pause();
    }
  }

  function openPlayer() {
    if (!player.classList.contains('is-open')) {
      player.classList.add('is-open');
      document.body.classList.add('has-player');
    }
  }

  function closePlayer() {
    if (audio) audio.pause();
    if (player) player.classList.remove('is-open');
    document.body.classList.remove('has-player');
    markCard(currentSlug, false);
    currentSlug = null;
  }

  function playSlug(slug) {
    var ep = episodesBySlug[slug];
    if (!ep || !ep.audio) return false;
    if (currentSlug && currentSlug !== slug) markCard(currentSlug, false);
    var sameEpisode = currentSlug === slug;
    currentSlug = slug;
    elTitle.textContent = ep.title;
    elTitle.title = ep.title;
    elTotal.textContent = ep.duration || '0:00';
    if (!sameEpisode) {
      elCurrent.textContent = '0:00';
      elSeek.value = '0';
      updateSeekFill(0);
      if (audio.src !== ep.audio) {
        audio.src = ep.audio;
        audio.load();
      }
    }
    openPlayer();
    audio.play().catch(function (err) {
      console.warn('[podcast-player] play blocked:', err);
      elTitle.textContent = 'Tap play to start · ' + ep.title;
    });
    return true;
  }

  function onCardClick(e) {
    if (e.defaultPrevented) return;
    if (e.button !== undefined && e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target && e.target.closest ? e.target.closest('[data-podcast-slug]') : null;
    if (!link) return;
    var slug = link.getAttribute('data-podcast-slug');
    if (!slug) return;

    e.preventDefault();
    buildPlayer();

    if (currentSlug === slug && !audio.paused) {
      audio.pause();
      return;
    }
    if (currentSlug === slug && audio.paused && audio.src) {
      audio.play().catch(function () {});
      return;
    }

    if (dataLoaded) {
      if (!playSlug(slug)) {
        console.warn('[podcast-player] no episode for slug:', slug);
      }
    } else {
      pendingSlug = slug;
      elTitle.textContent = 'Loading…';
      openPlayer();
    }
  }

  function ingest(list) {
    list.forEach(function (ep) {
      if (ep && ep.slug) episodesBySlug[ep.slug] = ep;
    });
    dataLoaded = true;
    if (pendingSlug) {
      var s = pendingSlug;
      pendingSlug = null;
      playSlug(s);
    }
  }

  function init() {
    document.addEventListener('click', onCardClick);

    fetch(DATA_URL, { credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(ingest)
      .catch(function (err) {
        console.warn('[podcast-player] data load failed:', err);
        dataLoaded = true;
        if (pendingSlug && player) {
          elTitle.textContent = 'Episode data unavailable';
        }
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
