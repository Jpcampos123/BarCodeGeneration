export default defineNuxtConfig({
  // Apenas a configuração do Tailwind CSS e Autoprefixer
  css: ["@/assets/css/tailwind.css"],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  compatibilityDate: "2024-10-05",
});