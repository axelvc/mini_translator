<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEventBus, useToggle, whenever, useTimeoutFn, useEventListener } from '@vueuse/core'
import { audioUrlMessage, getMessageError } from '@/shared/utils'
import VolumeOnIcon from '@/shared/components/icons/VolumeOnIcon.svg'
import VolumeOffIcon from '@/shared/components/icons/VolumeOffIcon.svg'
import { computePosition, flip, offset, shift } from '@floating-ui/dom'

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
const [active, setActive] = useToggle()

/* ------------------------------ handle error ------------------------------ */
const audioBox = ref<HTMLElement>()
const errorBox = ref<HTMLElement>()
const error = ref('')

whenever(errorBox, async (errorBox) => {
  const offsetSpace = 5

  const { x, y } = await computePosition(audioBox.value!, errorBox, {
    placement: 'bottom-end',
    middleware: [flip(), shift({ padding: offsetSpace }), offset(offsetSpace)],
  })

  errorBox.style.setProperty('left', `${x}px`)
  errorBox.style.setProperty('top', `${y}px`)
})

function handleError(e: unknown) {
  error.value = getMessageError(e)
  setActive(false)

  // timeout to remove error message
  const { start: startTimeout, stop: stopTimeout } = useTimeoutFn(() => {
    error.value = ''
  }, 2000)

  startTimeout()

  // remove message when user click
  useEventListener(
    document.body,
    'click',
    () => {
      stopTimeout()
      error.value = ''
    },
    { once: true },
  )
}

/* -------------------------------- controls -------------------------------- */
async function play() {
  // stop another audios
  bus.emit()

  setActive(true)

  try {
    audio.src ||= await audioUrlMessage(p.text, p.lang) // only download if needed

    // only play if no another audio is playing
    if (active.value) {
      audio.play()
    }
  } catch (e) {
    handleError(e)
  }
}

function stop() {
  if (!active.value) return

  setActive(false)
  audio.pause()
  audio.currentTime = 0
}

bus.on(stop)
audio.onended = stop

// force to download audio again if prop changes
watch(p, () => audio.removeAttribute('src'))

function handleClick() {
  if (!p.text || p.lang === 'auto') return

  if (active.value) {
    stop()
  } else {
    play()
  }
}
</script>

<template>
  <button ref="audioBox" title="Listen" :class="['iconBtn', s.btn, active && s.active]" @click="handleClick">
    <VolumeOffIcon v-if="active" class="icon" />
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
