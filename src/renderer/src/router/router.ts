import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
    { path: '/', component: () => import('../views/home/index.vue') },
    // { path: '/setting', component: () => import('../views/setting/index.vue') },
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export default router
