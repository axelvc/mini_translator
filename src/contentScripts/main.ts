import * as browser from 'webextension-polyfill'
import { App, createApp } from 'vue'
import ContentScripts from './ContentScripts.vue'
import { sleep, updateTheme } from '@/utils'
import { getOption, listenOption } from '@/settings'

/* ---------------------------------- setup --------------------------------- */
const container = document.createElement('div')
const shadow = container.attachShadow({ mode: 'closed' })

// mount styles
const style = document.createElement('link')

style.setAttribute('rel', 'stylesheet')
style.setAttribute('href', browser.runtime.getURL('contentScripts/style.css'))
shadow.append(style)

// mount root
const root = document.createElement('div')

// to avoid flicker when mounted
Object.assign(root.style, {
  float: 'left',
  width: 0,
  height: 0,
})
root.classList.add('root')
shadow.append(root)

/* -------------------------------- mount app ------------------------------- */
let app: App<Element> | null = null

function mount(selectedText: string, x: number, y: number) {
  document.body.appendChild(container)
  app = createApp(ContentScripts, { selectedText, x, y })
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
  const omitInMainLang = await getOption('floating_omit_main')
  const mainLang = await getOption('target_language')
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

getOption('floating_enabled').then(handleEnableSelection)
listenOption('floating_enabled', handleEnableSelection)
updateTheme(root)
