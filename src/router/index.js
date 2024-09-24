import { createRouter, createWebHistory } from 'vue-router'
import { useUserJwtStore } from '@/stores'
import { ElMessage } from 'element-plus'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      component: () => import('@/views/login/LoginPage.vue')
    },
    {
      path: '/reset/password',
      name: 'ResetPasswordPage',
      component: () => import('@/views/login/ResetPswd.vue')
    },
    {
      path: '/',
      name: 'LayoutContainer',
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          name: 'ArticleManage',
          component: () => import('@/views/article/ArticleManage.vue')
        },
        {
          path: '/article/channel',
          name: 'ArticleChannel',
          component: () => import('@/views/article/ArticleChannel.vue')
        },
        {
          path: '/user/profile',
          name: 'UserProfile',
          component: () => import('@/views/user/UserProfile.vue')
        },
        {
          path: '/user/avatar',
          name: 'UserAvatar',
          component: () => import('@/views/user/UserAvatar.vue')
        },
        {
          path: 'user/password',
          name: 'UserPassword',
          component: () => import('@/views/user/UserPassword.vue')
        }
      ]
    }
  ]
})

// 创建全局前置守卫
router.beforeEach((to) => {
  const userJwtStore = useUserJwtStore()
  // 定义一个数组，存放可以无权限进入的页面
  const whiteList = ['LoginPage', 'ResetPasswordPage']
  // 判断当前将要进入的页面是否为登录页面以外的页面
  if (!userJwtStore.jwt && !userJwtStore.sessionJwt && !whiteList.includes(to.name)) {
    ElMessage.error('请先登录')
    return { name: 'LoginPage' }
  } else {
    return true
  }
})

export default router
