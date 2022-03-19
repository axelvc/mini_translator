import { createApp } from 'vue'
import { updateTheme } from '@/utils'
import Popup from './Popup.vue'
import '@/style.scss'

updateTheme()
createApp(Popup).mount('#app')
