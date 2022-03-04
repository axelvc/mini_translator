<script setup lang="ts">
import { ref } from 'vue'
import { watchOnce } from '@vueuse/core'
import * as browser from 'webextension-polyfill'
import { computePosition, flip, shift, offset, type ReferenceElement } from '@floating-ui/dom'
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
const showTranslation = ref(false)

/* -------------------------- update boxes position ------------------------- */
async function updateBoxPosition(reference: ReferenceElement, box: HTMLElement) {
  const { x, y } = await computePosition(reference, box, {
    placement: 'bottom',
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
</script>

<template>
  <div v-if="showTranslation" ref="translationBox" :class="s.translation">
    <div :class="s.actions">
      <select value="Spanish" :class="s.lang" title="Language">
        <option v-for="lang in ['Spanish', 'English', 'Italian']" :key="lang">{{ lang }}</option>
      </select>

      <button :class="s.btn" title="Copy to clipboard">
        <ClipboardIcon class="icon" />
      </button>
      <button :class="s.btn" title="Listen">
        <VolumeIcon class="icon" />
      </button>
    </div>

    <p :class="s.text">{{ selectedText }}</p>

    <div :class="s.dict">
      <span :class="s.pos">verb:</span>
      <span>probar, tomar una muestra, catar</span>
      <span :class="s.pos">noun:</span>
      <span>muestra, espécimen</span>
    </div>
  </div>

  <img
    v-else
    ref="tooltipBox"
    :src="iconUrl"
    :class="s.tooltip"
    width="0"
    height="0"
    @click="showTranslation = true"
  />
</template>

<style lang="scss">
@import '@/style.scss';
</style>

<style lang="scss" module="s">
%container {
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

  display: grid;
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
