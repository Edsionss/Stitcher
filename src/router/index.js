// 1. 从 'vue-router' 中导入创建函数，而不是一个类
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

// 导入组件 (建议使用PascalCase命名规范，如 Design 和 Preview)
// import Design from '@design/index'
import Design from '@design/index.vue'
import Preview from '@preview/index.vue'

// 路由配置数组保持不变
const staticRoutes = [
  {
    path: '/',
    redirect: '/design'
  },
  {
    path: '/design',
    name: 'design',
    component: Design // 使用导入的组件
  },
  {
    path: '/preview',
    name: 'preview',
    component: Preview // 使用导入的组件
  }
]
const BASE_URL = import.meta.env.BASE_URL // import.meta.env.BASE_URL 是 Vue CLI 项目中默认的基础 URL
const HashHistory = createWebHashHistory('/') //hash 模式
const WebHistory = createWebHashHistory('/') //history 模式
// 2. 使用 createRouter() 函数创建路由实例
const router = createRouter({
  // 3. 必须提供 history 模式的实现
  history: HashHistory,
  routes: staticRoutes // (缩写) 相当于 routes: routes
})

export default router
