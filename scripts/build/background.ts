import { build } from 'vite'
import { resolve } from 'path'
import { config, root, outDir, isDev } from '../../vite.config'

const inputs = ['background', 'contentScripts']

export default async function buildBackground() {
  await Promise.all(
    inputs.map(name =>
      build({
        ...config,
        configFile: false,
        mode: isDev ? 'development' : 'production',
        build: {
          outDir,
          emptyOutDir: false,
          watch: isDev ? {} : null,
          sourcemap: isDev ? 'inline' : false,
          lib: {
            name,
            entry: resolve(root, name, 'main.ts'),
            fileName: `${name}/main.js`,
            formats: ['iife'],
          },
          rollupOptions: {
            output: {
              assetFileNames: `${name}/style.css`,
              entryFileNames: `${name}/main.js`,
            },
          },
        },
      }),
    ),
  )
}
