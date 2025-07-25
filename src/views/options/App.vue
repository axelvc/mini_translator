<script setup lang="ts">
import { watch } from 'vue'
import { clamp, whenever } from '@vueuse/core'

import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon.svg'
import { SettingId, Settings, useSettings } from '@/shared/composables/useSettings'
import { settingsDefinition } from './settings.definition'
import { useI18n } from '@/shared/composables/useI18n'
import { useTheme } from '@/shared/composables/useTheme'

const { t } = useI18n()
const { settings, save, loaded } = useSettings()

useTheme()
whenever(loaded, () => watch(settings, save))

function set<K extends SettingId>(id: K, value: Settings[K]) {
  settings[id] = value
}

function handleInputNumberChange(ev: Event, { min, max, id }: { min?: number; max?: number; id: SettingId }) {
  const target = ev.target as HTMLInputElement
  const n = Number(target.value)

  min ??= n
  max ??= Math.max(n, min)
  set(id, clamp(n, min, max))
}
</script>
<template>
  <main v-if="loaded">
    <h1>{{ t('settings') }}</h1>

    <section v-for="category in settingsDefinition" :key="category.id">
      <h2>{{ category.label }}</h2>

      <div class="list">
        <template v-for="option in category.settings" :key="option.id">
          <label v-if="(option as any).condition?.(settings) ?? true" class="option">
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

              <ChevronDownIcon class="icon" />
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

            <div v-if="option.type === 'multi-text'" class="multi-text">
              <div class="input multi-text outline-box">
                <textarea v-model.lazy="settings[option.id]" class="no-outline">{{ option.defaultValue }}</textarea>
                <button class="reset" @click="set(option.id, option.defaultValue)">Reset</button>
              </div>
            </div>
          </label>
        </template>
      </div>
    </section>
  </main>
</template>

<style lang="scss">
main {
  display: grid;
  gap: var(--s-xl);
  margin: 3rem 8rem;
  max-width: 25rem;
  font-size: 1rem;
}

h1 {
  font-size: 3rem;
}

h2 {
  font-size: 1.5rem;
}

h1,
h2,
select {
  text-transform: capitalize;
}

input[type='number'] {
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    padding: 0.25rem;
  }

  -moz-appearance: textfield;

  &:focus,
  &:hover {
    -moz-appearance: auto;
  }
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
    width: 0.375rem;
    background: var(--c-input-alt);
    border-radius: 9em;
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
    font-size: 0.875rem;
    color: var(--c-fg);
  }

  .description {
    color: var(--c-fg-alt);
    font-size: 0.875rem;
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
    width: 2.5rem;
    height: 1.5rem;
    border-radius: 9em;
    background: var(--c-input-alt);
    cursor: pointer;
    outline-offset: 2px;

    span {
      width: 1.5rem;
      height: 1.5rem;
      background: var(--c-bg-alt);
      border-radius: inherit;
      transform: scale(0.8);
      transition: transform 200ms ease-out;
    }
  }
}

.multi-text {
  position: relative;
  display: grid;
  gap: var(--s-sm);

  textarea {
    width: 100%;
    height: 100%;
    min-height: 10rem;
    resize: vertical;
  }

  .reset {
    position: absolute;
    top: var(--s-sm);
    right: var(--s-sm);
    padding: var(--s-xs) var(--s-sm);
    border-radius: var(--rounded-sm);
    background: var(--c-accent);
    outline-offset: 0.125rem;
    font-weight: 600;
    font-size: 0.75rem;
    opacity: 0.4;
    transition: opacity 200ms ease-in-out;

    &:hover,
    &:focus-visible {
      opacity: 1;
    }
  }
}
</style>
