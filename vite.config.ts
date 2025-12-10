import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/',          // custom domain: superiorcarting.com
  plugins: [react()],
})
