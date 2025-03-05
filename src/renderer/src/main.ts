import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import { MotionPlugin } from '@vueuse/motion'
import MessagePlugin from './components/VMessage'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(MotionPlugin)
app.use(MessagePlugin)
app.mount('#app')
