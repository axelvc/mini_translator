import browser from 'webextension-polyfill'
import { setupSettings } from '@/store'
import setupContextMenu from './contextMenu'
import { GoogleTranslator } from '@/services/translation'

const translator = new GoogleTranslator()

browser.runtime.onInstalled.addListener(async () => {
  await setupSettings()
  setupContextMenu()
})

if (__DEV__) {
  browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
    const isWebStore = url.startsWith('https://chrome.google.com/webstore')
    const isDevTools = /^(chrome|edge|devtools).*:\/\//.test(url)
    const hasFrame = frameId !== 0

    if (isWebStore || isDevTools || hasFrame) return

    browser.tabs.executeScript(tabId, {
      file: 'contentScripts/main.js',
      runAt: 'document_end',
    })
  })
}

browser.runtime.onMessage.addListener(async ({ type, data }: any) => {
  switch (type) {
    case 'translate':
      return await translator.translate(data)
    case 'getAudioUrl':
      return await translator.audio(data)
  }
})
