import * as browser from 'webextension-polyfill'
import { App, createApp } from 'vue'
import ContentScripts from './ContentScripts.vue'

/* ---------------------------------- setup --------------------------------- */
const container = document.createElement('div')
const shadow = container.attachShadow({ mode: 'closed' })

// mount styles
const style = document.createElement('link')

style.setAttribute('href', browser.runtime.getURL('contentScripts.css'))
style.setAttribute('rel', 'stylesheet')
shadow.append(style)

// mount root
const root = document.createElement('div')

root.style.setProperty('float', 'left') // to avoid flicker when mounted
root.classList.add('root')
shadow.append(root)

/* -------------------------------- mount app ------------------------------- */
let app: App<Element> | null = null

function mount(selectedText: string, x: number, y: number) {
  document.body.append(container)
  app = createApp(ContentScripts, { selectedText, x, y })
  app.mount(root)
}

function unmount() {
  getSelection()?.removeAllRanges()
  app?.unmount()
  container.remove()

  app = null
}

document.addEventListener('mouseup', ev => {
  const isOutside = !container.contains(ev.target as HTMLElement)
  const selectedText = getSelection()?.toString().trim()

  if (app) {
    isOutside && unmount()
  } else {
    selectedText && mount(selectedText, ev.x, ev.y)
  }
})
