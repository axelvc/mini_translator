<script setup lang="ts">
import { ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import * as browser from 'webextension-polyfill'
import { computePosition, flip, shift, offset, ReferenceElement, Placement } from '@floating-ui/dom'
import { listen, getLanguages, type Response } from '@/utils'
import { getOption } from '@/settings'
import CopyButton from '@/components/CopyButton.vue'
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

getOption('floating_max_width').then(v => (maxWidth.value = v ? `${v}px` : 'auto'))
getOption('floating_max_height').then(v => (maxHeight.value = v ? `${v}px` : 'auto'))

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
const languages = getLanguages()
const outputLang = ref('')
getOption('main_language').then(v => (outputLang.value = v))

// translation
const translation = ref<Response>({ trans: '' })

async function getTranslation() {
  const message = {
    type: 'translate',
    data: {
      text: p.selectedText,
      from: 'auto',
      to: outputLang.value,
    },
  }

  let res: Response = await browser.runtime.sendMessage(message)

  // use second language if the translation is same as selected text
  if (res.trans === p.selectedText) {
    message.data.from = outputLang.value
    outputLang.value = await getOption('second_language')
    message.data.to = outputLang.value

    res = await browser.runtime.sendMessage(message)
  }

  translation.value = res
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
      <select v-model="outputLang" :class="s.lang" title="Language" @change="getTranslation">
        <option v-for="[code, name] in languages" :key="code" :value="code">{{ name }}</option>
      </select>

      <CopyButton :class="s.btn" :text="translation.trans" />
      <button :class="s.btn" title="Listen" @click="listen(translation.trans, outputLang)">
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

  width: 24px;
  height: 24px;
  padding: 2px;
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
  height: 24px;
}

.lang {
  height: 100%;
  margin-right: auto;
  border-radius: var(--rounded-sm);
  font-weight: 600;
  font-size: 14px;
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

.text {
  font-size: 16px;
  margin: 0 var(--s-xs);
  overflow: auto;
}

.dict {
  display: grid;
  gap: var(--s-xs) var(--s-md);
  grid-template-columns: auto 1fr;
  margin: var(--s-xs);
  color: var(--c-label);
  font-size: 14px;

  .pos {
    font-weight: 600;
  }
}
</style>
