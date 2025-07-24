<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { debouncedWatch, watchOnce } from '@vueuse/core'
import browser from 'webextension-polyfill'

import SettingsIcon from '@/shared/components/icons/SettingsIcon.svg'
import VActions from '@/views/popup/components/VActions.vue'
import { LANGUAGES_ENTRIES } from '@/shared/utils/languages'
import { useI18n } from '@/shared/composables/useI18n'
import { useSettings } from '@/shared/composables/useSettings'
import { useTheme } from '@/shared/composables/useTheme'
import { useTranslator } from './composables/useTranslator'

const input = reactive({ text: '', from: 'auto', to: '' })
const inputFocus = ref(false)
const { error, res, translate } = useTranslator()
const { settings, loaded } = useSettings()
const { t } = useI18n()

useTheme()

function openSettings() {
  browser.runtime.openOptionsPage()
}

async function handleTranslate() {
  await translate(input.text, input.from, input.to)
  input.to = res.value?.outLang ?? ''
}

watch(() => [input.from, input.to], handleTranslate)
watchOnce(loaded, async () => {
  if (settings.start_with_selection) {
    try {
      const [text] = await browser.tabs.executeScript(undefined, { code: 'window.getSelection().toString()' })
      input.text = (text as string) || ''
      handleTranslate()
    } catch {}
  }

  debouncedWatch(() => input.text, handleTranslate, { debounce: settings.toolbar_delay })
})
</script>

<template>
  <main>
    <div :class="['input', inputFocus && 'outline']">
      <textarea
        v-model="input.text"
        autofocus
        class="no-outline text"
        :placeholder="t('popup_type_placeholder')"
        @focus="inputFocus = true"
        @blur="inputFocus = false"
      />

      <VActions
        v-model:lang="input.from"
        :lang-title="t('select_from_language')"
        :text="input.text"
        :voice-lang="res?.srcLang"
        :languages="[['auto', t('select_from_language_option_auto')], ...LANGUAGES_ENTRIES]"
      />
    </div>

    <div v-if="res" class="output">
      <VActions
        v-model:lang="input.to"
        :lang-title="t('select_to_language')"
        :text="res.text"
        :languages="LANGUAGES_ENTRIES"
      />

      <p class="text">
        {{ res.text }}
      </p>

      <div v-if="res.dict?.length" class="dict">
        <template v-for="{ pos, terms } in res.dict" :key="pos">
          <span class="pos">{{ pos }}:</span>
          <span>{{ terms.join(', ') }}</span>
        </template>
      </div>
    </div>

    <footer class="footer">
      <span v-if="error" class="error">{{ error }}</span>

      <span v-if="res && res.srcLang !== input.from" class="changeLanguage">
        {{ t('translated_from') }}:
        <button @click="input.from = res.srcLang">
          {{ LANGUAGES_ENTRIES.find(([code]) => code === res!.srcLang)![1] }}
        </button>
      </span>

      <button class="icon-btn" :title="t('settings')" @click="openSettings">
        <SettingsIcon class="icon" />
      </button>
    </footer>
  </main>
</template>

<style lang="scss">
html,
body {
  width: 22rem;
}

main {
  display: grid;
  gap: var(--s-sm);
  margin: var(--s-sm);
}

/* ------------------------------ input/output ------------------------------ */
.input {
  display: flex;
  gap: inherit;
  flex-direction: column-reverse;
  padding: var(--s-xs);
  height: 8rem;

  .text {
    flex: 1;
    margin: 0 var(--s-xs);
    font-size: 1rem;
    resize: none;
  }
}

.output {
  @extend .input;
  flex-direction: column;
  height: auto;
  padding: 0;

  .dict {
    display: grid;
    gap: var(--s-sm) var(--s-md);
    grid-template-columns: auto 1fr;
    margin: var(--s-xs);
    color: var(--c-fg-alt);
    font-size: 0.875rem;

    .pos {
      font-weight: 600;
    }
  }
}

/* --------------------------------- footer --------------------------------- */
.footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 0.75rem;

  .icon-btn {
    margin-left: auto;
  }

  .changeLanguage {
    text-transform: capitalize;
    color: var(--c-fg-alt);
    margin-left: var(--s-xs);

    button {
      color: var(--c-accent);
    }
  }
}
</style>
