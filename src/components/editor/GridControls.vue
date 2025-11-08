<template>
  <div class="grid-controls">
    <!-- 工具栏切换按钮 - 固定位置 -->
    <button
      @click="toggleExpanded"
      class="toolbar-toggle flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#15202B] border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      title="网格和画布设置"
    >
      <span class="material-symbols-outlined text-lg">tune</span>
      <span class="text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">设置</span>
    </button>

    <!-- 展开的工具栏面板 - 向左展开，不移动按钮 -->
    <div
      v-show="isExpanded"
      class="toolbar-panel absolute right-0 top-full mt-2 flex flex-col gap-2 bg-white dark:bg-[#15202B] border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-lg"
    >
      <!-- 网格设置 -->
      <div class="flex items-center gap-2">
        <button
          @click="toggleGrid"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors text-sm font-medium',
            {
              'bg-primary text-white': showGrid,
              'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800': !showGrid
            }
          ]"
          title="显示/隐藏网格线"
        >
          <span class="material-symbols-outlined text-lg">{{ showGrid ? 'grid_on' : 'grid_off' }}</span>
          <span>网格</span>
        </button>

        <button
          @click="toggleSnapToGrid"
          :class="[
            'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors text-sm font-medium',
            {
              'bg-primary text-white': snapToGrid,
              'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800': !snapToGrid
            }
          ]"
          title="拖拽时自动吸附到网格"
        >
          <span class="material-symbols-outlined text-lg">pinch</span>
          <span>吸附</span>
        </button>
      </div>

      <!-- 网格大小设置 -->
      <div class="flex flex-col gap-2">
        <label class="text-xs font-medium text-slate-600 dark:text-slate-400">网格大小</label>
        <div class="flex items-center gap-1">
          <button
            v-for="size in gridSizes"
            :key="size.value"
            @click="setGridSize(size.value)"
            :class="[
              'flex-1 py-1.5 text-xs font-medium rounded transition-colors',
              {
                'bg-primary text-white': gridSize === size.value,
                'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800': gridSize !== size.value
              }
            ]"
            :title="`网格大小: ${size.value}像素`"
          >
            {{ size.label }}px
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'

// Store
const canvasStore = useCanvasStore()

// 展开状态
const isExpanded = ref(false)

// 计算属性
const showGrid = computed(() => canvasStore.showGrid)
const gridSize = computed(() => canvasStore.gridSize)
const snapToGrid = computed(() => canvasStore.snapToGrid)

// 网格大小选项
const gridSizes = [
  { label: '8', value: 8 },
  { label: '16', value: 16 },
  { label: '32', value: 32 }
]

// 方法
const toggleGrid = () => {
  canvasStore.toggleGrid()
}

const setGridSize = (size: number) => {
  canvasStore.setGridSize(size)
}

const toggleSnapToGrid = () => {
  canvasStore.toggleSnapToGrid()
}

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.grid-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 20;
}

@media (min-width: 1024px) {
  .grid-controls {
    top: 1.5rem;
    right: 1.5rem;
  }
}

.toolbar-panel {
  min-width: 240px;
  z-index: 30;
}
</style>
