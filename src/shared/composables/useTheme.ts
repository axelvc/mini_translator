import { useEventListener, whenever } from '@vueuse/core'
import { watch } from 'vue'
import { Settings, useSettings } from './useSettings'

export function useTheme(root = document.documentElement) {
  const { settings, loaded } = useSettings()
  const match = window.matchMedia('(prefers-color-scheme: dark)')

  const getSystemTheme = () => (match.matches ? 'dark' : 'light')
  const resolveTheme = ({ theme }: Settings) => (theme === 'system' ? getSystemTheme() : theme)

  const updateTheme = () => (root.dataset.theme = resolveTheme(settings))

  const updateCustomTheme = () => {
    root.removeAttribute('style')
    if (settings.theme !== 'custom') return

    settings.custom_theme
      .replaceAll('\n', '')
      .split(';')
      .forEach((rule) => {
        if (!rule) return
        const [name, value] = rule.split(':')
        if (!name || !value) return

        root.style.setProperty(name, value)
      })
  }

  const updateThemePreference = () => {
    updateTheme()
    updateCustomTheme()
  }

  whenever(loaded, () => updateThemePreference, { once: true })
  useEventListener(match, 'change', updateTheme)
  watch(() => settings.theme, updateThemePreference)
  watch(() => settings.custom_theme, updateCustomTheme)
}
