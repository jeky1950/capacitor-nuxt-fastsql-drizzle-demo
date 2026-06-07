import sqlocal from 'sqlocal/vite';

export default defineNuxtConfig({
  vite: {
    plugins: [
      sqlocal()
    ],
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    },
    optimizeDeps: {
      exclude: ['@sqlite.org/sqlite-wasm'],
    },
    assetsInclude: [
      "**/*.sql"
    ]
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
