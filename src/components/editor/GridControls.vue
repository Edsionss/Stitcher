<template>
  <div class="grid-controls flex items-center gap-2 bg-white dark:bg-[#15202B] border border-slate-200 dark:border-slate-700 rounded-lg p-2 shadow-sm">
    <!-- 网格显示/隐藏 -->
    <button
      @click="toggleGrid"
      :class="[
        'p-1.5 rounded-md transition-colors',
        {
          'bg-slate-100 dark:bg-slate-700 text-primary': showGrid,
          'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800': !showGrid
        }
      ]"
      title="显示/隐藏网格"
    >
      <span class="material-symbols-outlined text-lg">grid_on</span>
    </button>

    <div class="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

    <!-- 网格大小 -->
    <div class="flex items-center gap-1">
      <button
        v-for="size in gridSizes"
        :key="size.value"
        @click="setGridSize(size.value)"
        :class="[
          'px-2 py-1 text-xs font-medium rounded transition-colors',
          {
            'bg-primary text-white': gridSize === size.value,
            'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800': gridSize !== size.value
          }
        ]"
        :title="`网格大小: ${size.value}px`"
      >
        {{ size.label }}
      </button>
    </div>

    <div class="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

    <!-- 吸附到网格 -->
    <button
      @click="toggleSnapToGrid"
      :class="[
        'flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors',
        {
          'bg-primary text-white': snapToGrid,
          'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800': !snapToGrid
        }
      ]"
      title="吸附到网格"
    >
      <span class="material-symbols-outlined text-sm">吸附_到_网格</span>
      <span>吸附</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'

// Store
const canvasStore = useCanvasStore()

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
</script>

<style scoped>
.grid-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}
</style>
