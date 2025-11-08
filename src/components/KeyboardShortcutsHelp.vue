<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="shortcuts-modal-overlay fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
      @click="handleBackdropClick"
    >
      <div
        class="shortcuts-modal bg-white dark:bg-[#1a1a1a] rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
        @click.stop
      >
        <!-- 头部 -->
        <div class="shortcuts-header flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
            快捷键帮助
          </h2>
          <button
            @click="close"
            class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="关闭"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- 快捷键列表 -->
        <div class="shortcuts-content flex-1 overflow-auto p-6">
          <div class="grid grid-cols-1 gap-4">
            <!-- 文件操作 -->
            <div class="shortcuts-group">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-base">folder</span>
                文件操作
              </h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">保存项目</span>
                  <kbd class="shortcut-key">Ctrl+S</kbd>
                </div>
              </div>
            </div>

            <!-- 编辑操作 -->
            <div class="shortcuts-group">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-base">edit</span>
                编辑操作
              </h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">撤销</span>
                  <kbd class="shortcut-key">Ctrl+Z</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">重做</span>
                  <kbd class="shortcut-key">Ctrl+Y</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">重做</span>
                  <kbd class="shortcut-key">Ctrl+Shift+Z</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">复制</span>
                  <kbd class="shortcut-key">Ctrl+C</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">粘贴</span>
                  <kbd class="shortcut-key">Ctrl+V</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">删除</span>
                  <kbd class="shortcut-key">Delete / Backspace</kbd>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">全选</span>
                  <kbd class="shortcut-key">Ctrl+A</kbd>
                </div>
              </div>
            </div>

            <!-- 视图操作 -->
            <div class="shortcuts-group">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-base">visibility</span>
                视图操作
              </h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-slate-600 dark:text-slate-400">取消选择</span>
                  <kbd class="shortcut-key">Esc</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部提示 -->
        <div class="shortcuts-footer p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
          <p class="text-xs text-slate-500 dark:text-slate-400 text-center">
            提示：在输入框中输入时，快捷键将不会生效
          </p>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleBackdropClick = () => {
  close();
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.shortcuts-modal-overlay {
  backdrop-filter: blur(2px);
}

.shortcut-key {
  @apply px-2 py-1 text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600;
}

.shortcuts-group {
  @apply p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg;
}
</style>
