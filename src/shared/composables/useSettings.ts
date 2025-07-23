import { reactive } from 'vue'
import browser from 'webextension-polyfill'
import { getMainLang, getSecondLang } from '@/shared/utils'

export type Settings = typeof DEFAULT_SETTINGS
export type SettingId = keyof Settings

export const DEFAULT_SETTINGS = {
  target_language: getMainLang(),
  second_language: getSecondLang(),
  toolbar_delay: 500,
  theme: 'system',
}

const storage = browser.storage.sync
const settings = reactive<Settings>({ ...DEFAULT_SETTINGS })

async function load() {
  const r = await storage.get({ settings: DEFAULT_SETTINGS })
  Object.assign(settings, r.settings)
}

async function save(newSettings = settings) {
  await storage.set({ settings: newSettings })
  Object.assign(settings, newSettings)
}

storage.onChanged.addListener((changes) => {
  if (!changes.settings) return
  Object.assign(settings, changes.settings.newValue)
})

export function useSettings() {
  const loaded = load()

  return {
    settings,
    save,
    loaded,
  }
}
