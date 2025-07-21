import type browser from 'webextension-polyfill'

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

export interface AudioUrlData {
  text: string
  lang: string
}

export class TranslateError extends Error {
  constructor(message: string) {
    super(`Server Error: ${message || 'Unknown Error'}`)

    this.name = 'TranslateError'
  }
}

export interface Translator {
  translate(data: TranslateData): Promise<TranslateResponse>
  audio(data: AudioUrlData): Promise<string>
  page(info: browser.Menus.OnClickData, tab: browser.Tabs.Tab): void
}
