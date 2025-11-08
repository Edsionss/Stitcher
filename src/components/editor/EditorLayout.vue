<template>
  <div class="relative flex h-screen w-full flex-col overflow-hidden font-display bg-background-light dark:bg-background-dark">
    <!-- 头部工具栏 -->
    <header class="flex flex-shrink-0 items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202B] px-4 py-2">
      <!-- 左侧：撤销/重做 -->
      <div class="flex items-center gap-2 flex-1">
        <button
          @click="handleUndo"
          :disabled="!historyStore.canUndo"
          class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="material-symbols-outlined">undo</span>
        </button>
        <button
          @click="handleRedo"
          :disabled="!historyStore.canRedo"
          class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="material-symbols-outlined">redo</span>
        </button>
      </div>

      <!-- 中间：响应式切换 -->
      <div class="flex flex-1 justify-center">
        <div class="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
          <button
            v-for="device in devices"
            :key="device.type"
            @click="setDevice(device.type)"
            :class="[
              'p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-md transition-colors',
              {
                'bg-white dark:bg-slate-700 text-primary shadow-sm': canvasStore.device === device.type
              }
            ]"
          >
            <span class="material-symbols-outlined">{{ device.icon }}</span>
          </button>
        </div>
      </div>

      <!-- 右侧：保存/预览/发布 -->
      <div class="flex items-center gap-2 flex-1 justify-end">
        <div class="flex items-center gap-2">
          <!-- 主题切换按钮 -->
          <button
            @click="toggleTheme"
            class="flex h-7 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <span class="material-symbols-outlined mr-1.5 text-base">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
            <span>{{ isDark ? '明亮' : '暗黑' }}</span>
          </button>
          <button class="flex h-7 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
            <span class="material-symbols-outlined mr-1.5 text-base">save</span>
            <span>Save</span>
          </button>
          <button class="flex h-7 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
            <span class="material-symbols-outlined mr-1.5 text-base">visibility</span>
            <span>Preview</span>
          </button>
        </div>
        <button class="flex h-7 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-white hover:bg-primary/90">
          <span class="material-symbols-outlined mr-1.5 text-base">publish</span>
          <span>Publish</span>
        </button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="flex h-full grow flex-row overflow-y-auto">
      <!-- 左侧边栏 -->
      <aside class="flex h-full w-64 flex-shrink-0 flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202B]">
        <!-- 顶部内容 -->
        <div class="flex flex-col gap-4 p-4">
          <!-- Workspace -->
          <div class="flex items-center gap-3">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gradient-to-br from-blue-400 to-purple-500"></div>
            <div class="flex flex-col">
              <h1 class="text-slate-900 dark:text-white text-base font-medium leading-normal">Workspace</h1>
              <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">My New App</p>
            </div>
          </div>

          <!-- 导航菜单 -->
          <nav class="flex flex-col gap-2">
            <a
              v-for="item in menuItems"
              :key="item.key"
              href="#"
              :class="[
                'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                {
                  'bg-primary/10 dark:bg-primary/20': item.active,
                  'hover:bg-slate-100 dark:hover:bg-slate-800': !item.active
                }
              ]"
            >
              <span
                :class="[
                  'material-symbols-outlined text-2xl',
                  { 'text-primary': item.active, 'text-slate-700 dark:text-slate-300': !item.active }
                ]"
              >
                {{ item.icon }}
              </span>
              <p
                :class="[
                  'text-sm font-medium leading-normal',
                  { 'text-primary': item.active, 'text-slate-700 dark:text-slate-300': !item.active }
                ]"
              >
                {{ item.label }}
              </p>
            </a>
          </nav>
        </div>

        <!-- 底部内容 -->
        <div class="flex flex-col gap-1 p-4">
          <a v-for="item in bottomMenuItems" :key="item.key" href="#" class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-2xl">{{ item.icon }}</span>
            <p class="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">{{ item.label }}</p>
          </a>
        </div>
      </aside>

      <!-- 主工作区 -->
      <main class="flex h-full flex-1 flex-col overflow-auto bg-background-light dark:bg-background-dark">
        <div class="p-4 lg:p-6">
          <div class="flex h-full w-full flex-col">
            <!-- 空状态画布 -->
            <div class="flex h-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#15202B]/50 p-6 min-h-[calc(100vh-10rem)]">
              <div class="flex max-w-[480px] flex-col items-center gap-2">
                <span class="material-symbols-outlined text-5xl text-primary">add_circle</span>
                <p class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Start building your application</p>
                <p class="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal text-center">Drag and drop a component from the left panel to get started.</p>
              </div>
              <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-700">
                <span class="truncate">Browse Components</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- 右侧边栏 -->
      <aside class="flex h-full w-80 flex-shrink-0 flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202B]">
        <div class="flex h-full flex-col">
          <!-- 面板标签 -->
          <div class="border-b border-slate-200 dark:border-slate-800 px-2">
            <nav aria-label="Tabs" class="-mb-px flex justify-center">
              <button
                v-for="tab in panelTabs"
                :key="tab.key"
                @click="setActiveTab(tab.key)"
                :class="[
                  'flex-1 whitespace-nowrap border-b-2 px-1 py-3 text-center text-sm font-medium transition-colors',
                  {
                    'border-primary text-primary': propertyStore.activeTab === tab.key,
                    'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300': propertyStore.activeTab !== tab.key
                  }
                ]"
              >
                {{ tab.label }}
              </button>
            </nav>
          </div>

          <!-- 面板内容 -->
          <div class="flex-1 overflow-y-auto p-4">
            <div class="flex flex-col gap-4">
              <template v-if="!propertyStore.selectedComponent">
                <p class="text-sm font-medium text-slate-900 dark:text-white">No Component Selected</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">Select a component on the canvas to see its properties.</p>
              </template>
              <template v-else>
                <!-- 组件属性内容将在这里显示 -->
                <p class="text-sm font-medium text-slate-900 dark:text-white">{{ propertyStore.selectedComponent.name }}</p>
                <p class="text-sm text-slate-500 dark:text-slate-400">Component properties will be displayed here.</p>
              </template>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { usePropertyStore } from '@/stores/property'
import { useHistoryStore } from '@/stores/history'

const canvasStore = useCanvasStore()
const propertyStore = usePropertyStore()
const historyStore = useHistoryStore()

// 主题状态
const isDark = ref(false)

// 设备类型
const devices = [
  { type: 'desktop', icon: 'desktop_windows' },
  { type: 'tablet', icon: 'tablet_mac' },
  { type: 'mobile', icon: 'smartphone' }
] as const

// 菜单项
const menuItems = [
  { key: 'components', label: 'Components', icon: 'widgets', active: true, href: '#' },
  { key: 'pages', label: 'Pages', icon: 'layers', active: false, href: '#' },
  { key: 'datasources', label: 'Data Sources', icon: 'database', active: false, href: '#' },
  { key: 'workflows', label: 'Workflows', icon: 'account_tree', active: false, href: '#' },
  { key: 'settings', label: 'Settings', icon: 'settings', active: false, href: '#' }
]

// 底部菜单
const bottomMenuItems = [
  { key: 'help', label: 'Help', icon: 'help', href: '#' },
  { key: 'profile', label: 'Profile', icon: 'account_circle', href: '#' }
]

// 面板标签
const panelTabs = [
  { key: 'properties', label: '属性' },
  { key: 'styles', label: '样式' },
  { key: 'events', label: '事件' },
  { key: 'advanced', label: '高级' }
] as const

// 主题切换方法
const toggleTheme = () => {
  isDark.value = !isDark.value
  updateTheme()
}

// 更新主题
const updateTheme = () => {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // 检查系统偏好
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  // 立即应用主题，不使用 updateTheme 以避免重复设置
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
})

// 方法
const setDevice = (type: 'desktop' | 'tablet' | 'mobile') => {
  canvasStore.setDevice(type)
}

const setActiveTab = (key: 'properties' | 'styles' | 'events' | 'advanced') => {
  propertyStore.setActiveTab(key)
}

const handleUndo = () => {
  historyStore.undo()
}

const handleRedo = () => {
  historyStore.redo()
}
</script>
