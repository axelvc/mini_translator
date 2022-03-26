import * as browser from 'webextension-polyfill'
import { getOption, listenOption } from '@/settings'
import { OptionId } from '@/settings/schema'

const idPage: OptionId = 'context_enabled'

async function getLangs(tab: browser.Tabs.Tab): Promise<{ to: string; from: string }> {
  const langs = {
    from: await browser.tabs.detectLanguage(tab.id),
    to: await getOption('target_language'),
  }

  if (langs.to === langs.from) {
    langs.to = await getOption('second_language')
  }

  return langs
}

async function translatePage(info: browser.Menus.OnClickData, tab: browser.Tabs.Tab) {
  const encodedUrl = encodeURIComponent(info.pageUrl!)
  const langs = await getLangs(tab)

  const translationUrl = `https://translate.google.com/translate?hl=${langs.to}&tl=${langs.to}&sl=${langs.from}&u=${encodedUrl}`

  browser.tabs.create({
    url: translationUrl,
    index: tab.index + 1,
    active: true,
  })
}

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
