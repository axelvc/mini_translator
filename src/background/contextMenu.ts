import * as browser from 'webextension-polyfill'
import { getOption, listenOption } from '@/settings'
import { OptionId } from '@/settings/schema'

const idPage: OptionId = 'context_enabled'

async function getLangs(tab: browser.Tabs.Tab): Promise<{ to: string; from: string }> {
  const langs = {
    from: await browser.tabs.detectLanguage(tab.id),
    to: await getOption('main_language'),
  }

  if (langs.to === langs.from) {
    langs.to = await getOption('second_language')
  }

  return langs
}

function removeMenu(id: string) {
  return browser.contextMenus.remove(id)
}

function createPageMenu() {
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

  browser.contextMenus.create({
    id: idPage,
    title: 'Translate page',
  })

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === idPage && tab) {
      translatePage(info, tab)
    }
  })
}

export default function setupContextMenu() {
  getOption(idPage).then(active => active && createPageMenu())
  listenOption(idPage, active => (active ? createPageMenu() : removeMenu(idPage)))
}
