import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', name: 'login', component: () => import('@/views/login')},
  { path: '/register', name: 'register', component: () => import('@/views/register')},
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/home')
  },
  { path: '/move',
    name: 'move',
    component: () => import('@/views/move')
  },
  { path: '/404', component: () => import('@/views/404') },
  { path: '*', redirect: '/404' }
]

export default new Router({
  routes: constantRouterMap
})
