import fs from 'fs-extra'
import ora from 'ora'
import chokidar from 'chokidar'
import { globby } from 'globby'
import { isDev, outDir, root } from './vite.config'
import buildBackground from './scripts/build/background'
import buildGeneral from './scripts/build/general'
import stubHtml from './scripts/stubHtml'
import makeManifest from './scripts/makeManifest'
import makeZip from './scripts/makeZip'

async function cleanBuild() {
  const files = await globby(`${outDir}/*`, {
    onlyFiles: false,
    ignore: ['**/*.zip'],
  })

  await Promise.all(files.map(file => fs.remove(file)))
}

;(async () => {
  await fs.rm(outDir, { recursive: true, force: true })

  if (isDev) {
    await buildGeneral()
    await buildBackground()

    await stubHtml()
    chokidar.watch(`${root}/**/*.html`).on('change', stubHtml)

    await makeManifest({ version: 2 })
    chokidar.watch('./scripts/makeManifest.ts').on('change', () => makeManifest({ version: 2 }))

    return
  }

  const spinner = ora()

  spinner.start('Building general')
  await buildGeneral()
  spinner.succeed()

  spinner.start('Building background')
  await buildBackground()
  spinner.succeed()

  spinner.start('Compressing to zip (manifest v2)')
  await makeManifest({ version: 2 })
  await makeZip({ version: 2 })
  spinner.succeed()

  spinner.start('Compressing to zip (manifest v3)')
  await makeManifest({ version: 3 })
  await makeZip({ version: 3 })
  spinner.succeed()

  spinner.start('Deleting build files')
  await cleanBuild()
  spinner.succeed('Extension ready!')
})()
