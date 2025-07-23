import { useSettings } from './useSettings'
import { watch } from 'vue'

export function useTheme(root = document.documentElement) {
  const { settings } = useSettings()
  watch(
    () => settings.theme,
    (theme) => (root.dataset.theme = theme),
  )
}
