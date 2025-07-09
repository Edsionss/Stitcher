//导入vue的构造函数
import { createApp } from 'vue'

//引入全局样式
import '@assets/style/main.css'

//引入路由
import router from './router'

//引入pinia
import { createPinia } from 'pinia'

//引入antd
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

//引入element-plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入element-plus的图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//引入wotd...

//引入主组件
import App from './App.vue'

//创建pinia
const pinia = createPinia()

const app = createApp(App)
//挂载路由
app.use(router)

//挂载pinia
app.use(pinia)

//挂载antd
app.use(Antd)

//挂载element-plus
app.use(ElementPlus, {
  locale: zhCn
})
//挂载element-plus的图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//挂载app
app.mount('#app')
