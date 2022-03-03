<script setup lang="ts">
import { useTextSelection } from '@vueuse/core'

const state = useTextSelection()
</script>

<template>
  <p>selection: {{ state.text }}</p>
</template>
