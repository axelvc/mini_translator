<script setup lang="ts">
import { ref, reactive } from 'vue'
import { debouncedWatch } from '@vueuse/core'
import * as browser from 'webextension-polyfill'
import { getOption } from '@/settings'
import { listenMessage, getLanguages, translateMessage } from '@/utils'
import type { TranslateData, TranslateResponse } from '@/background/translate'
import CopyButton from '@/components/CopyButton.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.svg'
import VolumeIcon from '@/components/icons/VolumeIcon.svg'

const inputFocus = ref(false)
const languages = getLanguages()

const input = reactive({ text: '', lang: 'auto' })
const translation = ref<TranslateResponse>({ text: '', srcLang: '', outLang: '' })

async function getTranslation() {
  if (!input.text) {
    translation.value = { text: '', srcLang: '', outLang: '' }
    return
  }

  const { outLang } = translation.value
  const langs = {
    target: await getOption('target_language'),
    second: await getOption('second_language'),
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

  translation.value = await translateMessage(data)
}

getOption('toolbar_delay').then(debounce => {
  debouncedWatch(() => input.text, getTranslation, { debounce })
})

function openSettings() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
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

      <div :class="s.actions">
        <select v-model="input.lang" :class="s.lang" title="From Language" @change="getTranslation">
          <option
            v-for="[code, name] in [['auto', 'detect language'], ...languages]"
            :key="code"
            :value="code"
          >
            {{ name }}
          </option>
        </select>

        <CopyButton :class="s.btn" :text="input.text" />
        <button
          :class="s.btn"
          title="Listen"
          @click="listenMessage(input.text, translation.srcLang)"
        >
          <VolumeIcon class="icon" />
        </button>
      </div>
    </div>

    <div v-if="translation.text" :class="s.output">
      <div :class="s.actions">
        <select
          v-model="translation.outLang"
          :class="s.lang"
          title="To Language"
          @change="getTranslation"
        >
          <option v-for="[code, name] in languages" :key="code" :value="code">{{ name }}</option>
        </select>

        <CopyButton :class="s.btn" :text="translation.text" />
        <button
          :class="s.btn"
          title="Listen"
          @click="listenMessage(translation.text, translation.outLang)"
        >
          <VolumeIcon class="icon" />
        </button>
      </div>

      <p :class="s.text">{{ translation.text }}</p>

      <div v-if="translation.dict?.length" :class="s.dict">
        <template v-for="{ pos, terms } in translation.dict" :key="pos">
          <span :class="s.pos">{{ pos }}:</span>
          <span>{{ terms.join(', ') }}</span>
        </template>
      </div>
    </div>

    <footer :class="s.footer">
      <span v-if="translation.text && translation.srcLang !== input.lang" :class="s.changeLanguage">
        Translated from:
        <button @click="input.lang = translation.srcLang">
          {{ languages.find(([code]) => code === translation.srcLang)![1] }}
        </button>
      </span>

      <button :class="s.btn" title="Settings" @click="openSettings">
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
.btn {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  color: var(--c-input);
  border-radius: var(--rounded-sm);
  font-size: 20px;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--c-accent);
  }
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--s-sm);
  align-items: center;
}

.lang {
  height: 24px;
  margin-right: auto;
  color: var(--c-fg-alt);
  font-weight: 600;
  border-radius: var(--rounded-sm);
  font-size: 13px;
  text-transform: capitalize;
  user-select: none;

  option {
    background: var(--c-bg-alt);
    color: var(--c-fg);
  }
}

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

  .lang {
    background: var(--c-bg-alt);
  }
}

/* --------------------------------- output --------------------------------- */
.output {
  @extend %box;
  flex-direction: column;
  min-height: 64px;

  .lang {
    background: var(--c-bg);
  }
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

  .changeLanguage {
    text-transform: capitalize;
    color: var(--c-fg-alt);
    flex: 1;

    button {
      color: var(--c-accent);
    }
  }
}
</style>
