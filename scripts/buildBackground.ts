import { build } from 'vite'
import { resolve } from 'path'
import { config, root, outDir, isDev } from '../vite.config'

export default async function buildBackground() {
  await build({
    ...config,
    configFile: false,
    build: {
      outDir,
      emptyOutDir: false,
      watch: isDev ? {} : null,
      sourcemap: isDev ? 'inline' : false,
      lib: {
        name: 'background',
        entry: resolve(root, 'background', 'main.ts'),
        fileName: 'background/main.js',
        formats: ['iife'],
      },
      rollupOptions: {
        output: {
          extend: true,
          assetFileNames: 'background/style.css',
          entryFileNames: 'background/main.js',
        },
      },
    },
  })
}
