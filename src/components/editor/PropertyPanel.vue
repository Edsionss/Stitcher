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

    <!-- 组件属性 -->
    <div v-if="editableProps.length > 0" class="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
      <h4 class="text-xs font-semibold text-slate-700 dark:text-slate-300">
        属性
      </h4>

      <div class="space-y-3">
        <div
          v-for="prop in editableProps"
          :key="prop.name"
          class="space-y-1"
        >
          <label class="text-xs font-medium text-slate-600 dark:text-slate-400">
            {{ prop.label }}
            <span v-if="prop.required" class="text-red-500">*</span>
          </label>

          <!-- 文本输入 -->
          <input
            v-if="prop.type === 'string'"
            :value="componentProps[prop.name]"
            @input="handlePropChange(prop.name, ($event.target as HTMLInputElement).value)"
            type="text"
            :placeholder="prop.description || prop.label"
            class="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950"
          />

          <!-- 数字输入 -->
          <input
            v-else-if="prop.type === 'number'"
            :value="componentProps[prop.name]"
            @input="handlePropChange(prop.name, Number(($event.target as HTMLInputElement).value))"
            type="number"
            class="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950"
          />

          <!-- 布尔值 -->
          <label
            v-else-if="prop.type === 'boolean'"
            class="flex items-center gap-2 cursor-pointer"
          >
            <input
              :checked="componentProps[prop.name]"
              @change="handlePropChange(prop.name, ($event.target as HTMLInputElement).checked)"
              type="checkbox"
              class="rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary"
            />
            <span class="text-xs text-slate-600 dark:text-slate-400">{{ prop.label }}</span>
          </label>

          <!-- 选择器 -->
          <select
            v-else-if="prop.type === 'select'"
            :value="componentProps[prop.name]"
            @change="handlePropChange(prop.name, ($event.target as HTMLSelectElement).value)"
            class="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950"
          >
            <option
              v-for="option in prop.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>

          <!-- 颜色选择 -->
          <div
            v-else-if="prop.type === 'color'"
            class="flex items-center gap-2"
          >
            <input
              :value="componentProps[prop.name]"
              @input="handlePropChange(prop.name, ($event.target as HTMLInputElement).value)"
              type="color"
              class="w-8 h-8 p-0 border border-slate-300 dark:border-slate-600 rounded cursor-pointer"
            />
            <input
              :value="componentProps[prop.name]"
              @input="handlePropChange(prop.name, ($event.target as HTMLInputElement).value)"
              type="text"
              class="flex-1 px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950"
              placeholder="#000000"
            />
          </div>

          <!-- 对象/数组 -->
          <textarea
            v-else-if="prop.type === 'object' || prop.type === 'array'"
            :value="formatJson(componentProps[prop.name])"
            @input="handleJsonChange(prop.name, ($event.target as HTMLTextAreaElement).value)"
            type="text"
            rows="3"
            class="w-full px-2 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-950 font-mono"
            placeholder="{ } 或 [ ]"
          />
        </div>
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
import { computed } from 'vue'
import { useComponentTreeStore } from '@/stores/componentTree'
import { useEditorStore } from '@/stores/editor'
import { ALL_COMPONENTS } from '@/data/components'
import type { ComponentNode, ComponentProp } from '@/types/component'

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

// 计算属性：组件props
const componentProps = computed(() => {
  return props.component?.props || {}
})

// 计算属性：可编辑的props
const editableProps = computed(() => {
  if (!props.component) return []
  const meta = ALL_COMPONENTS.find(c => c.type === props.component!.type)
  return meta?.props || []
})

// 处理prop变化
function handlePropChange(name: string, value: any) {
  if (props.component) {
    componentTreeStore.updateComponent(props.component.id, {
      props: {
        ...props.component.props,
        [name]: value
      }
    })
  }
}

// 处理JSON prop变化
function handleJsonChange(name: string, value: string) {
  if (!value.trim()) {
    handlePropChange(name, value)
    return
  }

  try {
    const parsed = JSON.parse(value)
    handlePropChange(name, parsed)
  } catch (e) {
    // JSON解析错误，忽略
  }
}

// 格式化JSON
function formatJson(value: any): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2)
  }
  return String(value)
}

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
