import { readonly, ref } from 'vue'
import { GoogleTranslator } from '@/shared/utils/translation'
import { TranslateResponse } from '@/shared/types/translation'
import { useSettings } from '@/shared/composables/useSettings'

const translator = new GoogleTranslator()

export function useTranslator() {
  const error = ref('')
  const res = ref<TranslateResponse | null>(null)
  const { settings } = useSettings()

  async function getTranslation(input: string, from: string, to?: string) {
    if (!input) return null

    const target = settings.target_language
    const second = settings.second_language
    const toLang = to || target

    return translator.translate({
      text: input.trim(),
      from,
      to: toLang,
      alternative: toLang === target ? second : target,
    })
  }

  function formatError(e: unknown): string {
    const isError = e instanceof Error

    if (isError) {
      if (e.message === 'Failed to fetch') {
        return 'Error: Unable to connect to the server'
      }

      if (e.message.startsWith('Server')) {
        return e.message
      }
    }

    return 'Error: Unknown error'
  }

  async function translate(input: string, from: string, to?: string) {
    error.value = ''

    try {
      res.value = await getTranslation(input, from, to)
    } catch (e) {
      res.value = null
      error.value = formatError(e)
    }
  }

  async function getAudio(text: string, lang: string) {
    text = text.trim()
    return translator.audio({ text, lang })
  }

  return {
    error: error,
    res: readonly(res),
    translate,
    getAudio,
  }
}
