import fs from 'fs-extra'
import { resolve } from 'path'
import { outDir, port, root } from '../vite.config'

async function stubAssets() {
  const inputs = ['icons', '_locales']

  await Promise.all(
    inputs.map(async (name) => {
      const outPath = resolve(outDir, name)

      await fs.ensureDir(outPath)
      await fs.copy(resolve(root, 'assets', name), outPath)
    }),
  )
}

async function stubHtml() {
  const inputs = ['views/popup', 'views/options']

  await Promise.all(
    inputs.map(async (name) => {
      const htmlPath = resolve(root, name, 'index.html')
      const outPath = resolve(outDir, name)

      await fs.ensureDir(outPath)

      // replace script source
      const html = await fs.readFile(htmlPath, 'utf8')
      const parsedHtml = html.replace('"./main.ts"', `"http://localhost:${port}/${name}/main.ts"`)

      await fs.writeFile(resolve(outPath, 'index.html'), parsedHtml)
    }),
  )
}

export default async function stubFiles() {
  return Promise.all([stubAssets(), stubHtml()])
}
