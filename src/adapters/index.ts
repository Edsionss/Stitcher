// UI库类型定义
export type UIType = 'element-plus' | 'ant-design' | 'naive-ui'

// 组件配置接口
export interface ComponentAdapter {
  library: UIType
  name: string
  componentMap: Map<string, any>
  themeConfig?: Record<string, any>
}

// 组件注册接口
export interface ComponentRegistry {
  registerComponent(type: string, component: any): void
  getComponent(type: string): any
  getAllComponents(): Map<string, any>
}

// 主题配置接口
export interface ThemeConfig {
  primary: string
  darkMode: boolean
  customColors?: Record<string, string>
}
