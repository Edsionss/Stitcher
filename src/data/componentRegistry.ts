/**
 * 组件注册表
 * 将组件类型映射到实际的UI库组件
 */

import type { Component as VueComponent, ComponentPropsOptions, DefineComponent } from 'vue'
import { h } from 'vue'
import {
  ElButton,
  ElInput,
  ElCard,
  ElContainer,
  ElSelect,
  ElOption,
  ElTabs,
  ElTabPane,
  ElTable,
  ElTableColumn,
  ElAlert,
  ElImage
} from 'element-plus'

// 组件渲染函数类型
export type ComponentRenderer = {
  component: VueComponent | DefineComponent
  props?: ComponentPropsOptions
}

// 动态文本组件
const createTextComponent = () => ({
  name: 'DynamicText',
  props: {
    content: { type: String, default: '文本内容' },
    tag: { type: String, default: 'p' },
    fontSize: { type: Number, default: 14 },
    fontWeight: { type: [String, Number], default: 'normal' }
  },
  render(props: any) {
    const Tag = props.tag || 'p'
    return h(Tag, {
      style: {
        fontSize: `${props.fontSize}px`,
        fontWeight: props.fontWeight,
        margin: 0,
        padding: 0
      }
    }, props.content)
  }
}) as any

// 动态按钮组件
const createButtonComponent = () => ({
  name: 'DynamicButton',
  props: {
    text: { type: String, default: '按钮' },
    type: { type: String, default: 'primary' },
    size: { type: String, default: 'default' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  render(props: any) {
    return h(ElButton, {
      type: props.type,
      size: props.size,
      disabled: props.disabled,
      loading: props.loading
    }, {
      default: () => props.text
    })
  }
}) as any

// 动态选择器组件
const createSelectComponent = () => ({
  name: 'DynamicSelect',
  props: {
    placeholder: { type: String, default: '请选择' },
    multiple: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    clearable: { type: Boolean, default: true }
  },
  render(props: any) {
    return h(ElSelect, {
      placeholder: props.placeholder,
      multiple: props.multiple,
      disabled: props.disabled,
      clearable: props.clearable
    }, {
      default: () => [
        h(ElOption, { label: '选项1', value: 'option1' }),
        h(ElOption, { label: '选项2', value: 'option2' }),
        h(ElOption, { label: '选项3', value: 'option3' })
      ]
    })
  }
}) as any

// 动态标签页组件
const createTabsComponent = () => ({
  name: 'DynamicTabs',
  props: {
    type: { type: String, default: 'text' },
    position: { type: String, default: 'top' }
  },
  render(props: any) {
    return h(ElTabs, {
      type: props.type,
      position: props.position
    }, {
      default: () => [
        h(ElTabPane, { label: '标签页1', name: 'first' }, {
          default: () => h('div', { style: 'padding: 20px;' }, '内容1')
        }),
        h(ElTabPane, { label: '标签页2', name: 'second' }, {
          default: () => h('div', { style: 'padding: 20px;' }, '内容2')
        })
      ]
    })
  }
}) as any

// 动态表格组件
const createTableComponent = () => ({
  name: 'DynamicTable',
  props: {
    columns: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    stripe: { type: Boolean, default: false },
    border: { type: Boolean, default: true },
    highlightCurrentRow: { type: Boolean, default: true }
  },
  render(props: any) {
    const tableData = props.data.length > 0 ? props.data : [
      { name: '张三', age: 24, address: '北京' },
      { name: '李四', age: 25, address: '上海' },
      { name: '王五', age: 26, address: '广州' }
    ]

    const columns = props.columns.length > 0 ? props.columns : [
      { prop: 'name', label: '姓名' },
      { prop: 'age', label: '年龄' },
      { prop: 'address', label: '地址' }
    ]

    return h(ElTable, {
      data: tableData,
      stripe: props.stripe,
      border: props.border,
      highlightCurrentRow: props.highlightCurrentRow
    }, {
      default: () => columns.map((col: any) =>
        h(ElTableColumn, { prop: col.prop, label: col.label })
      )
    })
  }
}) as any

// 组件注册表
export const COMPONENT_REGISTRY: Record<string, ComponentRenderer> = {
  // 基础组件
  'Text': {
    component: createTextComponent(),
    props: {
      content: { type: String, default: '文本内容' },
      tag: { type: String, default: 'p' },
      fontSize: { type: Number, default: 14 },
      fontWeight: { type: [String, Number], default: 'normal' }
    }
  },

  'Button': {
    component: createButtonComponent(),
    props: {
      text: { type: String, default: '按钮' },
      type: { type: String, default: 'primary' },
      size: { type: String, default: 'default' },
      disabled: { type: Boolean, default: false },
      loading: { type: Boolean, default: false }
    }
  },

  'Image': {
    component: ElImage,
    props: {
      src: { type: String, default: '' },
      alt: { type: String, default: '' },
      fit: { type: String, default: 'contain' }
    }
  },

  // 布局组件
  'Container': {
    component: ElContainer,
    props: {
      direction: { type: String, default: 'vertical' }
    }
  },

  'Card': {
    component: ElCard,
    props: {
      title: { type: String, default: '' },
      shadow: { type: String, default: 'hover' },
      bodyStyle: { type: Object, default: () => ({}) }
    }
  },

  // 表单组件
  'Input': {
    component: ElInput,
    props: {
      placeholder: { type: String, default: '请输入' },
      type: { type: String, default: 'text' },
      disabled: { type: Boolean, default: false },
      readonly: { type: Boolean, default: false },
      clearable: { type: Boolean, default: true }
    }
  },

  'Select': {
    component: createSelectComponent(),
    props: {
      placeholder: { type: String, default: '请选择' },
      multiple: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      clearable: { type: Boolean, default: true }
    }
  },

  // 导航组件
  'Tabs': {
    component: createTabsComponent(),
    props: {
      type: { type: String, default: 'text' },
      position: { type: String, default: 'top' }
    }
  },

  // 数据组件
  'Table': {
    component: createTableComponent(),
    props: {
      columns: { type: Array, default: () => [] },
      data: { type: Array, default: () => [] },
      stripe: { type: Boolean, default: false },
      border: { type: Boolean, default: true },
      highlightCurrentRow: { type: Boolean, default: true }
    }
  },

  // 反馈组件
  'Alert': {
    component: ElAlert,
    props: {
      title: { type: String, default: '提示' },
      type: { type: String, default: 'info' },
      description: { type: String, default: '' },
      closable: { type: Boolean, default: true },
      showIcon: { type: Boolean, default: true }
    }
  }
}

/**
 * 根据类型获取组件渲染器
 */
export function getComponentRenderer(type: string): ComponentRenderer | null {
  return COMPONENT_REGISTRY[type] || null
}

/**
 * 检查组件类型是否已注册
 */
export function isComponentRegistered(type: string): boolean {
  return type in COMPONENT_REGISTRY
}
