import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 7173         
  },
  build: {
    // Performance: Code splitting and chunk optimization
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['flowbite-react', 'react-hot-toast', 'framer-motion'],
          'form-vendor': ['js-cookie', 'jwt-decode'],
          'icons': ['react-icons', '@fortawesome/react-fontawesome', '@fortawesome/free-solid-svg-icons', '@fortawesome/fontawesome-svg-core', 'lucide-react'],
          'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
          'utils': ['axios', 'date-fns', 'uuid', 'canvas-confetti']
        },
        // Optimize asset file names for better caching
        assetFileNames: (assetInfo) => {
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash][extname]`;
          } else if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js'
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
        passes: 2 // Multiple passes for better compression
      },
      format: {
        comments: false // Remove all comments
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Generate sourcemaps for debugging (can disable for production)
    sourcemap: false,
    // Target modern browsers for smaller bundle
    target: 'es2015',
    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb as base64
    // Report compressed size
    reportCompressedSize: true
  },
  // Performance: Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'axios',
      'react-hot-toast',
      'js-cookie',
      'i18next',
      'react-i18next'
    ],
    // Exclude large libraries that should be code-split
    exclude: ['@react-pdf-viewer/core', 'pdfjs-dist', 'swiper']
  },
  // Enable esbuild optimization
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    drop: ['console', 'debugger']
  }
})
