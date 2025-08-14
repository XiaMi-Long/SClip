import { createWebHashHistory, createRouter } from 'vue-router'
import Home from '../views/home/index.vue'
import SettingIndex from '../views/setting/index.vue'

const routes = [
  { path: '/', component: Home },
  {
    path: '/setting',
    name: 'setting',
    component: SettingIndex,
    redirect: '/setting/theme',
    children: [
      {
        path: 'theme',
        name: 'Theme',
        component: () => import('../views/setting/theme/theme.vue')
      },
      {
        path: 'cardStyle',
        name: 'CardStyle',
        component: () => import('../views/setting/card-style/card-style.vue')
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
      },
      {
        path: 'fun',
        name: 'Fun',
        component: () => import('../views/setting/fun/fun.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/setting/about/about.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
