import { dirname, resolve } from 'path'
import { ensureDir, copy } from 'fs-extra'
import { readFile, writeFile } from 'fs/promises'
import { outDir, port, publicDir, root, views } from './utils'
import makeManifest from './makeManifest'

async function copyIcons() {
  const iconsDir = resolve(publicDir, 'icons')

  await ensureDir(iconsDir)
  await copy(iconsDir, resolve(outDir, 'icons'))
}

async function stubHtml() {
  await Promise.all(
    Object.entries(views).map(([name, viewPath]) => {
      const srcPath = resolve(root, viewPath)
      const outPath = resolve(outDir, viewPath)
      const devUrl = `"http://localhost:${port}/views/${name}/main.ts"`

      return ensureDir(dirname(outPath))
        .then(() => readFile(srcPath, 'utf8'))
        .then(html => html.replace('"./main.ts"', devUrl))
        .then(html => writeFile(outPath, html))
    }),
  )
}

ensureDir(outDir).then(() => {
  stubHtml()
  copyIcons()
  makeManifest()
})
