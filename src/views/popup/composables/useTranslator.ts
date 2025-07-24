import { readonly, ref } from 'vue'
import { translate as googleTranslate } from '@/shared/utils/translator'
import { TranslateResponse } from '@/shared/types/translation'
import { useSettings } from '@/shared/composables/useSettings'

export function useTranslator() {
  const error = ref('')
  const res = ref<TranslateResponse | null>(null)
  const { settings } = useSettings()

  async function translate(input: string, from: string, to?: string) {
    if (!input) return null
    error.value = ''

    const target = settings.target_language
    const second = settings.second_language
    const toLang = to || target

    try {
      return await googleTranslate({
        text: input.trim(),
        from,
        to: toLang,
        alternative: toLang === target ? second : target,
      })
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown error'
      error.value = `Failed to translate: ${message}`
      res.value = null
    }
  }

  return {
    error: readonly(error),
    res: readonly(res),
    translate,
  }
}
