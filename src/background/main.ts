import * as browser from 'webextension-polyfill'
import { listen, translate } from '@/utils'
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
    case 'listen':
      listen(data.text, data.lang)
  }
})
