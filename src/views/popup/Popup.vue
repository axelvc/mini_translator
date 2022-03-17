<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { debouncedWatch, useClipboard } from '@vueuse/core'
import * as browser from 'webextension-polyfill'
import { getOption } from '@/settings'
import { listen, translate, Response, getLanguages } from '@/utils'
import ClipboardIcon from '@/components/icons/ClipboardIcon.svg'
import SettingsIcon from '@/components/icons/SettingsIcon.svg'
import VolumeIcon from '@/components/icons/VolumeIcon.svg'

const inputFocus = ref(false)
const { copy } = useClipboard()

const input = ref('')
const output = ref<Response>({ trans: '' })

const langs = reactive({ input: '', output: '' })
getOption('main_language').then(v => (langs.input = v))
getOption('second_language').then(v => (langs.output = v))

async function getTranslation() {
  output.value = await translate(input.value, langs.input, langs.output)
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

watch(langs, async () => {
  if (!input.value) return

  await getTranslation()
})

const languages = getLanguages()

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

        <button :class="s.btn" title="Copy to clipboard" @click="copy(input)">
          <ClipboardIcon class="icon" />
        </button>
        <button :class="s.btn" title="Listen" @click="listen(input, langs.input)">
          <VolumeIcon class="icon" />
        </button>
      </div>
    </div>

    <div v-if="output.trans" :class="s.output">
      <div :class="s.actions">
        <select v-model="langs.output" :class="s.lang" title="Language">
          <option v-for="[code, name] in languages" :key="code" :value="code">{{ name }}</option>
        </select>

        <button :class="s.btn" title="Copy to clipboard" @click="copy(output.trans)">
          <ClipboardIcon class="icon" />
        </button>
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

    <nav :class="s.nav">
      <button :class="s.btn" title="Settings" @click="openSettings">
        <SettingsIcon class="icon" />
      </button>
    </nav>
  </main>
</template>

<style lang="scss" module="s">
html,
body {
  width: 22rem;
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
  width: 1.5rem;
  height: 1.5rem;
  color: var(--c-input);
  border-radius: var(--rounded-sm);
  font-size: 1.25rem;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--c-accent);
  }
}

.actions {
  display: flex;
  gap: var(--s-sm);
  align-items: center;
}

.lang {
  height: 1.5rem;
  margin-right: auto;
  color: var(--c-label);
  font-weight: 600;
  border-radius: var(--rounded-sm);
  font-size: 0.8125rem;
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
  font-size: 0.9375rem;
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
  height: 8rem;
}

/* --------------------------------- output --------------------------------- */
.output {
  @extend %box;
  flex-direction: column;
  min-height: 4rem;
}

.dict {
  display: grid;
  gap: var(--s-xs) var(--s-md);
  grid-template-columns: auto 1fr;
  margin: var(--s-xs);
  color: var(--c-label);
  font-size: 0.875rem;

  .pos {
    font-weight: 600;
  }
}

/* ----------------------------------- nav ---------------------------------- */
.nav {
  display: flex;
  justify-content: flex-end;
}
</style>
