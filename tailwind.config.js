/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind v4 no longer uses `content` in the config. Detection is automatic.
  theme: {
    extend: {},
  },
  plugins: [],
  // Configure Tailwind to be compatible with PrimeNG
  corePlugins: {
    // Keep preflight but ensure PrimeNG components are not affected
    preflight: true,
  },
};
