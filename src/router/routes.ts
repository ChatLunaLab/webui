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
  },
  {
    path: '/c/:conversationId',
    name: 'c',
    component: () => import('../pages/HomePage.vue')
  },
  {
    path: '/workspace',
    name: 'workspace',
    component: () => import('../pages/Workspace.vue'),
    children: [
      {
        path: 'assistant',
        name: 'assistant',
        component: () => import('../pages/workspace/AssistantPage.vue')
      },
      {
        path: 'knowledge',
        name: 'knowledge',
        component: () => import('../pages/workspace/knowledge/index.vue')
      },
      {
        path: 'knowledge/edit/:id',
        name: 'knowledge-edit',
        component: () => import('../pages/workspace/knowledge/edit/id.vue')
      },
      {
        path: 'workflow',
        name: 'workflow',
        component: () => import('../pages/workspace/WorkflowPage.vue')
      },
      {
        path: 'tools',
        name: 'tools',
        component: () => import('../pages/workspace/ToolsPage.vue')
      },
      {
        path: '*',
        redirect: '/'
      }
    ]
  }
]
