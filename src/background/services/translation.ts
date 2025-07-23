import { TranslateData, TranslateResponse, AudioUrlData, TranslateError, Translator } from '@/shared/types/translation'

export class GoogleTranslator implements Translator {
  async translate({ text, from, to, alternative }: TranslateData): Promise<TranslateResponse> {
    let translation = await this.request({ text, from, to })

    if (translation.srcLang === to && alternative) {
      translation = await this.request({ text, from, to: alternative })
    }

    return translation
  }

  async audio(data: AudioUrlData): Promise<string> {
    const audio = await this.audioRequest(data)

    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = () => {
        resolve(reader.result as string)
      }

      reader.readAsDataURL(audio)
    })
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

  private async audioRequest({ text, lang }: AudioUrlData): Promise<Blob> {
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&total=1&idx=0&textlen=${text.length}&client=tw-ob`

    const res = await fetch(audioUrl)

    if (!res.ok) {
      throw new TranslateError(res.statusText)
    }

    const blob = await res.blob()
    return blob
  }
}
