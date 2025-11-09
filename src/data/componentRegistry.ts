/**
 * 组件注册表
 * 将组件类型映射到实际的UI库组件
 */

import type { Component as VueComponent, ComponentPropsOptions } from 'vue'
import {
  ElButton,
  ElInput,
  ElCard,
  ElContainer,
  ElMain,
  ElAside,
  ElFooter,
  ElHeader,
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
  component: VueComponent
  props?: ComponentPropsOptions
  setup?: (props: any) => Record<string, any>
}

// 组件注册表
export const COMPONENT_REGISTRY: Record<string, ComponentRenderer> = {
  // 基础组件
  'Text': {
    component: {
      name: 'DynamicText',
      props: {
        content: { type: String, default: '文本内容' },
        tag: { type: String, default: 'p' },
        fontSize: { type: Number, default: 14 },
        fontWeight: { type: [String, Number], default: 'normal' }
      },
      setup(props: any) {
        return () => {
          const Tag = props.tag || 'p'
          return (
            <Tag style={{
              fontSize: `${props.fontSize}px`,
              fontWeight: props.fontWeight,
              margin: 0,
              padding: 0
            }}>
              {props.content}
            </Tag>
          )
        }
      }
    }
  },

  'Button': {
    component: ElButton,
    props: {
      text: { type: String, default: '按钮' },
      type: { type: String, default: 'primary' },
      size: { type: String, default: 'default' },
      disabled: { type: Boolean, default: false },
      loading: { type: Boolean, default: false }
    },
    setup(props: any, { slots, attrs }: any) {
      return () => {
        return (
          <ElButton
            type={props.type}
            size={props.size}
            disabled={props.disabled}
            loading={props.loading}
            {...attrs}
          >
            {props.text}
          </ElButton>
        )
      }
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
    component: ElSelect,
    props: {
      placeholder: { type: String, default: '请选择' },
      multiple: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      clearable: { type: Boolean, default: true }
    },
    setup(props: any) {
      return () => {
        return (
          <ElSelect
            placeholder={props.placeholder}
            multiple={props.multiple}
            disabled={props.disabled}
            clearable={props.clearable}
          >
            <ElOption label="选项1" value="option1" />
            <ElOption label="选项2" value="option2" />
            <ElOption label="选项3" value="option3" />
          </ElSelect>
        )
      }
    }
  },

  // 导航组件
  'Tabs': {
    component: ElTabs,
    props: {
      type: { type: String, default: 'text' },
      position: { type: String, default: 'top' }
    },
    setup(props: any) {
      return () => {
        return (
          <ElTabs type={props.type} position={props.position}>
            <ElTabPane label="标签页1" name="first">
              <div style="padding: 20px;">内容1</div>
            </ElTabPane>
            <ElTabPane label="标签页2" name="second">
              <div style="padding: 20px;">内容2</div>
            </ElTabPane>
          </ElTabs>
        )
      }
    }
  },

  // 数据组件
  'Table': {
    component: ElTable,
    props: {
      columns: { type: Array, default: () => [] },
      data: { type: Array, default: () => [] },
      stripe: { type: Boolean, default: false },
      border: { type: Boolean, default: true },
      highlightCurrentRow: { type: Boolean, default: true }
    },
    setup(props: any) {
      const tableData = props.data.length > 0 ? props.data : [
        { name: '张三', age: 24, address: '北京' },
        { name: '李四', age: 25, address: '上海' },
        { name: '王五', 26, address: '广州' }
      ]

      const columns = props.columns.length > 0 ? props.columns : [
        { prop: 'name', label: '姓名' },
        { prop: 'age', label: '年龄' },
        { prop: 'address', label: '地址' }
      ]

      return () => {
        return (
          <ElTable
            data={tableData}
            stripe={props.stripe}
            border={props.border}
            highlightCurrentRow={props.highlightCurrentRow}
          >
            {columns.map((col: any) => (
              <ElTableColumn prop={col.prop} label={col.label} />
            ))}
          </ElTable>
        )
      }
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
