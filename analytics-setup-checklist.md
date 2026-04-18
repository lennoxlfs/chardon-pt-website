# Analytics & Form Backend Setup — Chardon Performance Therapy

This document covers the one-time production swaps that must happen **before** the domain flips on Monday 2026-04-20. Every placeholder below ships in the codebase as a deliberate sentinel so a grep-for-sentinel confirms nothing was missed.

---

## 1. GA4 Measurement ID

**Placeholder in code:** `G-REPLACE_ON_LAUNCH`

**Where it lives:** `js/analytics.js` line 10. Every page loads this via `<script src="/js/analytics.js" defer>`, so the Measurement ID is swapped in **one place only**. If the constant still contains the word `REPLACE`, the GA4 bootstrap is a no-op — the script self-guards so a pre-launch deploy won't start counting bogus pageviews.

**Steps:**
1. Create the GA4 property at https://analytics.google.com → Admin → Create property.
2. Property name: **Chardon Performance Therapy**.
3. Time zone: **America/New_York**. Currency: **USD**.
4. Business details: Healthcare, Small (1–10 employees).
5. Create a **Web** data stream for `https://www.chardonperformancetherapy.com`.
6. Copy the Measurement ID (format: `G-XXXXXXXXXX`).
7. Open `js/analytics.js`, line 10, and replace:
   ```js
   var GA4_MEASUREMENT_ID = 'G-REPLACE_ON_LAUNCH';
   //                      ↓
   var GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';
   ```
8. Commit with message: `Wire real GA4 measurement ID`.

**What's being tracked (via `window.CPTAnalytics.track`):**
- `appointment_click` — every Request Appointment CTA (header, hero, service cards, sticky mobile bar, footer)
- `phone_click` — every `tel:+14402997171` link with `data-label` for location
- `form_submit_attempt`, `form_submit_success`, `form_submit_error` — contact form
- `form_submit_honeypot` — bot detection (do not use as a conversion)
- `scroll_depth_25`, `scroll_depth_50`, `scroll_depth_75`, `scroll_depth_90`
- `outbound_click` — external links (Google Maps, social, etc.)

**Recommended GA4 custom events to mark as conversions:**
- `appointment_click`
- `phone_click`
- `form_submit_success`

---

## 2. Vercel Web Analytics

**Status:** Auto-enabled on Vercel Pro projects once deployed. No code change required.

**Steps:**
1. Push to the Vercel project (project is already linked via `.vercel/`).
2. After first deploy, go to Vercel Dashboard → Project → **Analytics** tab → **Enable Web Analytics**.
3. Vercel injects its own script server-side — no manual `<script>` tag needed.

---

## 3. Vercel Speed Insights

**Status:** Auto-enabled on Vercel Pro projects once deployed. No code change required.

**Steps:**
1. After first deploy, Vercel Dashboard → Project → **Speed Insights** tab → **Enable**.
2. Real user Core Web Vitals (LCP, CLS, INP, FID, TTFB) will populate within ~24 hours.
3. Target: all green (LCP < 2.5s, CLS < 0.1, INP < 200ms).

---

## 4. Contact Form Backend (Formspree)

**Placeholder in code:** `action="REPLACE_ON_LAUNCH"`

**Where it lives:**
- `contact/index.html` → `<form data-contact-form action="REPLACE_ON_LAUNCH" method="POST">`

**Why Formspree:** No server needed, HIPAA-light (no PHI collected in form — only name, phone, email, reason, insurance carrier name, and free-text message). GDPR/CCPA compliant. Free tier covers 50 submissions/month.

**Steps:**
1. Sign up at https://formspree.io with `team@chardonpt.com`.
2. Create a new form called **Chardon PT – Contact**.
3. Add the notification email: `team@chardonpt.com`.
4. Copy the form endpoint (format: `https://formspree.io/f/xxxxxxxx`).
5. Edit `contact/index.html`:
   ```
   action="REPLACE_ON_LAUNCH"   →   action="https://formspree.io/f/xxxxxxxx"
   ```
6. In Formspree dashboard, enable:
   - [x] reCAPTCHA (the honeypot field `company` is already in place as a first-line filter)
   - [x] File upload: **off**
   - [x] Redirect after submit: leave blank (the JS in `main.js` handles the success state inline)
   - [x] Auto-response email to sender: **on**, with subject `We got your message — Chardon Performance Therapy`
7. Test submit from staging before flipping DNS.

**Fallback:** If JS is disabled, the form posts directly to Formspree and Formspree handles the thank-you page. The `<noscript>` mailto link also exists as a last-resort fallback.

---

## 5. Google Search Console

**Steps:**
1. Go to https://search.google.com/search-console.
2. Add property: `https://www.chardonperformancetherapy.com` (URL prefix, not Domain).
3. Verify via DNS TXT record (easiest on Vercel-managed DNS) or via the HTML meta tag (add to `<head>` of `index.html`).
4. Submit sitemap: `https://www.chardonperformancetherapy.com/sitemap.xml`.
5. Request indexing for: `/`, `/services/`, `/new-patients/`, `/contact/`.

---

## 6. Bing Webmaster Tools

**Steps:**
1. Go to https://www.bing.com/webmasters.
2. Import from Google Search Console (fastest) OR add and verify manually.
3. Submit sitemap: `https://www.chardonperformancetherapy.com/sitemap.xml`.

---

## 7. Google Business Profile (do not skip)

**Steps:**
1. Verify both locations on https://business.google.com:
   - **520 Fifth Avenue, Suite 3, Chardon, OH 44024** (primary clinic)
   - **115 Woodin Ave, Chardon, OH 44024** (Woodin — PerformanceFit classes)
2. Add website URL to each listing: `https://www.chardonperformancetherapy.com/locations/` (or the clinic-specific page if added later).
3. Add phone: `(440) 299-7171`.
4. Add hours, services (Physical Therapy, Dry Needling, Blood Flow Restriction Training, Golf Performance), and 3–5 photos.
5. The LocalBusiness / PhysicalTherapy JSON-LD on `/locations/` is already wired to match exactly what GBP lists — do not change one without the other.

---

## Pre-launch grep-for-sentinel

Run this right before DNS flip to confirm nothing was missed:

```bash
grep -r "REPLACE_ON_LAUNCH" --exclude-dir=.git --exclude-dir=node_modules --exclude=analytics-setup-checklist.md .
grep -r "G-REPLACE_ON_LAUNCH" --exclude-dir=.git --exclude-dir=node_modules --exclude=analytics-setup-checklist.md .
```

Both commands should return **zero matches** at launch time.
