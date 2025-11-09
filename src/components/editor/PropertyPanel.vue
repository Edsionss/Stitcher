<template>
  <div class="property-panel flex flex-col gap-4">
    <!-- 组件基本信息 -->
    <div class="space-y-2">
      <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">
        组件名称
      </label>
      <input
        v-model="componentName"
        type="text"
        class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
        placeholder="Component name"
      />
    </div>

    <!-- 组件类型 -->
    <div class="space-y-2">
      <label class="text-xs font-semibold text-slate-700 dark:text-slate-300">
        类型
      </label>
      <input
        :value="component?.type"
        type="text"
        readonly
        class="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
      />
    </div>

    <!-- 布局属性 -->
    <div class="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
      <h4 class="text-xs font-semibold text-slate-700 dark:text-slate-300">
        布局
      </h4>

      <div class="grid grid-cols-2 gap-2">
        <!-- Left -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
            Left
          </label>
          <div class="flex items-center gap-1">
            <input
              v-model.number="styles.left"
              type="number"
              class="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950"
            />
            <span class="text-xs text-slate-500">px</span>
          </div>
        </div>

        <!-- Top -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
            Top
          </label>
          <div class="flex items-center gap-1">
            <input
              v-model.number="styles.top"
              type="number"
              class="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950"
            />
            <span class="text-xs text-slate-500">px</span>
          </div>
        </div>

        <!-- Width -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
            Width
          </label>
          <div class="flex items-center gap-1">
            <input
              v-model.number="styles.width"
              type="number"
              class="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950"
            />
            <span class="text-xs text-slate-500">px</span>
          </div>
        </div>

        <!-- Height -->
        <div class="space-y-1">
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
            Height
          </label>
          <div class="flex items-center gap-1">
            <input
              v-model.number="styles.height"
              type="number"
              class="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950"
            />
            <span class="text-xs text-slate-500">px</span>
          </div>
        </div>
      </div>

      <!-- Z-Index -->
      <div class="space-y-1">
        <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
          Z-Index
        </label>
        <input
          v-model.number="styles.zIndex"
          type="number"
          class="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950"
        />
      </div>
    </div>

    <!-- 删除按钮 -->
    <div class="pt-2 border-t border-slate-200 dark:border-slate-700">
      <button
        @click="handleDelete"
        class="w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 font-medium border border-red-200 dark:border-red-900 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
      >
        删除组件
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useComponentTreeStore } from '@/stores/componentTree'
import { useEditorStore } from '@/stores/editor'
import type { ComponentNode } from '@/types/component'

interface Props {
  component: ComponentNode | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  delete: [id: string]
}>()

const componentTreeStore = useComponentTreeStore()
const editorStore = useEditorStore()

// 计算属性：当前选中的组件名称
const componentName = computed({
  get: () => props.component?.name || '',
  set: (value: string) => {
    if (props.component) {
      componentTreeStore.updateComponent(props.component.id, { name: value })
    }
  }
})

// 计算属性：样式对象
const styles = computed({
  get: () => {
    if (!props.component?.styles) return { left: 0, top: 0, width: 100, height: 50, zIndex: 1 }
    return {
      left: parseFloat(props.component.styles?.left?.replace('px', '') || '0'),
      top: parseFloat(props.component.styles?.top?.replace('px', '') || '0'),
      width: parseFloat(props.component.styles?.width?.replace('px', '') || '100'),
      height: parseFloat(props.component.styles?.height?.replace('px', '') || '50'),
      zIndex: props.component.styles?.zIndex || 1
    }
  },
  set: (value) => {
    if (props.component) {
      componentTreeStore.updateComponent(props.component.id, {
        styles: {
          ...props.component.styles,
          left: `${value.left}px`,
          top: `${value.top}px`,
          width: `${value.width}px`,
          height: `${value.height}px`,
          zIndex: value.zIndex
        }
      })
    }
  }
})

// 删除组件
const handleDelete = () => {
  if (props.component) {
    componentTreeStore.deleteComponent(props.component.id)
    editorStore.clearSelection()
    emit('delete', props.component.id)
  }
}
</script>

<style scoped>
.property-panel {
  /* 自定义样式 */
}

input[type='text'],
input[type='number'] {
  transition: border-color 0.2s;
}

input[type='text']:focus,
input[type='number']:focus {
  outline: none;
  border-color: hsl(var(--primary));
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
}

input[readonly] {
  cursor: not-allowed;
  opacity: 0.7;
}
</style>
