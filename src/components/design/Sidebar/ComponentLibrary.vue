<template>
  <div class="component-library h-full flex flex-col bg-white dark:bg-[#15202B] border-r border-slate-200 dark:border-slate-800">
    <!-- 头部 -->
    <div class="p-4 border-b border-slate-200 dark:border-slate-800">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">组件库</h2>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">拖拽组件到画布</p>
    </div>

    <!-- 组件库选择器 -->
    <div class="p-4 border-b border-slate-200 dark:border-slate-800">
      <select
        v-model="selectedLibrary"
        class="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-sm text-slate-900 dark:text-white"
        @change="handleLibraryChange"
      >
        <option value="shadcn">shadcn-vue</option>
        <option value="element" disabled>Element Plus (待适配)</option>
        <option value="antd" disabled>Ant Design Vue (待适配)</option>
      </select>
    </div>

    <!-- 组件分类 -->
    <div class="flex-1 overflow-y-auto">
      <div
        v-for="(components, categoryId) in groupedComponents"
        :key="categoryId"
        class="category-group"
      >
        <div class="category-header">
          <span class="category-title">
            {{ getCategoryName(categoryId) }}
          </span>
          <span class="category-count">{{ components.length }}</span>
        </div>

        <Draggable
          :list="components"
          :group="{ name: 'components', pull: 'clone', put: false }"
          :clone="cloneComponent"
          item-key="type"
          :sort="false"
          :animation="200"
          :ghost-class="'drag-ghost'"
          :chosen-class="'drag-chosen'"
          class="component-list"
        >
          <template #item="{ element }">
            <div class="component-card">
              <div class="component-icon">
                <span class="material-symbols-outlined">{{ element.icon || 'box' }}</span>
              </div>
              <div class="component-info">
                <div class="component-name">{{ element.name }}</div>
                <div class="component-desc">{{ element.description || '无描述' }}</div>
              </div>
            </div>
          </template>
        </Draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Draggable from 'vuedraggable';
import type { ComponentNode, ComponentLibrary } from '@/types/component';
import { COMPONENT_CONFIG, componentUtils } from '@/config/components.config';
import { dragUtils } from '@/config/drag.config';
import { useDesignStore } from '@/stores/design';

const designStore = useDesignStore();

// ========== 状态 ==========
const selectedLibrary = ref<ComponentLibrary>('shadcn');

// 组件库数据
const componentLibrary = ref<ComponentNode[]>([]);

// ========== 计算属性 ==========
const groupedComponents = computed(() => {
  return componentUtils.groupByCategory(componentLibrary.value);
});

// ========== 方法 ==========
const loadComponentLibrary = (library: ComponentLibrary) => {
  const components = COMPONENT_CONFIG[library.toUpperCase() as keyof typeof COMPONENT_CONFIG] || {};
  const result: ComponentNode[] = [];

  Object.entries(components).forEach(([key, meta]) => {
    result.push({
      id: '',
      type: meta.type,
      name: meta.name,
      library: selectedLibrary.value,
      category: meta.category,
      icon: meta.icon,
      description: meta.description,
      props: meta.defaultProps || {},
      style: {},
      events: {},
      lifecycle: {},
      children: [],
    });
  });

  componentLibrary.value = result;
};

const cloneComponent = (component: ComponentNode): ComponentNode => {
  const cloned = JSON.parse(JSON.stringify(component));
  cloned.id = dragUtils.generateId();
  cloned.name = component.name;
  cloned.library = selectedLibrary.value;
  return cloned;
};

const getCategoryName = (categoryId: string): string => {
  const category = COMPONENT_CONFIG.CATEGORIES[categoryId as keyof typeof COMPONENT_CONFIG.CATEGORIES];
  return category ? category.name : categoryId;
};

const handleLibraryChange = () => {
  loadComponentLibrary(selectedLibrary.value);
};

// ========== 初始化 ==========
onMounted(() => {
  loadComponentLibrary(selectedLibrary.value);
});
</script>

<style scoped>
.component-library {
  width: 280px;
}

.category-group {
  border-bottom: 1px solid #e2e8f0;
}

:global(.dark) .category-group {
  border-color: #334155;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f8fafc;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

:global(.dark) .category-header {
  background: #1e293b;
  color: #e2e8f0;
}

.category-title {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-count {
  font-size: 11px;
  padding: 2px 6px;
  background: #e2e8f0;
  color: #64748b;
  border-radius: 10px;
}

:global(.dark) .category-count {
  background: #334155;
  color: #94a3b8;
}

.component-list {
  padding: 8px;
}

.component-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: grab;
  transition: all 0.2s;
}

:global(.dark) .component-card {
  background: #1e293b;
  border-color: #334155;
}

.component-card:hover {
  border-color: #2b8cee;
  box-shadow: 0 2px 8px rgba(43, 140, 238, 0.15);
}

.component-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 20px;
  color: #64748b;
}

:global(.dark) .component-icon {
  background: #334155;
  color: #94a3b8;
}

.component-info {
  flex: 1;
  min-width: 0;
}

.component-name {
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  margin-bottom: 2px;
}

:global(.dark) .component-name {
  color: #fff;
}

.component-desc {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:global(.dark) .component-desc {
  color: #94a3b8;
}

/* 拖拽样式 */
:deep(.drag-ghost) {
  opacity: 0.5;
  background: #e0f2fe;
}

:deep(.drag-chosen) {
  opacity: 0.8;
  background: #bae6fd;
}

:deep(.sortable-ghost) {
  opacity: 0.5;
  background: #e0f2fe;
}
</style>
