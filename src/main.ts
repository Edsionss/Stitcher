import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import uiManager from './adapters/ui-manager'

const app = createApp(App)
const pinia = createPinia()

// 初始化默认UI库 (Element Plus)
uiManager.switchUI('element-plus', app)

app.use(pinia)
app.use(router)

app.mount('#app')
