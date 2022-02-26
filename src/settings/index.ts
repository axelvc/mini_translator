import settingSchema from './schema'
import * as browser from 'webextension-polyfill'

let settings: Record<string, any> = {}

export async function saveSettings(s = settings) {
  await browser.storage.local.set({ settings: s })
}

export async function setupSettings() {
  const r = await browser.storage.local.get({ settings })

  settings = r.settings

  let save = false
  settingSchema.forEach(category => {
    category.children.forEach(option => {
      const { id, defaultValue } = option
      if (!Object.hasOwn(settings, id)) {
        save = true
        settings[id] = defaultValue
      }
    })
  })

  if (save) saveSettings()

  return settings
}

export async function getOption<T = any>(key: string): Promise<T> {
  if (!Object.hasOwn(settings, key)) {
    await setupSettings()
  }

  return settings[key] as T
}

export async function setOption(key: string, value: any) {
  settings[key] = value

  await saveSettings()
}

export { settingSchema }
