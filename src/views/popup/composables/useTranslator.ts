import { readonly, ref } from 'vue'
import { TranslateResponse } from '@/shared/types/translation'
import { getMessageError, translateMessage } from '@/shared/utils'
import { useSettings } from '@/shared/composables/useSettings'

export function useTranslator() {
  const error = ref('')
  const res = ref<TranslateResponse | null>(null)
  const { settings } = useSettings()

  async function getTranslation(input: string, from: string, to?: string) {
    if (!input) return null

    const target = settings.target_language
    const second = settings.second_language
    const toLang = to || target

    return translateMessage({
      text: input,
      from,
      to: toLang,
      alternative: toLang === target ? second : target,
    })
  }

  async function translate(input: string, from: string, to?: string) {
    error.value = ''

    try {
      res.value = await getTranslation(input, from, to)
    } catch (e) {
      res.value = null
      error.value = getMessageError(e)
    }
  }

  return {
    error: readonly(error),
    res: readonly(res),
    translate,
  }
}
