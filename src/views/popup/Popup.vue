<script setup lang="ts">
import { ref } from 'vue'
import { debouncedWatch } from '@vueuse/core'
import ClipboardIcon from '../../components/icons/ClipboardIcon.svg'
import SettingsIcon from '../../components/icons/SettingsIcon.svg'
import VolumeIcon from '../../components/icons/VolumeIcon.svg'
import { translate, Response } from '../../utils/translate'

const inputFocus = ref(false)

const input = ref('')
const output = ref<Response>({ trans: '' })

debouncedWatch(
  input,
  async input => {
    if (!input) {
      output.value = { trans: '' }
      return
    }

    output.value = await translate(input, 'en', 'es') // TODO: use selected languages
  },
  { debounce: 500 },
)

// TODO: remove
const LANG_LIST = [
  'czech',
  'danish',
  'dutch',
  'english',
  'finnish',
  'freanch',
  'german',
  'italian',
  'norwegian',
  'polish',
  'portuguese',
  'russian',
  'spanish',
  'swedish',
  'turkish',
]
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
        <select :class="s.lang" title="language" value="english">
          <option v-for="lang in LANG_LIST" :key="lang">{{ lang }}</option>
        </select>

        <button :class="s.btn" title="Copy to clipboard">
          <ClipboardIcon class="icon" />
        </button>
        <button :class="s.btn" title="Listen ">
          <VolumeIcon class="icon" />
        </button>
      </div>
    </div>

    <div v-if="output.trans" :class="s.output">
      <div :class="s.actions">
        <select :class="s.lang" title="language" value="spanish">
          <option v-for="lang in LANG_LIST" :key="lang">{{ lang }}</option>
        </select>

        <button :class="s.btn" title="Copy to clipboard">
          <ClipboardIcon class="icon" />
        </button>
        <button :class="s.btn" title="Listen ">
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
      <button :class="s.btn" title="Settings">
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
