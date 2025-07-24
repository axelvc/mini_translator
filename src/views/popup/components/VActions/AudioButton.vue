<script setup lang="ts">
import { ref, watch } from 'vue'
import { computePosition, flip, offset, shift } from '@floating-ui/dom'
import { useEventBus, useToggle, whenever, useTimeoutFn, useEventListener } from '@vueuse/core'

import VolumeOffIcon from '@/shared/components/icons/VolumeOffIcon.svg'
import VolumeOnIcon from '@/shared/components/icons/VolumeOnIcon.svg'
import { useI18n } from '@/shared/composables/useI18n'
import { useTranslator } from '@/views/popup/composables/useTranslator'

const p = defineProps({
  text: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    required: true,
  },
})

const audio = new Audio()
const bus = useEventBus('audio')
const { getAudio, error } = useTranslator()
const [playing, setPlaying] = useToggle()
const { t } = useI18n()

/* ------------------------------ handle error ------------------------------ */
const audioBox = ref<HTMLElement>()
const errorBox = ref<HTMLElement>()

whenever(errorBox, async () => {
  setPlaying(false)
  await showPopup()
  clearError()
})

async function showPopup() {
  const offsetSpace = 5
  const box = audioBox.value!

  const { x, y } = await computePosition(audioBox.value!, box, {
    placement: 'bottom-end',
    middleware: [flip(), shift({ padding: offsetSpace }), offset(offsetSpace)],
  })

  box.style.setProperty('left', `${x}px`)
  box.style.setProperty('top', `${y}px`)
}

function clearError() {
  const clear = () => (error.value = '')
  const { start, stop } = useTimeoutFn(clear, 2000)

  start()
  useEventListener(
    document.body,
    'click',
    () => {
      stop()
      clear()
    },
    { once: true },
  )
}

/* -------------------------------- controls -------------------------------- */
async function play() {
  bus.emit() // stop another audios
  setPlaying(true)

  try {
    audio.src ||= await getAudio(p.text, p.lang)
    audio.play()
  } catch {}
}

function stop() {
  if (!playing.value) return

  setPlaying(false)
  audio.pause()
  audio.currentTime = 0
}

bus.on(stop)
audio.onended = stop

// force to download audio again if prop changes
watch(p, () => audio.removeAttribute('src'))

function handleClick() {
  if (!p.text || p.lang === 'auto') return

  if (playing.value) {
    stop()
  } else {
    play()
  }
}
</script>

<template>
  <button ref="audioBox" :title="t('play_audio')" :class="['iconBtn', s.btn, playing && s.active]" @click="handleClick">
    <VolumeOffIcon v-if="playing" class="icon" />
    <VolumeOnIcon v-else class="icon" />

    <span v-if="error" ref="errorBox" :class="['error', s.error]">{{ error }}</span>
  </button>
</template>

<style lang="scss" module="s">
.btn {
  position: relative;

  &.active {
    svg {
      color: var(--c-fg);
    }
  }
}

.error {
  position: absolute;
  white-space: nowrap;
  font-size: 13px;
}
</style>
