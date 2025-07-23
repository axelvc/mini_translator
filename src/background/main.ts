import browser from 'webextension-polyfill'
import { GoogleTranslator } from '@/services/translation'

const translator = new GoogleTranslator()

browser.runtime.onMessage.addListener(async ({ type, data }: any) => {
  switch (type) {
    case 'translate':
      return await translator.translate(data)
    case 'getAudioUrl':
      return await translator.audio(data)
  }
})
