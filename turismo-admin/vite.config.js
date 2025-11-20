import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // 👈 Esto es clave para Vercel
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // Tu puerto de backend
        changeOrigin: true,
        secure: false
      }
    }
  }
});
