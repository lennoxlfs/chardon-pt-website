/* Chardon Performance Therapy — FAQ page interactive behavior */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Audience toggle (Active Adults / Athletes) ---------- */
  const toggleRoot = document.querySelector('.audience-toggle');
  const audienceBtns = document.querySelectorAll('.audience-toggle__btn');
  const audiencePanels = document.querySelectorAll('.audience-panel');
  const togglePill = document.querySelector('.audience-toggle__pill');

  function positionPill(activeBtn) {
    if (!togglePill || !activeBtn || !toggleRoot) return;
    const rootRect = toggleRoot.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const offsetX = btnRect.left - rootRect.left - 6;
    togglePill.style.width = btnRect.width + 'px';
    togglePill.style.transform = 'translateX(' + offsetX + 'px)';
  }

  function switchAudience(audience) {
    audienceBtns.forEach(function (btn) {
      const active = btn.dataset.audience === audience;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
      if (active) positionPill(btn);
    });
    audiencePanels.forEach(function (panel) {
      const active = panel.id === 'audience-' + audience;
      panel.classList.toggle('is-active', active);
      if (active) { panel.removeAttribute('hidden'); }
      else { panel.setAttribute('hidden', ''); }
    });
  }

  if (toggleRoot && audienceBtns.length) {
    audienceBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        switchAudience(btn.dataset.audience);
      });
    });
    const initialActive = document.querySelector('.audience-toggle__btn.is-active') || audienceBtns[0];
    // Position pill after fonts/layout settle
    window.requestAnimationFrame(function () { positionPill(initialActive); });
    window.addEventListener('resize', function () {
      const active = document.querySelector('.audience-toggle__btn.is-active');
      if (active) positionPill(active);
    });
  }

  /* ---------- Body Map regions ---------- */
  const REGIONS = {
    tmj: {
      title: 'TMJ & Jaw Pain',
      kicker: 'Head · Jaw',
      summary: "Clicking, popping, or locking in the jaw, morning tension, tooth-grinding pressure, headaches that trace from the temples to the ear.",
      conditions: ['TMJ dysfunction', 'Jaw clicking & popping', 'Tension headaches', 'Clenching & grinding', 'Ear fullness / aching'],
      treatments: ['Manual therapy', 'Intra-oral release', 'Dry needling (masseter / temporalis)', 'Postural retraining'],
      cta: '/services/physical-therapy/'
    },
    neck: {
      title: 'Neck Pain',
      kicker: 'Cervical Spine',
      summary: "Stiffness after long days at the desk, tension that climbs into the skull, nerve-like pain referring into the shoulder or arm.",
      conditions: ['Neck pain & stiffness', 'Tension headaches', 'Pinched nerves / radiculopathy', 'Whiplash recovery', 'Postural strain'],
      treatments: ['Joint mobilization', 'Dry needling (upper trap, levator, suboccipitals)', 'Nerve glides', 'Deep-neck flexor strength'],
      cta: '/services/physical-therapy/'
    },
    shoulder: {
      title: 'Shoulder Pain',
      kicker: 'Shoulder · Rotator Cuff',
      summary: "Trouble reaching overhead, night pain on the affected side, weakness during push-ups, swings, or lifting the kids.",
      conditions: ['Rotator cuff strain & tears', 'Impingement', 'Frozen shoulder / adhesive capsulitis', 'Post-op rehab (labrum, cuff)', 'Lifting-related injuries'],
      treatments: ['Scapular mobilization', 'Dry needling (cuff, posterior capsule)', 'BFR cuff strengthening', 'Progressive overhead loading'],
      cta: '/services/physical-therapy/'
    },
    elbow: {
      title: 'Elbow Pain',
      kicker: 'Lateral · Medial Epicondyle',
      summary: "Pain on the outside (tennis elbow) or inside (golfer's elbow) of the elbow — the ache that ruins your grip, your swing, your keyboard day.",
      conditions: ['Tennis elbow (lateral epicondylitis)', "Golfer's elbow (medial epicondylitis)", 'Ulnar nerve irritation', 'Post-op rehab', 'Grip-strength loss'],
      treatments: ['Manual soft-tissue work', 'Dry needling (extensors / flexors)', 'Eccentric loading', 'Blood flow restriction'],
      cta: '/services/dry-needling/'
    },
    wrist: {
      title: 'Wrist & Hand Pain',
      kicker: 'Wrist · Hand',
      summary: "Grip fatigue, numb fingers, pain with typing or tool use. We treat the full chain — neck, shoulder, forearm — because wrists rarely act alone.",
      conditions: ['Carpal tunnel symptoms', 'Wrist sprains', "De Quervain's tenosynovitis", 'Post-fracture stiffness', 'Thumb arthritis'],
      treatments: ['Nerve glide mobilization', 'Manual therapy', 'Dry needling (forearm)', 'Progressive grip loading'],
      cta: '/services/physical-therapy/'
    },
    back: {
      title: 'Back & Spine Pain',
      kicker: 'Lumbar · Thoracic',
      summary: "From a rogue weekend yard day to chronic low-back ache, we work out what's actually driving the pain — disc, joint, or pattern — and teach you how to train around it.",
      conditions: ['Low back pain', 'Herniated discs', 'Sciatica', 'SI joint dysfunction', 'Pain with weightlifting'],
      treatments: ['Spinal mobilization', 'Dry needling (paraspinals, QL, glutes)', 'Core & hip strengthening', 'Movement re-patterning'],
      cta: '/services/physical-therapy/'
    },
    hip: {
      title: 'Hip Pain',
      kicker: 'Hip · Pelvis',
      summary: "Pinching in the front, deep ache in the glute, stiffness getting out of the car. Hips carry everything — we untangle what's tight, what's weak, what's referred.",
      conditions: ['Hip impingement (FAI)', 'Labral tears', 'Bursitis', 'Arthritis', 'Post-op hip rehab'],
      treatments: ['Joint mobilization & distraction', 'Dry needling (glutes, piriformis, adductors)', 'Force-plate assessment', 'Progressive strength loading'],
      cta: '/services/physical-therapy/'
    },
    knee: {
      title: 'Knee Pain',
      kicker: 'Knee · Patella',
      summary: "The knee rarely is the problem — hip and ankle usually are. We treat the joint that hurts and fix the chain above and below it so it stays quiet.",
      conditions: ['Meniscus injuries', 'Patellofemoral pain', 'Knee arthritis', 'ACL / post-op rehab', 'Runner/cyclist knee'],
      treatments: ['Manual therapy', 'Dry needling (quads, hamstrings, calves)', 'BFR strengthening', 'VALD force-plate testing'],
      cta: '/services/blood-flow-restriction/'
    },
    ankle: {
      title: 'Ankle & Foot Pain',
      kicker: 'Ankle · Foot',
      summary: "Sprains that never fully healed, plantar pain that greets you in the morning, calf strains from the first long run of spring — all downstream fixes.",
      conditions: ['Ankle sprains & instability', 'Plantar fasciitis', 'Achilles tendinopathy', 'Shin splints', 'Post-surgical ankle rehab'],
      treatments: ['Joint mobilization', 'Dry needling (calf, plantar)', 'Eccentric heel loading', 'Balance & return-to-sport progressions'],
      cta: '/services/physical-therapy/'
    }
  };

  /* ---------- Body Map interactions ---------- */
  const hotspots = document.querySelectorAll('.region-card[data-region], .body-hotspot[data-region]');
  const bodyPanel = document.querySelector('.body-map__panel-inner');

  function renderRegion(region) {
    const data = REGIONS[region];
    if (!data || !bodyPanel) return;
    const conditionsHtml = data.conditions.map(function (c) {
      return '<li><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' + c + '</li>';
    }).join('');
    const treatmentsHtml = data.treatments.map(function (t) {
      return '<li class="body-map__panel-tag">' + t + '</li>';
    }).join('');

    const html =
      '<span class="eyebrow">' + data.kicker + '</span>' +
      '<h3 class="h3 mt-4">' + data.title + '</h3>' +
      '<p class="lead mt-4">' + data.summary + '</p>' +
      '<div class="body-map__panel-section">' +
        '<span class="body-map__panel-eyebrow">Conditions we treat</span>' +
        '<ul class="body-map__panel-list">' + conditionsHtml + '</ul>' +
      '</div>' +
      '<div class="body-map__panel-section">' +
        '<span class="body-map__panel-eyebrow">How we treat it</span>' +
        '<ul class="body-map__panel-tags">' + treatmentsHtml + '</ul>' +
      '</div>' +
      '<a class="body-map__panel-cta" href="' + data.cta + '" data-label="faq_body_map">See related service' +
        '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="16" height="16"><path stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6l6 6-6 6"/></svg>' +
      '</a>';

    bodyPanel.setAttribute('data-region-view', region);
    bodyPanel.innerHTML = html;
    // Retrigger animation
    bodyPanel.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    bodyPanel.offsetHeight;
    bodyPanel.style.animation = '';
  }

  function activateHotspot(hotspot) {
    hotspots.forEach(function (h) { h.classList.remove('is-active'); });
    hotspot.classList.add('is-active');
    renderRegion(hotspot.dataset.region);
  }

  hotspots.forEach(function (hotspot) {
    hotspot.addEventListener('click', function () {
      activateHotspot(hotspot);
    });
    hotspot.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activateHotspot(hotspot);
      }
    });
  });

})();
