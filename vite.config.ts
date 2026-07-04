import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Set VITE_BASE_PATH for project pages, e.g. /open-dataset-explorer/
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'manifest.webmanifest'],
      manifest: {
        name: 'OpenDataset Explorer',
        short_name: 'ODE',
        description: 'Discover open-access research datasets',
        theme_color: '#1a5f7a',
        background_color: '#f4f6f8',
        display: 'standalone',
        start_url: base,
        icons: [
          {
            src: `${base}favicon.svg`,
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,json,webmanifest}'],
      },
    }),
  ],
});
