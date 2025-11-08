import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useComponentStore = defineStore('component', () => {
  // State
  const componentLibrary = ref<any[]>([])
  const categories = ref<string[]>([
    '基础组件',
    '布局组件',
    '导航组件',
    '数据录入',
    '数据展示',
    '反馈组件',
    '业务组件'
  ])

  // Actions
  function setComponentLibrary(components: any[]) {
    componentLibrary.value = components
  }

  function addComponent(component: any) {
    componentLibrary.value.push(component)
  }

  function getComponentsByCategory(category: string) {
    return componentLibrary.value.filter(c => c.category === category)
  }

  return {
    // state
    componentLibrary,
    categories,
    // actions
    setComponentLibrary,
    addComponent,
    getComponentsByCategory,
  }
})
