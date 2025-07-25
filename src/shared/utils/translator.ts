import { TranslateData, TranslateResponse, TranslateFn } from '@/shared/types/translation'

let controller: AbortController | null = null

export const translate: TranslateFn = async ({ text, from, to, alternative }) => {
  let translation = await request({ text, from, to })

  if (translation.lang.src === to && alternative) {
    translation = await request({ text, from, to: alternative })
  }

  return translation
}

async function request({ from, text, to }: TranslateData): Promise<TranslateResponse> {
  const translationUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(text)}`

  controller?.abort()
  controller = new AbortController()
  const res = await fetch(translationUrl, { signal: controller.signal })

  if (!res.ok) {
    throw new Error(res.statusText)
  }

  const json = await res.json()

  return {
    text: (json.sentences as any[]).reduce((text, sentence) => text + sentence.trans, ''),
    dict: json.dict,
    lang: {
      src: json.ld_result?.srclangs[0] || json.src,
      out: to,
    },
  }
}
