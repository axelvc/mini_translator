import * as browser from 'webextension-polyfill'
import { setupSettings } from '@/settings'
import setupContextMenu from './contextMenu'
import { translate, getAudioUrl } from './translate'

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
      return await translate(data)
    case 'getAudio':
      return await getAudioUrl(data)
  }
})
