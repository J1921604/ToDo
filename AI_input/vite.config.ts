import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/todo-app/' : '/',  // GitHub Pages対応
  plugins: [react()],
  server: {
    port: 1234
  }
})
