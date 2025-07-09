import { defineStore } from 'pinia'
const SYSTEM_STORE = {
  state: () => ({
    componentAttr: {}, // 当前组件属性
    componentConfig: {}, // 当前组件配置
    componentsList: [], // 当前组件列表
    designMode: ''
  }),
  actions: {},
  mutations: {
    setComponentAttr(state, payload) {
      state.componentAttr = _.cloneDeep(payload)
    },
    setComponentConfig(state, payload) {
      state.componentConfig = _.cloneDeep(payload)
    },
    setComponentsList(state, payload) {
      state.componentsList = _.cloneDeep(payload)
    },
    setDesignMode(state, payload) {
      state.designMode = _.cloneDeep(payload)
    }
  },
  getters: {}
}
export default defineStore(system, SYSTEM_STORE)
