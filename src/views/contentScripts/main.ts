import browser from 'webextension-polyfill'
import { App as Application, createApp } from 'vue'

import App from './App.vue'
import { Settings } from '@/store/settings'
import { sleep } from '@/utils'
import { useTheme } from '@/composables/useTheme'

/* ---------------------------------- setup --------------------------------- */
const settings = new Settings()
const container = document.createElement('div')
const shadow = container.attachShadow({ mode: 'closed' })

// mount styles
const style = document.createElement('link')

style.setAttribute('rel', 'stylesheet')
style.setAttribute('href', browser.runtime.getURL('views/contentScripts/style.css'))
shadow.append(style)

// mount root
const root = document.createElement('div')
root.classList.add('root')

// to avoid flicker when mounted
Object.assign(root.style, {
  float: 'left',
  width: 0,
  height: 0,
})

useTheme(root)
shadow.append(root)

/* -------------------------------- mount app ------------------------------- */
let app: Application<Element> | null = null

function mount(selectedText: string, x: number, y: number) {
  document.body.appendChild(container)
  app = createApp(App, { selectedText, x, y })
  app.mount(root)
}

function unmount() {
  app?.unmount()
  container.remove()

  app = null
}

async function handleMount(ev: MouseEvent) {
  await sleep() // wait for the selection to be updated

  // ignore click in the floating box
  const isInside = container.contains(ev.target as HTMLElement)
  if (isInside) return

  unmount()

  // omit if tab language is same as main language
  const omitInMainLang = await settings.get('floating_omit_main')
  const mainLang = await settings.get('target_language')
  const tabLang = document.documentElement.lang
  if (omitInMainLang && mainLang === tabLang) return

  const selectedText = getSelection()?.toString().trim()
  if (selectedText) mount(selectedText, ev.x, ev.y)
}

function handleEnableSelection(enabled: boolean) {
  if (enabled) {
    return document.addEventListener('mouseup', handleMount)
  }

  unmount()
  document.removeEventListener('mouseup', handleMount)
}

settings.listen('floating_enabled', handleEnableSelection)
