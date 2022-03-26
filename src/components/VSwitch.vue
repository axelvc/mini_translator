<script setup lang="ts">
const p = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()
</script>

<template>
  <input
    ref="input"
    type="checkbox"
    :class="s.input"
    :checked="p.modelValue"
    @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
  />

  <span :class="s.switch">
    <span />
  </span>
</template>

<style lang="scss" module="s">
.input {
  position: absolute;
  height: 0;
  width: 0;
  opacity: 0;

  &:focus-visible {
    outline: none;

    & + .switch {
      outline: var(--outline);
    }
  }

  &:checked + .switch {
    background-color: var(--c-accent);

    span {
      transform: scale(0.8) translateX(80%);
    }
  }
}

.switch {
  display: flex;
  width: 40px;
  height: 24px;
  border-radius: 99em;
  background: var(--c-input-alt);
  cursor: pointer;
  outline-offset: 2px;

  span {
    width: 24px;
    height: 24px;
    background: var(--c-bg-alt);
    border-radius: inherit;
    transform: scale(0.8);
    transition: all 200ms ease-out;
  }
}
</style>
