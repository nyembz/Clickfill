import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // The 'server' object goes here, inside the main config
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server URL
        changeOrigin: true,
      }
    }
  }
})