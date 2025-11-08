import type { UIType } from './index'
import ElementPlusAdapter from './element-plus'
import AntDesignAdapter from './ant-design'
import NaiveUIAdapter from './naive-ui'

class UIManager {
  private currentUI: UIType = 'element-plus'
  private adapters: Map<UIType, any> = new Map()

  constructor() {
    this.adapters.set('element-plus', ElementPlusAdapter)
    this.adapters.set('ant-design', AntDesignAdapter)
    this.adapters.set('naive-ui', NaiveUIAdapter)
  }

  // 切换UI库
  switchUI(uiType: UIType, app: any) {
    this.currentUI = uiType
    const adapter = this.adapters.get(uiType)
    
    if (adapter) {
      if (uiType === 'naive-ui') {
        adapter.createNaive(app)
      } else {
        adapter.install(app)
      }
    }
  }

  // 获取当前UI类型
  getCurrentUI(): UIType {
    return this.currentUI
  }

  // 获取当前适配器
  getCurrentAdapter() {
    return this.adapters.get(this.currentUI)
  }

  // 获取所有支持的UI库
  getSupportedUI(): UIType[] {
    return Array.from(this.adapters.keys())
  }
}

export const uiManager = new UIManager()
export default uiManager
