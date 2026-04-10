import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    base: process.env.VITE_BASE_PATH || '/',
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.APP_URL': JSON.stringify(env.APP_URL || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks - separate large libraries
            'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
            'recharts': ['recharts'],
            'motion': ['motion/react'],
            'lucide': ['lucide-react'],
            // Admin dashboard as separate chunk (lazy loaded)
            'admin-dashboard': ['./src/components/AdminDashboard.tsx'],
            // Landing components as separate chunk
            'landing': ['./src/components/Landing.tsx'],
          },
        },
      },
      // Increase chunk size warning limit for Firebase bundle
      chunkSizeWarningLimit: 600,
      // Minify with esbuild (faster than terser)
      minify: 'esbuild',
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
