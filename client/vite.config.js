import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],

    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor libs into separate chunks for better caching.
            // NOTE: Only include packages that are ACTUALLY imported in src/.
            // An empty manualChunk (package not used) produces a 1-byte JS
            // file that silently breaks ES module graph loading → white screen.
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-ui':    ['react-toastify', 'react-icons', 'react-markdown'],
            // 'motion' removed — not imported anywhere in the codebase.
            // It produced vendor-motion-*.js (1 byte, empty) which caused
            // browser ES module graph failures → blank white screen.
          },
        },
      },
    },
  };
});
