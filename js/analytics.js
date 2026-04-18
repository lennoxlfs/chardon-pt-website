/* Chardon Performance Therapy — analytics module
   Centralized GA4 + Vercel Analytics event layer.
   Replace GA4_MEASUREMENT_ID on launch (see analytics-setup-checklist.md).
*/
(function () {
  'use strict';

  // ====== CONFIG ======
  // Replace on launch. Until filled, GA4 script does not load.
  var GA4_MEASUREMENT_ID = 'G-REPLACE_ON_LAUNCH';

  // ====== GA4 BOOTSTRAP ======
  var gaLoaded = false;
  function loadGA4() {
    if (gaLoaded) return;
    if (!GA4_MEASUREMENT_ID || GA4_MEASUREMENT_ID.indexOf('REPLACE') !== -1) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_MEASUREMENT_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: true
    });
  }

  loadGA4();

  // ====== PUBLIC API ======
  var CPTAnalytics = {
    track: function (name, params) {
      if (window.gtag) {
        window.gtag('event', name, params || {});
      }
      // Buffer events for pre-launch debugging
      if (!window.__cptEventLog) window.__cptEventLog = [];
      window.__cptEventLog.push({ name: name, params: params || {}, ts: Date.now() });
    }
  };
  window.CPTAnalytics = CPTAnalytics;

  // ====== AUTO-WIRED EVENTS ======
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  onReady(function () {

    // Phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.addEventListener('click', function () {
        CPTAnalytics.track('phone_click', {
          phone_number: a.getAttribute('href').replace('tel:', ''),
          location_label: a.getAttribute('data-label') || 'unlabeled',
          page_path: location.pathname
        });
      });
    });

    // Email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      a.addEventListener('click', function () {
        CPTAnalytics.track('email_click', {
          email: a.getAttribute('href').replace('mailto:', ''),
          page_path: location.pathname
        });
      });
    });

    // Appointment / booking CTAs
    document.querySelectorAll('[data-event="appointment_click"]').forEach(function (a) {
      a.addEventListener('click', function () {
        CPTAnalytics.track('appointment_click', {
          cta_label: a.getAttribute('data-label') || a.textContent.trim().slice(0, 60),
          location_section: a.getAttribute('data-location') || 'unknown',
          page_path: location.pathname
        });
      });
    });

    // Directions clicks
    document.querySelectorAll('[data-event="directions_click"]').forEach(function (a) {
      a.addEventListener('click', function () {
        CPTAnalytics.track('directions_click', {
          location_label: a.getAttribute('data-label') || 'unlabeled',
          page_path: location.pathname
        });
      });
    });

    // Outbound link tracking
    var hostname = location.hostname;
    document.querySelectorAll('a[href^="http"]').forEach(function (a) {
      try {
        var url = new URL(a.href);
        if (url.hostname && url.hostname !== hostname && !a.hasAttribute('data-internal')) {
          a.addEventListener('click', function () {
            CPTAnalytics.track('outbound_click', {
              url: a.href,
              hostname: url.hostname,
              page_path: location.pathname
            });
          });
          if (!a.hasAttribute('rel')) {
            a.setAttribute('rel', 'noopener');
          }
        }
      } catch (e) { /* skip malformed URLs */ }
    });

  });

  // ====== Vercel Analytics (auto-enables on Vercel deploy) ======
  // Official zero-config script for Vercel Web Analytics.
  // Silent no-op outside Vercel until project connects.
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  var va = document.createElement('script');
  va.defer = true;
  va.src = '/_vercel/insights/script.js';
  document.head.appendChild(va);

  var si = document.createElement('script');
  si.defer = true;
  si.src = '/_vercel/speed-insights/script.js';
  document.head.appendChild(si);

})();
