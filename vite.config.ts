import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      // Proxy API requests to avoid CORS issues when calling Google Apps Script
      proxy: {
        // all requests to /api/clinic will be forwarded to the Apps Script endpoint
        '/api/clinic': {
          target: 'https://script.google.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/clinic/, '/macros/s/AKfycbx_nJ8_t_meDHZslHKyT7Ho4-_6MUzwTl_K9aMQ-khFSlIEi4Fkp-mIqGUWGS5eHMMp/exec'),
        },
      },
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.')
      }
    }
  }
})
