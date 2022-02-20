import { resolve } from 'path'

export const isDev = process.env.NODE_ENV !== 'production'
export const port = Number(process.env.PORT) || 3000

export const root = resolve(__dirname, '../src')
export const outDir = resolve(__dirname, '../dist')
export const publicDir = resolve(__dirname, '../public')
export const views = {
  popup: 'views/popup/index.html',
  options: 'views/options/index.html',
}

export const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1)
