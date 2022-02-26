<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import VSelect from '../../components/VSelect.vue'
import VSwitch from '../../components/VSwitch.vue'
import { settingSchema, setupSettings, saveSettings } from '../../settings'

const loading = ref(true)
const settings = reactive<Record<string, any>>({})

setupSettings().then(s => {
  loading.value = false
  Object.assign(settings, s)
})

watch(settings, saveSettings)
</script>
<template>
  <main>
    <h1>Options</h1>

    <template v-if="!loading">
      <section v-for="category in settingSchema" :key="category.id">
        <h2>{{ category.name }}</h2>

        <ul class="list">
          <li v-for="option in category.children" :key="option.id" class="option">
            <label :class="[option.type === 'boolean' && 'inline']">
              <span class="name">{{ option.label }}</span>

              <VSwitch v-if="option.type === 'boolean'" v-model="settings[option.id]" />
              <VSelect
                v-else-if="option.type === 'select'"
                v-model="settings[option.id]"
                :options="option.options"
              />
              <input
                v-else-if="option.type === 'number'"
                v-model="settings[option.id]"
                type="number"
                class="input"
              />
              <textarea v-else-if="option.multiline" v-model="settings[option.id]" class="input" />
              <input v-else v-model="settings[option.id]" type="text" class="input" />
            </label>
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
  max-width: 25rem;
  margin: 3rem 8rem;
  font-size: 1rem;
}

h1 {
  font-size: 3rem;
  text-transform: capitalize;
}

h2 {
  font-size: 1.5rem;
  text-transform: capitalize;
}

input[type='number'] {
  padding-right: 0;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    padding: var(--s-xs);
    margin-right: var(--s-xs);
    height: 1em;
  }
}

textarea {
  height: 8rem;
  resize: vertical;
}

section {
  display: grid;
  gap: var(--s-md);
}

.input {
  min-height: 2.5rem;
  padding: var(--s-sm);
}

.list {
  position: relative;
  display: grid;
  gap: var(--s-lg);
  padding-left: var(--s-lg);
  margin-left: var(--s-xs);
  list-style: none;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 0.3125rem;
    background: var(--c-input-alt);
    border-radius: 99em;
  }
}

.option {
  label {
    display: grid;
    gap: var(--s-xs);

    &.inline {
      display: flex;
      gap: var(--s-xs);
      align-items: center;
      justify-content: space-between;
      height: 2.5rem;
    }
  }

  .name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--c-label);
  }
}
</style>
