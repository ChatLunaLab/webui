import type { RouteRecordRaw } from 'vue-router'


export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => {
      return '/home'
    }
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../pages/HomePage.vue')
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../pages/AuthPage.vue')
  }
]
