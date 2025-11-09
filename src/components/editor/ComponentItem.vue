<template>
  <div
    class="group relative flex flex-col p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-card cursor-grab active:cursor-grabbing hover:border-primary dark:hover:border-primary hover:shadow-sm transition-all"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <!-- 组件图标 -->
    <div class="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
      <span class="material-symbols-outlined text-2xl text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">
        {{ component.icon }}
      </span>
    </div>

    <!-- 组件名称 -->
    <div class="text-center">
      <p class="text-sm font-medium text-slate-900 dark:text-white mb-1 truncate">
        {{ component.name }}
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-400 truncate" :title="component.description">
        {{ component.description || '暂无描述' }}
      </p>
    </div>

    <!-- 标签 -->
    <div class="flex flex-wrap gap-1 mt-2">
      <span
        v-for="tag in component.tags.slice(0, 2)"
        :key="tag"
        class="px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
      >
        {{ tag }}
      </span>
      <span
        v-if="component.tags.length > 2"
        class="px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
      >
        +{{ component.tags.length - 2 }}
      </span>
    </div>

    <!-- 库标识 -->
    <div class="absolute top-2 right-2">
      <span
        class="px-1.5 py-0.5 text-xs font-medium rounded"
        :class="getLibraryClass(component.library)"
      >
        {{ getLibraryLabel(component.library) }}
      </span>
    </div>

    <!-- 容器标识 -->
    <div
      v-if="component.isContainer"
      class="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-green-500"
      title="可包含子组件"
    />
  </div>
</template>

<script setup lang="ts">
import type { ComponentMeta, UILibrary } from '@/types/component'

interface Props {
  component: ComponentMeta
}

const props = defineProps<Props>()

const emit = defineEmits<{
  dragStart: [component: ComponentMeta, event: DragEvent]
  dragEnd: [event: DragEvent]
}>()

// 处理拖拽开始
function handleDragStart(event: DragEvent) {
  emit('dragStart', props.component, event)
}

// 处理拖拽结束
function handleDragEnd(event: DragEvent) {
  emit('dragEnd', event)
}

// 获取库标签样式
function getLibraryClass(library: UILibrary): string {
  const classMap = {
    'element-plus': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    'ant-design': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
    'naive-ui': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
  }
  return classMap[library]
}

// 获取库标签文本
function getLibraryLabel(library: UILibrary): string {
  const labelMap = {
    'element-plus': 'EP',
    'ant-design': 'Ant',
    'naive-ui': 'NUI'
  }
  return labelMap[library]
}
</script>