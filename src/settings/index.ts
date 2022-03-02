import settingSchema, { type OptionId } from './schema'
import * as browser from 'webextension-polyfill'

export type Settings = Record<OptionId, any>

let settings = {} as Settings

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

export async function getOption(key: OptionId): Promise<any> {
  if (!Object.hasOwn(settings, key)) {
    await setupSettings()
  }

  return settings[key]
}

export async function setOption(key: OptionId, value: any) {
  settings[key] = value

  await saveSettings()
}

export async function listenOption(key: OptionId, cb: (value: any) => void) {
  browser.storage.onChanged.addListener(({ settings }) => {
    cb(settings.newValue[key])
  })
}

export { settingSchema }
