# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What this repo is

A static collection of browser-based utility tools deployed to GitHub Pages at `online-tools.ni18.in` (see `CNAME`). The `redesign/astro-md3` branch is a full **Astro 6 SSG + Material Web Components (MD3)** rewrite of what used to be hand-written HTML on `main`. All 48 pages (21 tools, homepage, `/tools/` listing, 8 blogs, about, 404, plus `/es/` + `/fr/` locales) have been migrated. `main` still holds the legacy hand-written HTML — until the Pages source is cut over, both coexist.

Tools remain client-side only. Don't introduce server calls or third-party data exfiltration — anything that touches user input (JSON, images, recordings) must stay in-browser.

## Commands

```bash
npm run dev            # astro dev server
npm run build          # astro build → dist/
npm run preview        # serve built dist/
npm run verify         # build + verify-build.mjs (canonical / JSON-LD / URL / no-Tailwind-CDN gate)
npm run verify:build   # run gate alone against existing dist/
npm run test:e2e       # Playwright (see tests/tools.spec.ts)
npm run test:lh        # Lighthouse CI (lighthouserc.json) — non-blocking
```

CI (`.github/workflows/deploy.yml`) runs `verify` + Playwright on PRs and gates deploys on them; only `main` deploys.

## Architecture

**Catalog-driven.** `src/data/tools.ts` is the canonical list — it drives the homepage grid, `/tools/` listing, sitemap generation (`src/pages/sitemap.xml.ts`), and per-tool SEO. Add a tool by adding a catalog entry + a page under `src/pages/tools/<slug>/index.astro`. Same pattern for `src/data/blogs.ts` and `src/data/i18n.ts` (locale strings).

**Layouts and SEO.** `src/layouts/{Base,Page,Tool,Blog}Layout.astro` wrap pages; `<Seo>` (`src/components/Seo.astro`) emits canonical, hreflang reciprocals, OG/Twitter, and JSON-LD via `set:html(JSON.stringify(...))` (valid by construction — never hand-author JSON-LD strings). `ToolLayout` accepts a `headRaw` prop for per-tool CDN script tags.

**URL contract (load-bearing for SEO).** `astro.config.mjs` sets `build.format:'preserve'` + `trailingSlash:'ignore'` so directory routes emit with a trailing slash (`/tools/<slug>/`) and blog posts emit a literal `.html` (`/blogs/<name>.html`). `verify-build.mjs` enforces this against `sitemap.xml`. Don't change either config knob without re-checking the sitemap diff.

**Tailwind wiring (deliberately unusual).** Tailwind v3 is wired via **PostCSS** (`postcss.config.mjs`), not `@astrojs/tailwind` (that integration peers Astro ≤5). The entry stylesheet imports `@tailwind components` + `@tailwind utilities` only — **Preflight is OFF** globally via `corePlugins.preflight:false`, because the legacy tool markup relies on UA defaults. A scoped Preflight (`src/styles/tw-preflight-scoped.css`) is re-supplied inside a `.legacy-tw` wrapper for the ~11 tools that need it. `darkMode` is `['variant', ['[data-theme="dark"] &', '.dark &']]` so `dark:` utilities follow both the MD3 shell toggle and each tool's own `.dark` class.

**Tool migration pattern (two flavors).**
- Small / custom-CSS tools are transcribed into an Astro template with a scoped `<style>`; CSS vars remap to MD3 tokens so the tool follows the theme.
- Most tools come through `scripts/extract-legacy.mjs <slug> [src] [category]`, which pulls body/CSS/JS verbatim from a legacy HTML file, strips GA/ads/Tailwind-CDN, PostCSS-scopes CSS to `#tool-<slug>`, and (for blogs/pages) narrows to `<main>`. The resulting Astro page is thin SEO wiring + `set:html(body)` + scoped `<style>` + `is:inline` `<script>`.

**Tool islands.** Each tool keeps its own background and color scheme (several are intentionally dark — stripping background makes their light text unreadable). `.tool-island` provides a consistent outer frame (centered, max-width 1080, soft radius) without border/shadow, so it doesn't double-frame tools that already render their own cards.

## Astro gotchas (learned the hard way)

- **`set:html` does NOT execute injected `<script>` tags.** When migrating a tool, split JS out and re-attach via `<script is:inline set:html={js}>`.
- **Hoisted module scripts inside a layout slot silently don't bundle.** If a `<script>` with an `import` lives in a page that's rendered through a layout `<slot/>`, Astro may skip it. Use `is:inline` for tool JS.
- **`getStaticPaths` can't close over frontmatter `const`s** — it runs in its own scope. Define the array inside `getStaticPaths` or `import` it.
- **Column-flex item + `margin:0 auto`** disables `align-items:stretch` and shrink-wraps to content width. Use `width:100%` on `.tool-main` so tools fill the page shell.

## Localization

`src/pages/es/` and `src/pages/fr/` mirror the root structure. Translated tool slugs may differ (e.g. `es/tools/px-a-rem-convertidor/`). Not every English tool has a translation — `src/data/i18n.ts` and the catalog drive which alternates exist, and `<Seo>` only emits hreflang entries for present locales (reciprocity is enforced).

## SEO conventions (still load-bearing — see `ISSUES.md`)

- Every page: `<link rel="canonical">`, `<meta name="description">`, OG + Twitter tags, JSON-LD (`WebApplication` for tools, `BlogPosting` for blogs, `CollectionPage`/`ItemList` for landing, plus `BreadcrumbList` on tools/blogs).
- Full hreflang set (`en`/`es`/`fr`/`x-default`) where translations exist.
- Trailing slashes on directory URLs; literal `.html` on blog posts (see URL contract above).
- `alt` on every `<img>`.
- JSON-LD is emitted from `<Seo>` via `set:html(JSON.stringify(...))` — don't hand-write JSON-LD with `//` comments. Legacy validators (`scripts/validate-jsonld.js`, `strip-jsonld-comments.js`) exist because that was a recurring bug on the old site.

## Maintenance scripts

`scripts/` are standalone Node/Bash helpers — no npm aliases for most:

- `scripts/extract-legacy.mjs <slug> [src] [category]` — legacy-tool ingestion (see above).
- `scripts/verify-build.mjs` — the build gate (wired as `verify:build`).
- `scripts/validate-jsonld.js`, `scripts/validate-canonicals.js`, `scripts/strip-jsonld-comments.js` — legacy validators, still useful when touching SEO across the locale tree.
- `scripts/add-breadcrumbs.sh`, `scripts/optimize-images.sh` — Bash idempotent sweeps; need the Bash tool on Windows.

## Legacy files still in the tree

Root `index.html`, `tools/<slug>/index.html`, `blogs/*.html`, `es/`, `fr/`, root `style.css` / `script.js` are the **old** hand-written site. They're kept on this branch only so a branch-based Pages deploy doesn't break mid-cutover. Don't edit them — work in `src/`. They'll be deleted after the Pages source is switched to "GitHub Actions" and the Astro build goes live.
