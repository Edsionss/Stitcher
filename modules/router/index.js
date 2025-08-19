//导入组件
import design from '@design/index.js'
import preview from '@preview/index.js'
import previewNext from '@view/previewNext/index.js'
import store from '@modules/store/index.js'

const staticRoutes = [
  {
    path: '/',
    redirect: '/preview'
  },
  {
    path: '/design',
    name: 'design',
    component: design
  },
  {
    path: '/preview',
    name: 'preview',
    component: preview
  },
  {
    path: '/previewNext',
    name: 'previewNext',
    component: previewNext
  }
]
Vue.use(VueRouter)
const router = new VueRouter({
  routes: staticRoutes // (缩写) 相当于 routes: routes
})

router.beforeEach((to, from, next) => {
  store.commit('pushVueHistoryLength')
  next()
})
export default router
