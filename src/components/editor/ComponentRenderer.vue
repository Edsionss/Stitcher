<template>
  <component
    :is="actualComponent"
    v-bind="componentProps"
    v-on="eventHandlers"
    :style="mergedStyles"
  >
    <template v-if="children && children.length > 0">
      <component-renderer
        v-for="child in children"
        :key="child.id"
        :node="child"
        :selected="isChildSelected(child.id)"
        @select="(id, multi) => emit('select', id, multi)"
      />
    </template>
  </component>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { getComponentRenderer } from '@/data/componentRegistry'
import type { ComponentNode } from '@/types/component'

interface Props {
  node: ComponentNode
  selected?: boolean
  scale?: number
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  scale: 1
})

const emit = defineEmits<{
  select: [id: string, multiSelect: boolean]
  'move-start': [e: MouseEvent]
  'resize-start': [e: MouseEvent]
}>()

// 获取组件渲染器
const renderer = computed(() => {
  return getComponentRenderer(props.node.type)
})

// 实际渲染的组件
const actualComponent = computed(() => {
  if (!renderer.value) {
    // 如果未注册，返回默认占位符组件
    return {
      name: 'PlaceholderComponent',
      props: {
        name: { type: String, default: props.node.name },
        type: { type: String, default: props.node.type }
      },
      template: `<div class="placeholder" style="padding: 10px; border: 1px dashed #ccc; text-align: center;">
        {{ name }} ({{ type }})
      </div>`
    }
  }
  return renderer.value.component
})

// 合并props（组件默认props + 节点props）
const componentProps = computed(() => {
  const defaultProps: Record<string, any> = {}
  const nodeProps = props.node.props || {}

  // 直接合并props
  return { ...defaultProps, ...nodeProps }
})

// 事件处理器
const eventHandlers = computed(() => {
  const handlers: Record<string, Function> = {}

  // 绑定节点定义的事件
  if (props.node.events) {
    Object.entries(props.node.events).forEach(([event, handler]) => {
      handlers[event] = handler
    })
  }

  return handlers
})

// 合并样式（组件样式 + 布局样式）
const mergedStyles = computed(() => {
  const styles: Record<string, any> = { ...props.node.styles }

  // 确保有position样式（绝对定位）
  if (!styles.position) {
    styles.position = 'absolute'
  }

  return styles
})

// 子组件
const children = computed(() => {
  return props.node.children || []
})

// 检查子组件是否被选中
function isChildSelected(id: string): boolean {
  // 这里可以基于selected state判断
  return false
}
</script>
