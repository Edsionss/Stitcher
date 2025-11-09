<template>
  <div class="style-panel flex flex-col gap-4 p-4 bg-white dark:bg-slate-900 rounded-lg shadow">
    <!-- 布局属性 -->
    <div class="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
      <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-200">
        布局
      </h4>

      <div class="grid grid-cols-2 gap-3">
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

    <!-- 样式属性 -->
    <div v-if="editableStyles.length > 0" class="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
      <h4 class="text-sm font-semibold text-slate-800 dark:text-slate-200">
        样式
      </h4>

      <div class="space-y-2">
        <div
          v-for="style in editableStyles"
          :key="style"
          class="space-y-1"
        >
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
            {{ style }}
          </label>
          <input
            :value="componentStyles[style] || ''"
            @input="handleStyleChange(style, ($event.target as HTMLInputElement).value)"
            type="text"
            class="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950"
            :placeholder="`${style}...`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentTreeStore } from '@/stores/componentTree'
import { ALL_COMPONENTS } from '@/data/components'
import type { ComponentNode, ComponentStyle } from '@/types/component'

interface Props {
  component: ComponentNode | null
}

const props = defineProps<Props>()

const componentTreeStore = useComponentTreeStore()

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

// 计算属性：组件样式（除布局外）
const componentStyles = computed(() => {
  if (!props.component?.styles) return {}
  const { left, top, width, height, position, zIndex, ...rest } = props.component.styles
  return rest
})

// 计算属性：可编辑的样式
const editableStyles = computed(() => {
  if (!props.component) return []
  const meta = ALL_COMPONENTS.find(c => c.type === props.component!.type)
  if (!meta?.styles) return []

  const styleProperties: string[] = []
  meta.styles.forEach((style: ComponentStyle) => {
    styleProperties.push(...style.properties)
  })

  // 过滤掉已经在布局中显示的属性
  return styleProperties.filter(s => !['left', 'top', 'width', 'height', 'zIndex'].includes(s))
})

// 处理样式变化
function handleStyleChange(name: string, value: string) {
  if (props.component) {
    componentTreeStore.updateComponent(props.component.id, {
      styles: {
        ...props.component.styles,
        [name]: value
      }
    })
  }
}
</script>

<style scoped>
.style-panel {
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
</style>
