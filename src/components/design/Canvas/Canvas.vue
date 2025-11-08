<template>
  <div class="canvas-container h-full flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden">
    <!-- 画布工具栏 -->
    <div class="canvas-toolbar flex items-center gap-2 p-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#15202B]">
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
      <div class="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
      <button
        @click="fitToScreen"
        class="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        适应屏幕
      </button>
      <button
        @click="resetZoom"
        class="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        重置
      </button>
      <div class="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
      <button
        @click="toggleGrid"
        :class="[
          'px-3 py-1 text-sm rounded',
          showGrid
            ? 'bg-primary text-white'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        ]"
      >
        网格
      </button>
    </div>

    <!-- 画布主体 -->
    <div class="canvas-wrapper flex-1 overflow-auto p-8">
      <div
        class="canvas-board relative"
        :style="{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${zoom})`,
          transformOrigin: 'top left',
        }"
      >
        <!-- 背景网格 -->
        <div
          v-if="showGrid"
          class="absolute inset-0 pointer-events-none"
          :style="{
            backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px),
                              linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            opacity: gridOpacity,
          }"
        ></div>

        <!-- 拖拽放置区域 -->
        <Draggable
          v-model="canvasComponents"
          :group="{ name: 'components', pull: false, put: true }"
          item-key="id"
          :sort="true"
          :animation="150"
          :ghost-class="'drag-ghost'"
          :chosen-class="'drag-chosen'"
          :drag-class="'drag-drag'"
          class="canvas-components relative min-h-full"
          :class="{ 'empty': canvasComponents.length === 0 }"
          @add="handleComponentAdd"
          @update="handleComponentUpdate"
          @remove="handleComponentRemove"
          @end="handleDragEnd"
        >
          <template #item="{ element, index }">
            <div class="canvas-item-wrapper">
              <!-- 组件渲染 -->
              <div
                class="canvas-item"
                :class="{
                  active: selectedIds.includes(element.id),
                  selected: selectedIds.includes(element.id),
                }"
                :data-component-id="element.id"
                @click="selectComponent(element.id, $event)"
              >
                <!-- 组件工具栏 -->
                <div v-if="selectedIds.includes(element.id)" class="component-toolbar">
                  <button
                    @click.stop="duplicateComponent(element.id)"
                    class="toolbar-btn"
                    title="复制"
                  >
                    <span class="material-symbols-outlined">content_copy</span>
                  </button>
                  <button
                    @click.stop="deleteComponent(element.id)"
                    class="toolbar-btn text-red-500"
                    title="删除"
                  >
                    <span class="material-symbols-outlined">delete</span>
                  </button>
                </div>

                <!-- 实际组件渲染 -->
                <component
                  :is="getComponentRenderer(element)"
                  :component="element"
                  class="actual-component"
                >
                  <!-- 嵌套拖拽容器 -->
                  <div v-if="element.children && element.children.length > 0" class="nested-container">
                    <Draggable
                      v-model="element.children"
                      :group="{ name: 'components' }"
                      item-key="id"
                      :sort="true"
                      :animation="150"
                      class="nested-draggable"
                      @add="handleNestedAdd(element.id, $event)"
                      @update="handleNestedUpdate(element.id, $event)"
                    >
                      <template #item="{ element: child }">
                        <div
                          class="canvas-item nested-item"
                          :class="{ active: selectedIds.includes(child.id) }"
                          :data-component-id="child.id"
                          @click="selectComponent(child.id, $event)"
                        >
                          <component
                            :is="getComponentRenderer(child)"
                            :component="child"
                          />
                        </div>
                      </template>
                    </Draggable>
                  </div>
                </component>
              </div>

              <!-- 空白占位符 -->
              <div v-if="index === canvasComponents.length - 1" class="canvas-placeholder">
                <span class="material-symbols-outlined text-slate-400">add_circle</span>
                <p class="text-slate-500 dark:text-slate-400">拖拽组件到这里</p>
              </div>
            </div>
          </template>

          <!-- 空画布提示 -->
          <template #footer v-if="canvasComponents.length === 0">
            <div class="flex h-full w-full flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#15202B]/50 p-6 min-h-[calc(100vh-10rem)]">
              <div class="flex max-w-[480px] flex-col items-center gap-2">
                <span class="material-symbols-outlined text-5xl text-primary">add_circle</span>
                <p class="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">开始构建您的应用</p>
                <p class="text-slate-600 dark:text-slate-400 text-sm font-normal leading-normal text-center">从左侧拖拽组件到画布开始</p>
              </div>
              <button class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:hover:bg-slate-700">
                <span class="truncate">浏览组件</span>
              </button>
            </div>
          </template>
        </Draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import Draggable from 'vuedraggable';
import { useDesignStore } from '@/stores/design';
import { useDeviceStore } from '@/stores/device';
import { DRAG_CONFIG, dragUtils } from '@/config/drag.config';
import type { ComponentNode } from '@/types/component';

// ========== Store ==========
const designStore = useDesignStore();
const deviceStore = useDeviceStore();

// ========== 状态 ==========
const zoom = ref(1);
const showGrid = ref(true);

// ========== 计算属性 ==========
const canvasWidth = computed(() => designStore.canvas.width);
const canvasHeight = computed(() => designStore.canvas.height);
const canvasComponents = computed({
  get: () => designStore.componentTree.rootComponents,
  set: (value) => {
    // 更新根组件
    designStore.componentTree.rootComponents = value;
  },
});
const selectedIds = computed(() => designStore.selectedIds);

const gridSize = computed(() => designStore.canvas.gridSize);
const gridColor = computed(() => '#e2e8f0');
const gridOpacity = computed(() => 0.5);

// ========== 方法 ==========
const handleComponentAdd = (e: any) => {
  const component = e.item._underlying_vm_;
  const newIndex = e.newIndex;

  // 设置父级关系
  component.parentId = undefined;
  component.id = dragUtils.generateId();

  // 触发设计器状态更新
  designStore.addComponent(component, undefined, newIndex);

  console.log('组件添加:', component);
};

const handleComponentUpdate = (e: any) => {
  const { oldIndex, newIndex } = e;
  console.log('组件更新:', { oldIndex, newIndex });

  // 更新组件位置
  // designStore.moveComponent(...)
};

const handleComponentRemove = (e: any) => {
  const component = e.item._underlying_vm_;
  console.log('组件移除:', component);

  // 从设计器状态中移除
  // designStore.removeComponent(component.id);
};

const handleDragEnd = (e: any) => {
  console.log('拖拽结束:', e);
  designStore.setDragging(false);
};

const handleNestedAdd = (parentId: string, e: any) => {
  const component = e.item._underlying_vm_;
  const newIndex = e.newIndex;

  component.parentId = parentId;
  component.id = dragUtils.generateId();

  designStore.addComponent(component, parentId, newIndex);

  console.log('嵌套组件添加:', component);
};

const handleNestedUpdate = (parentId: string, e: any) => {
  console.log('嵌套组件更新:', e);
};

const selectComponent = (componentId: string, event: MouseEvent) => {
  if (!componentId) return;

  // 支持多选
  if (event.ctrlKey || event.metaKey) {
    const ids = [...selectedIds.value];
    if (ids.includes(componentId)) {
      designStore.deselectComponent(componentId);
    } else {
      designStore.selectComponent(componentId);
    }
  } else if (event.shiftKey && selectedIds.value.length > 0) {
    // Shift多选
    const lastSelected = selectedIds.value[selectedIds.value.length - 1];
    if (!lastSelected || !componentId) return;

    const components = designStore.componentTree.allComponents;
    const componentKeys = Array.from(components.keys()).filter(key => key !== undefined) as string[];
    const index1 = componentKeys.indexOf(lastSelected);
    const index2 = componentKeys.indexOf(componentId);

    if (index1 === -1 || index2 === -1) {
      designStore.selectComponent(componentId);
      return;
    }

    const [start, end] = index1 < index2 ? [index1, index2] : [index2, index1];
    const newIds = componentKeys.slice(start, end + 1);
    designStore.selectComponents(newIds);
  } else {
    designStore.selectComponent(componentId);
  }
};

const duplicateComponent = (componentId: string) => {
  designStore.duplicateComponent(componentId);
};

const deleteComponent = (componentId: string) => {
  designStore.removeComponent(componentId);
};

import BaseComponents from '@/components/base/BaseComponents.vue';

const getComponentRenderer = (component: ComponentNode) => {
  // 使用 BaseComponents 来渲染所有组件
  return BaseComponents;
};

// 缩放控制
const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.25, 4);
};

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.25, 0.25);
};

const resetZoom = () => {
  zoom.value = 1;
};

const fitToScreen = () => {
  // 简化的适应屏幕逻辑
  zoom.value = 0.8;
};

const toggleGrid = () => {
  showGrid.value = !showGrid.value;
  designStore.setCanvasState({ showGrid: showGrid.value });
};
</script>

<style scoped>
.canvas-container {
  display: flex;
  flex-direction: column;
}

.canvas-wrapper {
  position: relative;
  overflow: auto;
  background: #f6f7f8;
}

:global(.dark) .canvas-wrapper {
  background: #0f172a;
}

.canvas-board {
  position: relative;
  margin: 0 auto;
  background: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

:global(.dark) .canvas-board {
  background: #1e293b;
}

.canvas-components {
  position: relative;
  min-height: 100%;
  padding: 20px;
}

.canvas-components.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.canvas-item-wrapper {
  position: relative;
  margin-bottom: 8px;
}

.canvas-item {
  position: relative;
  background: white;
  border: 2px solid transparent;
  border-radius: 4px;
  transition: all 0.2s;
  cursor: pointer;
}

:global(.dark) .canvas-item {
  background: #1e293b;
}

.canvas-item:hover {
  border-color: #e2e8f0;
}

:global(.dark) .canvas-item:hover {
  border-color: #334155;
}

.canvas-item.active,
.canvas-item.selected {
  border-color: #2b8cee;
  box-shadow: 0 0 0 1px #2b8cee;
}

.actual-component {
  padding: 12px;
}

.component-toolbar {
  position: absolute;
  top: -40px;
  right: 0;
  display: flex;
  gap: 4px;
  padding: 4px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

:global(.dark) .component-toolbar {
  background: #1e293b;
  border-color: #334155;
}

.toolbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

:global(.dark) .toolbar-btn {
  color: #94a3b8;
}

.toolbar-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

:global(.dark) .toolbar-btn:hover {
  background: #334155;
  color: #fff;
}

.nested-container {
  margin-left: 20px;
  padding: 10px;
  border-left: 2px dashed #e2e8f0;
  min-height: 50px;
}

:global(.dark) .nested-container {
  border-left-color: #334155;
}

.nested-draggable {
  min-height: 30px;
}

.nested-item {
  margin-bottom: 4px;
}

.empty-canvas {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;
}

:global(.dark) .empty-canvas {
  color: #64748b;
}

.canvas-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
  color: #94a3b8;
  margin-top: 20px;
}

:global(.dark) .canvas-placeholder {
  border-color: #334155;
  color: #64748b;
}

.canvas-placeholder p {
  margin-top: 8px;
  font-size: 14px;
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
