# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A pure-static collection of browser-based utility tools, deployed to GitHub Pages at `online-tools.ni18.in` (see `CNAME`). **No build system, no package manager, no bundler, no tests** — every page is hand-written HTML with inline CSS/JS and CDN-loaded dependencies (Tailwind via `cdn.tailwindcss.com`, FontAwesome, jQuery for some tools, Google Fonts Inter).

## Run locally

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Any static file server works. There is no `npm install` step — opening `index.html` directly mostly works too, except CDN scripts and root-relative paths (`/assets/...`, `/tools/...`) require a server at the site root.

## Architecture

**Each tool is one self-contained `tools/<slug>/index.html` file** (typically 200–1700 lines) that bundles its markup, inline `<style>`, inline `<script>`, and any CDN imports it needs. There is no shared JS framework, no shared component layer, no build pipeline that combines them. Tools do not import each other. To add a new tool: create `tools/<new-slug>/index.html`, add a card to the homepage `index.html` tool grid, and add entries to `sitemap.xml`.

**Shared root assets** are minimal:
- `index.html` — landing page with the tool grid
- `style.css` — site-wide styles for the landing/listing pages (individual tools mostly use Tailwind + their own inline styles)
- `script.js` — powers ONLY the homepage live search-filter over `.tool-card` elements
- `assets/icons/` — favicons, PWA icons referenced by `manifest.json`
- `manifest.json`, `robots.txt`, `sitemap.xml`, `favicon.ico`, `yandex_*.html` — site metadata

**Localization is done by directory duplication**, not i18n keys. `/es/` and `/fr/` mirror the root structure (`es/index.html`, `es/tools/<slug>/index.html`, `es/blogs/`, `es/about/`). Translated tool slugs may differ (e.g. `es/tools/px-a-rem-convertidor/`). Not every English tool has a translation — only a subset is mirrored.

**Blogs** (`blogs/*.html`) are SEO articles linking back to the tools. Images live in `blogs/images/`.

## SEO and accessibility conventions (load-bearing)

This site lives or dies on search ranking — `ISSUES.md` documents a completed audit and the conventions it locked in. **When editing or adding any HTML page, preserve these:**

- `<link rel="canonical">` on every page
- Full `hreflang` set (`en`, `es`, `fr`, `x-default`) on landing/tool pages where translations exist
- `<meta name="description">` and `<meta name="keywords">` on every page
- `application/ld+json` structured data — typically `WebApplication` schema for tool pages, `BlogPosting` for blogs, `CollectionPage`/`ItemList` for the homepage
- Open Graph (`og:*`) and `twitter:*` meta tags
- **Trailing slashes on all internal directory URLs** (`/tools/`, not `/tools`) — this was a deliberate normalization
- `alt` attributes on every `<img>`
- Update `sitemap.xml` when adding/removing pages, including the `<xhtml:link rel="alternate" hreflang="...">` entries

Existing tool pages are the reference template — copy the `<head>` structure from a similar tool (e.g. `tools/json-visualizer-pro/index.html`) rather than writing from scratch.

## Privacy posture

Tools are advertised as client-side. Don't introduce server calls or third-party data exfiltration — any tool that touches user data (JSON input, uploaded images, screen recordings) must process it in-browser only.

## What's NOT here

No `package.json`, no `node_modules`, no test runner, no linter config, no CI beyond GitHub Pages deployment. Don't try to run `npm`/`yarn`/`pnpm` or look for a missing build step — there isn't one
