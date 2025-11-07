// 拖拽系统全局配置
export const DRAG_CONFIG = {
  // 默认动画时长
  DEFAULT_ANIMATION: 200,

  // 性能优化配置
  PERFORMANCE: {
    VIRTUAL_SCROLL_ENABLED: true,
    VIRTUAL_SCROLL_ITEM_SIZE: 60,
    ANIMATION: 150, // 降低动画时间提升性能
    FORCE_FALLBACK_FOR_MOBILE: true,
  },

  // 视觉反馈配置
  VISUAL_FEEDBACK: {
    GHOST_CLASS: 'drag-ghost',
    CHOSEN_CLASS: 'drag-chosen',
    DRAG_CLASS: 'drag-drag',
    GHOST_OPACITY: 0.5,
    HIGHLIGHT_COLOR: '#2b8cee',
  },

  // 拖拽组配置
  GROUPS: {
    COMPONENTS: {
      name: 'components',
      pull: 'clone',
      put: false,
    },
    CANVAS: {
      name: 'components',
      pull: false,
      put: true,
      sort: true,
    },
    NESTED: {
      name: 'components',
      pull: true,
      put: true,
      sort: true,
    },
  },

  // 嵌套配置
  NESTED: {
    ENABLED: true,
    MAX_LEVEL: 5,
    THRESHOLD: 30, // 嵌套距离阈值
    SHOW_INDICATOR: true,
  },

  // 组件库面板配置
  COMPONENT_PANEL: {
    COLUMN_COUNT: 2,
    CARD_HEIGHT: 80,
    GAP: 12,
    SHOW_LABELS: true,
    ENABLE_SEARCH: true,
    ENABLE_FILTER: true,
  },

  // 画布配置
  CANVAS: {
    DEFAULT_WIDTH: 1920,
    DEFAULT_HEIGHT: 1080,
    GRID_SIZE: 8,
    SHOW_GRID: true,
    SNAP_TO_GRID: true,
    GRID_COLOR: '#e0e0e0',
    GRID_OPACITY: 0.3,
    MIN_ZOOM: 0.25,
    MAX_ZOOM: 4,
    ZOOM_STEP: 0.25,
  },

  // 性能阈值
  PERFORMANCE_THRESHOLDS: {
    MAX_VISIBLE_COMPONENTS: 100,
    MAX_HISTORY_ITEMS: 50,
    MAX_UNDO_STEPS: 100,
    DEBOUNCE_DELAY: 300,
  },

  // 快捷键
  SHORTCUTS: {
    MULTI_SELECT: 'shift',
    QUICK_DUPLICATE: 'alt',
    QUICK_DELETE: 'delete',
  },
};

// 拖拽样式类名
export const DRAG_CLASSES = {
  GHOST: 'drag-ghost',
  CHOSEN: 'drag-chosen',
  DRAG: 'drag-drag',
  DRAGGING: 'dragging',
  SORTABLE: 'sortable',
  SORTABLE_GHOST: 'sortable-ghost',
  SORTABLE_CHOSEN: 'sortable-chosen',
  SORTABLE_DRAG: 'sortable-drag',
  DRAGGABLE: 'draggable-item',
  HANDLE: 'drag-handle',
  PLACEHOLDER: 'drag-placeholder',
};

// 事件钩子
export const DRAG_HOOKS = {
  ON_ADD: 'onAdd',
  ON_UPDATE: 'onUpdate',
  ON_REMOVE: 'onRemove',
  ON_START: 'onStart',
  ON_END: 'onEnd',
  ON_CHOOSE: 'onChoose',
  ON_UNCHOOSE: 'onUnchoose',
  ON_SORT: 'onSort',
  ON_FILTER: 'onFilter',
  ON_MOVE: 'onMove',
};

// 工具函数
export const dragUtils = {
  // 生成唯一ID
  generateId: (prefix = 'comp'): string => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // 深度克隆组件
  cloneComponent: (component: any): any => {
    return JSON.parse(JSON.stringify(component, (key, value) => {
      if (key === 'id') {
        return dragUtils.generateId();
      }
      return value;
    }));
  },

  // 检查是否可以嵌套
  canNested: (sourceLevel: number, maxLevel: number): boolean => {
    return sourceLevel < maxLevel;
  },

  // 获取拖拽位置信息
  getDropPosition: (evt: any): { index: number; parentId?: string } => {
    return {
      index: evt.newIndex || 0,
      parentId: evt.to?.dataset?.parentId,
    };
  },

  // 验证拖拽操作
  validateDrop: (dragged: any, target: any): boolean => {
    // 基础验证逻辑
    if (!dragged || !target) return false;

    // 防止组件自我嵌套（除非是容器组件）
    if (dragged.id === target.id && !dragged.children) {
      return false;
    }

    return true;
  },
};
