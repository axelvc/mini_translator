import { resolve } from 'path'
import { InlineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'

export const isDev = process.env.NODE_ENV !== 'production'

export const port = Number(process.env.PORT) || 3000
export const root = resolve(__dirname, 'src')
export const outDir = resolve(__dirname, 'build')

export const config: InlineConfig = {
  configFile: false,
  root,
  logLevel: isDev ? 'info' : 'silent',
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
