import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, './src'),
      '@components': resolve(import.meta.dirname, './src/components'),
      '@pages': resolve(import.meta.dirname, './src/pages'),
      '@hooks': resolve(import.meta.dirname, './src/hooks'),
      '@utils': resolve(import.meta.dirname, './src/utils'),
      '@assets': resolve(import.meta.dirname, './src/assets'),
      '@types': resolve(import.meta.dirname, './src/types'),
      '@store': resolve(import.meta.dirname, './src/store'),
    },
  },
  // Serve index.html for all routes so React Router handles them (fixes 404 on refresh)
  // Note: Vite handles SPA fallback automatically in dev. For prod, configure your host (Vercel rewrites, nginx try_files, etc.)
})
