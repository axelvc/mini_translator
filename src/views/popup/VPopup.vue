<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { debouncedWatch } from '@vueuse/core'
import browser from 'webextension-polyfill'

import SettingsIcon from '@/components/icons/SettingsIcon.svg'
import VActions from '@/components/VActions/VActions.vue'
import type { TranslateData, TranslateResponse } from '@/types/translation'
import { LANGUAGES_ENTRIES, getMessageError, translateMessage } from '@/utils'
import { Settings } from '@/store/settings'
import { useTheme } from '@/composables/useTheme'

const settings = new Settings()
const inputFocus = ref(false)
const languages = LANGUAGES_ENTRIES

const input = reactive({ text: '', lang: 'auto' })
const initialStateTranslation: TranslateResponse = { text: '', srcLang: '', outLang: '' }
const translation = ref(initialStateTranslation)
const error = ref('')

useTheme()

async function getTranslation() {
  error.value = ''

  if (!input.text) {
    translation.value = initialStateTranslation
    return
  }

  const { outLang } = translation.value
  const langs = {
    target: await settings.get('target_language'),
    second: await settings.get('second_language'),
  }

  const data: TranslateData = {
    text: input.text,
    from: input.lang,
    to: outLang || langs.target,
  }

  // swap between target and second language
  if (data.to === langs.target) {
    data.alternative = langs.second
  } else if (data.to === langs.second) {
    data.alternative = langs.target
  }

  try {
    translation.value = await translateMessage(data)
  } catch (e) {
    translation.value = initialStateTranslation
    error.value = getMessageError(e)
  }
}

onMounted(async () => {
  debouncedWatch(() => input.text, getTranslation, { debounce: await settings.get('toolbar_delay') })
})

function openSettings() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <Suspense>
    <main>
      <div :class="['input', inputFocus && 'outline', s.input]">
        <textarea
          v-model="input.text"
          :class="['no-outline', s.text]"
          placeholder="Type something"
          autofocus
          @focus="inputFocus = true"
          @blur="inputFocus = false"
        />

        <VActions
          v-model:lang="input.lang"
          :text="input.text"
          :languages="[['auto', 'detect language'], ...languages]"
          :voice-lang="translation.srcLang"
          lang-title="From Language"
          @update:lang="getTranslation"
        />
      </div>

      <div v-if="translation.text" :class="s.output">
        <VActions
          v-model:lang="translation.outLang"
          :text="translation.text"
          :languages="languages"
          lang-title="To Language"
          @update:lang="getTranslation"
        />

        <p :class="s.text">
          {{ translation.text }}
        </p>

        <div v-if="translation.dict?.length" :class="s.dict">
          <template v-for="{ pos, terms } in translation.dict" :key="pos">
            <span :class="s.pos">{{ pos }}:</span>
            <span>{{ terms.join(', ') }}</span>
          </template>
        </div>
      </div>

      <footer :class="s.footer">
        <span v-if="error" class="error">{{ error }}</span>

        <span v-if="translation.text && translation.srcLang !== input.lang" :class="s.changeLanguage">
          Translated from:
          <button @click="input.lang = translation.srcLang">
            {{ languages.find(([code]) => code === translation.srcLang)![1] }}
          </button>
        </span>

        <button class="iconBtn" title="Settings" @click="openSettings">
          <SettingsIcon class="icon" />
        </button>
      </footer>
    </main>
  </Suspense>
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
