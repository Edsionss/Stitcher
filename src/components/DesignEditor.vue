<template>
  <div class="design-editor h-screen w-screen flex flex-col font-display bg-background-light dark:bg-background-dark">
    <!-- 顶部工具栏 -->
    <header class="top-toolbar h-16 flex items-center justify-between gap-2 flex-shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202B] px-4 py-2">
      <!-- 左侧：撤销重做 -->
      <div class="flex items-center gap-2 flex-1">
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

      <!-- 中间：设备切换 -->
      <div class="flex-1 flex justify-center">
        <div class="flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
          <button class="rounded-md bg-white dark:bg-slate-700 p-1.5 text-primary shadow-sm">
            <span class="material-symbols-outlined">desktop_windows</span>
          </button>
          <button class="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
            <span class="material-symbols-outlined">tablet_mac</span>
          </button>
          <button class="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
            <span class="material-symbols-outlined">smartphone</span>
          </button>
        </div>
      </div>

      <!-- 右侧：Save、Preview、Publish -->
      <div class="flex items-center gap-2 flex-1 justify-end">
        <button class="flex h-7 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700">
          <span class="material-symbols-outlined mr-1.5 text-base">save</span>
          <span>Save</span>
        </button>
        <button
          @click="openPreview"
          class="flex h-7 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <span class="material-symbols-outlined mr-1.5 text-base">visibility</span>
          <span>Preview</span>
        </button>
        <button class="flex h-7 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-white hover:bg-primary/90">
          <span class="material-symbols-outlined mr-1.5 text-base">publish</span>
          <span>Publish</span>
        </button>
      </div>
    </header>

    <!-- 主工作区 -->
    <div class="main-workspace flex-1 flex flex-row overflow-y-auto">
      <!-- 左侧边栏：工作区信息和组件库 -->
      <aside class="sidebar-left w-64 flex-shrink-0 flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202B]">
        <!-- 顶部工作区信息 -->
        <div class="flex flex-col gap-4 p-4">
          <div class="flex items-center gap-3">
            <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-primary/20 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl text-primary">dashboard</span>
            </div>
            <div class="flex flex-col">
              <h1 class="text-slate-900 dark:text-white text-base font-medium leading-normal">Workspace</h1>
              <p class="text-slate-500 dark:text-slate-400 text-sm font-normal leading-normal">My New App</p>
            </div>
          </div>

          <!-- 导航菜单 -->
          <nav class="flex flex-col gap-2">
            <a class="flex items-center gap-3 rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-2" href="#">
              <span class="material-symbols-outlined text-primary text-2xl">widgets</span>
              <p class="text-primary text-sm font-medium leading-normal">Components</p>
            </a>
            <a class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="#">
              <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-2xl">layers</span>
              <p class="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Pages</p>
            </a>
            <a class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="#">
              <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-2xl">database</span>
              <p class="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Data Sources</p>
            </a>
            <a class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="#">
              <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-2xl">account_tree</span>
              <p class="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Workflows</p>
            </a>
            <a class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="#">
              <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-2xl">settings</span>
              <p class="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Settings</p>
            </a>
          </nav>

          <!-- 组件库 -->
          <div class="flex-1 overflow-y-auto mt-2">
            <ComponentLibrary />
          </div>
        </div>

        <!-- 底部用户信息 -->
        <div class="flex flex-col gap-1 p-4 border-t border-slate-200 dark:border-slate-800">
          <a class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="#">
            <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-2xl">help</span>
            <p class="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Help</p>
          </a>
          <a class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800" href="#">
            <span class="material-symbols-outlined text-slate-700 dark:text-slate-300 text-2xl">account_circle</span>
            <p class="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Profile</p>
          </a>
        </div>
      </aside>

      <!-- 中间画布区域 -->
      <main class="canvas-area flex-1 flex flex-col overflow-auto bg-background-light dark:bg-background-dark">
        <Canvas />
      </main>

      <!-- 右侧边栏：属性面板 -->
      <aside class="sidebar-right w-80 flex-shrink-0 flex-col border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202B]">
        <div class="flex h-full flex-col">
          <!-- 标签页 -->
          <div class="border-b border-slate-200 dark:border-slate-800 px-2">
            <nav class="-mb-px flex justify-center">
              <a class="flex-1 whitespace-nowrap border-b-2 border-primary px-1 py-3 text-center text-sm font-medium text-primary">属性</a>
              <a class="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-3 text-center text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300">样式</a>
              <a class="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-3 text-center text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300">事件</a>
              <a class="flex-1 whitespace-nowrap border-b-2 border-transparent px-1 py-3 text-center text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-300">高级</a>
            </nav>
          </div>
          <!-- 属性面板内容 -->
          <div class="flex-1 overflow-y-auto p-4">
            <PropertyPanel />
          </div>
        </div>
      </aside>
    </div>

    <!-- 底部状态栏（简化版） -->
    <div class="bottom-status-bar h-6 flex items-center justify-end px-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202B]">
      <div class="flex items-center gap-4">
        <span>组件: {{ componentCount }}</span>
        <span>选择: {{ selectedCount }}</span>
        <span>{{ currentDate }}</span>
      </div>
    </div>

    <!-- 预览模态框 -->
    <PreviewModal
      :visible="showPreview"
      @close="closePreview"
    />

    <!-- 代码导出模态框 -->
    <CodeExportModal
      :visible="showExport"
      @close="closeExport"
    />

    <!-- 快捷键帮助模态框 -->
    <KeyboardShortcutsHelp
      :visible="showShortcuts"
      @close="closeShortcuts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDesignStore } from '@/stores/design';
import { useThemeStore } from '@/stores/theme';
import { useDeviceStore } from '@/stores/device';
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts';
import ComponentLibrary from './design/Sidebar/ComponentLibrary.vue';
import Canvas from './design/Canvas/Canvas.vue';
import PropertyPanel from './design/PropertyPanel/PropertyPanel.vue';
import PreviewModal from './PreviewModal.vue';
import CodeExportModal from './CodeExportModal.vue';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp.vue';

// ========== Store ==========
const designStore = useDesignStore();
const themeStore = useThemeStore();
const deviceStore = useDeviceStore();

// ========== 快捷键 ==========
useKeyboardShortcuts();

// ========== 状态 ==========
const showPreview = ref(false);
const showExport = ref(false);
const showShortcuts = ref(false);

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

const openPreview = () => {
  showPreview.value = true;
};

const closePreview = () => {
  showPreview.value = false;
};

const openExport = () => {
  showExport.value = true;
};

const closeExport = () => {
  showExport.value = false;
};

const openShortcuts = () => {
  showShortcuts.value = true;
};

const closeShortcuts = () => {
  showShortcuts.value = false;
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
