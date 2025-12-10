import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/SuperiorRFQ/',        // 👈 important for GitHub Pages
  build: {
    outDir: 'docs',             // 👈 GitHub Pages will serve from /docs
  },
  plugins: [react()],
})
