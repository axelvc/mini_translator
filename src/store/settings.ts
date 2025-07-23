import browser from 'webextension-polyfill'
import { getMainLang, getSecondLang } from '@/utils'

export type SettingsData = typeof Settings.DEFAULT_SETTINGS
export type Option = keyof SettingsData

export class Settings {
  static readonly DEFAULT_SETTINGS = {
    target_language: getMainLang(),
    second_language: getSecondLang(),
    toolbar_delay: 500,
    theme: 'system',
  }

  static instance: Settings

  private readonly storage = browser.storage.sync
  private readonly listeners = new Map<Option, ((value: any) => void)[]>()
  private readonly loaded: Promise<void> = Promise.resolve()
  settings: SettingsData | null = null

  constructor() {
    if (Settings.instance) return Settings.instance

    this.loaded = this.load()
    this.listenChanges()
    Settings.instance = this
  }

  async get<T extends Option>(key: T): Promise<SettingsData[T]> {
    await this.loaded
    return this.settings![key]
  }

  async getAll(): Promise<SettingsData> {
    await this.loaded
    return { ...this.settings! }
  }

  async save(settings: SettingsData) {
    await this.storage.set({ settings })
    this.settings = settings
  }

  listen<T extends Option>(key: T, cb: (value: SettingsData[T]) => void): () => void {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, [])
    }

    this.listeners.get(key)!.push(cb)
    this.get(key)
      .then(cb)
      .catch(() => {
        // TODO: handle error
      })

    return () => {
      const callbacks = this.listeners.get(key)
      if (!callbacks) return

      const index = callbacks.indexOf(cb)
      if (index > -1) callbacks.splice(index, 1)
    }
  }

  private async load() {
    const r = await this.storage.get({ settings: Settings.DEFAULT_SETTINGS })
    this.settings = r.settings as SettingsData
  }

  private listenChanges() {
    this.storage.onChanged.addListener((changes) => {
      if (!changes.settings) return

      const { newValue, oldValue } = changes.settings as { newValue: SettingsData; oldValue: SettingsData }
      this.settings = newValue

      this.listeners.entries().forEach(([key, callbacks]) => {
        if (newValue[key] !== oldValue[key]) {
          callbacks.forEach((cb) => cb(newValue[key]))
        }
      })
    })
  }
}
