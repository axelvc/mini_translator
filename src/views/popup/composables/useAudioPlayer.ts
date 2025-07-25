import { useI18n } from '@/shared/composables/useI18n'
import { useEventBus } from '@vueuse/core'
import { readonly, ref } from 'vue'

async function audioRequest(text: string, lang: string): Promise<Blob> {
  const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&total=1&idx=0&textlen=${text.length}&client=tw-ob`
  const res = await fetch(audioUrl)

  if (!res.ok) throw new Error(res.statusText)

  return res.blob()
}

export function useAudioPlayer() {
  const audio = new Audio()
  const { t } = useI18n()
  const bus = useEventBus('audio')
  const playing = ref(false)
  const lastText = ref('')
  const error = ref('')

  audio.addEventListener('ended', stop)
  bus.on(stop)

  function stop() {
    if (!playing.value) return
    playing.value = false

    audio.pause()
    audio.currentTime = 0
  }

  async function play(text: string, lang: string) {
    bus.emit()

    error.value = ''
    playing.value = true

    try {
      if (lastText.value !== text) {
        if (audio.src.startsWith('blob:')) URL.revokeObjectURL(audio.src)

        const audioBlob = await audioRequest(text, lang)
        audio.src = URL.createObjectURL(audioBlob)
        lastText.value = text
      }

      await audio.play()
    } catch (e) {
      const message = (e as Error)?.message || t('error_cause_unknown')
      error.value = t('error_play_audio', message)
      playing.value = false
    }
  }

  return {
    playing: readonly(playing),
    error,
    play,
    stop,
  }
}
