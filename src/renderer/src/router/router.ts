import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/home/index.vue') },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('../views/setting/index.vue'),
    redirect: '/setting/appearance',
    children: [
      {
        path: 'appearance',
        name: 'Theme',
        component: () => import('../views/setting/theme/theme.vue')
      },
      {
        path: 'language',
        name: 'Language',
        component: () => import('../views/setting/language/language.vue')
      },
      {
        path: 'keyboard',
        name: 'Keyboard',
        component: () => import('../views/setting/keyboard/keyboard.vue')
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('../views/setting/log/log.vue')
      },
      {
        path: 'sclip',
        name: 'Sclip',
        component: () => import('../views/setting/sclip/sclip.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
