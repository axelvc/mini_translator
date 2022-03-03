import * as browser from 'webextension-polyfill'

browser.webNavigation.onCommitted.addListener(({ tabId, frameId }) => {
  if (frameId !== 0) return

  browser.tabs.executeScript(tabId, {
    file: './contentScripts.js',
    runAt: 'document_end',
  })
})
