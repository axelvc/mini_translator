import { resolve } from 'path'
import { defineConfig, UserConfigExport } from 'vite'
import { root, outDir, views, port, isDev, publicDir } from './scripts/utils'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

if (isDev) {
  import('./scripts/prepare')
} else {
  import('./scripts/makeManifest')
}

export const config: UserConfigExport = {
  root,
  publicDir,
  resolve: {
    alias: {
      '@': root,
    },
  },
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
}

// https://vitejs.dev/config/
export default defineConfig({
  ...config,
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
        background: resolve(root, views.background),
      },
    },
  },
})
