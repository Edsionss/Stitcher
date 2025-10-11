import { defineStore } from 'pinia'

interface SystemStoreState {
  componentAttr: any // 当前组件属性
  componentConfig: any // 当前组件配置
  componentsList: any[] // 当前组件列表
  designMode: string
}

const SYSTEM_STORE = {
  state: (): SystemStoreState => ({
    componentAttr: {}, // 当前组件属性
    componentConfig: {}, // 当前组件配置
    componentsList: [], // 当前组件列表
    designMode: ''
  }),
  actions: {},
  mutations: {
    setComponentAttr(state: SystemStoreState, payload: any) {
      state.componentAttr = _.cloneDeep(payload)
    },
    setComponentConfig(state: SystemStoreState, payload: any) {
      state.componentConfig = _.cloneDeep(payload)
    },
    setComponentsList(state: SystemStoreState, payload: any[]) {
      state.componentsList = _.cloneDeep(payload)
    },
    setDesignMode(state: SystemStoreState, payload: string) {
      state.designMode = _.cloneDeep(payload)
    }
  },
  getters: {}
}

export default defineStore('system', SYSTEM_STORE)