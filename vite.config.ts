import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    //open: true, // Opens the browser automatically
    host: true, // Allows external access (e.g., network devices)
  },
  base: '/', // Ensures the app uses the root path (adjust if deployed under a subpath)
});