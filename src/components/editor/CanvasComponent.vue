<template>
  <div
    ref="componentRef"
    class="canvas-component-wrapper absolute flex flex-col items-center justify-center cursor-move"
    :class="{
      'ring-2 ring-primary': isSelected,
      'border-2 border-dashed border-primary hover:border-solid hover:border-primary': !isSelected
    }"
    :style="{
      left: component.styles?.left || '0px',
      top: component.styles?.top || '0px',
      width: component.styles?.width || '100px',
      height: component.styles?.height || '50px',
      zIndex: component.styles?.zIndex || 1,
      transform: dragTransform,
      ...componentStyles
    }"
    @click.stop="handleComponentClick"
  >
    <!-- 调整大小的手柄 -->
    <template v-if="isSelected">
      <div class="resize-handle top-left"></div>
      <div class="resize-handle top-right"></div>
      <div class="resize-handle bottom-left"></div>
      <div class="resize-handle bottom-right"></div>
      <div class="resize-handle top-center"></div>
      <div class="resize-handle bottom-center"></div>
      <div class="resize-handle left-center"></div>
      <div class="resize-handle right-center"></div>
    </template>

    <!-- 组件名称标签 -->
    <div class="absolute -top-6 left-0 text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
      {{ component.name }}
    </div>

    <!-- 组件内容 - 使用ComponentRenderer渲染真实组件 -->
    <div class="relative z-0">
      <component-renderer
        :node="component"
        :selected="isSelected"
        @select="handleRendererSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import interact from 'interactjs'
import { useEditorStore } from '@/stores/editor'
import { useComponentTreeStore } from '@/stores/componentTree'
import { useCanvasStore } from '@/stores/canvas'
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
}>()

const editorStore = useEditorStore()
const componentTreeStore = useComponentTreeStore()
const canvasStore = useCanvasStore()

const componentRef = ref<HTMLElement | null>(null)
const dragTransform = ref('')

const componentStyles = computed(() => {
  const styles: Record<string, any> = {}
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

const handleRendererSelect = (id: string, multiSelect: boolean) => {
  emit('select', id, multiSelect)
  editorStore.selectComponent(id, multiSelect)
}

onMounted(() => {
  if (!componentRef.value) return

  const interaction = interact(componentRef.value)
  const initialPos = { x: 0, y: 0 }

  interaction.draggable({
    inertia: true,
    modifiers: [
      interact.modifiers.restrictRect({
        restriction: 'parent',
        endOnly: true
      })
    ],
    autoScroll: true,
    listeners: {
      start() {
        initialPos.x = parseFloat(props.component.styles?.left || '0')
        initialPos.y = parseFloat(props.component.styles?.top || '0')
      },
      move(event) {
        // 考虑缩放比例计算实际拖拽距离
        const dx = (event.pageX - event.x0) / props.scale
        const dy = (event.pageY - event.y0) / props.scale

        let targetX = initialPos.x + dx
        let targetY = initialPos.y + dy

        // 对拖拽后的位置进行吸附计算
        if (canvasStore.snapToGrid) {
          targetX = Math.round(targetX / canvasStore.gridSize) * canvasStore.gridSize
          targetY = Math.round(targetY / canvasStore.gridSize) * canvasStore.gridSize
        }

        // transform 使用吸附后的位置与初始位置的差值
        const transformX = targetX - initialPos.x
        const transformY = targetY - initialPos.y

        dragTransform.value = `translate(${transformX}px, ${transformY}px)`
      },
      end(event) {
        // 考虑缩放比例计算最终位置
        let newX = initialPos.x + (event.pageX - event.x0) / props.scale
        let newY = initialPos.y + (event.pageY - event.y0) / props.scale

        if (canvasStore.snapToGrid) {
          newX = Math.round(newX / canvasStore.gridSize) * canvasStore.gridSize
          newY = Math.round(newY / canvasStore.gridSize) * canvasStore.gridSize
        }

        // 先更新位置，然后再清空transform，避免位置跳跃
        componentTreeStore.updateComponent(props.component.id, {
          styles: {
            ...props.component.styles,
            left: `${newX}px`,
            top: `${newY}px`
          }
        })

        // 清空transform，应用新的left/top值
        dragTransform.value = ''
      }
    }
  })

  interaction.resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move(event) {
        const { width, height } = event.rect
        let { left, top } = props.component.styles || { left: '0px', top: '0px' }

        // 考虑缩放比例计算实际位移
        let x = parseFloat(left) + event.deltaRect.left / props.scale
        let y = parseFloat(top) + event.deltaRect.top / props.scale

        if (canvasStore.snapToGrid) {
          x = Math.round(x / canvasStore.gridSize) * canvasStore.gridSize
          y = Math.round(y / canvasStore.gridSize) * canvasStore.gridSize
        }

        // 尺寸也需要考虑缩放比例
        const scaledWidth = width / props.scale
        const scaledHeight = height / props.scale

        componentTreeStore.updateComponent(props.component.id, {
          styles: {
            ...props.component.styles,
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
            left: `${x}px`,
            top: `${y}px`
          }
        })
      }
    },
    modifiers: [
      interact.modifiers.restrictSize({
        min: { width: 50, height: 30 }
      })
    ],
    inertia: true
  })

  watch(() => props.isSelected, (selected) => {
    if (selected) {
      interaction.draggable(true)
      // 只有在 canResize 为 true 时才启用调整大小
      if (props.component.canResize !== false) {
        interaction.resizable(true)
      }
    } else {
      // 取消选择时禁用调整大小，拖拽功能保持启用
      interaction.resizable(false)
    }
  }, { immediate: true })

  // 监听 canResize 属性的变化
  watch(() => props.component.canResize, (canResize) => {
    if (props.isSelected) {
      if (canResize !== false) {
        interaction.resizable(true)
      } else {
        interaction.resizable(false)
      }
    }
  })
})

defineExpose({
  handleComponentClick
})
</script>

<style scoped>
.canvas-component-wrapper {
  border-radius: 4px;
  transition: all 0.2s ease;
}

.resize-handle {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: #fff;
  border: 1px solid #3b82f6;
  border-radius: 2px;
  z-index: 10;
}
.top-left { top: -5px; left: -5px; cursor: nwse-resize; }
.top-right { top: -5px; right: -5px; cursor: nesw-resize; }
.bottom-left { bottom: -5px; left: -5px; cursor: nesw-resize; }
.bottom-right { bottom: -5px; right: -5px; cursor: nwse-resize; }
.top-center { top: -5px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
.bottom-center { bottom: -5px; left: 50%; transform: translateX(-50%); cursor: ns-resize; }
.left-center { top: 50%; left: -5px; transform: translateY(-50%); cursor: ew-resize; }
.right-center { top: 50%; right: -5px; transform: translateY(-50%); cursor: ew-resize; }
</style>
