import fs from 'fs-extra'
import { resolve } from 'path'
import type { Manifest } from 'webextension-polyfill'
import { isDev, outDir, port } from '../vite.config'
import pkg from '../package.json'

export default async function makeManifest() {
  const outPath = resolve(outDir, 'manifest.json')
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: isDev ? 2 : 3,
    version: pkg.version,
    name: pkg.visualName,
    description: pkg.description,
    icons: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
    options_ui: {
      page: 'options/index.html',
      open_in_tab: true,
    },
    background: {
      service_worker: 'background/main.js',
    },
    browser_action: {
      default_popup: 'popup/index.html',
    },
    permissions: ['storage', 'webNavigation', 'contextMenus'],
    host_permissions: ['*://*/'],
    web_accessible_resources: ['contentScripts/*', 'icons/*'],
    content_security_policy: `script-src 'self' http://localhost:${port}; object-src 'self'`,
  }

  if (isDev) {
    manifest.permissions.push(...manifest.host_permissions)
    manifest.background = { scripts: ['background/main.js'] }

    delete manifest.host_permissions
  } else {
    Object.assign(manifest, {
      action: manifest.browser_action,
      web_accessible_resources: [
        {
          matches: ['<all_urls>'],
          resources: manifest.web_accessible_resources as string[],
        },
      ],
      content_security_policy: {
        extension_pages: `script-src 'self'; object-src 'self'`,
      },
      content_scripts: [
        {
          matches: ['<all_urls>'],
          js: ['contentScripts/main.js'],
        },
      ],
    } as Manifest.WebExtensionManifest)

    delete manifest.browser_action
  }

  await fs.ensureDir(outDir)
  await fs.writeJson(outPath, manifest, { spaces: 2 })
}
