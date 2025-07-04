import { getOption, listenOption } from '@/store'

export function useTheme(root = document.documentElement) {
  function handleChange(theme: string) {
    root.dataset.theme = theme
  }

  getOption('theme').then(handleChange)
  listenOption('theme', handleChange)
}
