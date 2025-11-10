<template>
  <div class="flex flex-col">
    <!-- 搜索栏 -->
    <div class="p-3 border-b border-slate-200 dark:border-slate-700">
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

    <!-- 组件树形列表 -->
    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col gap-1 p-2">
        <!-- 遍历每个UI库 -->
        <div
          v-for="library in libraries"
          :key="library.key"
          class="library-group"
        >
          <!-- UI库标题 -->
          <button
            @click="toggleLibrary(library.key)"
            class="flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">{{ library.icon }}</span>
              <span>{{ library.label }}</span>
            </div>
            <span class="material-symbols-outlined text-lg transition-transform" :class="{ 'rotate-180': expandedLibraries.includes(library.key) }">
              expand_more
            </span>
          </button>

          <!-- 分类列表（展开时显示） -->
          <div
            v-if="expandedLibraries.includes(library.key)"
            class="ml-4 mt-1 space-y-1"
          >
            <!-- 遍历该库下的每个分类 -->
            <div
              v-for="category in library.categories"
              :key="category.key"
            >
              <!-- 分类标题 -->
              <button
                @click="toggleCategory(library.key, category.key)"
                class="flex w-full items-center justify-between rounded-md p-2 text-left text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{{ category.label }}</span>
                <span class="material-symbols-outlined text-lg transition-transform" :class="{ 'rotate-180': expandedCategories[`${library.key}-${category.key}`] }">
                  {{ expandedCategories[`${library.key}-${category.key}`] ? 'expand_less' : 'expand_more' }}
                </span>
              </button>

              <!-- 组件列表（展开时显示） -->
              <div
                v-if="expandedCategories[`${library.key}-${category.key}`]"
                class="grid grid-cols-2 gap-2 p-2"
              >
                <component-item
                  v-for="component in category.components"
                  :key="component.id"
                  :component="component"
                />
              </div>
            </div>
          </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ComponentItem from './ComponentItem.vue'
import { ALL_COMPONENTS, CATEGORY_LABELS, getAllCategories, LIBRARY_LABELS } from '@/data/components'
import type { ComponentMeta, ComponentCategory, UILibrary } from '@/types/component'

// 响应式数据
const searchQuery = ref('')

// 展开状态追踪
const expandedLibraries = ref<UILibrary[]>(['element-plus'])
const expandedCategories = ref<Record<string, boolean>>({
  'element-plus-basic': true
})

// UI库配置
const libraries = computed(() => {
  const uiLibraries: UILibrary[] = ['element-plus', 'ant-design', 'naive-ui']

  return uiLibraries.map(library => {
    // 获取该库下的所有组件
    const libraryComponents = ALL_COMPONENTS.filter(c => c.library === library)

    // 按分类分组组件
    const categoriesMap = new Map<ComponentCategory, ComponentMeta[]>()
    libraryComponents.forEach(component => {
      if (!categoriesMap.has(component.category)) {
        categoriesMap.set(component.category, [])
      }
      categoriesMap.get(component.category)!.push(component)
    })

    // 转换为分类配置
    const categories = Array.from(categoriesMap.entries()).map(([key, components]) => ({
      key,
      label: CATEGORY_LABELS[key],
      components
    }))

    return {
      key: library,
      label: LIBRARY_LABELS[library],
      icon: getLibraryIcon(library),
      categories
    }
  })
})

// 过滤后的组件列表（用于空状态）
const filteredComponents = computed(() => {
  if (!searchQuery.value) return ALL_COMPONENTS

  const keyword = searchQuery.value.toLowerCase()
  return ALL_COMPONENTS.filter(c =>
    c.name.toLowerCase().includes(keyword) ||
    c.description?.toLowerCase().includes(keyword) ||
    c.tags.some(tag => tag.toLowerCase().includes(keyword))
  )
})

// 切换库展开/收起
function toggleLibrary(library: UILibrary) {
  const index = expandedLibraries.value.indexOf(library)
  if (index > -1) {
    expandedLibraries.value.splice(index, 1)
  } else {
    expandedLibraries.value.push(library)
  }
}

// 切换分类展开/收起
function toggleCategory(library: UILibrary, category: ComponentCategory) {
  const key = `${library}-${category}`
  expandedCategories.value[key] = !expandedCategories.value[key]
}

// 获取库图标
function getLibraryIcon(library: UILibrary): string {
  const iconMap = {
    'element-plus': 'view_module',
    'ant-design': 'layers',
    'naive-ui': 'dashboard'
  }
  return iconMap[library]
}
</script>