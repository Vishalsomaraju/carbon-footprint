/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'CarbonWise',
        short_name: 'CarbonWise',
        description:
          'Track, understand, and reduce your personal carbon footprint with AI-powered insights.',
        theme_color: '#15803d',
        icons: [
          {
            src: 'vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      workbox: {
        // Use NetworkFirst for HTML navigation so stale shells are not served
        // after a SW update. Assets/fonts/APIs use the default CacheFirst.
        runtimeCaching: [
          {
            urlPattern: ({ request }: { request: Request }): boolean =>
              request.mode === 'navigate',
            handler: 'NetworkFirst' as const,
            options: {
              cacheName: 'html-cache',
              networkTimeoutSeconds: 3,
            },
          },
        ],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1500,
  },
  server: {
    headers: {
      // Required for Firebase signInWithPopup to work in Chrome:
      // allows the Google auth popup to postMessage credentials back to this window
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    testTimeout: 10000,
  },
});
