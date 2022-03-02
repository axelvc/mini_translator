import { getOption, listenOption } from '../settings'

function updateTheme(theme: string) {
  document.documentElement.dataset.theme = theme
}

getOption('theme').then(updateTheme)
listenOption('theme', updateTheme)
