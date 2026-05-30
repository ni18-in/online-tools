// Material Web Components used by the shell. Imported from a single deferred module
// (Astro bundles + defers this), so MWC's Lit runtime never blocks first paint/LCP.
// Only the components actually used in the chrome are registered, keeping the bundle small.
import '@material/web/iconbutton/icon-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/ripple/ripple.js';

// Adopt the MD3 typescale utility classes (.md-typescale-*) site-wide.
import { styles as typescaleStyles } from '@material/web/typography/md-typescale-styles.js';
document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
