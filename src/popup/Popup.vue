<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { debouncedWatch } from '@vueuse/core'
import * as browser from 'webextension-polyfill'
import { getOption } from '@/settings'
import { listen, translate, Response, getLanguages, detectLang } from '@/utils'
import CopyButton from '@/components/CopyButton.vue'
import SettingsIcon from '@/components/icons/SettingsIcon.svg'
import VolumeIcon from '@/components/icons/VolumeIcon.svg'

const inputFocus = ref(false)

const input = ref('')
const output = ref<Response>({ trans: '' })

const langs = reactive({ input: '', output: '', alternative: '' })
getOption('main_language').then(v => (langs.input = v))
getOption('second_language').then(v => (langs.output = v))

function changeToAlternativeLang() {
  langs.input = langs.alternative
  langs.alternative = ''
}

async function getTranslation() {
  const translation = await translate(input.value, langs.input, langs.output)
  const detectedLang = await detectLang(input.value)

  // offer change to correct language if available
  if (detectedLang !== langs.input) {
    langs.alternative = detectedLang
  } else {
    langs.alternative = ''
  }

  output.value = translation
}

getOption('toolbar_delay').then(delay => {
  debouncedWatch(
    input,
    async input => {
      if (!input) {
        output.value = { trans: '' }
        return
      }

      await getTranslation()
    },
    { debounce: delay },
  )
})

const languages = getLanguages()

watch(
  () => ({ ...langs }),
  async (value, oldValue) => {
    if (!input.value) return

    // swap if input and output are the same
    if (value.input === value.output) {
      langs.output = oldValue.input
      langs.input = oldValue.output
    }

    await getTranslation()
  },
)

function openSettings() {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <main>
    <div :class="['input', inputFocus && 'outline', s.input]">
      <textarea
        v-model="input"
        :class="['no-outline', s.text]"
        placeholder="Type something"
        autofocus
        @focus="inputFocus = true"
        @blur="inputFocus = false"
      />

      <div :class="s.actions">
        <select v-model="langs.input" :class="s.lang" title="Language">
          <option v-for="[code, name] in languages" :key="code" :value="code">{{ name }}</option>
        </select>

        <CopyButton :class="s.btn" :text="input" />
        <button :class="s.btn" title="Listen" @click="listen(input, langs.input)">
          <VolumeIcon class="icon" />
        </button>
      </div>
    </div>

    <div v-if="output.trans" :class="s.output">
      <div :class="s.actions">
        <select v-model="langs.output" :class="s.lang" title="To Language">
          <option v-for="[code, name] in languages" :key="code" :value="code">{{ name }}</option>
        </select>

        <CopyButton :class="s.btn" :text="output.trans" />
        <button :class="s.btn" title="Listen" @click="listen(output.trans, langs.output)">
          <VolumeIcon class="icon" />
        </button>
      </div>

      <p :class="s.text">{{ output.trans }}</p>

      <div v-if="output.dict?.length" :class="s.dict">
        <template v-for="{ pos, terms } in output.dict" :key="pos">
          <span :class="s.pos">{{ pos }}:</span>
          <span>{{ terms.join(', ') }}</span>
        </template>
      </div>
    </div>

    <footer :class="s.footer">
      <span v-if="langs.alternative" :class="s.changeLanguage">
        Translate from:
        <button @click="changeToAlternativeLang">
          {{ languages.find(([code]) => code === langs.alternative)![1] }}
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
