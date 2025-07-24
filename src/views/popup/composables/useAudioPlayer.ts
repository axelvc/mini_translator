import { useEventBus } from '@vueuse/core'
import { readonly, ref } from 'vue'
import { useTranslator } from './useTranslator'

export function useAudioPlayer() {
  const audio = new Audio()
  const bus = useEventBus('audio')
  const playing = ref(false)
  const lastText = ref('')
  const { getAudio, error } = useTranslator()

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

    if (!audio.src || lastText.value !== text) {
      audio.src = await getAudio(text, lang)
      lastText.value = text
    }

    playing.value = true
    audio.play()
  }

  return {
    playing: readonly(playing),
    play,
    stop,
    error,
  }
}
