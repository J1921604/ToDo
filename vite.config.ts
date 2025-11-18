import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ToDo/' : '/',  // GitHub Pages対応 (リポジトリ名: ToDo)
  plugins: [react()],
  server: {
    port: 1234
  }
})
