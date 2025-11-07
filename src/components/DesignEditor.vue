<template>
  <div class="design-editor h-screen w-screen flex flex-col bg-slate-50 dark:bg-slate-900">
    <!-- 顶部工具栏 -->
    <div class="top-toolbar h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202B]">
      <div class="flex items-center gap-4">
        <h1 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Stitcher Designer</h1>
        <div class="flex items-center gap-2">
          <button
            @click="undo"
            :disabled="!canUndo"
            class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            title="撤销"
          >
            <span class="material-symbols-outlined">undo</span>
          </button>
          <button
            @click="redo"
            :disabled="!canRedo"
            class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
            title="重做"
          >
            <span class="material-symbols-outlined">redo</span>
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="toggleTheme"
          class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          title="切换主题"
        >
          <span class="material-symbols-outlined">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
        </button>
        <div class="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
        <span class="text-xs text-slate-500 dark:text-slate-400">
          {{ currentDate }}
        </span>
      </div>
    </div>

    <!-- 主工作区 -->
    <div class="main-workspace flex-1 flex overflow-hidden">
      <!-- 左侧边栏：组件库 -->
      <div class="sidebar-left w-64 flex-shrink-0">
        <ComponentLibrary />
      </div>

      <!-- 中间画布区域 -->
      <div class="canvas-area flex-1 flex flex-col">
        <Canvas />
      </div>

      <!-- 右侧边栏：属性面板 -->
      <div class="sidebar-right w-80 flex-shrink-0">
        <PropertyPanel />
      </div>
    </div>

    <!-- 底部状态栏 -->
    <div class="bottom-status-bar h-8 flex items-center justify-between px-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202B]">
      <div class="flex items-center gap-4">
        <span>组件数：{{ componentCount }}</span>
        <span>已选择：{{ selectedCount }}</span>
        <span>缩放：{{ Math.round(zoom * 100) }}%</span>
      </div>
      <div class="flex items-center gap-4">
        <span v-if="isDragging">拖拽中...</span>
        <span>设备：{{ currentDeviceName }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDesignStore } from '@/stores/design';
import { useThemeStore } from '@/stores/theme';
import { useDeviceStore } from '@/stores/device';
import ComponentLibrary from './design/Sidebar/ComponentLibrary.vue';
import Canvas from './design/Canvas/Canvas.vue';
import PropertyPanel from './design/PropertyPanel/PropertyPanel.vue';

// ========== Store ==========
const designStore = useDesignStore();
const themeStore = useThemeStore();
const deviceStore = useDeviceStore();

// ========== 计算属性 ==========
const canUndo = computed(() => designStore.canUndo);
const canRedo = computed(() => designStore.canRedo);
const componentCount = computed(() => designStore.componentTree.allComponents.size);
const selectedCount = computed(() => designStore.selectedIds.length);
const isDragging = computed(() => designStore.isDragging);
const isDark = computed(() => themeStore.isDark);
const currentDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
const zoom = computed(() => 1); // TODO: 从Canvas组件获取
const currentDeviceName = computed(() => deviceStore.currentDevice?.name || '桌面设备');

// ========== 方法 ==========
const undo = () => {
  designStore.undo();
};

const redo = () => {
  designStore.redo();
};

const toggleTheme = () => {
  themeStore.toggleTheme();
};

// ========== 初始化 ==========
// 初始化主题
themeStore.initTheme();

// 初始化设备
deviceStore.initDevice();
</script>

<style scoped>
.design-editor {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

.top-toolbar {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sidebar-left,
.sidebar-right {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
}

:global(.dark) .sidebar-left,
:global(.dark) .sidebar-right {
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
}
</style>
