import type { ComponentNode } from './component';

// 设计器状态
export type DesignMode = 'edit' | 'preview';

// 画布状态
export interface CanvasState {
  width: number;
  height: number;
  backgroundColor?: string;
  backgroundImage?: string;
  zoom: number; // 缩放比例
  showGrid: boolean; // 显示网格
  gridSize: number; // 网格大小
}

// 选区状态
export interface SelectionState {
  selectedIds: string[];
  selectedComponents: ComponentNode[];
}

// 历史记录
export interface HistoryRecord {
  id: string;
  timestamp: number;
  type: 'add' | 'remove' | 'update' | 'move';
  componentId: string;
  beforeState?: any;
  afterState?: any;
  description: string;
}

// 撤销重做状态
export interface HistoryState {
  past: HistoryRecord[];
  present: HistoryRecord | null;
  future: HistoryRecord[];
  maxHistory: number;
}

// 组件树
export interface ComponentTree {
  id: string;
  rootComponents: ComponentNode[];
  allComponents: Map<string, ComponentNode>;
  parentChildrenMap: Map<string, string[]>; // 父ID -> 子ID列表
}

// 画布操作
export type CanvasAction =
  | { type: 'ADD_COMPONENT'; payload: { component: ComponentNode; parentId?: string; index?: number } }
  | { type: 'REMOVE_COMPONENT'; payload: { componentId: string } }
  | { type: 'UPDATE_COMPONENT'; payload: { componentId: string; updates: Partial<ComponentNode> } }
  | { type: 'MOVE_COMPONENT'; payload: { componentId: string; newParentId?: string; newIndex: number } }
  | { type: 'SELECT_COMPONENTS'; payload: { componentIds: string[] } }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'DUPLICATE_COMPONENT'; payload: { componentId: string } }
  | { type: 'GROUP_COMPONENTS'; payload: { componentIds: string[] } }
  | { type: 'UNGROUP_COMPONENTS'; payload: { groupId: string } }
  | { type: 'SET_CANVAS_STATE'; payload: Partial<CanvasState> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'LOAD_PROJECT'; payload: { project: DesignProject } };

// 设计项目
export interface DesignProject {
  id: string;
  name: string;
  description?: string;
  version: string;
  createdAt: number;
  updatedAt: number;
  canvas: CanvasState;
  components: ComponentNode[];
  meta: {
    framework: 'vue3';
    uiLibrary: 'shadcn';
    theme: string;
    device: string;
    viewport: {
      width: number;
      height: number;
    };
  };
  settings: {
    autoSave: boolean;
    showRulers: boolean;
    snapToGrid: boolean;
    showOutline: boolean;
  };
}

// 剪贴板数据
export interface ClipboardData {
  type: 'component' | 'multiple';
  components: ComponentNode[];
  timestamp: number;
}

// 设计器状态接口
export interface DesignStoreState {
  // 核心状态
  mode: DesignMode;
  canvas: CanvasState;
  componentTree: ComponentTree;
  selection: SelectionState;
  history: HistoryState;

  // 剪贴板
  clipboard: ClipboardData | null;

  // 状态
  isDragging: boolean;
  isLoading: boolean;
  hasUnsavedChanges: boolean;

  // 当前项目
  currentProject: DesignProject | null;

  // 工具
  currentTool: 'select' | 'marquee' | 'hand';
  copyCutInProgress: boolean;
}

// 操作结果
export interface OperationResult {
  success: boolean;
  error?: string;
  componentId?: string;
  affectedComponents?: string[];
}

// 设计器事件
export interface DesignEvent {
  type: string;
  timestamp: number;
  data: any;
  source: 'user' | 'system' | 'script';
}

// 拖拽放置位置
export interface DropPosition {
  x: number;
  y: number;
  index: number;
  parentId?: string;
}

// 画布点
export interface CanvasPoint {
  x: number;
  y: number;
}

// 画布矩形
export interface CanvasRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 框选状态
export interface MarqueeSelection {
  start: CanvasPoint;
  end: CanvasPoint;
  active: boolean;
}

// 快捷键映射
export interface KeyboardShortcuts {
  'ctrl+c': string;
  'ctrl+v': string;
  'ctrl+x': string;
  'ctrl+z': string;
  'ctrl+y': string;
  'ctrl+s': string;
  'delete': string;
  'escape': string;
  'ctrl+a': string;
  'ctrl+d': string;
}
