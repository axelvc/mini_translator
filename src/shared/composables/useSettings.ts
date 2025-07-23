import { reactive, readonly, ref } from 'vue'
import browser from 'webextension-polyfill'
import { getMainLang, getSecondLang } from '@/shared/utils'

export type Settings = typeof DEFAULT_SETTINGS
export type SettingId = keyof Settings

export const DEFAULT_SETTINGS = {
  target_language: getMainLang(),
  second_language: getSecondLang(),
  toolbar_delay: 500,
  theme: 'system',
  start_with_selection: true,
}

const storage = browser.storage.sync
const settings = reactive<Settings>({ ...DEFAULT_SETTINGS })
const loaded = ref(false)

async function load() {
  if (loaded.value) return
  const r = await storage.get({ settings: DEFAULT_SETTINGS })
  Object.assign(settings, r.settings)
  loaded.value = true
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
  load()

  return {
    settings,
    save,
    loaded: readonly(loaded),
  }
}
