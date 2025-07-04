import settingSchema, { type OptionId } from './schema'
import browser from 'webextension-polyfill'

export type Settings = Record<OptionId, any>

export async function getSettings(): Promise<Settings> {
  const r = await browser.storage.local.get({ settings: {} })

  return r.settings as Settings
}

export async function saveSettings(settings: Settings) {
  await browser.storage.local.set({ settings: { ...settings } })
}

export async function getOption<T = any>(key: OptionId): Promise<T> {
  const settings = await getSettings()

  return settings[key]
}

export async function setOption<T = any>(key: OptionId, value: T) {
  const settings = await getSettings()

  settings[key] = value

  await saveSettings(settings)
}

export async function listenOption(key: OptionId, cb: (value: any) => void) {
  browser.storage.onChanged.addListener(({ settings = {} }) => {
    if ((settings.newValue as any)[key] === (settings.oldValue as any)[key]) return

    cb((settings.newValue as any)[key])
  })
}

export async function setupSettings() {
  const settings = await getSettings()
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

  if (save) await saveSettings(settings)
}

export * from './schema'
export { settingSchema }
