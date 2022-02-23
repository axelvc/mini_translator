<script setup lang="ts">
import { defineProps, type PropType } from 'vue'
import ChevronDownIcon from './icons/ChevronDownIcon.svg'

const p = defineProps({
  options: {
    type: Array as PropType<string[]>,
    required: true,
  },
  id: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <span ref="container" :class="s.container">
    <select class="input">
      <option v-for="option in p.options" :key="option" :value="option">{{ option }}</option>
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
