import { TranslateData, TranslateResponse } from '@/background/translate'
import * as browser from 'webextension-polyfill'

export async function translateMessage(data: TranslateData): Promise<TranslateResponse> {
  return browser.runtime.sendMessage({
    type: 'translate',
    data,
  })
}

export async function listenMessage(text: string, lang: string): Promise<void> {
  text = text.trim()

  const url = await browser.runtime.sendMessage({
    type: 'getAudio',
    data: { text, lang },
  })

  const audio = new Audio(url)
  audio.play()
}
