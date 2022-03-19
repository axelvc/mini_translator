import { createApp } from 'vue'
import { updateTheme } from '@/utils'
import Options from './Options.vue'
import '@/style.scss'

updateTheme()
createApp(Options).mount('#app')
