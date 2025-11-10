/**
 * 组件库类型定义
 */

export type UILibrary = 'element-plus' | 'ant-design' | 'naive-ui'

export type ComponentCategory =
  | 'layout'
  | 'form'
  | 'data'
  | 'feedback'
  | 'navigation'
  | 'basic'

/**
 * 组件属性定义
 */
export interface ComponentProp {
  name: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'object' | 'array'
  default?: any
  label: string
  description?: string
  options?: { label: string; value: any }[]
  required?: boolean
}

/**
 * 组件事件定义
 */
export interface ComponentEvent {
  name: string
  label: string
  description?: string
}

/**
 * 组件样式定义
 */
export interface ComponentStyle {
  category: 'layout' | 'typography' | 'color' | 'border' | 'shadow' | 'effect'
  properties: string[]
}

/**
 * 组件元数据
 */
export interface ComponentMeta {
  id: string
  name: string
  type: string
  category: ComponentCategory
  library: UILibrary
  icon: string
  description?: string
  tags: string[]
  props: ComponentProp[]
  events: ComponentEvent[]
  styles: ComponentStyle[]
  /** 预览图或图标 */
  thumbnail?: string
  /** 是否为容器组件（可包含子组件） */
  isContainer?: boolean
  /** 允许的子组件类型 */
  allowChildren?: string[]
  /** 默认子组件 */
  defaultChildren?: string[]
}

/**
 * 组件树节点
 */
export interface ComponentNode {
  id: string
  type: string
  library: UILibrary
  name: string
  props: Record<string, any>
  styles: Record<string, any>
  children?: ComponentNode[]
  events?: Record<string, Function>
  parentId?: string
  order?: number
  /** 是否允许调整大小 */
  canResize?: boolean
}

/**
 * 组件库配置
 */
export interface ComponentLibraryConfig {
  name: string
  library: UILibrary
  components: ComponentMeta[]
  version: string
}

/**
 * 拖拽数据
 */
export interface DragComponentData {
  type: 'component'
  component: ComponentMeta
  offset?: { x: number; y: number }
}

/**
 * 组件面板显示模式
 */
export type PanelDisplayMode = 'grid' | 'list'

/**
 * 组件面板过滤器
 */
export interface ComponentFilter {
  category?: ComponentCategory
  library?: UILibrary
  search?: string
  tags?: string[]
}