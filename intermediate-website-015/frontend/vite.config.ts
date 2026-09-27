import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/bhuvan-tile': {
        target: 'https://bhuvan-vec1.nrsc.gov.in',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/bhuvan-tile/, ''),
      },
      '/api/bhuvan-wms': {
        target: 'https://bhuvan-vec2.nrsc.gov.in',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/bhuvan-wms/, ''),
      },
    },
  },
})
