<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="export-modal-overlay fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      @click="handleBackdropClick"
    >
      <div
        class="export-modal bg-white dark:bg-[#1a1a1a] rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col"
        @click.stop
      >
        <!-- 头部工具栏 -->
        <div class="export-header flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
              代码导出
            </h2>
            <div class="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
            <select
              v-model="selectedFormat"
              class="px-3 py-1.5 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              <option value="vue-sfc">Vue SFC</option>
              <option value="vue-jsx">Vue JSX</option>
              <option value="html">HTML</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="copyToClipboard"
              class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2"
              title="复制代码"
            >
              <span class="material-symbols-outlined">content_copy</span>
              复制
            </button>
            <button
              @click="downloadCode"
              class="px-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-2"
              title="下载文件"
            >
              <span class="material-symbols-outlined">download</span>
              下载
            </button>
            <button
              @click="close"
              class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="关闭"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <!-- 代码预览区域 -->
        <div class="export-content flex-1 overflow-auto p-4">
          <div class="code-container bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-auto">
            <pre class="text-sm text-slate-100 font-mono whitespace-pre-wrap"><code>{{ generatedCode }}</code></pre>
          </div>
        </div>

        <!-- 底部信息栏 -->
        <div class="export-footer flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-4">
            <span>格式: {{ formatLabel }}</span>
            <span>行数: {{ lineCount }}</span>
            <span>大小: {{ fileSize }} KB</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="copySuccess" class="text-green-500 dark:text-green-400 flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">check_circle</span>
              已复制
            </span>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDesignStore } from '@/stores/design';
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

// ========== 状态 ==========
const selectedFormat = ref<'vue-sfc' | 'vue-jsx' | 'html'>('vue-sfc');
const copySuccess = ref(false);

// ========== 计算属性 ==========
const componentTree = computed(() => designStore.componentTree);

const formatLabel = computed(() => {
  const labels = {
    'vue-sfc': 'Vue SFC (.vue)',
    'vue-jsx': 'Vue JSX',
    'html': 'HTML',
  };
  return labels[selectedFormat.value];
});

// ========== 导入代码生成器 ==========
import {
  generateVueSFC,
  generateVueJSX,
  generateHTML,
} from '@/utils/CodeGenerator';

// ========== 代码生成 ==========
const generatedCode = computed(() => {
  const components = componentTree.value.rootComponents;
  switch (selectedFormat.value) {
    case 'vue-sfc':
      return generateVueSFC(components);
    case 'vue-jsx':
      return generateVueJSX(components);
    case 'html':
      return generateHTML(components);
    default:
      return '';
  }
});

const lineCount = computed(() => {
  return generatedCode.value.split('\n').length;
});

const fileSize = computed(() => {
  return Math.ceil(new Blob([generatedCode.value]).size / 1024);
});

// ========== 方法 ==========
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedCode.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
  }
};

const downloadCode = () => {
  const extension = {
    'vue-sfc': 'vue',
    'vue-jsx': 'js',
    'html': 'html',
  }[selectedFormat.value];

  const filename = `generated-component.${extension}`;
  const blob = new Blob([generatedCode.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
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
.export-modal-overlay {
  backdrop-filter: blur(2px);
}

.code-container {
  max-height: calc(90vh - 200px);
}
</style>

// 定义组件名称
defineOptions({
  name: 'CodeExportModal'
});
