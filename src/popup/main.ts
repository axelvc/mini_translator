import { createApp } from 'vue'
import { useTheme } from '@/composables/useTheme'
import Popup from './Popup.vue'
import '@/style.scss'

useTheme()
createApp(Popup).mount('#app')
