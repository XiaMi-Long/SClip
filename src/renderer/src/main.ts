import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import { MotionPlugin } from '@vueuse/motion'


const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(MotionPlugin)
app.mount('#app')
