import fs from 'fs-extra'
import archiver from 'archiver'
import path from 'path'
import pkg from '../package.json'
import { outDir } from '../vite.config'

export default async function makeZip({ version }: { version: number }) {
  const zip = archiver('zip')

  // set output file pipe
  const output = path.resolve(outDir, `${pkg.name}-manifest_v${version}.zip`)
  const stream = fs.createWriteStream(output)
  zip.pipe(stream)

  // add build files
  zip.glob('**', {
    cwd: outDir,
    ignore: ['*.zip'],
  })

  await zip.finalize()
}
