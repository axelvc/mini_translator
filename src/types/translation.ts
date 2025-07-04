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
