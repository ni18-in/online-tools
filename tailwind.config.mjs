/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}',
    // Legacy tool bodies are injected via set:html, so Tailwind must scan them to keep
    // the utility classes those tools' markup + JS depend on.
    './src/components/legacy/**/*.html',
  ],
  // Belt-and-suspenders with applyBaseStyles:false — never emit the Preflight reset.
  corePlugins: { preflight: false },
  // Classes added/removed at runtime by tool JS (string literals the scanner can't see).
  // Audited and extended per-tool during P3–P5.
  safelist: ['hidden'],
  theme: { extend: {} },
  plugins: [],
};
