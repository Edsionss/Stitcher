<template>
  <div class="flex flex-col h-full">
    <!-- 搜索栏 -->
    <div class="p-4 border-b border-slate-200 dark:border-slate-800">
      <div class="relative">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
          search
        </span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索组件..."
          class="w-full h-9 pl-10 pr-4 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg border-0 focus:ring-2 focus:ring-primary outline-none"
        />
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="px-2 py-2 border-b border-slate-200 dark:border-slate-800">
      <div class="flex gap-1 overflow-x-auto">
        <button
          v-for="cat in categories"
          :key="cat.key"
          @click="activeCategory = cat.key"
          :class="[
            'flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
            activeCategory === cat.key
              ? 'bg-primary text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          ]"
        >
          <span class="material-symbols-outlined text-sm mr-1">{{ cat.icon }}</span>
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- 组件列表 -->
    <div class="flex-1 overflow-y-auto p-2">
      <div class="grid grid-cols-2 gap-2">
        <component-item
          v-for="component in filteredComponents"
          :key="component.id"
          :component="component"
          @drag-start="handleDragStart"
        />
      </div>

      <!-- 空状态 -->
      <div
        v-if="filteredComponents.length === 0"
        class="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-slate-600"
      >
        <span class="material-symbols-outlined text-4xl mb-2">find_in_page</span>
        <p class="text-sm">未找到匹配的组件</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ComponentItem from './ComponentItem.vue'
import { ALL_COMPONENTS, CATEGORY_LABELS, getAllCategories } from '@/data/components'
import type { ComponentMeta, ComponentCategory } from '@/types/component'

// 响应式数据
const searchQuery = ref('')
const activeCategory = ref<ComponentCategory | 'all'>('all')

// 计算属性
const categories = computed(() => [
  { key: 'all', label: '全部', icon: 'apps' },
  ...getAllCategories().map(cat => ({
    key: cat,
    label: CATEGORY_LABELS[cat],
    icon: getCategoryIcon(cat)
  }))
])

const filteredComponents = computed(() => {
  let components = ALL_COMPONENTS

  // 按分类过滤
  if (activeCategory.value !== 'all') {
    components = components.filter(c => c.category === activeCategory.value)
  }

  // 按搜索关键词过滤
  if (searchQuery.value) {
    const keyword = searchQuery.value.toLowerCase()
    components = components.filter(c =>
      c.name.toLowerCase().includes(keyword) ||
      c.description?.toLowerCase().includes(keyword) ||
      c.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  return components
})

// 获取分类图标
function getCategoryIcon(category: ComponentCategory): string {
  const iconMap: Record<ComponentCategory, string> = {
    layout: 'view_quilt',
    form: 'rule',
    data: 'table_chart',
    feedback: 'notifications',
    navigation: 'navigation',
    basic: 'crop_square'
  }
  return iconMap[category]
}

// 处理拖拽开始
function handleDragStart(component: ComponentMeta, event: DragEvent) {
  if (!event.dataTransfer) return

  const dragData = {
    type: 'component',
    component
  }

  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('application/json', JSON.stringify(dragData))

  // 创建拖拽预览
  const dragPreview = document.createElement('div')
  dragPreview.className = 'flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700'
  dragPreview.innerHTML = `
    <span class="material-symbols-outlined text-primary">${component.icon}</span>
    <span class="text-sm font-medium text-slate-900 dark:text-white">${component.name}</span>
  `
  document.body.appendChild(dragPreview)
  event.dataTransfer.setDragImage(dragPreview, 0, 0)

  // 清理预览元素
  setTimeout(() => {
    document.body.removeChild(dragPreview)
  }, 0)
}
</script>