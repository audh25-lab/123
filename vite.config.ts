// vite.config.ts
// ────────────────────────────────────────────────────────────────────────────────
// Configures Vite for Phaser 3 + TypeScript + Capacitor + PWA support
// Research sources:
// - Vite official docs: https://vitejs.dev/config/
// - vite-plugin-singlefile: https://github.com/vite-plugin/vite-plugin-singlefile
// - Capacitor + Vite integration: https://capacitorjs.com/docs/guides/vite
// - PWA manifest & service worker: https://vite-pwa-org.netlify.app/
// - Phaser 3 Vite setup: https://phaser.io/examples/v3/view/community/vite

import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import singlefile from 'vite-plugin-singlefile'

export default defineConfig({
  base: './', // relative paths for APK/PWA

  plugins: [
    // Single-file bundle for easy distribution (optional fallback)
    singlefile(),

    // PWA support (add to home screen on Android/iOS)
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'RAAJJE THEFT AUTO 1',
        short_name: 'RAAJJE',
        description: 'Retro top-down crime game set in the Maldives',
        theme_color: '#00aaff',
        background_color: '#000',
        display: 'standalone',
        scope: './',
        start_url: './index.html',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512-mask.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,wav,ogg}']
      }
    })
  ],

  resolve: {
    alias: {
      '@': '/src' // absolute imports
    }
  },

  server: {
    port: 3000,
    open: true,
    hmr: true
  },

  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // smaller builds for APK
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    },
    chunkSizeWarningLimit: 2000
  },

  // Capacitor needs this for Android/iOS builds
  publicDir: 'public'
})