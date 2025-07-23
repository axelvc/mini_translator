import { Settings } from '@/shared/store/settings'

export function useTheme(root = document.documentElement) {
  const settings = new Settings()

  settings.listen('theme', (theme) => {
    root.dataset.theme = theme
  })
}
