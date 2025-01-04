import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './HomeView.vue'
import AboutView from './AboutView.vue'

const routes = [
    { path: '/', component: () => import('../views/index.vue') },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router
