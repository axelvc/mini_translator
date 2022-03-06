<script setup lang="ts">
import { ref } from 'vue'
import { watchOnce, useClipboard } from '@vueuse/core'
import * as browser from 'webextension-polyfill'
import { computePosition, flip, shift, offset, ReferenceElement, Placement } from '@floating-ui/dom'
import { type Response } from '@/utils'
import { getOption } from '@/settings'
import ClipboardIcon from '@/components/icons/ClipboardIcon.svg'
import VolumeIcon from '@/components/icons/VolumeIcon.svg'

const p = defineProps({
  selectedText: {
    type: String,
    default: '',
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
})

const tooltipBox = ref<HTMLDivElement>()
const translationBox = ref<HTMLDivElement>()

const offsetSpace = 10
const iconUrl = browser.runtime.getURL('icons/icon.svg')

/* -------------------------------- settings -------------------------------- */
const maxWidth = ref('auto')
const maxHeight = ref('auto')

getOption('floating_max_width').then(v => (maxWidth.value = v || 'auto'))
getOption('floating_max_height').then(v => (maxHeight.value = v || 'auto'))

/* -------------------------- update boxes position ------------------------- */
const position = ref<Placement>('bottom')

getOption('floating_position').then(v => (position.value = v))

async function updateBoxPosition(reference: ReferenceElement, box: HTMLElement) {
  const { x, y } = await computePosition(reference, box, {
    placement: position.value,
    middleware: [flip(), shift({ padding: offsetSpace }), offset(offsetSpace)],
  })

  box.style.setProperty('left', `${x}px`)
  box.style.setProperty('top', `${y}px`)
}

watchOnce(tooltipBox, box => {
  const cursorPosition = {
    getBoundingClientRect: () => ({
      x: p.x,
      y: p.y,
      top: p.y,
      bottom: p.y,
      right: p.x,
      left: p.x,
      width: 0,
      height: 0,
    }),
  }

  updateBoxPosition(cursorPosition, box!)
})

watchOnce(translationBox, box => {
  const selectionRange = getSelection()!.getRangeAt(0)

  updateBoxPosition(selectionRange, box!)
})

/* ------------------------------- translation ------------------------------ */
// output language
const LANG_LIST = ['en', 'es', 'fr', 'it', 'nl', 'pt', 'ru'] // TODO: remove
const outputLang = ref('')
getOption('main_language').then(v => (outputLang.value = v))

// translation
const translation = ref<Response>({ trans: '' })

async function getTranslation() {
  const res: Response = await browser.runtime.sendMessage({
    type: 'translate',
    data: {
      text: p.selectedText,
      from: 'auto',
      to: outputLang.value,
    },
  })

  translation.value = res
}

// listen
async function listen() {
  browser.runtime.sendMessage({
    type: 'listen',
    data: {
      text: p.selectedText,
      lang: outputLang.value,
    },
  })
}

// clipboard
const { copy } = useClipboard()

function copyOutput() {
  copy(translation.value.trans)
}
</script>

<template>
  <div
    v-if="translation.trans"
    ref="translationBox"
    :class="s.translation"
    :style="{ maxHeight, maxWidth }"
  >
    <div :class="s.actions">
      <select v-model="outputLang" :class="s.lang" title="Language">
        <option v-for="lang in LANG_LIST" :key="lang">{{ lang }}</option>
      </select>

      <button :class="s.btn" title="Copy to clipboard" @click="copyOutput">
        <ClipboardIcon class="icon" />
      </button>
      <button :class="s.btn" title="Listen" @click="listen">
        <VolumeIcon class="icon" />
      </button>
    </div>

    <p :class="s.text">{{ translation.trans }}</p>

    <div v-if="translation.dict" :class="s.dict">
      <template v-for="{ pos, terms } in translation.dict" :key="pos">
        <span :class="s.pos">{{ pos }}:</span>
        <span>{{ terms.join(', ') }}</span>
      </template>
    </div>
  </div>

  <img v-else ref="tooltipBox" :src="iconUrl" :class="s.tooltip" @click="getTranslation" />
</template>

<style lang="scss">
@import '@/style.scss';
</style>

<style lang="scss" module="s">
%container {
  z-index: 99;
  position: absolute;
  display: flex;
  border: 1px solid var(--c-bg-alt);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  border-radius: var(--rounded);
  background: inherit;
}

/* --------------------------------- tooltip -------------------------------- */
.tooltip {
  @extend %container;

  width: 1.5rem;
  height: 1.5rem;
  padding: 0.125rem;
  cursor: pointer;
}

/* ------------------------------- translation ------------------------------ */
.translation {
  @extend %container;

  display: flex;
  flex-direction: column;
  gap: var(--s-sm);
  padding: var(--s-sm);
}

.actions {
  display: flex;
  gap: var(--s-xs);
  align-items: center;
  color: var(--c-label);
  height: 1.5rem;
}

.lang {
  height: 100%;
  margin-right: auto;
  border-radius: var(--rounded-sm);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: capitalize;
  user-select: none;

  option {
    background: var(--c-bg-alt);
    color: var(--c-fg);
  }
}

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

.text {
  font-size: 1rem;
  margin: 0 var(--s-xs);
  overflow: auto;
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
</style>
