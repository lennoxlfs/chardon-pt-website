# Implementation Log — Chardon Performance Therapy Website

A running record of meaningful build decisions, content milestones, and ops changes. Append entries in **reverse-chrono** (newest on top). Keep entries tight — one paragraph, plus a short bullet list if needed.

---

## 2026-04-17 — Final production build complete

**Outcome:** Full production website built end-to-end. Ready for Monday 2026-04-20 DNS flip pending the three launch-day swaps (GA4 ID, Formspree endpoint, GBP verification).

**Pages shipped (19 public URLs):**
- `/` (homepage)
- `/services/` + 5 detail pages: physical-therapy, dry-needling, blood-flow-restriction, golf-performance, performancefit-classes
- `/about/`, `/team/`, `/locations/`, `/new-patients/`, `/contact/`
- `/blog/` index + 3 pillar articles: TPI-for-golfers, dry-needling-for-runners, first-visit walkthrough
- `/privacy/`, `/accessibility/`, `/terms/`
- `/404.html`, `/500.html`

**System pieces:**
- Shared CSS in `css/main.css` (design tokens + component library — cards, buttons, nav, footer, hero variants, info-blocks, FAQ, features grid, map-embed, team-card, credentials-list, blog-card, prose)
- Shared JS: `js/main.js` (nav, scroll reveal, form handler w/ honeypot + mailto fallback, mobile menu) and `js/analytics.js` (`window.CPTAnalytics.track` wrapper + scroll depth + outbound click tracking)
- `robots.txt` with AI bot allowlist (GPTBot, ClaudeBot, Perplexity, Google-Extended, etc.) and internal-doc disallow list
- `sitemap.xml` covers all 19 URLs with priority + changefreq
- `site.webmanifest` for PWA/install prompt; theme color `#0a0f15`
- `vercel.json` with strict CSP, HSTS, X-Frame-Options, Permissions-Policy, clean URLs, trailing slash, and ~20 legacy/short-URL redirects (`/bfr`, `/tpi`, `/golf`, `/book`, `/first-visit`, `/dave`, `/courtney`, etc.)

**Schema coverage:** PhysicalTherapy + ExerciseGym at `/locations/` (with GeoCoordinates + openingHoursSpecification for both 520 Fifth Ave and 115 Woodin); Person schema for Dave (DPT, CIDN, TPI Medical 2, BFR, alumniOf UKentucky) and Courtney (CIDN) at `/team/`; BlogPosting on each article; FAQPage at `/new-patients/`; BreadcrumbList on every interior page; WebSite + Organization + PhysicalTherapy on home.

**Deliberately left as placeholders for launch-day swap:**
- `G-REPLACE_ON_LAUNCH` — GA4 Measurement ID (every page's gtag snippet)
- `REPLACE_ON_LAUNCH` — Formspree action URL on `/contact/` form

Both are grep-for-sentinel safe: a single `grep -r REPLACE_ON_LAUNCH` before flip confirms nothing missed.

**Docs at repo root:** `README.md`, `launch-checklist.md`, `analytics-setup-checklist.md`, `implementation-log.md` (this file).

**Not deploying.** Stopping here per brief — build complete, QA passed locally, ready to ship Monday.

---

## 2026-04-17 — Content voice and visual decisions worth remembering

A few non-obvious decisions locked in during the build — documenting here in case any of them get questioned post-launch:

- **Ohio direct access** is featured prominently on `/new-patients/`. Ohio allows direct access to PT without a physician referral, and this is a real differentiator for a clinic targeting active adults and athletes who just want to book and go. Not buried in FAQ — it's a lead section.
- **TPI Medical 2** (not just "TPI certified") is the language used everywhere for Dave. Level 2 Medical is materially above generic TPI and is the right framing for golfers who know the difference. If the certification level ever changes, update `/team/`, `/services/golf-performance/`, `/blog/why-golfers-need-a-tpi-certified-pt/`, and the Person JSON-LD simultaneously.
- **CIDN, not "dry needling certified"** — both clinicians have the Certified in Integrative Dry Needling credential. Spell it out everywhere.
- **Two locations, two schemas**: 520 Fifth Ave is `PhysicalTherapy` (clinic). 115 Woodin is `ExerciseGym` (PerformanceFit classes, not PT). These are distinct entities for Google. Keep them distinct.
- **No stock photos of needles or clinicians we don't have photos of yet.** Blog articles use inline SVG illustrations rather than placeholders. When real photography lands, swap inline.
- **Brand colors**: navy `#0a0f15` / `#111921`, brand blue `#0447a7`, accent olive `#a1b50f`. Accent olive is used sparingly — bullet dots, active states, small accents — never on large surfaces. Brand blue is the primary CTA color.
- **No framework.** Vanilla everything. This was intentional — the site is ~15 pages, will rarely change, and Dave will not be editing code. Shipping a Next.js build for this is overkill and adds a maintenance tax the clinic doesn't need.
