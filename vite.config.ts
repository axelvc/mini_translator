import { resolve } from 'path'
import { defineConfig, UserConfigExport } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

export const isDev = process.env.NODE_ENV !== 'production'

export const port = Number(process.env.PORT) || 3000
export const root = resolve(__dirname, 'src')
export const outDir = resolve(__dirname, 'dist')

export const config: UserConfigExport = {
  root,
  publicDir: resolve(root, 'static'),
  resolve: {
    alias: {
      '@': root,
    },
  },
  define: {
    __DEV__: isDev,
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
        popup: resolve(root, 'popup/index.html'),
        options: resolve(root, 'options/index.html'),
      },
      output: {
        assetFileNames: '[name]/style.css',
        entryFileNames: '[name]/main.js',
      },
    },
  },
})
