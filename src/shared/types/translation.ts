export interface TranslateData {
  text: string
  from: string
  to: string
  alternative?: string
}

export interface TranslateResponse {
  text: string
  lang: {
    src: string
    out: string
  }
  dict?: {
    pos: string
    terms: string[]
  }[]
}

export type TranslateFn = (data: TranslateData) => Promise<TranslateResponse>
