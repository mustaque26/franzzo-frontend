import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to the backend during development to avoid CORS issues
    proxy: {
      // Proxy any request starting with /api to the backend server
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // keep the /api prefix, but you can rewrite if your backend uses a different base
        // rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
})
