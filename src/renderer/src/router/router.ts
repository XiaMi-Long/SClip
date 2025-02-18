import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
    { path: '/', component: () => import('../views/home/index.vue') },
    { path: '/setting', component: () => import('../views/setting/index.vue') },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
