<script setup lang="ts">
import { ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import browser from 'webextension-polyfill'
import { computePosition, flip, shift, offset, ReferenceElement, Placement } from '@floating-ui/dom'
import { getOption } from '@/store'
import { getLanguages, getMessageError, translateMessage } from '@/utils'
import type { TranslateResponse } from '@/types/translation'
import VActions from '@/components/VActions/VActions.vue'

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

getOption('floating_max_width')
  .then((v) => (maxWidth.value = v ? `${v}px` : 'auto'))
  .catch(() => {
    // TODO: handle error
  })
getOption('floating_max_height')
  .then((v) => (maxHeight.value = v ? `${v}px` : 'auto'))
  .catch(() => {
    // TODO: handle error
  })

/* -------------------------- update boxes position ------------------------- */
const position = ref<Placement>('bottom')

getOption('floating_position')
  .then((v) => (position.value = v))
  .catch(() => {
    // TODO: handle error
  })

async function updateBoxPosition(reference: ReferenceElement, box: HTMLElement) {
  const { x, y } = await computePosition(reference, box, {
    placement: position.value,
    middleware: [flip(), shift({ padding: offsetSpace }), offset(offsetSpace)],
  })

  box.style.setProperty('left', `${x}px`)
  box.style.setProperty('top', `${y}px`)
}

watchOnce(tooltipBox, (box) => {
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

watchOnce(translationBox, (box) => {
  const selectionRange = getSelection()!.getRangeAt(0)

  updateBoxPosition(selectionRange, box!)
})

/* ------------------------------- translation ------------------------------ */
const languages = getLanguages()
const translation = ref<TranslateResponse>({ text: '', srcLang: '', outLang: '' })
const error = ref('')

async function getTranslation() {
  const userTarget = translation.value.outLang

  // prefer language selected by the user
  // only pass second if it's the first call
  const langs = {
    target: userTarget || (await getOption('target_language')),
    second: userTarget ? null : await getOption('second_language'),
  }

  try {
    translation.value = await translateMessage({
      text: p.selectedText,
      from: 'auto',
      to: langs.target,
      alternative: langs.second,
    })
  } catch (e) {
    error.value = getMessageError(e)
  }
}
</script>

<template>
  <div v-if="translation.text || error" ref="translationBox" :class="s.translation" :style="{ maxHeight, maxWidth }">
    <template v-if="translation.text">
      <VActions
        v-model:lang="translation.outLang"
        :text="translation.text"
        :languages="languages"
        lang-title="Language"
        @update:lang="getTranslation"
      />

      <p :class="s.text">
        {{ translation.text }}
      </p>

      <div v-if="translation.dict" :class="s.dict">
        <template v-for="{ pos, terms } in translation.dict" :key="pos">
          <span :class="s.pos">{{ pos }}:</span>
          <span>{{ terms.join(', ') }}</span>
        </template>
      </div>
    </template>

    <span v-if="error" class="error">
      {{ error }}
    </span>
  </div>

  <img v-else ref="tooltipBox" :src="iconUrl" :class="s.tooltip" @click="getTranslation" />
</template>

<style lang="scss">
@use '@/style.scss';
</style>

<style lang="scss" module="s">
.box {
  z-index: 2147483647; // max z-index (according to a google search)
  position: absolute;
  display: flex;
  border: 1px solid var(--c-input-alt);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  border-radius: var(--rounded);
  background: var(--c-bg-alt);
}

/* --------------------------------- tooltip -------------------------------- */
.tooltip {
  @extend .box;

  width: 24px;
  height: 24px;
  padding: 2px;
  cursor: pointer;
}

/* ------------------------------- translation ------------------------------ */
.translation {
  @extend .box;

  flex-direction: column;
  gap: var(--s-sm);
  padding: var(--s-sm);
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
  color: var(--c-fg-alt);
  font-size: 14px;

  .pos {
    font-weight: 600;
  }
}
</style>
