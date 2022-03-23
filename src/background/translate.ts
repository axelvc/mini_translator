/* -------------------------------- translate ------------------------------- */
export interface TranslateData {
  text: string
  from: string
  to: string
  alternative?: string
}

export interface TranslateResponse {
  text: string
  srcLang: string
  outLang: string
  dict?: {
    pos: string
    terms: string[]
  }[]
}

async function fetchTranslations({
  from,
  text,
  to,
}: Omit<TranslateData, 'alternative'>): Promise<TranslateResponse> {
  const translationUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(
    text,
  )}`
  const res = await fetch(translationUrl)
  const json = await res.json()

  return {
    text: (json.sentences as any[]).reduce((text, sentence) => text + sentence.trans, ''),
    dict: json.dict,
    srcLang: json.ld_result?.srclangs[0] || json.src,
    outLang: to,
  }
}

export async function translate({
  text,
  from,
  to,
  alternative,
}: TranslateData): Promise<TranslateResponse> {
  let translation = await fetchTranslations({ text, from, to })

  if (translation.srcLang === to && alternative) {
    translation = await fetchTranslations({ text, from, to: alternative })
  }

  return translation
}

/* ---------------------------------- audio --------------------------------- */
interface AudioUrlData {
  text: string
  lang: string
}

export async function getAudioUrl({ text, lang }: AudioUrlData): Promise<string> {
  const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    text,
  )}&tl=${lang}&total=1&idx=0&textlen=${text.length}&client=tw-ob`

  const res = await fetch(audioUrl)
  const blob = await res.blob()

  return new Promise(resolve => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(reader.result as string)
    }

    reader.readAsDataURL(blob)
  })
}
