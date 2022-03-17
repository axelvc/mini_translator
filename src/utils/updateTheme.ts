import { getOption, listenOption } from '../settings'

export function updateTheme(root = document.documentElement) {
  function handleChange(theme: string) {
    root.dataset.theme = theme
  }

  getOption('theme').then(handleChange)
  listenOption('theme', handleChange)
}
