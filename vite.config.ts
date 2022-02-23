import { resolve } from 'path'
import { defineConfig } from 'vite'
import { root, outDir, views, port, isDev, publicDir } from './scripts/utils'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

if (isDev) {
  import('./scripts/prepare')
} else {
  import('./scripts/makeManifest')
}

// https://vitejs.dev/config/
export default defineConfig({
  root,
  publicDir,
  plugins: [
    vue(),
    svgLoader({
      svgoConfig: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeDimensions',
            active: true,
          },
        ],
      },
    }),
  ],
  server: {
    port,
    strictPort: true,
    hmr: { host: 'localhost' },
  },
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(root, views.popup),
        options: resolve(root, views.options),
      },
    },
  },
})
