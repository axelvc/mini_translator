import * as browser from 'webextension-polyfill'
import { translate } from '@/utils'
import { setupSettings } from '@/settings'
import setupContextMenu from './contextMenu'

browser.runtime.onInstalled.addListener(async () => {
  await setupSettings()
  setupContextMenu()
})

if (__DEV__) {
  browser.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
    if (
      frameId !== 0 ||
      url === 'https://chrome.google.com/webstore' ||
      /^(chrome|edge|devtools).*:\/\//.test(url)
    ) {
      return
    }

    browser.tabs.executeScript(tabId, {
      file: 'contentScripts/main.js',
      runAt: 'document_end',
    })
  })
}

browser.runtime.onMessage.addListener(async ({ type, data }) => {
  switch (type) {
    case 'translate':
      return await translate(data.text, data.from, data.to)
    case 'getAudio':
      return new Promise(resolve => {
        const { text, lang } = data
        const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
          text,
        )}&tl=${lang}&total=1&idx=0&textlen=${text.length}&client=tw-ob`

        fetch(audioUrl)
          .then(r => r.blob())
          .then(blob => {
            const reader = new FileReader()

            reader.onload = () => {
              resolve(reader.result)
            }

            reader.readAsDataURL(blob)
          })
      })
  }
})
