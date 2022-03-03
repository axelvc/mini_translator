import { resolve } from 'path'
import { defineConfig } from 'vite'
import { root, outDir, views, isDev } from './scripts/utils'
import { config } from './vite.config'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  ...config,
  build: {
    outDir,
    emptyOutDir: false,
    watch: isDev ? {} : null,
    lib: {
      entry: resolve(root, views.contentScripts),
      name: pkg.name,
      fileName: 'contentScripts.js',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'contentScripts.js',
      },
    },
  },
})
