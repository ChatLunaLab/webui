import type { RouteRecordRaw } from 'vue-router'

export const routes : RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => {
      // TODO: Redirect to login, ...
      return "/home"
    }
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/HomeView.vue")
  }
]
