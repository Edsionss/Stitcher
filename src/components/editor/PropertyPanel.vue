<template>
  <div class="property-panel flex flex-col gap-4">
    <!-- 组件基本信息 -->
    <div class="space-y-2">
      <Label class="text-xs font-semibold">组件名称</Label>
      <Input v-model="componentName" placeholder="Component name" />
    </div>

    <!-- 组件类型 -->
    <div class="space-y-2">
      <Label class="text-xs font-semibold">类型</Label>
      <Input :value="component?.type" readonly class="cursor-not-allowed" />
    </div>

    <!-- 组件交互 -->
    <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
      <h4 class="text-xs font-semibold">交互</h4>
      <div class="flex items-center gap-2">
        <Switch :checked="component?.canResize !== false" @update:checked="handleResizeToggle" />
        <div class="flex flex-col">
          <Label class="text-xs text-slate-600 dark:text-slate-400">允许调整大小</Label>
          <span class="text-[10px] text-slate-400">启用后可以在画布上拖拽调整组件大小</span>
        </div>
      </div>
    </div>

    <!-- 组件属性 -->
    <div
      v-if="editableProps.length > 0"
      class="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700"
    >
      <h4 class="text-xs font-semibold">属性</h4>

      <div class="space-y-3">
        <div v-for="prop in editableProps" :key="prop.name" class="space-y-2">
          <Label class="text-xs font-medium">
            {{ prop.label }}
            <span v-if="prop.required" class="text-red-500">*</span>
          </Label>

          <!-- 文本输入 -->
          <Input
            v-if="prop.type === 'string'"
            :value="componentProps[prop.name]"
            @input="handlePropChange(prop.name, ($event.target as HTMLInputElement).value)"
            :placeholder="prop.description || prop.label"
          />

          <!-- 数字输入 -->
          <NumberField
            v-else-if="prop.type === 'number'"
            :model-value="componentProps[prop.name]"
            @update:model-value="handlePropChange(prop.name, $event)"
            :min="0"
          >
            <NumberFieldInput />
          </NumberField>

          <!-- 布尔值 -->
          <div v-else-if="prop.type === 'boolean'" class="flex items-center gap-2">
            <Checkbox
              :checked="componentProps[prop.name]"
              @update:checked="handlePropChange(prop.name, $event)"
            />
            <Label class="text-xs">{{ prop.label }}</Label>
          </div>

          <!-- 选择器 -->
          <Select
            v-else-if="prop.type === 'select'"
            :model-value="componentProps[prop.name]"
            @update:model-value="handlePropChange(prop.name, $event)"
          >
            <SelectTrigger>
              <SelectValue :placeholder="prop.label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in prop.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>

          <!-- 颜色选择 -->
          <div v-else-if="prop.type === 'color'" class="flex items-center gap-2">
            <input
              :value="componentProps[prop.name]"
              @input="handlePropChange(prop.name, ($event.target as HTMLInputElement).value)"
              type="color"
              class="w-8 h-8 p-0 border border-slate-300 dark:border-slate-600 rounded cursor-pointer"
            />
            <Input
              :value="componentProps[prop.name]"
              @input="handlePropChange(prop.name, ($event.target as HTMLInputElement).value)"
              placeholder="#000000"
            />
          </div>

          <!-- 对象/数组 -->
          <Textarea
            v-else-if="prop.type === 'object' || prop.type === 'array'"
            :value="formatJson(componentProps[prop.name])"
            @input="handleJsonChange(prop.name, ($event.target as HTMLTextAreaElement).value)"
            rows="3"
            class="font-mono"
            placeholder="{ } 或 [ ]"
          />
        </div>
      </div>
    </div>

    <!-- 删除按钮 -->
    <div class="pt-2 border-t border-slate-200 dark:border-slate-700">
      <Button
        @click="handleDelete"
        variant="destructive"
        class="w-full bg-destructive text-destructive-foreground!"
      >
        删除组件
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComponentTreeStore } from '@/stores/componentTree'
import { useEditorStore } from '@/stores/editor'
import { ALL_COMPONENTS } from '@/data/components'
import type { ComponentNode, ComponentProp } from '@/types/component'

// shadcn-vue components
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumberField, NumberFieldInput } from '@/components/ui/number-field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'

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
  },
})

// 计算属性：组件props
const componentProps = computed(() => {
  return props.component?.props || {}
})

// 计算属性：可编辑的props
const editableProps = computed(() => {
  if (!props.component) return []
  const meta = ALL_COMPONENTS.find((c) => c.type === props.component!.type)
  return meta?.props || []
})

// 处理prop变化
function handlePropChange(name: string, value: any) {
  if (props.component) {
    componentTreeStore.updateComponent(props.component.id, {
      props: {
        ...props.component.props,
        [name]: value,
      },
    })
  }
}

// 处理调整大小开关
function handleResizeToggle(enabled: boolean | undefined) {
  if (props.component) {
    // 如果启用，设置为 true；如果关闭，设置为 false
    componentTreeStore.updateComponent(props.component.id, {
      canResize: enabled ?? false,
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
</style>
