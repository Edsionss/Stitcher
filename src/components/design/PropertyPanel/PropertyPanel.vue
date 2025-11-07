<template>
  <div class="property-panel h-full flex flex-col bg-white dark:bg-[#15202B] border-l border-slate-200 dark:border-slate-800">
    <!-- 面板标题 -->
    <div class="panel-header flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300">属性面板</h3>
      <button
        v-if="selectedIds.length > 0"
        @click="clearSelection"
        class="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      >
        清除选择
      </button>
    </div>

    <!-- 内容区域 -->
    <div class="panel-content flex-1 overflow-auto">
      <!-- 未选择组件时 -->
      <div v-if="selectedIds.length === 0" class="empty-state p-6 text-center">
        <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">
          info
        </span>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-3">
          请在画布中选择一个组件进行编辑
        </p>
      </div>

      <!-- 多选提示 -->
      <div v-else-if="selectedIds.length > 1" class="multi-select-notice p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-600 dark:text-blue-400">select_all</span>
          <span class="text-sm text-blue-700 dark:text-blue-300">
            已选择 {{ selectedIds.length }} 个组件
          </span>
        </div>
        <p class="text-xs text-blue-600 dark:text-blue-400 mt-1">
          仅显示通用属性
        </p>
      </div>

      <!-- 单个组件属性 -->
      <div v-else class="properties-container p-4">
        <!-- 组件信息 -->
        <div class="component-info mb-6 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <h4 class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            组件信息
          </h4>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between">
              <span class="text-slate-600 dark:text-slate-400">类型：</span>
              <span class="text-slate-900 dark:text-slate-200 font-mono">{{ currentComponent?.type }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-600 dark:text-slate-400">ID：</span>
              <span class="text-slate-900 dark:text-slate-200 font-mono text-xs">{{ currentComponent?.id }}</span>
            </div>
          </div>
        </div>

        <!-- 基础属性 -->
        <div class="property-section mb-6">
          <h4 class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">edit</span>
            基础属性
          </h4>
          <div class="space-y-3">
            <div v-for="(value, key) in basicProps" :key="key" class="property-field">
              <label class="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                {{ getPropLabel(key) }}
              </label>
              <!-- 文本输入 -->
              <input
                v-if="isTextProp(key)"
                type="text"
                :value="value"
                @input="(e) => updateProp(key, (e.target as HTMLInputElement).value)"
                class="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <!-- 数字输入 -->
              <input
                v-else-if="isNumberProp(key)"
                type="number"
                :value="value"
                @input="(e) => updateProp(key, parseInt((e.target as HTMLInputElement).value) || 0)"
                class="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <!-- 布尔值 -->
              <label v-else-if="isBooleanProp(key)" class="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  :checked="value"
                  @change="(e) => updateProp(key, (e.target as HTMLInputElement).checked)"
                  class="w-4 h-4 text-primary border-slate-300 dark:border-slate-600 rounded focus:ring-primary"
                />
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ getPropLabel(key) }}</span>
              </label>
              <!-- 下拉选择 -->
              <select
                v-else-if="isSelectProp(key)"
                :value="value"
                @change="(e) => updateProp(key, (e.target as HTMLSelectElement).value)"
                class="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option v-for="option in getSelectOptions(key)" :key="option.value" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <!-- 默认文本 -->
              <input
                v-else
                type="text"
                :value="value"
                @input="(e) => updateProp(key, (e.target as HTMLInputElement).value)"
                class="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- 样式属性 -->
        <div class="property-section mb-6">
          <h4 class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">palette</span>
            样式
          </h4>
          <div class="space-y-3">
            <!-- 颜色选择 -->
            <div class="property-field">
              <label class="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                前景色
              </label>
              <div class="flex gap-2">
                <input
                  type="color"
                  :value="styleProps.color || '#000000'"
                  @input="(e) => updateStyleProp('color', (e.target as HTMLInputElement).value)"
                  class="w-12 h-10 border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  :value="styleProps.color || '#000000'"
                  @input="(e) => updateStyleProp('color', (e.target as HTMLInputElement).value)"
                  class="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div class="property-field">
              <label class="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                背景色
              </label>
              <div class="flex gap-2">
                <input
                  type="color"
                  :value="styleProps.backgroundColor || '#ffffff'"
                  @input="(e) => updateStyleProp('backgroundColor', (e.target as HTMLInputElement).value)"
                  class="w-12 h-10 border border-slate-200 dark:border-slate-700 rounded-md cursor-pointer"
                />
                <input
                  type="text"
                  :value="styleProps.backgroundColor || '#ffffff'"
                  @input="(e) => updateStyleProp('backgroundColor', (e.target as HTMLInputElement).value)"
                  class="flex-1 px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <!-- 尺寸 -->
            <div class="grid grid-cols-2 gap-3">
              <div class="property-field">
                <label class="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  宽度
                </label>
                <input
                  type="text"
                  :value="styleProps.width || ''"
                  @input="(e) => updateStyleProp('width', (e.target as HTMLInputElement).value)"
                  placeholder="auto"
                  class="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div class="property-field">
                <label class="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                  高度
                </label>
                <input
                  type="text"
                  :value="styleProps.height || ''"
                  @input="(e) => updateStyleProp('height', (e.target as HTMLInputElement).value)"
                  placeholder="auto"
                  class="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <!-- 内边距 -->
            <div class="property-field">
              <label class="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                内边距
              </label>
              <input
                type="text"
                :value="styleProps.padding || ''"
                @input="(e) => updateStyleProp('padding', (e.target as HTMLInputElement).value)"
                placeholder="0px"
                class="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <!-- 外边距 -->
            <div class="property-field">
              <label class="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                外边距
              </label>
              <input
                type="text"
                :value="styleProps.margin || ''"
                @input="(e) => updateStyleProp('margin', (e.target as HTMLInputElement).value)"
                placeholder="0px"
                class="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <!-- 事件处理 -->
        <div class="property-section">
          <h4 class="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">bolt</span>
            事件
          </h4>
          <div class="space-y-3">
            <div class="property-field">
              <label class="block text-xs text-slate-600 dark:text-slate-400 mb-1">
                点击事件
              </label>
              <input
                type="text"
                :value="eventProps.onClick || ''"
                @input="(e) => updateEventProp('onClick', (e.target as HTMLInputElement).value)"
                placeholder="onClick"
                class="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useDesignStore } from '@/stores/design';
import type { ComponentNode } from '@/types/component';

// ========== Store ==========
const designStore = useDesignStore();

// ========== 计算属性 ==========
const selectedIds = computed(() => designStore.selectedIds);
const currentComponent = computed<ComponentNode | null>(() => {
  if (selectedIds.value.length === 1) {
    const firstId = selectedIds.value[0];
    return firstId ? designStore.componentTree.allComponents.get(firstId) || null : null;
  }
  return null;
});

// 基础属性（仅显示可编辑的通用属性）
const basicProps = computed(() => {
  if (!currentComponent.value) return {};
  return currentComponent.value.props || {};
});

// 样式属性
const styleProps = reactive<Record<string, string>>({});

// 事件属性
const eventProps = reactive<Record<string, string>>({});

// ========== 方法 ==========
const clearSelection = () => {
  designStore.clearSelection();
};

const getPropLabel = (key: string): string => {
  const labels: Record<string, string> = {
    text: '文本',
    placeholder: '占位符',
    disabled: '禁用',
    readonly: '只读',
    type: '类型',
    variant: '变体',
    size: '尺寸',
  };
  return labels[key] || key;
};

const isTextProp = (key: string): boolean => {
  return ['text', 'placeholder', 'title', 'value'].includes(key);
};

const isNumberProp = (key: string): boolean => {
  return ['maxLength', 'minLength', 'rows', 'cols'].includes(key);
};

const isBooleanProp = (key: string): boolean => {
  return ['disabled', 'readonly', 'required', 'multiple'].includes(key);
};

const isSelectProp = (key: string): boolean => {
  return ['type', 'variant', 'size'].includes(key);
};

const getSelectOptions = (key: string) => {
  const options: Record<string, Array<{ value: string; label: string }>> = {
    type: [
      { value: 'text', label: '文本' },
      { value: 'password', label: '密码' },
      { value: 'email', label: '邮箱' },
      { value: 'number', label: '数字' },
    ],
    variant: [
      { value: 'default', label: '默认' },
      { value: 'primary', label: '主要' },
      { value: 'secondary', label: '次要' },
      { value: 'outline', label: '描边' },
    ],
    size: [
      { value: 'sm', label: '小' },
      { value: 'default', label: '默认' },
      { value: 'lg', label: '大' },
    ],
  };
  return options[key] || [];
};

const updateProp = (key: string, value: any) => {
  if (!currentComponent.value) return;
  designStore.updateComponentProps(currentComponent.value.id, { [key]: value });
};

const updateStyleProp = (key: string, value: string) => {
  if (!currentComponent.value) return;
  styleProps[key] = value;
  designStore.updateComponentStyle(currentComponent.value.id, { [key]: value });
};

const updateEventProp = (key: string, value: string) => {
  if (!currentComponent.value) return;
  eventProps[key] = value;
  designStore.updateComponentEvents(currentComponent.value.id, { [key]: value });
};
</script>

<style scoped>
.property-panel {
  width: 320px;
}

.property-section {
  border-left: 3px solid transparent;
  padding-left: 12px;
}

.property-section:hover {
  border-left-color: #e2e8f0;
}

:global(.dark) .property-section:hover {
  border-left-color: #334155;
}

.property-field input:focus,
.property-field select:focus {
  outline: none;
}

.empty-state {
  min-height: 200px;
}
</style>
