# Chardon Performance Therapy — Website

Production website for **Chardon Performance Therapy**, a 1-on-1 physical therapy practice in Chardon, Ohio specializing in manual therapy, dry needling (CIDN), Blood Flow Restriction (BFR) training, and TPI-certified golf performance.

**Live site:** https://www.chardonperformancetherapy.com
**Primary contact:** Dave Nelson, PT, DPT, CIDN — `team@chardonpt.com` / (440) 299-7171

---

## Stack

- **Static HTML + CSS + vanilla JS** — no frameworks, no build step
- **Hosted on Vercel** (static output, `vercel.json` for headers + redirects)
- **Analytics:** GA4 + Vercel Web Analytics + Vercel Speed Insights
- **Forms:** Formspree (backend for `/contact/`)
- **Fonts:** Google Fonts — Space Grotesk (display) + Inter (body)

No Node runtime, no database, no CMS. Content is edited directly in HTML files and deployed via `git push`.

---

## Project structure

```
/
├── index.html                       Homepage
├── 404.html                          Not-found page (served by Vercel)
├── 500.html                          Server error page
├── robots.txt
├── sitemap.xml
├── site.webmanifest                  PWA manifest
├── vercel.json                       Headers, redirects, clean URLs
│
├── css/
│   └── main.css                      All styles (design tokens + components)
├── js/
│   ├── main.js                       Nav, form, scroll reveal, CPTAnalytics wrapper
│   └── analytics.js                  GA4 + Vercel tracking setup
│
├── brand_assets/                     Logo files
├── assets/                           Photos, graphics
│
├── services/
│   ├── index.html                    Services overview
│   ├── physical-therapy/
│   ├── dry-needling/
│   ├── blood-flow-restriction/
│   ├── golf-performance/
│   └── performancefit-classes/
│
├── about/
├── team/
├── locations/
├── new-patients/
├── contact/
│
├── blog/
│   ├── index.html
│   ├── why-golfers-need-a-tpi-certified-pt/
│   ├── dry-needling-for-runners/
│   └── first-physical-therapy-visit-chardon/
│
├── privacy/
├── accessibility/
└── terms/
```

---

## Local development

No build step. Just serve the repo root with any static file server:

```bash
# Python (built-in)
python3 -m http.server 3000

# Or Node (if you have it installed)
npx serve . -p 3000
```

Then open http://localhost:3000.

Edit HTML / CSS / JS directly — changes are visible on refresh.

---

## Deployment

The repo is linked to a Vercel project via `.vercel/`. Pushing to `main` triggers a production deploy:

```bash
git push origin main
```

Preview deploys happen on PRs automatically.

---

## Conventions

### Design tokens

All color, spacing, typography, and radius values are CSS custom properties defined at the top of `css/main.css`. Use the tokens, not raw values:

```css
/* good */
color: var(--brand-500);
padding: var(--space-8);

/* bad */
color: #0447a7;
padding: 32px;
```

### Components

CSS is organized by **component**, not page. If two pages need a card, the card is defined once in `main.css` and the classname is reused. Don't write per-page styles.

### JSON-LD schema

Every page carries JSON-LD structured data:
- **Homepage**: `PhysicalTherapy` + `WebSite` + `Organization`
- **Service pages**: `MedicalTherapy` or `Service` + `BreadcrumbList`
- **Locations**: `PhysicalTherapy` + `ExerciseGym` with `PostalAddress` + `GeoCoordinates` + `openingHoursSpecification`
- **Team**: `Person` with `hasCredential` for DPT, CIDN, TPI, BFR
- **Blog articles**: `BlogPosting` with author Person
- **New patients**: `FAQPage`
- **Contact**: `ContactPage`
- All pages: `BreadcrumbList`

If you edit a page, keep the schema in sync with the visible content. Validate at https://search.google.com/test/rich-results.

### Analytics events

All tracked interactions go through `window.CPTAnalytics.track(event, params)` defined in `js/analytics.js`. Never call `gtag` directly from markup — use `data-event`, `data-label`, `data-location` attributes on CTAs and let the wrapper handle it.

### Accessibility

Target is **WCAG 2.1 Level AA**. The stricter things worth calling out:
- Every interactive element is keyboard accessible
- `prefers-reduced-motion` disables scroll reveal
- Focus styles are visible (not removed)
- Form errors are announced, not just colored red
- Color contrast ≥ 4.5:1 body, ≥ 3:1 large text

See `/accessibility/` for the public statement.

---

## Before making changes

- **Do not** edit `research-package.md`, `brand-package.md`, `client-report.md`, or `internal-report.md`. They are internal LFS documents and are gitignored; they existed before and after the website build.
- **Do not** commit `.docx`, `.pdf`, or anything in `temporary screenshots/`. `.gitignore` already covers this.
- **Do** append notes to `implementation-log.md` when you make meaningful changes (new page, content overhaul, schema update).
- **Do** keep `sitemap.xml` in sync when adding or removing public pages.

---

## Launch + analytics setup

See the two checklists at the repo root:

- [`launch-checklist.md`](./launch-checklist.md) — step-by-step runbook for the DNS flip and post-launch verification
- [`analytics-setup-checklist.md`](./analytics-setup-checklist.md) — GA4, Vercel Analytics, Speed Insights, Formspree, Search Console, and GBP setup

---

## Ownership

Built and maintained by **LFS** (Lennox's agency) for Chardon Performance Therapy. Questions about the codebase → `lennoxlfs@gmail.com`. Questions about the clinic → `team@chardonpt.com`.
