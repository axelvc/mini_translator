import browser from 'webextension-polyfill'
import { GoogleTranslator } from '@/services/translation'
import { getOption, listenOption } from '@/store'
import { OptionId } from '@/store/schema'

const idPage: OptionId = 'context_enabled'
const translator = new GoogleTranslator()

function handleClickContextMenu(info: browser.Menus.OnClickData, tab?: browser.Tabs.Tab) {
  if (info.menuItemId === idPage && tab) {
    translator.page(info, tab)
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
  getOption(idPage)
    .then(active => active && createMenu())
    .catch(() => {
      // TODO: handle error
    })

  listenOption(idPage, active => (active ? createMenu() : removeMenu()))
}
