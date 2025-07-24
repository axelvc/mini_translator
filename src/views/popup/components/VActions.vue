<script setup lang="ts">
import { PropType } from 'vue'

import ClipboardIcon from '@/shared/components/icons/ClipboardIcon.svg'
import VolumeOffIcon from '@/shared/components/icons/VolumeOffIcon.svg'
import VolumeOnIcon from '@/shared/components/icons/VolumeOnIcon.svg'
import { useAudioPlayer } from '@/views/popup/composables/useAudioPlayer'
import { useClipboard, whenever } from '@vueuse/core'
import { useI18n } from '@/shared/composables/useI18n'

const p = defineProps({
  lang: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  languages: {
    type: Array as PropType<readonly [string, string][]>,
    required: true,
  },
  langTitle: {
    type: String,
    default: '',
  },
  voiceLang: {
    type: String,
    default: '',
  },
})

defineEmits<{
  (e: 'update:lang', v: string): void
}>()

const { t } = useI18n()
const { copy, copied } = useClipboard()
const { play, stop, playing, error } = useAudioPlayer()

function handleClickAudio() {
  if (playing.value) {
    stop()
  } else {
    play(p.text, p.voiceLang || p.lang)
  }
}

whenever(error, () => {
  const id = setTimeout(() => (error.value = ''), 2000)
  return () => clearTimeout(id)
})
</script>

<template>
  <div :class="s.actions">
    <select
      :class="s.lang"
      :value="p.lang"
      :title="p.langTitle"
      @change="$emit('update:lang', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="[code, name] in p.languages" :key="code" :value="code">
        {{ name }}
      </option>
    </select>

    <button
      :disabled="!text"
      :title="t('copy_clipboard')"
      :class="['icon-btn', s.copy]"
      @click="p.text && copy(p.text)"
    >
      <ClipboardIcon class="icon" />
      <span v-if="copied" :class="s.copied">Text copied</span>
    </button>

    <button
      ref="audioBox"
      :disabled="!text"
      :title="t('play_audio')"
      :class="['icon-btn', s.audio, playing && s.active]"
      @click="p.text && handleClickAudio()"
    >
      <VolumeOffIcon v-if="playing" class="icon" />
      <VolumeOnIcon v-else class="icon" />

      <span v-if="error" ref="errorBox" :class="['error', s.error]">{{ error }}</span>
    </button>
  </div>
</template>

<style lang="scss" module="s">
.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--s-sm);
  align-items: center;
  background: inherit;
}

.lang {
  height: 1.5rem;
  margin-right: auto;
  color: var(--c-fg-alt);
  background: inherit;
  border-radius: var(--rounded-sm);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: capitalize;
  user-select: none;

  option {
    background: var(--c-bg-alt);
    color: var(--c-fg);
  }
}

.copy {
  position: relative;

  .copied {
    position: absolute;
    top: 100%;
    padding: var(--s-xs) var(--s-sm);
    margin: var(--s-xs);
    color: var(--c-fg);
    background: var(--c-bg-alt);
    border: 1px solid var(--c-input);
    border-radius: var(--rounded-sm);
    font-size: 0.875rem;
    white-space: nowrap;
    cursor: default;
  }
}

.audio {
  position: relative;

  &.active {
    svg {
      color: var(--c-fg);
    }
  }

  .error {
    position: absolute;
    margin: var(--s-xs);
    top: 100%;
    right: 0;
    white-space: nowrap;
    font-size: 0.875rem;
  }
}
</style>
