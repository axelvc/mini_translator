import { TranslateData, TranslateResponse } from '@/background/translate'
import * as browser from 'webextension-polyfill'

export async function translateMessage(data: TranslateData): Promise<TranslateResponse> {
  data.text = data.text.trim()

  return browser.runtime.sendMessage({
    type: 'translate',
    data,
  })
}

export async function audioUrlMessage(text: string, lang: string): Promise<string> {
  text = text.trim()

  console.log('getting audio')

  return browser.runtime.sendMessage({
    type: 'getAudioUrl',
    data: { text, lang },
  })
}
