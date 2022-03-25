import { createServer, build, InlineConfig } from 'vite'
import { resolve } from 'path'
import { config as sharedConfig, port, outDir, root, isDev } from '../../vite.config'

export default async function buildGeneral() {
  const config: InlineConfig = {
    ...sharedConfig,
    server: {
      port,
      strictPort: true,
      hmr: { host: 'localhost' },
    },
    build: {
      outDir,
      emptyOutDir: false,
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
  }

  if (isDev) {
    const server = await createServer(config)
    await server.listen()
  } else {
    build(config)
  }
}
