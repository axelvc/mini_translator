import * as browser from 'webextension-polyfill'
import { translatePage } from './translate'
import { getOption, listenOption } from '@/settings'
import { OptionId } from '@/settings/schema'

const idPage: OptionId = 'context_enabled'

function handleClickContextMenu(info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) {
  if (info.menuItemId === idPage && tab) {
    translatePage(info, tab)
  }
}

async function removeMenu() {
  await browser.contextMenus.removeAll()
  browser.contextMenus.onClicked.removeListener(handleClickContextMenu)
}

function createMenu() {
  browser.contextMenus.create({
    id: idPage,
    title: 'Translate page',
  })

  browser.contextMenus.onClicked.addListener(handleClickContextMenu)
}

export default function setupContextMenu() {
  getOption(idPage).then(active => active && createMenu())
  listenOption(idPage, active => (active ? createMenu() : removeMenu()))
}
