import { resolve } from 'path'
import { defineConfig, InlineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

export const isDev = process.env.NODE_ENV !== 'production'

export const port = Number(process.env.PORT) || 3000
export const root = resolve(import.meta.dirname, 'src')
export const outDir = resolve(import.meta.dirname, 'build')

export const config: InlineConfig = {
  root,
  publicDir: resolve(root, 'assets'),
  mode: isDev ? 'development' : 'production',
  resolve: {
    alias: {
      '@': root,
    },
  },
  define: {
    __DEV__: isDev,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
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

export default defineConfig({
  ...config,
  server: {
    port,
    strictPort: true,
    hmr: { host: 'localhost' },
  },
  build: {
    outDir,
    emptyOutDir: !isDev,
    rollupOptions: {
      input: {
        popup: resolve(root, 'views/popup/index.html'),
        options: resolve(root, 'views/options/index.html'),
      },
      output: {
        assetFileNames: '[name]/style.css',
        entryFileNames: '[name]/main.js',
      },
    },
  },
})
