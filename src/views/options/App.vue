<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { clamp } from '@vueuse/core'

import ChevronDownIcon from '@/shared/components/icons/ChevronDownIcon.svg'
import { Settings, SettingsData } from '@/shared/store/settings'
import { settingsDefinition } from './settings.definition'
import { useTheme } from '@/shared/composables/useTheme'

const settings = new Settings()

const loading = ref(true)
const settingsData = reactive<Record<string, any>>({})

useTheme()
watch(settingsData, () => settings.save(settingsData as SettingsData))
onMounted(async () => {
  Object.assign(settingsData, await settings.getAll())
  loading.value = false
})

function handleInputNumberChange(ev: Event, { min, max, id }: { min?: number; max?: number; id: string }) {
  const target = ev.target as HTMLInputElement
  const n = Number(target.value)

  min ??= n
  max ??= Math.max(n, min)

  settingsData[id] = clamp(n, min, max)
}
</script>
<template>
  <main>
    <h1>Options</h1>

    <template v-if="!loading">
      <section v-for="category in settingsDefinition" :key="category.id">
        <h2>{{ category.label }}</h2>

        <ul class="list">
          <li v-for="option in category.settings" :key="option.id" class="option">
            <label>
              <span class="name">{{ option.label }}</span>

              <span v-if="option.type === 'select'" class="select">
                <select v-model="settingsData[option.id]" class="input">
                  <template v-if="Array.isArray(option.options[0])">
                    <option v-for="[value, name] in option.options" :key="value" :value="value">{{ name }}</option>
                  </template>

                  <template v-else>
                    <option v-for="value in option.options" :key="value as string" :value="value">
                      {{ value }}
                    </option>
                  </template>
                </select>

                <span class="icon">
                  <ChevronDownIcon />
                </span>
              </span>

              <input
                v-else-if="option.type === 'number'"
                class="input"
                type="number"
                :value="settingsData[option.id]"
                :min="option.min"
                @change="handleInputNumberChange($event, option)"
              />
            </label>

            <div v-if="'description' in option" class="description">
              {{ option.description }}
            </div>
          </li>
        </ul>
      </section>
    </template>
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

  label {
    display: grid;
    gap: inherit;
  }

  .name {
    font-weight: 600;
    font-size: 14px;
    color: var(--c-fg);
  }

  .description {
    color: var(--c-fg-alt);
    font-size: 14px;
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
</style>
