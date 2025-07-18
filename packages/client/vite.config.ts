import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'esbuild', // Explicitly use esbuild instead of terser
    rollupOptions: {
      output: {
        entryFileNames: 'booking-ui.js',
        chunkFileNames: 'booking-ui-[hash].js',
        assetFileNames: 'booking-ui.[ext]'
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})
