import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
// import { WorkspaceHeader } from '@config/index'
import utils from '@utils/index'

interface DeviceMode {
  [key: string]: any
}

interface ActiveComponent {
  [key: string]: any
}

interface PageSchema {
  [key: string]: any
}

interface ActiveAttributes {
  [key: string]: any
}

interface ModeStyle {
  [key: string]: any
}

const SYSTEM_STORE = () => {
  const deviceMode = ref<DeviceMode>({}), // 设备模式
    activeComponent = reactive<ActiveComponent>({}), // 当前激活的组件
    pageSchema = reactive<PageSchema[]>([]), // 页面结构
    activeAttributes = reactive<ActiveAttributes>({}), // 当前组件属性
    modeStyle = reactive<ModeStyle>({}) // 当前设备模式样式
    
  // 监听设备模式计算样式
  watch(deviceMode.value, (newValue, oldValue) => {
    Object.assign(modeStyle, utils.calculationCanvasModeStyle(newValue))
  })

  return { deviceMode, activeComponent, pageSchema, activeAttributes, modeStyle }
}

export const useSystemStore = defineStore('system', SYSTEM_STORE)