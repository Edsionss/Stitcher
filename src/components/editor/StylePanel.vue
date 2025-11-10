<template>
  <div class="style-panel flex flex-col gap-4">
    <!-- 布局属性 -->
    <div class="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
      <h4 class="text-sm font-semibold">
        布局
      </h4>

      <div class="grid grid-cols-2 gap-3">
        <!-- Left -->
        <div class="space-y-1">
          <Label class="text-xs font-medium">Left</Label>
          <div class="flex items-center gap-1">
            <NumberField
              v-model="styles.left"
              :min="-9999"
            >
              <NumberFieldInput class="px-2 py-1" />
            </NumberField>
            <span class="text-xs text-slate-500">px</span>
          </div>
        </div>

        <!-- Top -->
        <div class="space-y-1">
          <Label class="text-xs font-medium">Top</Label>
          <div class="flex items-center gap-1">
            <NumberField
              v-model="styles.top"
              :min="-9999"
            >
              <NumberFieldInput class="px-2 py-1" />
            </NumberField>
            <span class="text-xs text-slate-500">px</span>
          </div>
        </div>

        <!-- Width -->
        <div class="space-y-1">
          <Label class="text-xs font-medium">Width</Label>
          <div class="flex items-center gap-1">
            <NumberField
              v-model="styles.width"
              :min="0"
            >
              <NumberFieldInput class="px-2 py-1" />
            </NumberField>
            <span class="text-xs text-slate-500">px</span>
          </div>
        </div>

        <!-- Height -->
        <div class="space-y-1">
          <Label class="text-xs font-medium">Height</Label>
          <div class="flex items-center gap-1">
            <NumberField
              v-model="styles.height"
              :min="0"
            >
              <NumberFieldInput class="px-2 py-1" />
            </NumberField>
            <span class="text-xs text-slate-500">px</span>
          </div>
        </div>
      </div>

      <!-- Z-Index -->
      <div class="space-y-1">
        <Label class="text-xs font-medium">Z-Index</Label>
        <NumberField
          v-model="styles.zIndex"
          :min="-9999"
        >
          <NumberFieldInput class="px-2 py-1" />
        </NumberField>
      </div>
    </div>

    <!-- 样式属性 -->
    <div v-if="editableStyles.length > 0" class="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
      <h4 class="text-sm font-semibold">样式</h4>

      <div class="space-y-2">
        <div
          v-for="style in editableStyles"
          :key="style"
          class="space-y-1"
        >
          <Label class="text-xs font-medium">
            {{ style }}
          </Label>
          <Input
            :value="componentStyles[style] || ''"
            @input="handleStyleChange(style, ($event.target as HTMLInputElement).value)"
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

// shadcn-vue components
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumberField, NumberFieldInput } from '@/components/ui/number-field'

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
</style>
