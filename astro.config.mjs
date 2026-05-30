// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// online-tools.ni18.in — pure static, deployed to GitHub Pages.
// URL contract (load-bearing for SEO — see plan + ISSUES.md):
//   - directory pages keep a trailing slash  (/, /tools/, /tools/<slug>/, /about/, /blogs/)
//   - blog POSTS keep a literal .html         (/blogs/<name>.html)
// build.format:'preserve' lets both coexist: folder/index.astro -> folder/index.html (trailing slash),
// and a non-index .astro route -> <name>.html. Validated by the dist/ inspection in P0.
export default defineConfig({
  site: 'https://online-tools.ni18.in',
  trailingSlash: 'ignore',
  build: { format: 'preserve' },
  integrations: [
    // applyBaseStyles:false => NO Tailwind Preflight reset injected (it would restyle the
    // ~10 tools that rely on their own inline CSS + UA defaults). Utilities only.
    tailwind({ applyBaseStyles: false }),
  ],
});
