import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    minify: 'esbuild', // terser kerak bo'lmaydi
    outDir: 'dist',    // build qilingan fayllar shu papkaga tushadi
    sourcemap: false,  // false bo'lsa, source map yaratilmaydi
  },
  resolve: {
    alias: {
      '@': '/src', // @ belgisi orqali src papkasiga murojaat qilsa bo'ladi
    }
  },
  server: {
    port: 3000,   // dev server uchun port
    open: true    // brauzerni avtomatik ochadi
  }
})
