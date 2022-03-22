import * as browser from 'webextension-polyfill'

interface Dictionary {
  pos: string
  terms: string[]
}

export interface Response {
  trans: string
  srcLang: string
  dict?: Dictionary[]
}

export function translate(text: string, from: string, to: string): Promise<Response> {
  const TRANSLATE_URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(
    text.trim(),
  )}`

  return fetch(TRANSLATE_URL)
    .then(r => r.json())
    .then(r => ({
      dict: r.dict,
      trans: (r.sentences as any[]).reduce((text, sentence) => text + sentence.trans, ''),
      srcLang: r.ld_result?.srclangs[0] || r.src,
    }))
}

export async function listen(text: string, lang: string): Promise<void> {
  text = text.trim()

  const url = await browser.runtime.sendMessage({
    type: 'getAudio',
    data: { text, lang },
  })

  const audio = new Audio(url)
  audio.play()
}
