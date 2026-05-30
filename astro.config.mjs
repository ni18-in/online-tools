// @ts-check
import { defineConfig } from 'astro/config';

// online-tools.ni18.in — pure static, deployed to GitHub Pages.
// URL contract (load-bearing for SEO — see plan + ISSUES.md):
//   - directory pages keep a trailing slash  (/, /tools/, /tools/<slug>/, /about/, /blogs/)
//   - blog POSTS keep a literal .html         (/blogs/<name>.html)
// build.format:'preserve' lets both coexist: folder/index.astro -> folder/index.html (trailing slash),
// and a non-index .astro route -> <name>.html. Validated by the dist/ inspection in P0.
//
// Tailwind v3 is wired via PostCSS (postcss.config.mjs), NOT @astrojs/tailwind (deprecated,
// and peers Astro <=5). The Tailwind entry (src/styles/tailwind.css) imports only the
// `components`+`utilities` layers — never `base` — so Preflight never resets legacy tool CSS.
export default defineConfig({
  site: 'https://online-tools.ni18.in',
  trailingSlash: 'ignore',
  build: { format: 'preserve' },
});
