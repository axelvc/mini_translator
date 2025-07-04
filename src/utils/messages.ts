import { TranslateData, TranslateResponse } from '@/types/translation'
import browser from 'webextension-polyfill'

export async function translateMessage(data: TranslateData): Promise<TranslateResponse> {
  data.text = data.text.trim()

  return browser.runtime.sendMessage({
    type: 'translate',
    data,
  })
}

export async function audioUrlMessage(text: string, lang: string): Promise<string> {
  text = text.trim()

  return browser.runtime.sendMessage({
    type: 'getAudioUrl',
    data: { text, lang },
  })
}

export function getMessageError(e: unknown): string {
  const isError = e instanceof Error

  if (isError) {
    console.dir(e)

    if (e.message === 'Failed to fetch') {
      return 'Error: Unable to connect to the server'
    }

    if (e.message.startsWith('Server')) {
      return e.message
    }
  }

  return 'Error: Unknown error'
}
