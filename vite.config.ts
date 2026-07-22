import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// `npm run dev` (Vite, :5173) only serves the React SPA. The /api/*
// routes live in server.js (Express, :8080) — this proxy forwards
// every /api/* call from the browser through Vite to the Express
// server, so you can HMR-develop the React app while still hitting
// the real n8n/OpenRouter proxy.
//
// Workflow: `node server.js` in one terminal, `npm run dev` in another.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
