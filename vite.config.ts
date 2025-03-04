import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import tailwindcss from '@tailwindcss/vite'
import autoprefixer from 'autoprefixer'
import path from 'node:path'
import { builtinModules } from 'module'

const allExternal = [
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`)
]

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [autoprefixer()]
    }
  },
  plugins: [vue(), vueJsx(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      external: ['fsevents', ...allExternal]
    }
  },
  server: {
    allowedHosts: ['local.dingyi222666.top']
  }
})
