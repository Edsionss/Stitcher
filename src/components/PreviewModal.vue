<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="preview-modal-overlay fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      @click="handleBackdropClick"
    >
      <div
        class="preview-modal bg-white dark:bg-[#1a1a1a] rounded-lg shadow-2xl max-w-7xl w-full max-h-[95vh] flex flex-col"
        @click.stop
      >
        <!-- 头部工具栏 -->
        <div class="preview-header flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
              预览模式
            </h2>
            <div class="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <div class="flex items-center gap-2">
              <!-- 设备切换 -->
              <select
                v-model="currentDeviceId"
                class="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                @change="handleDeviceChange"
              >
                <option
                  v-for="device in devices"
                  :key="device.id"
                  :value="device.id"
                >
                  {{ device.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- 缩放控制 -->
            <button
              @click="zoomOut"
              class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="缩小"
            >
              <span class="material-symbols-outlined">zoom_out</span>
            </button>
            <span class="text-sm text-slate-600 dark:text-slate-400 min-w-[60px] text-center">
              {{ Math.round(zoom * 100) }}%
            </span>
            <button
              @click="zoomIn"
              class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="放大"
            >
              <span class="material-symbols-outlined">zoom_in</span>
            </button>
            <button
              @click="resetZoom"
              class="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              重置
            </button>

            <div class="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            <!-- 刷新按钮 -->
            <button
              @click="refreshPreview"
              class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="刷新预览"
            >
              <span class="material-symbols-outlined">refresh</span>
            </button>

            <!-- 关闭按钮 -->
            <button
              @click="close"
              class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="关闭预览"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <!-- 预览内容区域 -->
        <div class="preview-content flex-1 overflow-auto p-8 bg-slate-100 dark:bg-slate-900">
          <div
            class="preview-frame mx-auto transition-all duration-200"
            :style="{
              width: `${currentDevice?.width || 1920}px`,
              height: `${currentDevice?.height || 1080}px`,
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
            }"
          >
            <div class="preview-canvas w-full h-full overflow-auto bg-white dark:bg-slate-800">
              <component
                v-for="component in rootComponents"
                :key="component.id"
                :is="getComponentRenderer(component)"
                :component="component"
              />
            </div>
          </div>
        </div>

        <!-- 底部信息栏 -->
        <div class="preview-footer flex items-center justify-between px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-4">
            <span>设备: {{ currentDevice?.name || '桌面' }}</span>
            <span>尺寸: {{ currentDevice?.width }} × {{ currentDevice?.height }}</span>
            <span>缩放: {{ Math.round(zoom * 100) }}%</span>
          </div>
          <div class="flex items-center gap-4">
            <span>组件数: {{ componentCount }}</span>
            <span>按 Esc 键退出预览</span>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDesignStore } from '@/stores/design';
import { useDeviceStore } from '@/stores/device';
import BaseComponents from '@/components/base/BaseComponents.vue';
import type { ComponentNode } from '@/types/component';

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// ========== Store ==========
const designStore = useDesignStore();
const deviceStore = useDeviceStore();

// ========== 状态 ==========
const zoom = ref(1);
const currentDeviceId = ref('desktop-1920x1080');

// ========== 计算属性 ==========
const rootComponents = computed(() => designStore.componentTree.rootComponents);
const componentCount = computed(() => designStore.componentTree.allComponents.size);
const devices = computed(() => deviceStore.allDevices);
const currentDevice = computed(() => deviceStore.allDevices.find(d => d.id === currentDeviceId.value));

// ========== 方法 ==========
const getComponentRenderer = (component: ComponentNode) => {
  return BaseComponents;
};

const handleDeviceChange = () => {
  deviceStore.setCurrentDevice(currentDeviceId.value);
  // 自动调整缩放以适应屏幕
  autoFit();
};

const autoFit = () => {
  if (!currentDevice.value) return;

  const maxWidth = window.innerWidth * 0.85;
  const maxHeight = window.innerHeight * 0.7;

  const scaleX = maxWidth / currentDevice.value.width;
  const scaleY = maxHeight / currentDevice.value.height;

  zoom.value = Math.min(scaleX, scaleY, 1);
};

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.1, 2);
};

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.1, 0.1);
};

const resetZoom = () => {
  zoom.value = 1;
};

const refreshPreview = () => {
  // 强制重新渲染
  console.log('刷新预览');
};

const handleBackdropClick = () => {
  close();
};

const close = () => {
  emit('close');
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close();
  }
};

// ========== 生命周期 ==========
watch(
  () => props.visible,
  (newVisible) => {
    if (newVisible) {
      document.addEventListener('keydown', handleKeydown);
      // 设置默认设备
      currentDeviceId.value = deviceStore.currentDeviceId || 'desktop-1920x1080';
      // 自动适应
      setTimeout(() => {
        autoFit();
      }, 100);
    } else {
      document.removeEventListener('keydown', handleKeydown);
    }
  }
);

onMounted(() => {
  if (props.visible) {
    document.addEventListener('keydown', handleKeydown);
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.preview-modal-overlay {
  backdrop-filter: blur(2px);
}

.preview-frame {
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.05),
    0 20px 50px rgba(0, 0, 0, 0.3);
}

.preview-canvas {
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

:global(.dark) .preview-canvas {
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}
</style>
