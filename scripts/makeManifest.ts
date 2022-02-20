import { resolve } from 'path'
import { type Manifest } from 'webextension-polyfill'
import { writeJson } from 'fs-extra'
import { capitalize, isDev, outDir, port, views } from './utils'
import pkg from '../package.json'

export default async function makeManifest() {
  const outPath = resolve(outDir, 'manifest.json')
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    version: pkg.version,
    name: capitalize(pkg.name),
    description: pkg.description,
    icons: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
    browser_action: {
      default_popup: views.popup,
    },
    options_ui: {
      page: views.options,
      open_in_tab: true,
    },
    permissions: ['storage', 'https://*/'],
  }

  if (isDev) {
    manifest.content_security_policy = `script-src 'self' http://localhost:${port}; object-src 'self'`
  }

  await writeJson(outPath, manifest, { spaces: 2 })
}
