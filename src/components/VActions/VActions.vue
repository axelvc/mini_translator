<script setup lang="ts">
import { PropType } from 'vue'
import CopyButton from './CopyButton.vue'
import AudioButton from './AudioButton.vue'

defineProps({
  lang: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  languages: {
    type: Array as PropType<[string, string][]>,
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
</script>

<template>
  <div :class="s.actions">
    <select
      :class="s.lang"
      :value="lang"
      :title="langTitle"
      @change="$emit('update:lang', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="[code, name] in languages" :key="code" :value="code">
        {{ name }}
      </option>
    </select>

    <CopyButton :class="s.btn" :text="text" />
    <AudioButton :class="s.btn" :text="text" :lang="voiceLang || lang" />
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
  height: 24px;
  margin-right: auto;
  color: var(--c-fg-alt);
  background: inherit;
  border-radius: var(--rounded-sm);
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
  user-select: none;

  option {
    background: var(--c-bg-alt);
    color: var(--c-fg);
  }
}
</style>
