// 组件库类型
export type ComponentLibrary = 'shadcn' | 'element' | 'antd';

// 组件基础属性
export interface BaseComponentProps {
  // 基础属性
  id?: string;
  type?: string;
  key?: string | number;

  // 样式属性
  style?: Record<string, any>;
  class?: string | Record<string, boolean> | string[];

  // 事件属性
  onClick?: (e: Event) => void;
  onDblclick?: (e: Event) => void;
  onMouseenter?: (e: Event) => void;
  onMouseleave?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;
  onChange?: (e: any) => void;
  onInput?: (e: any) => void;
  onSubmit?: (e: Event) => void;
}

// 组件节点
export interface ComponentNode extends BaseComponentProps {
  id: string;
  type: string;
  library: ComponentLibrary;
  name: string; // 组件显示名称
  category: string; // 组件分类（基础、表单、反馈等）
  icon?: string; // 组件图标
  description?: string; // 组件描述
  props: Record<string, any>;
  children?: ComponentNode[];
  parentId?: string;
  style: Record<string, any>;
  events: Record<string, Function>;
  lifecycle: Record<string, Function>;
  isLocked?: boolean; // 是否锁定
  isHidden?: boolean; // 是否隐藏
  zIndex?: number; // 层级
}

// 组件元数据
export interface ComponentMeta {
  type: string;
  name: string;
  library: ComponentLibrary;
  category: string;
  icon?: string;
  description?: string;
  defaultProps: Record<string, any>;
  propSchema: Record<string, PropSchema>;
  events?: Record<string, EventSchema>;
  children?: boolean; // 是否支持子组件
  editable?: boolean; // 是否可编辑
}

// 属性模式
export interface PropSchema {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'function' | 'color' | 'size' | 'select' | 'textarea';
  default: any;
  label: string;
  description?: string;
  required?: boolean;
  options?: Array<{ label: string; value: any }>;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

// 事件模式
export interface EventSchema {
  label: string;
  description?: string;
  parameters?: Array<{ name: string; type: string }>;
}

// 组件库注册表
export interface ComponentRegistry {
  [library: string]: {
    [category: string]: Record<string, ComponentMeta>;
  };
}

// 组件渲染器
export interface ComponentRenderer {
  (props: any): any;
}

// 组件适配器
export interface ComponentAdapter {
  library: ComponentLibrary;
  componentMap: Record<string, string>; // 内部类型名到实际组件名的映射
  adaptProps: (props: Record<string, any>, componentType: string) => Record<string, any>;
  adaptEvents: (events: Record<string, any>, componentType: string) => Record<string, any>;
  adaptStyles: (styles: Record<string, any>, componentType: string) => Record<string, any>;
}
