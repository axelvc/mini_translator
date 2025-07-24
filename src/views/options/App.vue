<script setup lang="ts">
import { watch } from 'vue'
import { clamp } from '@vueuse/core'

import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon.svg'
import { settingsDefinition } from './settings.definition'
import { SettingId, useSettings } from '@/shared/composables/useSettings'
import { useTheme } from '@/shared/composables/useTheme'
import { useI18n } from '@/shared/composables/useI18n'

const { t } = useI18n()
const { settings, save, loaded } = useSettings()

useTheme()
watch(settings, save)

function handleInputNumberChange(ev: Event, { min, max, id }: { min?: number; max?: number; id: SettingId }) {
  const target = ev.target as HTMLInputElement
  const n = Number(target.value)

  min ??= n
  max ??= Math.max(n, min)
  ;(settings as any)[id] = clamp(n, min, max)
}
</script>
<template>
  <main v-if="loaded">
    <h1>{{ t('settings') }}</h1>

    <section v-for="category in settingsDefinition" :key="category.id">
      <h2>{{ category.label }}</h2>

      <div class="list">
        <label v-for="option in category.settings" :key="option.id" class="option">
          <div>
            <span class="name">{{ option.label }}</span>
            <p v-if="'description' in option" class="description">
              {{ option.description }}
            </p>
          </div>

          <div v-if="option.type === 'select'" class="select">
            <select v-model="settings[option.id]" class="input">
              <option v-for="[value, name] in option.options" :key="value.toString()" :value="value">
                {{ name }}
              </option>
            </select>

            <span class="icon">
              <ChevronDownIcon />
            </span>
          </div>

          <div v-else-if="option.type === 'boolean'" class="boolean">
            <input ref="input" v-model="settings[option.id]" type="checkbox" class="no-outline" />

            <span class="switch">
              <span />
            </span>
          </div>

          <input
            v-else-if="option.type === 'number'"
            class="input"
            type="number"
            :value="settings[option.id]"
            :min="option.min"
            @change="handleInputNumberChange($event, option)"
          />
        </label>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
main {
  display: grid;
  gap: var(--s-xl);
  max-width: 400px;
  margin: 48px 128px;
  font-size: 16px;
}

h1 {
  font-size: 48px;
  text-transform: capitalize;
}

h2 {
  font-size: 24px;
  text-transform: capitalize;
}

input[type='number'] {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    padding: 2px;
  }

  -moz-appearance: textfield;

  &:focus,
  &:hover {
    -moz-appearance: auto;
  }
}

textarea {
  height: 128px;
  resize: vertical;
}

section {
  display: grid;
  gap: var(--s-md);
}

.input {
  min-height: 40px;
  padding: var(--s-sm);
}

.list {
  position: relative;
  display: grid;
  gap: var(--s-xl);
  padding-left: var(--s-lg);
  margin-left: var(--s-xs);
  list-style: none;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 5px;
    background: var(--c-input-alt);
    border-radius: 99em;
  }
}

.option {
  display: grid;
  gap: var(--s-xs);

  &:has(.boolean) {
    display: flex;
    align-items: center;
  }

  .name {
    font-weight: 600;
    font-size: 14px;
    color: var(--c-fg);
  }

  .description {
    color: var(--c-fg-alt);
    font-size: 14px;
    text-wrap: pretty;
  }
}

.select {
  position: relative;

  select {
    width: 100%;
    text-transform: capitalize;
    appearance: none;
    padding-right: 2em;
  }

  .icon {
    position: absolute;
    top: calc(50% - 0.5em);
    right: var(--s-sm);
    pointer-events: none;
    color: var(--c-input);
  }
}

.boolean {
  float: right;

  input {
    position: absolute;
    height: 0;
    width: 0;
    opacity: 0;

    &:focus-visible + .switch {
      outline: var(--outline);
    }

    &:checked + .switch {
      background-color: var(--c-accent);

      span {
        transform: scale(0.8) translateX(80%);
      }
    }
  }

  .switch {
    float: right;
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
      transition: transform 200ms ease-out;
    }
  }
}
</style>
