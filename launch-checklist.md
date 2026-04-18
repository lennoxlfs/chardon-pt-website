# Launch Checklist — Chardon Performance Therapy

**Target launch:** Monday 2026-04-20
**Domain:** `chardonperformancetherapy.com` (flipping DNS from placeholder to Vercel)
**Primary contact on launch day:** LFS (Lennox)
**Clinic contact:** Dave Nelson — `team@chardonpt.com` / (440) 299-7171

Work this top-to-bottom. Don't skip steps marked **[blocking]** — they gate the DNS flip.

---

## T-3 days — final build review (Friday 2026-04-17)

- [x] All pages built, QA'd locally, and pushed to `main`
- [x] `robots.txt` correct (public crawlers allowed, internal docs disallowed, AI bot allowlist in place)
- [x] `sitemap.xml` lists all 19 public URLs
- [x] `/404.html` and `/500.html` both styled and functional
- [x] `site.webmanifest` valid (tested in Chrome DevTools → Application → Manifest)
- [x] `vercel.json` shipped with security headers, clean URLs, trailing slash, redirects

---

## T-2 days — accounts + integrations (Saturday 2026-04-18)

### Formspree (contact form backend) **[blocking]**
- [ ] Sign up at https://formspree.io with `team@chardonpt.com`
- [ ] Create form "Chardon PT — Contact", notify → `team@chardonpt.com`
- [ ] Enable reCAPTCHA, auto-response email
- [ ] Copy endpoint → find/replace `REPLACE_ON_LAUNCH` → `https://formspree.io/f/xxxxxxxx`
- [ ] Test submit from preview deploy; confirm email arrives

### GA4 **[blocking]**
- [ ] Create GA4 property (Chardon Performance Therapy, America/New_York, USD)
- [ ] Create Web data stream for `https://www.chardonperformancetherapy.com`
- [ ] Copy Measurement ID → find/replace `G-REPLACE_ON_LAUNCH` across repo
- [ ] Mark `appointment_click`, `phone_click`, `form_submit_success` as conversions
- [ ] Confirm DebugView lights up after a test page load

### Vercel
- [ ] Dashboard → Project → Analytics → Enable Web Analytics
- [ ] Dashboard → Project → Speed Insights → Enable
- [ ] Confirm Production environment variables (none needed currently — all config is in `vercel.json`)

### Google Business Profile (both locations)
- [ ] Verify 520 Fifth Ave, Suite 3, Chardon, OH 44024
- [ ] Verify 115 Woodin Ave, Chardon, OH 44024
- [ ] Add website + phone + hours + services + photos
- [ ] Confirm LocalBusiness JSON-LD on `/locations/` matches GBP exactly

---

## T-1 day — final QA (Sunday 2026-04-19)

### Sentinel grep **[blocking]**
```bash
grep -r "REPLACE_ON_LAUNCH" --exclude-dir=.git --exclude=launch-checklist.md --exclude=analytics-setup-checklist.md .
```
- [ ] Returns **zero** matches

### Links & redirects
- [ ] All internal links resolve (200) — no /foo broken into /foo/
- [ ] All `tel:+14402997171` links work on mobile
- [ ] All `mailto:team@chardonpt.com` links work
- [ ] Legacy redirects work: `/bfr`, `/tpi`, `/golf`, `/book`, `/first-visit`, `/dave`, `/courtney`

### SEO
- [ ] Every page has unique `<title>` and `<meta description>`
- [ ] Every page has canonical URL pointing to `https://www.chardonperformancetherapy.com/...`
- [ ] Every page has OG + Twitter Card meta
- [ ] JSON-LD validates: https://search.google.com/test/rich-results for `/`, `/services/physical-therapy/`, `/locations/`, `/team/`, `/blog/why-golfers-need-a-tpi-certified-pt/`
- [ ] `sitemap.xml` validates at https://www.xml-sitemaps.com/validate-xml-sitemap.html

### Accessibility **[blocking]**
- [ ] Lighthouse Accessibility score ≥ 95 on `/`, `/services/`, `/new-patients/`, `/contact/`
- [ ] Keyboard nav works: tab through entire homepage, hit every CTA, open mobile menu, submit form
- [ ] Screen reader spot check: VoiceOver on `/` — headings, landmarks, skip link
- [ ] Contrast check on nav, hero text, footer, CTA buttons (target WCAG AA 4.5:1 body, 3:1 large)
- [ ] `prefers-reduced-motion` disables scroll reveal animations

### Performance **[blocking]**
- [ ] Lighthouse Performance ≥ 90 (mobile) on `/`, `/services/`, `/contact/`
- [ ] LCP < 2.5s, CLS < 0.1, INP < 200ms (field data from Speed Insights OR synthetic from PageSpeed Insights)
- [ ] Images lazy-loaded below the fold (`loading="lazy"` on all non-hero `<img>`)
- [ ] Fonts preconnected; `display=swap` on Google Fonts URL

### Security
- [ ] `vercel.json` headers active — check https://securityheaders.com after first deploy
- [ ] CSP does not block GA4, Formspree, Vercel Analytics, or Google Maps iframes
- [ ] HTTPS enforced, HSTS present

### Forms
- [ ] Contact form: submit with real data → email arrives at `team@chardonpt.com`
- [ ] Contact form: submit with honeypot filled → silently succeeds (bot trap)
- [ ] Contact form: submit with invalid email → inline error shows

### Browser matrix
- [ ] Safari on iPhone (latest iOS) — mobile menu, sticky bar, form
- [ ] Chrome on Android
- [ ] Safari on macOS
- [ ] Chrome on macOS / Windows
- [ ] Edge on Windows
- [ ] Firefox on macOS

---

## T-0 — launch day (Monday 2026-04-20)

### Morning (before DNS flip)
- [ ] Confirm deployment on Vercel preview URL is green, all checks passing
- [ ] One final sentinel grep — zero `REPLACE_ON_LAUNCH` matches
- [ ] Confirm with Dave he's available for the next ~4 hours for any "the website is doing X" calls

### DNS flip
- [ ] Update A / CNAME records at the registrar to point `chardonperformancetherapy.com` and `www.` to Vercel
- [ ] In Vercel → Project → Settings → Domains, add both `chardonperformancetherapy.com` and `www.chardonperformancetherapy.com`; set `www.` as primary
- [ ] Force HTTPS (should auto-provision Let's Encrypt cert within 2–5 min)
- [ ] Verify non-www redirects to www (set in Vercel domain config)

### Post-flip verification (within 30 min of DNS propagation)
- [ ] `https://www.chardonperformancetherapy.com` → loads homepage (HTTP 200)
- [ ] `https://chardonperformancetherapy.com` → 301 redirect to www
- [ ] `http://www.chardonperformancetherapy.com` → 301 redirect to https
- [ ] GA4 Real-time sees your own visit
- [ ] Contact form: live submit → email arrives
- [ ] Phone link on mobile initiates dial
- [ ] Google Maps iframe renders in `/locations/`

### Search Console + Bing
- [ ] Google Search Console: add property, verify, submit sitemap
- [ ] Bing Webmaster: import from GSC, submit sitemap
- [ ] Request indexing for `/`, `/services/`, `/new-patients/`, `/contact/`

### Announce
- [ ] Send Dave a "you're live" confirmation with screenshots
- [ ] Dave updates GBP website URL on both listings (should already be done; re-verify)

---

## T+1 — day after (Tuesday 2026-04-21)

- [ ] GA4 shows pageviews from real visitors (not just us)
- [ ] Speed Insights has field data populated
- [ ] No errors in Vercel → Logs
- [ ] Check Search Console: coverage report, any crawl errors
- [ ] Check Formspree: any real submissions overnight?

---

## T+7 — week one retro

- [ ] Top pages by pageviews (should skew `/`, `/services/*`, `/contact/`)
- [ ] Conversion events: any `appointment_click` / `phone_click` / `form_submit_success`?
- [ ] Speed Insights: all green? If not, which page + which metric needs work?
- [ ] Search Console: any pages indexed yet? Any queries showing?
- [ ] Any bounce pattern that suggests a page isn't landing (e.g., >85% bounce + <10s on page on a priority page)

---

## Rollback plan (if anything breaks)

1. **Form not sending** → check Formspree dashboard; fall back to `mailto:` in-page instruction while fixing
2. **Page throwing server error** → Vercel → Deployments → promote previous working deploy
3. **GA4 not tracking** → Measurement ID likely wrong; re-grep for typos, re-deploy
4. **CSP blocking something** → inspect browser console, add the domain to the appropriate CSP directive in `vercel.json`, redeploy
5. **Catastrophic** (wrong site deployed, DNS points elsewhere) → at registrar, restore previous DNS; Vercel keeps staging URL alive so the site is still reachable via preview

---

## Contact during launch

- **LFS (Lennox)** — `lennoxlfs@gmail.com` — on point for the deploy and any fixes
- **Dave Nelson** — `team@chardonpt.com` / (440) 299-7171 — for clinic-side calls
- **Vercel status** — https://www.vercel-status.com
- **Formspree status** — https://status.formspree.io
