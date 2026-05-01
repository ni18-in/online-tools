# Identified Issues and Recommendations - Audit Status

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
