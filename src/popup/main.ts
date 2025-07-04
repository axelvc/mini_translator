import { createApp } from 'vue'
import { useTheme } from '@/composables/useTheme'
import VPopup from './VPopup.vue'
import '@/style.scss'

useTheme()
createApp(VPopup).mount('#app')
