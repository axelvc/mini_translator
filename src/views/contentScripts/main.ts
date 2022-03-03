import { createApp } from 'vue'
import ContentScripts from './ContentScripts.vue'

const root = document.createElement('div')

document.body.append(root)
createApp(ContentScripts).mount(root)
