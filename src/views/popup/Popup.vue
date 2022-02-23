<script setup lang="ts">
import { ref } from 'vue'
import ClipboardIcon from '../../components/icons/ClipboardIcon.svg'
import SettingsIcon from '../../components/icons/SettingsIcon.svg'
import VolumeIcon from '../../components/icons/VolumeIcon.svg'

const inputFocus = ref(false)

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

    <div :class="s.output">
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

      <p :class="s.text">Texto de ejemplo</p>
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
}

/* ----------------------------------- nav ---------------------------------- */
.nav {
  display: flex;
  justify-content: flex-end;
}
</style>
