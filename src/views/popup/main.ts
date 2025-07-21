import { createApp } from 'vue'
import { useTheme } from '@/composables/useTheme'
import Popup from './VPopup.vue'
import '@/style.scss'

useTheme()
createApp(Popup).mount('#app')
