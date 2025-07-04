import { createApp } from 'vue'
import { useTheme } from '@/composables/useTheme'
import Options from './Options.vue'
import '@/style.scss'

useTheme()
createApp(Options).mount('#app')
