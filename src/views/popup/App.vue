<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { debouncedWatch, watchOnce } from '@vueuse/core'
import browser from 'webextension-polyfill'

import SettingsIcon from '@/shared/components/icons/SettingsIcon.svg'
import VActions from './components/VActions/VActions.vue'
import { LANGUAGES_ENTRIES } from '@/shared/utils/languages'
import { useTheme } from '@/shared/composables/useTheme'
import { useTranslator } from './composables/useTranslator'
import { useSettings } from '@/shared/composables/useSettings'
import { useI18n } from '@/shared/composables/useI18n'

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
    <div :class="['input', s.input, inputFocus && 'outline']">
      <textarea
        v-model="input.text"
        autofocus
        :placeholder="t('popup_type_placeholder')"
        :class="['no-outline', s.text]"
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

    <div v-if="res" :class="s.output">
      <VActions
        v-model:lang="input.to"
        :lang-title="t('select_to_language')"
        :text="res.text"
        :languages="LANGUAGES_ENTRIES"
      />

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
        {{ t('translated_from') }}:
        <button @click="input.from = res.srcLang">
          {{ LANGUAGES_ENTRIES.find(([code]) => code === res!.srcLang)![1] }}
        </button>
      </span>

      <button class="iconBtn" :title="t('settings')" @click="openSettings">
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
