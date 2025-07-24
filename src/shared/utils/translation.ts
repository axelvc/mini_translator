import { TranslateData, TranslateResponse, TranslateError, Translator } from '@/shared/types/translation'

export class GoogleTranslator implements Translator {
  async translate({ text, from, to, alternative }: TranslateData): Promise<TranslateResponse> {
    let translation = await this.request({ text, from, to })

    if (translation.srcLang === to && alternative) {
      translation = await this.request({ text, from, to: alternative })
    }

    return translation
  }

  private async request({ from, text, to }: TranslateData): Promise<TranslateResponse> {
    const translationUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(text)}`

    const res = await fetch(translationUrl)

    if (!res.ok) {
      throw new TranslateError(res.statusText)
    }

    const json = await res.json()

    return {
      text: (json.sentences as any[]).reduce((text, sentence) => text + sentence.trans, ''),
      dict: json.dict,
      srcLang: json.ld_result?.srclangs[0] || json.src,
      outLang: to,
    }
  }
}
