<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { debouncedWatch } from '@vueuse/core'
import browser from 'webextension-polyfill'

import SettingsIcon from '@/components/icons/SettingsIcon.svg'
import VActions from '@/components/VActions/VActions.vue'
import { LANGUAGES_ENTRIES } from '@/utils'
import { Settings } from '@/store/settings'
import { useTheme } from '@/composables/useTheme'
import { useTranslator } from '@/composables/useTranslator'

const settings = new Settings()
const inputFocus = ref(false)
const input = reactive({ text: '', from: 'auto', to: '' })
const { error, res, translate } = useTranslator()

useTheme()

async function handleTranslate() {
  await translate(input.text, input.from, input.to)
  input.to = res.value?.outLang ?? ''
}

onMounted(async () => {
  watch(() => [input.from, input.to], handleTranslate)
  debouncedWatch(() => input.text, handleTranslate, { debounce: await settings.get('toolbar_delay') })
})

function openSettings() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main>
    <div :class="['input', s.input, inputFocus && 'outline']">
      <textarea
        v-model="input.text"
        autofocus
        placeholder="Type something"
        :class="['no-outline', s.text]"
        @focus="inputFocus = true"
        @blur="inputFocus = false"
      />

      <VActions
        v-model:lang="input.from"
        lang-title="From Language"
        :text="input.text"
        :voice-lang="res?.srcLang"
        :languages="[['auto', 'detect language'], ...LANGUAGES_ENTRIES]"
      />
    </div>

    <div v-if="res" :class="s.output">
      <VActions v-model:lang="input.to" lang-title="To Language" :text="res.text" :languages="LANGUAGES_ENTRIES" />

      <p :class="s.text">
        {{ res.text }}
      </p>

      <div v-if="res.dict?.length" :class="s.dict">
        <template v-for="{ pos, terms } in res.dict" :key="pos">
          <span :class="s.pos">{{ pos }}:</span>
          <span>{{ terms.join(', ') }}</span>
        </template>
      </div>
    </div>

    <footer :class="s.footer">
      <span v-if="error" class="error">{{ error }}</span>

      <span v-if="res && res.srcLang !== input.from" :class="s.changeLanguage">
        Translated from:
        <button @click="input.from = res.srcLang">
          {{ LANGUAGES_ENTRIES.find(([code]) => code === res!.srcLang)![1] }}
        </button>
      </span>

      <button class="iconBtn" title="Settings" @click="openSettings">
        <SettingsIcon class="icon" />
      </button>
    </footer>
  </main>
</template>

<style lang="scss" module="s">
html,
body {
  width: 352px;
}

main {
  display: grid;
  gap: var(--s-sm);
  margin: var(--s-sm);
}

/* --------------------------------- shared --------------------------------- */
.text {
  flex: 1;
  margin: 0 var(--s-xs);
  font-size: 15px;
  resize: none;
}

%box {
  display: flex;
  gap: inherit;
}

/* ---------------------------------- input --------------------------------- */
.input {
  @extend %box;
  flex-direction: column-reverse;
  padding: var(--s-xs);
  height: 128px;
}

/* --------------------------------- output --------------------------------- */
.output {
  @extend %box;
  flex-direction: column;
  min-height: 64px;
  background: var(--c-bg);
}

.dict {
  display: grid;
  gap: var(--s-xs) var(--s-md);
  grid-template-columns: auto 1fr;
  margin: var(--s-xs);
  color: var(--c-fg-alt);
  font-size: 14px;

  .pos {
    font-weight: 600;
  }
}

/* --------------------------------- footer --------------------------------- */
.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 12px;

  :global(.iconBtn) {
    margin-left: auto;
  }

  .changeLanguage {
    text-transform: capitalize;
    color: var(--c-fg-alt);

    button {
      color: var(--c-accent);
    }
  }
}
</style>
