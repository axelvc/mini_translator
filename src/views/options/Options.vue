<script setup lang="ts">
import VSelect from '../../components/VSelect.vue'
import VSwitch from '../../components/VSwitch.vue'
</script>

<template>
  <main>
    <h1>Options</h1>

    <section>
      <h2>General</h2>
      <ul class="list">
        <li>
          <label class="option">
            <span class="name">First language</span>
            <VSelect :options="['option 1', 'option 2', 'option 3']" />
          </label>
        </li>
        <li>
          <label class="option">
            <span class="name">Second language</span>
            <VSelect :options="['option 1', 'option 2', 'option 3']" />
          </label>
        </li>
        <li>
          <label class="option">
            <span class="name">Theme</span>
            <VSelect :options="['option 1', 'option 2', 'option 3']" />
          </label>
        </li>
        <li>
          <label class="option">
            <span class="name">Font size</span>
            <VSelect :options="['option 1', 'option 2', 'option 3']" />
          </label>
        </li>
      </ul>
    </section>

    <section>
      <h2>Toolbar translation</h2>
      <ul class="list">
        <li>
          <label class="option">
            <span class="name">Waiting time to translate</span>
            <input class="input" type="number" placeholder="500" />
          </label>
        </li>
      </ul>
    </section>

    <section>
      <h2>Floating translation</h2>
      <ul class="list">
        <li>
          <label class="option">
            <span class="name">Mode</span>
            <VSelect :options="['option 1', 'option 2', 'option 3']" />
          </label>
        </li>
        <li>
          <label class="option">
            <span class="name">Position</span>
            <VSelect :options="['option 1', 'option 2', 'option 3']" />
          </label>
        </li>
        <li>
          <label class="option">
            <span class="name">Offset</span>
            <input class="input" type="number" placeholder="10" />
          </label>
        </li>
        <li>
          <label class="option">
            <span class="name">Max width</span>
            <input class="input" type="number" placeholder="full" />
          </label>
        </li>
        <li>
          <label class="option">
            <span class="name">Max height</span>
            <input class="input" type="number" placeholder="full" />
          </label>
        </li>
        <li>
          <label class="option inline">
            <span class="name">Hide in my languages</span>
            <VSwitch />
          </label>
        </li>
      </ul>
    </section>

    <section>
      <h2>Context menu options</h2>
      <ul class="list">
        <li>
          <label class="option inline">
            <span class="name">Translate this page</span>
            <VSwitch />
          </label>
        </li>
        <li>
          <label class="option inline">
            <span class="name">Translate selected text</span>
            <VSwitch />
          </label>
        </li>
      </ul>
    </section>

    <section>
      <h2>Exclusion</h2>
      <ul class="list">
        <li>
          <label class="option">
            <span class="name">Languages</span>
            <input class="input" type="text" />
          </label>
        </li>
        <li>
          <label class="option">
            <span class="name">Pages</span>
            <textarea class="input" />
          </label>
        </li>

        <li>
          <label class="option">
            <span class="name">First language</span>
            <VSelect :options="['option 1', 'option 2', 'option 3']" />
          </label>
        </li>
      </ul>
    </section>
  </main>
</template>

<style lang="scss">
main {
  display: grid;
  gap: var(--s-xl);
  max-width: 25rem;
  margin: 3rem 8rem;
  font-size: 1rem;
}

h1 {
  font-size: 3rem;
}

h2 {
  font-size: 1.5rem;
}

input[type='number'] {
  padding-right: 0;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    padding: var(--s-xs);
    margin-right: var(--s-xs);
    height: 1em;
  }
}

textarea {
  height: 8rem;
  resize: vertical;
}

section {
  display: grid;
  gap: var(--s-md);
}

.input {
  min-height: 2.5rem;
  padding: var(--s-sm);
}

.list {
  position: relative;
  display: grid;
  gap: var(--s-lg);
  padding-left: var(--s-lg);
  margin-left: var(--s-xs);
  list-style: none;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 0.3125rem;
    background: var(--c-input-alt);
    border-radius: 99em;
  }
}

.option {
  display: grid;
  gap: var(--s-xs);

  &.inline {
    display: flex;
    gap: var(--s-xs);
    align-items: center;
    justify-content: space-between;
    height: 2.5rem;
  }

  .name {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--c-label);
  }
}
</style>
