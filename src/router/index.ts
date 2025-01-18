import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { routes } from './routes'
import { useLoginData } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...routes]
})

router.beforeEach((to, from, next) => {
  const loginInfo = useLoginData()
  if (to.path !== '/auth' && loginInfo.loginData.accessToken === '') {
    next('/auth')
  } else {
    next()
  }
})

export default router
