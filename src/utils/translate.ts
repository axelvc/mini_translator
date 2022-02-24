interface Dictionary {
  pos: string
  terms: string[]
}

export interface Response {
  trans: string
  dict?: Dictionary[]
}

export function translate(text: string, from: string, to: string): Promise<Response> {
  const TRANSLATE_URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(
    text,
  )}`

  return fetch(TRANSLATE_URL)
    .then(r => r.json())
    .then(r => ({
      trans: r.sentences[0].trans,
      dict: r.dict,
    }))
}
