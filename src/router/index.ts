import { createRouter, createWebHistory } from 'vue-router'
import DesignEditor from '../components/DesignEditor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'designer',
      component: DesignEditor,
    },
  ],
})

export default router
