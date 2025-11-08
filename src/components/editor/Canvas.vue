<template>
  <div
    ref="canvasContainerRef"
    class="canvas-container relative h-full w-full overflow-auto bg-background-light dark:bg-background-dark"
    @mousedown="handleMouseDown"
  >
    <!-- 网格控制面板 -->
    <GridControls />

    <!-- 缩放控制面板 -->
    <ZoomControls
      :zoom-level="zoomLevel"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
      @reset-zoom="resetZoom"
      @fit-to-screen="fitToScreen"
    />

    <!-- 画布居中容器 -->
    <div class="flex items-center justify-center h-full w-full">
      <div
        class="canvas-wrapper relative"
        :style="{
          width: canvasWidth + 'px',
          height: canvasHeight + 'px',
          transform: `scale(${zoomLevel})`,
          transformOrigin: '0 0'
        }"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
      >
      <!-- 网格背景 -->
      <div
        v-if="showGrid"
        class="grid-background absolute inset-0"
        :style="{
          backgroundImage: gridPattern,
          backgroundSize: gridSize + 'px ' + gridSize + 'px'
        }"
      ></div>

      <!-- 画布内容区域 -->
      <div
        class="canvas-content relative h-full w-full"
        @drop="handleDrop"
        @dragover="handleDragOver"
      >
        <!-- 空状态显示 -->
        <div
          v-if="!hasComponents"
          class="flex h-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-[#15202B]/50 p-6"
        >
          <div class="flex max-w-[480px] flex-col items-center gap-2">
            <span class="material-symbols-outlined text-5xl text-primary">add_circle</span>
            <p class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">
              Start building your application
            </p>
            <p class="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal text-center">
              Drag and drop a component from the left panel to get started.
            </p>
          </div>
          <button
            @click="$emit('browse-components')"
            class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <span class="truncate">Browse Components</span>
          </button>
        </div>

        <!-- 组件渲染区域 -->
        <div
          v-else
          class="components-layer relative h-full w-full"
        >
          <!-- 组件将在这里渲染 -->
        </div>

        <!-- 辅助线层 -->
        <div
          v-if="guideLines.length > 0"
          class="guide-lines-layer absolute inset-0 pointer-events-none"
        >
          <div
            v-for="(line, index) in guideLines"
            :key="index"
            :class="[
              'guide-line absolute bg-primary/50',
              line.type === 'vertical' ? 'w-0.5 h-full' : 'h-0.5 w-full'
            ]"
            :style="{
              left: line.type === 'vertical' ? line.position + 'px' : '0',
              top: line.type === 'horizontal' ? line.position + 'px' : '0'
            }"
          ></div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import GridControls from './GridControls.vue'
import ZoomControls from './ZoomControls.vue'

// 组件属性
interface Props {
  canvasWidth?: number
  canvasHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  canvasWidth: 1920,
  canvasHeight: 1080
})

// 事件
const emit = defineEmits<{
  'browse-components': []
  'zoom-changed': [zoom: number]
}>()

// Store
const canvasStore = useCanvasStore()

// Refs
const canvasContainerRef = ref<HTMLElement | null>(null)

// 画布状态
const zoomLevel = ref(1)
const isPanning = ref(false)
const lastPanPoint = ref({ x: 0, y: 0 })
const guideLines = ref<Array<{ type: 'vertical' | 'horizontal'; position: number }>>([])

// 计算属性
const showGrid = computed(() => canvasStore.showGrid)
const gridSize = computed(() => canvasStore.gridSize)
const snapToGrid = computed(() => canvasStore.snapToGrid)
const device = computed(() => canvasStore.device)
const hasComponents = ref(false) // TODO: 从组件树store获取

const canvasWidth = computed(() => {
  // 根据设备类型调整画布宽度
  if (device.value === 'desktop') return 1920
  if (device.value === 'tablet') return 768
  return 375
})

const canvasHeight = computed(() => {
  // 根据设备类型调整画布高度
  if (device.value === 'desktop') return 1080
  if (device.value === 'tablet') return 1024
  return 667
})

// 网格图案
const gridPattern = computed(() => {
  const size = gridSize.value
  return `
    linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
  `
})

// 方法
const handleMouseDown = (e: MouseEvent) => {
  // 只在按住空格键时平移
  if (e.button === 0 && e.ctrlKey) {
    isPanning.value = true
    lastPanPoint.value = { x: e.clientX, y: e.clientY }
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (isPanning.value) {
    const deltaX = e.clientX - lastPanPoint.value.x
    const deltaY = e.clientY - lastPanPoint.value.y

    if (canvasContainerRef.value) {
      canvasContainerRef.value.scrollLeft -= deltaX
      canvasContainerRef.value.scrollTop -= deltaY
    }

    lastPanPoint.value = { x: e.clientX, y: e.clientY }
  }
}

const handleMouseUp = () => {
  isPanning.value = false
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  // TODO: 处理组件放置
  console.log('Component dropped on canvas')
}

// 公共方法
const zoomIn = () => {
  const newZoom = Math.min(2, zoomLevel.value + 0.1)
  zoomLevel.value = newZoom
  emit('zoom-changed', newZoom)
}

const zoomOut = () => {
  const newZoom = Math.max(0.25, zoomLevel.value - 0.1)
  zoomLevel.value = newZoom
  emit('zoom-changed', newZoom)
}

const resetZoom = () => {
  zoomLevel.value = 1
  emit('zoom-changed', zoomLevel.value)
}

const fitToScreen = () => {
  if (!canvasContainerRef.value) return

  const container = canvasContainerRef.value
  const containerWidth = container.clientWidth - 40 // 减去padding
  const containerHeight = container.clientHeight - 40

  const scaleX = containerWidth / canvasWidth.value
  const scaleY = containerHeight / canvasHeight.value
  const newZoom = Math.min(scaleX, scaleY, 1)

  zoomLevel.value = newZoom
  emit('zoom-changed', newZoom)

  // 居中画布
  setTimeout(() => {
    if (canvasContainerRef.value) {
      const canvasWrapper = canvasContainerRef.value.querySelector('.canvas-wrapper') as HTMLElement
      if (canvasWrapper) {
        const left = (containerWidth - canvasWidth.value * newZoom) / 2
        const top = (containerHeight - canvasHeight.value * newZoom) / 2
        container.scrollLeft = left
        container.scrollTop = top
      }
    }
  }, 0)
}

const toggleGrid = () => {
  canvasStore.toggleGrid()
}

const setGridSize = (size: number) => {
  canvasStore.setGridSize(size)
}

const toggleSnapToGrid = () => {
  canvasStore.toggleSnapToGrid()
}

// 暴露方法
defineExpose({
  zoomIn,
  zoomOut,
  resetZoom,
  fitToScreen,
  toggleGrid,
  setGridSize,
  toggleSnapToGrid,
  zoomLevel
})

// 生命周期
onMounted(() => {
  // 初始缩放适应屏幕
  setTimeout(() => {
    fitToScreen()
  }, 100)
})

onUnmounted(() => {
  // 清理
})
</script>

<style scoped>
.canvas-container {
  cursor: grab;
}

.canvas-container:active {
  cursor: grabbing;
}

.grid-background {
  pointer-events: none;
}

.guide-lines-layer {
  z-index: 100;
}

.guide-line {
  animation: guideLineFadeIn 0.3s ease-out;
}

@keyframes guideLineFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.5;
  }
}
</style>
