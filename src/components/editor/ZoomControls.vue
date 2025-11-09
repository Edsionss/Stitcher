<template>
  <div class="zoom-controls flex items-center gap-2 bg-white dark:bg-card border border-slate-200 dark:border-slate-700 rounded-lg p-1 shadow-sm">
    <!-- 缩小 -->
    <button
      @click="zoomOut"
      :disabled="zoomLevel <= 0.25"
      class="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title="缩小"
    >
      <span class="material-symbols-outlined text-lg">remove</span>
    </button>

    <!-- 缩放级别显示 -->
    <div class="px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 min-w-[60px] text-center">
      {{ Math.round(zoomLevel * 100) }}%
    </div>

    <!-- 放大 -->
    <button
      @click="zoomIn"
      :disabled="zoomLevel >= 2"
      class="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title="放大"
    >
      <span class="material-symbols-outlined text-lg">add</span>
    </button>

    <div class="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>

    <!-- 适应屏幕 -->
    <button
      @click="fitToScreen"
      class="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title="适应屏幕"
    >
      <span class="material-symbols-outlined text-lg">fit_screen</span>
    </button>

    <!-- 实际尺寸 -->
    <button
      @click="resetZoom"
      class="p-1.5 rounded-md text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      title="实际尺寸 (100%)"
    >
      <span class="material-symbols-outlined text-lg">1x_mobiledata</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 组件属性
interface Props {
  zoomLevel: number
}

const props = defineProps<Props>()

// 事件
const emit = defineEmits<{
  'zoom-in': []
  'zoom-out': []
  'reset-zoom': []
  'fit-to-screen': []
}>()

// 方法
const zoomIn = () => {
  emit('zoom-in')
}

const zoomOut = () => {
  emit('zoom-out')
}

const resetZoom = () => {
  emit('reset-zoom')
}

const fitToScreen = () => {
  emit('fit-to-screen')
}
</script>

<style scoped>
.zoom-controls {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}
</style>
