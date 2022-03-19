<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import ClipboardIcon from '@/components/icons/ClipboardIcon.svg'

const p = defineProps({
  text: {
    type: String,
    required: true,
  },
})

const { copy, copied } = useClipboard()
</script>

<template>
  <button
    v-bind="$attrs"
    title="Copy to clipboard"
    :class="s.btn"
    :disabled="!p.text || copied"
    @click="copy(p.text)"
  >
    <ClipboardIcon class="icon" />

    <span v-if="copied" :class="s.copied">Text copied</span>
  </button>
</template>

<style lang="scss" module="s">
.btn {
  position: relative;
}

.copied {
  position: absolute;
  top: 100%;
  padding: var(--s-xs) var(--s-sm);
  margin: 5px;
  color: var(--c-fg);
  background: var(--c-bg-alt);
  border: 1px solid var(--c-input);
  border-radius: 4px;
  font-size: 13px;
  white-space: nowrap;
  cursor: default;
}
</style>
