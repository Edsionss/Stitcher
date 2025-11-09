<template>
  <div
    class="relative flex h-screen w-full flex-col overflow-hidden font-display bg-background"
  >
    <!-- 头部工具栏 -->
    <header
      class="flex flex-shrink-0 items-center gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-card px-4 py-2"
    >
      <!-- 左侧：Workspace -->
      <div class="flex items-center gap-3 flex-shrink-0">
        <div
          class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gradient-to-br from-blue-400 to-purple-500"
        ></div>
        <div class="flex flex-col">
          <h1 class="text-slate-900 dark:text-white text-base font-medium leading-normal">
            Workspace
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">
            My New App
          </p>
        </div>
      </div>

      <!-- 左侧：撤销/重做（向右移动一个Workspace的宽度） -->
      <div class="flex items-center gap-2 flex-shrink-0 ml-64">
        <Button
          @click="handleUndo"
          :disabled="!historyStore.canUndo"
          size="icon"
          variant="ghost"
        >
          <span class="material-symbols-outlined">undo</span>
        </Button>
        <Button
          @click="handleRedo"
          :disabled="!historyStore.canRedo"
          size="icon"
          variant="ghost"
        >
          <span class="material-symbols-outlined">redo</span>
        </Button>
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
                'bg-white dark:bg-slate-700 text-primary shadow-sm':
                  canvasStore.device === device.type,
              },
            ]"
          >
            <span class="material-symbols-outlined">{{ device.icon }}</span>
          </button>
        </div>
      </div>

      <!-- 右侧：保存/预览/发布 -->
      <div class="flex items-center gap-2 flex-shrink-0 ml-auto">
        <div class="flex items-center gap-2">
          <!-- 主题切换按钮 -->
          <Button
            @click="toggleTheme"
            variant="ghost"
            size="sm"
            class="gap-1.5 text-xs"
          >
            <span class="material-symbols-outlined text-base">{{
              isDark ? 'light_mode' : 'dark_mode'
            }}</span>
            <span>{{ isDark ? '明亮' : '暗黑' }}</span>
          </Button>

          <!-- 项目操作下拉菜单 -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="ghost" size="sm" class="gap-1.5 text-xs">
                <span class="material-symbols-outlined text-base">folder</span>
                <span>项目</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-48">
              <DropdownMenuItem @click="handleSave">
                <span class="material-symbols-outlined mr-2 text-base">save</span>
                <span>保存到本地</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleExport" :disabled="persistence.isExporting.value">
                <span class="material-symbols-outlined mr-2 text-base">download</span>
                <span>{{ persistence.isExporting.value ? '导出中...' : '导出JSON' }}</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="triggerImport">
                <span class="material-symbols-outlined mr-2 text-base">upload</span>
                <span>导入JSON</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="handleLoad">
                <span class="material-symbols-outlined mr-2 text-base">refresh</span>
                <span>从本地加载</span>
              </DropdownMenuItem>
              <DropdownMenuItem @click="handleClear" class="text-red-600 dark:text-red-400">
                <span class="material-symbols-outlined mr-2 text-base">clear_all</span>
                <span>清空数据</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- 隐藏的文件输入 -->
          <input
            ref="fileInputRef"
            type="file"
            accept=".json"
            @change="handleImport"
            class="hidden"
          />

          <Button
            variant="ghost"
            size="sm"
            class="gap-1.5 text-xs"
          >
            <span class="material-symbols-outlined text-base">visibility</span>
            <span>Preview</span>
          </Button>
        </div>
        <Button variant="secondary" size="sm" class="gap-1.5 text-xs">
          <span class="material-symbols-outlined text-base">publish</span>
          <span>Publish</span>
        </Button>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="flex h-full grow flex-row overflow-y-auto">
      <!-- 左侧边栏 -->
      <aside
        class="flex h-full w-64 flex-shrink-0 flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-card"
      >
        <!-- 顶部内容 -->
        <div class="flex flex-col gap-4 p-4">
          <!-- 导航菜单 -->
          <nav class="flex flex-col gap-2">
            <template v-for="item in menuItems" :key="item.key">
              <!-- 菜单按钮 -->
              <button
                @click="toggleMenuItem(item.key)"
                :class="[
                  'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left w-full',
                  {
                    'bg-primary/10 dark:bg-primary/20': activeMenuItem === item.key,
                    'hover:bg-slate-100 dark:hover:bg-slate-800': activeMenuItem !== item.key,
                  },
                ]"
              >
                <span
                  :class="[
                    'material-symbols-outlined text-2xl',
                    {
                      'text-primary': activeMenuItem === item.key,
                      'text-slate-700 dark:text-slate-300': activeMenuItem !== item.key,
                    },
                  ]"
                >
                  {{ item.icon }}
                </span>
                <p
                  :class="[
                    'text-sm font-medium leading-normal',
                    {
                      'text-primary': activeMenuItem === item.key,
                      'text-slate-700 dark:text-slate-300': activeMenuItem !== item.key,
                    },
                  ]"
                >
                  {{ item.label }}
                </p>
                <!-- 展开/收起箭头（仅Components菜单显示） -->
                <span
                  v-if="item.key === 'components'"
                  class="material-symbols-outlined text-sm ml-auto transition-transform"
                  :class="{ 'rotate-180': activeMenuItem === 'components' }"
                >
                  expand_more
                </span>
              </button>

              <!-- 组件库面板（紧贴着Components按钮下方） -->
              <div
                v-if="item.key === 'components' && activeMenuItem === 'components'"
                class="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
              >
                <ComponentPanel class="max-h-[calc(100vh-20rem)] overflow-y-auto" />
              </div>
            </template>
          </nav>
        </div>

        <!-- 底部内容 -->
        <div class="flex flex-col gap-1 p-4">
          <a
            v-for="item in bottomMenuItems"
            :key="item.key"
            href="#"
            class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-2xl">{{
              item.icon
            }}</span>
            <p class="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">
              {{ item.label }}
            </p>
          </a>
        </div>
      </aside>

      <!-- 主工作区 - 画布区域 -->
      <main
        class="flex h-full flex-1 flex-col overflow-hidden bg-background"
      >
        <Canvas
          ref="canvasRef"
          @browse-components="toggleMenuItem('components')"
          @zoom-changed="handleZoomChanged"
        />
      </main>

      <!-- 右侧边栏 -->
      <aside
        class="flex h-full w-80 flex-shrink-0 flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-card"
      >
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
                    'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300':
                      propertyStore.activeTab !== tab.key,
                  },
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
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  No Component Selected
                </p>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  Select a component on the canvas to see its properties.
                </p>
              </template>
              <template v-else>
                <!-- 组件属性内容将在这里显示 -->
                <p class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ propertyStore.selectedComponent.name }}
                </p>
                <p class="text-sm text-slate-500 dark:text-slate-400">
                  Component properties will be displayed here.
                </p>
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useCanvasStore } from '@/stores/canvas'
import { usePropertyStore } from '@/stores/property'
import { useHistoryStore } from '@/stores/history'
import { useProjectPersistence } from '@/composables/useProjectPersistence'
import { useEventSystem, useAutoStateListener } from '@/composables/useEventSystem'
import ComponentPanel from './ComponentPanel.vue'
import Canvas from './Canvas.vue'

const canvasStore = useCanvasStore()
const propertyStore = usePropertyStore()
const historyStore = useHistoryStore()
const persistence = useProjectPersistence()

// 主题状态
const isDark = ref(false)

// 预览模式状态
const isPreviewMode = ref(false)

// 文件输入引用
const fileInputRef = ref<HTMLInputElement | null>(null)

// Canvas引用
const canvasRef = ref<InstanceType<typeof Canvas> | null>(null)

// 设备类型
const devices = [
  { type: 'desktop', icon: 'desktop_windows' },
  { type: 'tablet', icon: 'tablet_mac' },
  { type: 'mobile', icon: 'smartphone' },
] as const

// 菜单项
const menuItems = [
  { key: 'components', label: 'Components', icon: 'widgets' },
  { key: 'pages', label: 'Pages', icon: 'layers' },
  { key: 'datasources', label: 'Data Sources', icon: 'database' },
  { key: 'workflows', label: 'Workflows', icon: 'account_tree' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
]

// 当前活动的菜单项
const activeMenuItem = ref('')

// 底部菜单
const bottomMenuItems = [
  { key: 'help', label: 'Help', icon: 'help', href: '#' },
  { key: 'profile', label: 'Profile', icon: 'account_circle', href: '#' },
]

// 面板标签
const panelTabs = [
  { key: 'properties', label: '属性' },
  { key: 'styles', label: '样式' },
  { key: 'events', label: '事件' },
  { key: 'advanced', label: '高级' },
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

  // 初始化状态监听器
  const { getSnapshot } = useAutoStateListener()

  // 示例：监听画布缩放变化
  const { on } = useEventSystem()
  on('canvas:zoom:changed', (zoom) => {
    console.log('Canvas zoom changed to:', zoom)
  })

  // 示例：监听项目更新
  on('project:updated', (project) => {
    console.log('Project updated:', project?.name)
  })
})

// 菜单项切换方法
const toggleMenuItem = (key: string) => {
  // 如果点击的是已激活的 Components，则收起
  if (activeMenuItem.value === key && key === 'components') {
    activeMenuItem.value = ''
  }
  // 否则激活该菜单项
  else {
    activeMenuItem.value = key
  }
}

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

// 项目菜单方法
const handleSave = () => {
  const result = persistence.saveToLocal()
  if (result.success) {
    // 可以添加成功提示
  }
}

const handleExport = async () => {
  const result = await persistence.exportProject()
  if (result.success) {
    // 导出成功
  }
}

const handleImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const result = await persistence.importProject(file)
    if (result.success) {
      // 导入成功
    }
  }
  // 清空输入
  target.value = ''
}

const triggerImport = () => {
  fileInputRef.value?.click()
}

const handleLoad = () => {
  const result = persistence.loadFromLocal()
  if (result.success) {
    // 加载成功
  }
}

const handleClear = () => {
  if (confirm('确定要清空所有数据吗？此操作不可撤销。')) {
    persistence.clearAll()
  }
}

// Canvas事件处理
const handleZoomChanged = (zoom: number) => {
  // 可以在这里添加缩放变化的处理逻辑
  // 例如更新状态、触发事件等
  console.log('Zoom changed to:', zoom)
}
</script>
