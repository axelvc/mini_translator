import * as browser from 'webextension-polyfill'
import { listen, translate } from '@/utils'
import { setupSettings } from '@/settings'
import setupContextMenu from './contextMenu'

browser.runtime.onInstalled.addListener(() => {
  setupSettings()
  setupContextMenu()
})

browser.webNavigation.onCommitted.addListener(({ tabId, frameId }) => {
  if (frameId !== 0) return

  browser.tabs.executeScript(tabId, {
    file: './contentScripts.js',
    runAt: 'document_end',
  })
})

browser.runtime.onMessage.addListener(async ({ type, data }) => {
  switch (type) {
    case 'translate':
      return await translate(data.text, data.from, data.to)
    case 'listen':
      listen(data.text, data.lang)
  }
})
