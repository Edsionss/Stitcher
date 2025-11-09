<template>
  <div
    class="canvas-component-wrapper absolute cursor-move"
    :style="{
      left: component.styles?.left || '0px',
      top: component.styles?.top || '0px',
      width: component.styles?.width || '100px',
      height: component.styles?.height || '50px',
      zIndex: component.styles?.zIndex || 1,
      ...componentStyles
    }"
    :class="{
      'ring-2 ring-primary': isSelected,
      'ring-1 ring-transparent hover:ring-slate-300 dark:hover:ring-slate-600': !isSelected
    }"
    @click.stop="handleComponentClick"
    @mousedown.stop="handleMouseDown"
  >
    <!-- 调整大小的手柄 -->
    <div
      v-if="isSelected"
      class="absolute bottom-0 right-0 w-4 h-4 bg-primary rounded-bl cursor-se-resize"
      @mousedown.stop="handleResizeStart"
    ></div>

    <!-- 组件名称标签 -->
    <div class="absolute -top-6 left-0 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
      {{ component.name }}
    </div>

    <!-- 组件内容 - 使用ComponentRenderer渲染真实组件 -->
    <component-renderer
      :node="component"
      :selected="isSelected"
      @select="handleRendererSelect"
      @move-start="handleMouseDown"
      @resize-start="handleResizeStart"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEditorStore } from '@/stores/editor'
import ComponentRenderer from './ComponentRenderer.vue'
import type { ComponentNode } from '@/types/component'

interface Props {
  component: ComponentNode
  isSelected?: boolean
  scale?: number
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
  scale: 1
})

const emit = defineEmits<{
  select: [id: string, multiSelect: boolean]
  'move-start': [e: MouseEvent]
  'resize-start': [e: MouseEvent]
}>()

const editorStore = useEditorStore()

const componentStyles = computed(() => {
  const styles: Record<string, any> = {}

  // 添加其他样式
  if (props.component.styles) {
    Object.entries(props.component.styles).forEach(([key, value]) => {
      if (!['left', 'top', 'width', 'height', 'position', 'zIndex'].includes(key)) {
        styles[key] = value
      }
    })
  }

  return styles
})

const handleComponentClick = (e: MouseEvent) => {
  const multiSelect = e.ctrlKey || e.metaKey
  emit('select', props.component.id, multiSelect)
  editorStore.selectComponent(props.component.id, multiSelect)
}

// 处理ComponentRenderer的select事件
const handleRendererSelect = (id: string, multiSelect: boolean) => {
  emit('select', id, multiSelect)
  editorStore.selectComponent(id, multiSelect)
}

const handleMouseDown = (e: MouseEvent) => {
  emit('move-start', e)
}

const handleResizeStart = (e: MouseEvent) => {
  emit('resize-start', e)
}

defineExpose({
  handleComponentClick
})
</script>

<style scoped>
.canvas-component-wrapper {
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
}

.dark .canvas-component-wrapper {
  background: rgba(30, 30, 30, 0.8);
}
</style>
