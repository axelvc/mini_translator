<script setup lang="ts">
import { watch } from 'vue'
import { useEventBus, useToggle } from '@vueuse/core'
import { audioUrlMessage } from '@/utils'
import VolumeOnIcon from '@/components/icons/VolumeOnIcon.svg'
import VolumeOffIcon from '@/components/icons/VolumeOffIcon.svg'

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

async function play() {
  // stop another audios
  bus.emit()

  setActive(true)
  audio.src ||= await audioUrlMessage(p.text, p.lang) // only download if needed
  audio.play()
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
</script>

<template>
  <button title="Listen" :class="['iconBtn', active && s.active]" @click="active ? stop() : play()">
    <VolumeOffIcon v-if="active" class="icon" />
    <VolumeOnIcon v-else class="icon" />
  </button>
</template>

<style lang="scss" module="s">
.active {
  svg {
    color: var(--c-fg);
  }
}
</style>
