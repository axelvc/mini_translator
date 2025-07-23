<script setup lang="ts">
import { type PropType } from 'vue'
import ChevronDownIcon from './icons/ChevronDownIcon.svg'

const p = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  options: {
    type: Array as PropType<readonly any[] | [any, any][]>,
    required: true,
  },
  id: {
    type: String,
    default: '',
  },
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()
</script>

<template>
  <span ref="container" :class="s.container">
    <select
      class="input"
      :value="p.modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <template v-if="Array.isArray(p.options[0])">
        <option v-for="[value, name] in p.options" :key="value" :value="value">{{ name }}</option>
      </template>

      <template v-else>
        <option v-for="option in p.options" :key="option as string" :value="option">
          {{ option }}
        </option>
      </template>
    </select>

    <span class="icon">
      <ChevronDownIcon />
    </span>
  </span>
</template>

<style lang="scss" module="s">
.container {
  position: relative;

  select {
    width: 100%;
    text-transform: capitalize;
    appearance: none;
    padding-right: 2em;
  }

  :global(.icon) {
    position: absolute;
    top: calc(50% - 0.5em);
    right: var(--s-sm);
    pointer-events: none;
    color: var(--c-input);
  }
}
</style>
