import fs from 'fs-extra'
import { resolve } from 'path'
import type { Manifest } from 'webextension-polyfill'
import { isDev, outDir, port } from '../vite.config'
import pkg from '../package.json'

export default async function makeManifest({ version }: { version: number }) {
  const permissions = ['storage']
  const host_permissions = ['*://*/']

  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
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
      page: 'views/options/index.html',
      open_in_tab: true,
    },
    background: {
      scripts: ['background/main.js'],
    },
    browser_action: {
      default_popup: 'views/popup/index.html',
    },
    permissions: [...permissions, ...host_permissions],
    web_accessible_resources: ['icons/*'],
    content_security_policy: `script-src 'self'; object-src 'self'`,
  }

  if (isDev) {
    manifest.permissions.push('webNavigation')
    manifest.content_security_policy = `script-src 'self' http://localhost:${port}; object-src 'self'`
  }

  if (version === 3) {
    Object.assign<typeof manifest, Partial<typeof manifest>>(manifest, {
      manifest_version: 3,
      permissions,
      host_permissions,
      action: manifest.browser_action,
      background: {
        service_worker: manifest.background.scripts![0],
      },
      content_security_policy: {
        extension_pages: manifest.content_security_policy as string,
      },
      web_accessible_resources: [
        {
          matches: ['<all_urls>'],
          resources: manifest.web_accessible_resources as string[],
        },
      ],
    })

    delete manifest.browser_action
  }

  await fs.writeJson(resolve(outDir, 'manifest.json'), manifest, { spaces: 2 })
}
