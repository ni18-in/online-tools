// Tailwind v3 + Autoprefixer via PostCSS. Vite (Astro) picks this up automatically
// for any imported CSS. Tailwind reads tailwind.config.mjs for content/safelist/preflight.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
