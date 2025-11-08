// 设计器状态管理
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ComponentNode } from '@/types/component';
import type { DesignStoreState, CanvasAction, HistoryRecord, DesignProject } from '@/types/design';
import { deviceUtils } from '@/config/device.config';

export const useDesignStore = defineStore('design', () => {
  // ========== 状态 ==========
  const mode = ref<'edit' | 'preview'>('edit');
  const currentProject = ref<DesignProject | null>(null);
  const isDragging = ref(false);
  const isLoading = ref(false);
  const hasUnsavedChanges = ref(false);
  const currentTool = ref<'select' | 'marquee' | 'hand'>('select');
  const copyCutInProgress = ref(false);
  const clipboard = ref<ComponentNode[]>([]);

  // 画布状态
  const canvas = ref({
    width: 1920,
    height: 1080,
    backgroundColor: '#ffffff',
    zoom: 1,
    showGrid: true,
    gridSize: 8,
  });

  // 组件树
  const componentTree = ref({
    id: 'root',
    rootComponents: [] as ComponentNode[],
    allComponents: new Map<string, ComponentNode>(),
    parentChildrenMap: new Map<string, string[]>(),
  });

  // 选区状态
  const selection = ref({
    selectedIds: [] as string[],
    selectedComponents: [] as ComponentNode[],
  });

  // 历史记录
  const history = ref({
    past: [] as HistoryRecord[],
    present: null as HistoryRecord | null,
    future: [] as HistoryRecord[],
    maxHistory: 100,
  });

  // ========== 计算属性 ==========
  const selectedComponent = computed(() => {
    return selection.value.selectedComponents.length > 0
      ? selection.value.selectedComponents[0]
      : null;
  });

  const selectedComponents = computed(() => selection.value.selectedComponents);
  const selectedIds = computed(() => selection.value.selectedIds);
  const canUndo = computed(() => history.value.past.length > 0);
  const canRedo = computed(() => history.value.future.length > 0);

  // ========== 核心方法 ==========

  // 项目管理
  const loadProject = (project: DesignProject) => {
    currentProject.value = project;
    canvas.value = { ...canvas.value, ...project.canvas };
    hasUnsavedChanges.value = false;
  };

  const newProject = (name = '新项目') => {
    const project: DesignProject = {
      id: `project-${Date.now()}`,
      name,
      version: '1.0.0',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      canvas: { ...canvas.value },
      components: [],
      meta: {
        framework: 'vue3',
        uiLibrary: 'shadcn',
        theme: 'light',
        device: 'desktop-1920x1080',
        viewport: { width: 1920, height: 1080 },
      },
      settings: {
        autoSave: true,
        showRulers: false,
        snapToGrid: true,
        showOutline: true,
      },
    };

    loadProject(project);
    hasUnsavedChanges.value = false;
  };

  // 组件树管理
  const addComponent = (
    component: ComponentNode,
    parentId?: string,
    index?: number
  ) => {
    // 添加到组件树
    componentTree.value.allComponents.set(component.id, component);

    if (parentId) {
      const children = componentTree.value.parentChildrenMap.get(parentId) || [];
      if (index !== undefined) {
        children.splice(index, 0, component.id);
      } else {
        children.push(component.id);
      }
      componentTree.value.parentChildrenMap.set(parentId, children);
    } else {
      if (index !== undefined) {
        componentTree.value.rootComponents.splice(index, 0, component);
      } else {
        componentTree.value.rootComponents.push(component);
      }
    }

    // 记录历史
    addHistory({
      id: generateHistoryId(),
      timestamp: Date.now(),
      type: 'add',
      componentId: component.id,
      description: `添加组件: ${component.name}`,
    });

    hasUnsavedChanges.value = true;
  };

  const removeComponent = (componentId: string) => {
    const component = componentTree.value.allComponents.get(componentId);
    if (!component) return;

    // 递归删除子组件
    if (component.children && component.children.length > 0) {
      component.children.forEach(child => {
        removeComponent(child.id);
      });
    }

    // 从父级删除
    if (component.parentId) {
      const siblings = componentTree.value.parentChildrenMap.get(component.parentId) || [];
      const index = siblings.indexOf(componentId);
      if (index > -1) {
        siblings.splice(index, 1);
      }
    } else {
      const index = componentTree.value.rootComponents.findIndex(c => c.id === componentId);
      if (index > -1) {
        componentTree.value.rootComponents.splice(index, 1);
      }
    }

    // 删除组件映射
    componentTree.value.allComponents.delete(componentId);
    componentTree.value.parentChildrenMap.delete(componentId);

    // 记录历史
    addHistory({
      id: generateHistoryId(),
      timestamp: Date.now(),
      type: 'remove',
      componentId: componentId,
      description: `删除组件: ${component.name}`,
    });

    // 清除选区
    if (selection.value.selectedIds.includes(componentId)) {
      deselectComponent(componentId);
    }

    hasUnsavedChanges.value = true;
  };

  const updateComponent = (componentId: string, updates: Partial<ComponentNode>) => {
    const component = componentTree.value.allComponents.get(componentId);
    if (!component) return;

    const beforeState = { ...component };
    const updated = { ...component, ...updates };

    // 深度更新
    Object.assign(component, updates);

    // 记录历史
    addHistory({
      id: generateHistoryId(),
      timestamp: Date.now(),
      type: 'update',
      componentId,
      beforeState,
      afterState: updates,
      description: `更新组件: ${component.name}`,
    });

    hasUnsavedChanges.value = true;
  };

  const updateComponentProps = (componentId: string, props: Record<string, any>) => {
    const component = componentTree.value.allComponents.get(componentId);
    if (!component) return;

    const beforeProps = { ...component.props };
    component.props = { ...component.props, ...props };

    // 记录历史
    addHistory({
      id: generateHistoryId(),
      timestamp: Date.now(),
      type: 'update',
      componentId,
      beforeState: beforeProps,
      afterState: component.props,
      description: `更新组件属性: ${component.name}`,
    });

    hasUnsavedChanges.value = true;
  };

  const updateComponentStyle = (componentId: string, style: Record<string, any>) => {
    const component = componentTree.value.allComponents.get(componentId);
    if (!component) return;

    const beforeStyle = { ...component.style };
    component.style = { ...component.style, ...style };

    // 记录历史
    addHistory({
      id: generateHistoryId(),
      timestamp: Date.now(),
      type: 'update',
      componentId,
      beforeState: beforeStyle,
      afterState: component.style,
      description: `更新组件样式: ${component.name}`,
    });

    hasUnsavedChanges.value = true;
  };

  const updateComponentEvents = (componentId: string, events: Record<string, any>) => {
    const component = componentTree.value.allComponents.get(componentId);
    if (!component) return;

    const beforeEvents = { ...component.events };
    component.events = { ...component.events, ...events };

    // 记录历史
    addHistory({
      id: generateHistoryId(),
      timestamp: Date.now(),
      type: 'update',
      componentId,
      beforeState: beforeEvents,
      afterState: component.events,
      description: `更新组件事件: ${component.name}`,
    });

    hasUnsavedChanges.value = true;
  };

  const moveComponent = (componentId: string, newParentId?: string, newIndex: number = 0) => {
    const component = componentTree.value.allComponents.get(componentId);
    if (!component) return;

    const oldParentId = component.parentId;
    const oldIndex = oldParentId
      ? (componentTree.value.parentChildrenMap.get(oldParentId) || []).indexOf(componentId)
      : componentTree.value.rootComponents.findIndex(c => c.id === componentId);

    // 从原位置移除
    if (oldParentId) {
      const oldSiblings = componentTree.value.parentChildrenMap.get(oldParentId) || [];
      const index = oldSiblings.indexOf(componentId);
      if (index > -1) {
        oldSiblings.splice(index, 1);
      }
    } else {
      const index = componentTree.value.rootComponents.findIndex(c => c.id === componentId);
      if (index > -1) {
        componentTree.value.rootComponents.splice(index, 1);
      }
    }

    // 添加到新位置
    component.parentId = newParentId;
    if (newParentId) {
      const newSiblings = componentTree.value.parentChildrenMap.get(newParentId) || [];
      newSiblings.splice(newIndex, 0, componentId);
      componentTree.value.parentChildrenMap.set(newParentId, newSiblings);
    } else {
      componentTree.value.rootComponents.splice(newIndex, 0, component);
    }

    // 记录历史
    addHistory({
      id: generateHistoryId(),
      timestamp: Date.now(),
      type: 'move',
      componentId,
      beforeState: { parentId: oldParentId, index: oldIndex },
      afterState: { parentId: newParentId, index: newIndex },
      description: `移动组件: ${component.name}`,
    });

    hasUnsavedChanges.value = true;
  };

  // 选区管理
  const selectComponent = (componentId: string) => {
    const component = componentTree.value.allComponents.get(componentId);
    if (!component) return;

    selection.value.selectedIds = [componentId];
    selection.value.selectedComponents = [component];
  };

  const selectComponents = (componentIds: string[]) => {
    const components = componentIds
      .map(id => componentTree.value.allComponents.get(id))
      .filter(Boolean) as ComponentNode[];

    selection.value.selectedIds = componentIds;
    selection.value.selectedComponents = components;
  };

  const deselectComponent = (componentId: string) => {
    selection.value.selectedIds = selection.value.selectedIds.filter(id => id !== componentId);
    selection.value.selectedComponents = selection.value.selectedComponents.filter(
      comp => comp.id !== componentId
    );
  };

  const clearSelection = () => {
    selection.value.selectedIds = [];
    selection.value.selectedComponents = [];
  };

  // 历史记录管理
  const addHistory = (record: HistoryRecord) => {
    const { past, future, maxHistory } = history.value;

    past.push(record);
    if (past.length > maxHistory) {
      past.shift();
    }

    history.value.future = [];
  };

  const undo = () => {
    if (history.value.past.length === 0) return;

    const { past, present, future } = history.value;
    const previous = past.pop()!;

    future.unshift(present!);
    history.value.present = previous;

    // 执行撤销操作
    applyHistoryRecord(previous, 'undo');

    hasUnsavedChanges.value = true;
  };

  const redo = () => {
    if (history.value.future.length === 0) return;

    const { past, present, future } = history.value;
    const next = future.shift()!;

    past.push(present!);
    history.value.present = next;

    // 执行重做操作
    applyHistoryRecord(next, 'redo');

    hasUnsavedChanges.value = true;
  };

  const clearHistory = () => {
    history.value = {
      past: [],
      present: null,
      future: [],
      maxHistory: 100,
    };
  };

  // 应用历史记录
  const applyHistoryRecord = (record: HistoryRecord, direction: 'undo' | 'redo') => {
    const { type, componentId, beforeState, afterState } = record;

    switch (type) {
      case 'add':
        if (direction === 'undo') {
          // 撤销添加 = 删除
          componentTree.value.allComponents.delete(componentId);
        } else {
          // 重做添加 = 重新添加
          // 这里需要从 afterState 恢复
        }
        break;

      case 'remove':
        if (direction === 'undo') {
          // 撤销删除 = 恢复
          // 这里需要从 beforeState 恢复
        } else {
          // 重做删除 = 重新删除
          componentTree.value.allComponents.delete(componentId);
        }
        break;

      case 'update':
        if (direction === 'undo') {
          // 撤销更新 = 恢复到 beforeState
          if (beforeState) {
            Object.assign(componentTree.value.allComponents.get(componentId)!, beforeState);
          }
        } else {
          // 重做更新 = 应用 afterState
          if (afterState) {
            Object.assign(componentTree.value.allComponents.get(componentId)!, afterState);
          }
        }
        break;
    }
  };

  const generateHistoryId = () => {
    return `hist-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 工具方法
  const duplicateComponent = (componentId: string) => {
    const component = componentTree.value.allComponents.get(componentId);
    if (!component) return;

    // 深度克隆
    const cloned = JSON.parse(JSON.stringify(component));
    cloned.id = `${componentId}-copy-${Date.now()}`;
    cloned.name = `${component.name} (副本)`;

    // 递归更新子组件ID
    const updateChildIds = (comp: any) => {
      if (comp.children && comp.children.length > 0) {
        comp.children.forEach((child: any) => {
          child.id = `${child.id}-copy-${Date.now()}`;
          updateChildIds(child);
        });
      }
    };
    updateChildIds(cloned);

    addComponent(cloned, component.parentId);
  };

  const selectAll = () => {
    const allIds = Array.from(componentTree.value.allComponents.keys());
    selectComponents(allIds);
  };

  const deleteSelected = () => {
    selection.value.selectedIds.forEach(id => {
      removeComponent(id);
    });
    clearSelection();
  };

  // ========== 快捷键支持方法 ==========
  const copySelectedComponents = () => {
    clipboard.value = [...selectedComponents.value];
  };

  const pasteComponents = () => {
    if (clipboard.value.length === 0) return;

    // 记录历史
    addHistory({
      id: generateHistoryId(),
      timestamp: Date.now(),
      type: 'batch-add',
      components: [...clipboard.value],
      description: `粘贴 ${clipboard.value.length} 个组件`,
    });

    // 清空选区
    clearSelection();
    hasUnsavedChanges.value = true;
  };

  const deleteSelectedComponents = () => {
    deleteSelected();
  };

  const selectAllComponents = () => {
    selectAll();
  };

  const saveProject = () => {
    // 保存项目的逻辑
    console.log('保存项目');
    hasUnsavedChanges.value = false;
  };

  // ========== 返回 ==========
  return {
    // 状态
    mode,
    canvas,
    componentTree,
    selection,
    history,
    currentProject,
    isDragging,
    isLoading,
    hasUnsavedChanges,
    currentTool,
    copyCutInProgress,

    // 计算属性
    selectedComponent,
    selectedComponents,
    selectedIds,
    canUndo,
    canRedo,

    // 组件树方法
    addComponent,
    removeComponent,
    updateComponent,
    updateComponentProps,
    updateComponentStyle,
    updateComponentEvents,
    moveComponent,
    duplicateComponent,

    // 选区方法
    selectComponent,
    selectComponents,
    deselectComponent,
    clearSelection,
    selectAll,
    deleteSelected,

    // 快捷键支持方法
    copySelectedComponents,
    pasteComponents,
    deleteSelectedComponents,
    selectAllComponents,
    saveProject,

    // 历史记录方法
    undo,
    redo,
    clearHistory,

    // 画布方法
    setCanvasState: (updates: Partial<typeof canvas.value>) => {
      Object.assign(canvas.value, updates);
      hasUnsavedChanges.value = true;
    },

    // 模式切换
    setMode: (newMode: 'edit' | 'preview') => {
      mode.value = newMode;
    },

    // 拖拽状态
    setDragging: (dragging: boolean) => {
      isDragging.value = dragging;
    },

    // 项目管理
    loadProject,
    newProject,
  };
});
