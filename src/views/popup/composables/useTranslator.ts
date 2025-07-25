import { readonly, ref } from 'vue'
import { translate as googleTranslate } from '@/shared/utils/translator'
import { TranslateResponse } from '@/shared/types/translation'
import { useSettings } from '@/shared/composables/useSettings'
import { useI18n } from '@/shared/composables/useI18n'

export function useTranslator() {
  const { t } = useI18n()
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
      res.value = await googleTranslate({
        text: input.trim(),
        from,
        to: toLang,
        alternative: toLang === target ? second : target,
      })
    } catch (e: any) {
      if (e?.name === 'AbortError') return
      const message = e?.message || t('error_cause_unknown')
      error.value = t('error_translate', message)
      res.value = null
    }
  }

  return {
    error: readonly(error),
    res: readonly(res),
    translate,
  }
}
