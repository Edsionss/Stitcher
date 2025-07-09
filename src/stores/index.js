import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
// import { WorkspaceHeader } from '@config/index'
import utils from '@utils/index'
const SYSTEM_STORE = () => {
  const deviceMode = ref({}), // 设备模式
    activeComponent = reactive({}), // 当前激活的组件
    pageSchema = reactive([]), // 页面结构
    activeAttributes = reactive({}), // 当前组件属性
    modeStyle = reactive({}) // 当前设备模式样式
  // 监听设备模式计算样式
  watch(deviceMode.value, (newValue, oldValue) => {
    Object.assign(modeStyle, utils.calculationCanvasModeStyle(newValue))
  })

  return { deviceMode, activeComponent, pageSchema, activeAttributes, modeStyle }
}
export const useSystemStore = defineStore('system', SYSTEM_STORE)
