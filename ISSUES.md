# Identified Issues and Recommendations - Audit Status

## Round 3: 2026-08-12 Post-migration audit (Astro site)

A full scan of the built `dist/` (122 pages) for defects the existing gate did
not cover. Four correctness bugs, then the gate was extended so each one fails
the build from now on.

### Fixed in this round

#### Two French blog pages shipped completely blank
`/fr/blogs/ai-beauty-test-free-online.html` and
`/fr/blogs/guide-iphone-photo-fixer.html` rendered an empty `<article>`. The
blog routes resolve partials by the **English** slug (`blog-<en-slug>/`), but
those two directories were named after the French slug, so the lookup returned
`''`. Directories renamed; `pick()` now takes `required=true` for `body.html`
and throws during the build instead of emitting a blank page.

#### Duplicate title + description on two blog pairs
`basic-auth-header-guide` / `jwt-debugger-guide` (thin, ~2.5 KB) carried
byte-identical titles *and* descriptions to `secure-basic-auth-header` /
`chrome-privacy-shift-jwt-debugger` (~13 KB) — the same duplicate-signal class
Round 2 blames for the deindexing. Consolidated onto the long articles; neither
thin page had ever deployed, so no index equity was lost.

#### Four `og:image` URLs pointed at files that were never committed
The newest four posts referenced `/assets/blog/<slug>-banner.webp` with no such
file, so social previews were broken. The consolidated posts' banners were
repointed to the surviving articles; fastjson/heic reuse related banners.

#### `<h1>` structure
17 tool pages had **no** `h1` (their markup starts at `h2`) and
`happy-new-year` had **two** in all three locales. `ToolLayout` now takes an
optional visually-hidden `h1`; the hidden shared-wish heading became
`h2.as-h1`, which inherits the `h1` styling across themes and breakpoints.

#### SERP truncation
45 titles >65 chars / descriptions >165 chars trimmed across en/es/fr. The gate
reports 0 length warnings now. Stale "in 2025" markers in three blog titles
were dropped rather than bumped.

### Guard rails added (so Round 4 isn't a repeat)

`scripts/verify-build.mjs` gained five hard checks — single `h1`, social image
resolves, no duplicate titles/descriptions, non-empty main content, no broken
internal links / missing `alt`. Each was negative-tested by injecting the
defect into `dist` and confirming the gate fails.

Playwright: the tool list is read from `src/data/tools.ts` instead of being
hand-copied (it claimed 21 while holding 23), plus smoke coverage for all 42
`es`/`fr` tool pages — each locale tool ships its own `body.html` + `script.js`,
so a JS error in a localized copy was previously invisible. 74 tests (was 30).

### Still open (deliberately not done here)

- **CLS**: 62 `<img>` without `width`/`height`, 24 without `loading`. Needs the
  intrinsic dimensions of each asset; worth a dedicated pass.
- **Third-party tool libraries** load from `cdnjs`, `unpkg`, `jsdelivr` on 6
  tools. A CDN outage breaks those tools, and it's third-party code on pages
  that advertise "100% client-side". Vendoring them locally is the fix.
- **Google Fonts** is still a render-blocking third-party request on every page.
- **`GSC_VERIFICATION`** in `src/data/site.ts` is wired but empty — paste the
  token from Search Console to emit the backup verification tag.
- **Legacy hand-written HTML** still in the tree; delete after the Pages source
  is switched to GitHub Actions.

---

## Round 2: 2026-05-02 Indexability Recovery

The site had disappeared from Google search results. A second SEO audit found
multiple inconsistencies that had crept back in since the first pass — these
are the most likely cause of deindexing.

### Fixed in this round

#### Canonical / hreflang / og:url conflicts (top deindexing cause)
Conflicting URL signals tell Google the canonical is uncertain, which can lead
to URLs being dropped from the index. Found and fixed:

- **5 canonicals missing trailing slashes** while sitemap, hreflang, and
  internal links used trailing slashes:
  `tools/next-gen-gst-reforms/`, `tools/free-online-image-utility-tool/`,
  `es/about/`, `es/blogs/`, `fr/about/`.
- **Wrong `og:url` on `blogs/px-to-rem-converter.html`** — it pointed at the
  homepage (`https://online-tools.ni18.in/`), not its own URL.
- **og:url / canonical mismatches** (trailing-slash drift) on
  `about/`, `blogs/`, `tools/free-online-image-utility-tool/`,
  `tools/px-to-rem-converter/`, `tools/rem-to-px-converter/`,
  `es/tools/rem-to-px-converter/`, `es/tools/px-a-rem-convertidor/`.
- **JSON-LD `url` self-references** in `next-gen-gst-reforms`,
  `free-online-image-utility-tool`, `px-to-rem-converter`,
  `rem-to-px-converter`, `es/tools/rem-to-px-converter`,
  `es/tools/px-a-rem-convertidor`, `blogs/index.html`, and the homepage
  list — all normalized to the canonical URL with trailing slash.

#### Broken hreflang target
- The homepage (and many other pages) advertised `hreflang="fr"` to
  `https://online-tools.ni18.in/fr/`, but `fr/index.html` did not exist
  and the URL returned 404. Created `fr/index.html` (mirrors the Spanish
  homepage in French) so the hreflang cluster is now valid.

#### Sitemap freshness
- Refreshed all `<lastmod>` dates to 2026-05-02 to encourage Google to
  recrawl, added the missing `/fr/` homepage entry, and added consistent
  `xhtml:link` alternates (`en`, `es`, `fr`, `x-default`) to landing pages.

#### Indexing controls
- Added `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">`
  to all 48 HTML pages. The `max-image-preview:large` directive enables
  Google Discover and rich image previews; `max-snippet:-1` allows full
  snippet text. Previously only one tool page had any robots meta.

#### Internal navigation
- Bulk-fixed 30+ navigation links in `es/` and `fr/` pages that were missing
  trailing slashes (e.g. `/es/tools` → `/es/tools/`). These would have
  triggered 301 redirects on every click, wasting crawl budget.

#### 404 handling
- Added `404.html` so GitHub Pages returns a proper 404 with a useful
  in-brand page, preventing soft-404s from hurting ranking.

### Confirmed fine (no action needed)
- No `noindex` or `nofollow` tags anywhere
- No `X-Robots-Tag` blocking from server
- All pages return HTTP 200 to Googlebot
- robots.txt allows all crawlers
- Every `<img>` has an `alt` attribute
- Every page has exactly one `<title>`, `<meta name="description">`, and one canonical
- Site is reachable from `bingbot`, `yandex` (verified file is present)

---

## Required manual steps (cannot be done from the repo)

These must be done by the site owner with access to Google Search Console:

1. **Verify ownership in Google Search Console** for `online-tools.ni18.in`
   (no `google-site-verification` meta currently present — ownership may
   already be verified via DNS, but confirm).
2. **Resubmit `sitemap.xml`** in GSC → Sitemaps so Google picks up the new
   `lastmod` timestamps.
3. For any URLs flagged as "Crawled - currently not indexed" or
   "Discovered - currently not indexed" in GSC, use **URL Inspection → Request Indexing**.
4. Check **Coverage / Pages report** in GSC for any "Excluded" URLs — these
   will tell you exactly what Google sees as the deindexing reason.
5. Check **Manual actions** and **Security issues** in GSC. If a manual
   penalty exists, no on-page fix recovers indexing until it is reviewed
   and lifted.

---

## Round 1: prior audit (still applies)

### Meta tags & internationalization (FIXED earlier)
- Added keyword meta tags to all HTML pages.
- Added full `hreflang` set (`en`, `es`, `fr`, `x-default`) to landing pages.
- Added `<link rel="canonical">` to all pages.

### Structured data (FIXED earlier)
- Added `WebApplication` schema to `happy-new-year`, `iphone-photo-fixer`,
  `subtitle-resync-tool`.

### Accessibility (FIXED earlier)
- Fixed `<img>` tags missing `alt` attributes site-wide.

### Navigation (FIXED earlier)
- Standardized internal links to trailing slashes (this was partially
  reverted in newer pages — fixed again in Round 2).

---

## Out of scope for this audit (recommended next phase)

The following would meaningfully improve UX, performance, and Core Web
Vitals, but require coordinated changes across all 21 tool pages and
contradict the current "no build system" architecture documented in
`CLAUDE.md`. They should be planned as a separate phase:

- **Replace Tailwind CDN** with a precompiled stylesheet. The Tailwind team
  explicitly says the CDN is not for production — it ships ~3 MB of CSS and
  blocks rendering. Single biggest LCP win available.
- **Shared header/footer** so navigation, language switcher, and footer are
  consistent across all 36+ pages. Without a build system this means either
  introducing a templating step or accepting hand-maintained duplication.
- **Lazy-load images** below the fold (`loading="lazy"`) and add explicit
  `width`/`height` to prevent CLS.
- **Per-tool functional smoke tests** (Playwright/Cypress) so future SEO
  edits cannot silently break a tool's JavaScript.
- **Add `google-site-verification` meta** as a backup verification method
  in GSC.

---
*Round 2 status: 2026-05-02. Indexability blockers fixed; awaiting GSC
resubmit and recrawl.*
