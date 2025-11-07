import type { ComponentNode } from './component';

// 拖拽组配置
export interface DragGroup {
  name: string;
  pull?: boolean | 'clone' | false;
  put?: boolean | ((to: any, from: any, dragEl: any, evt: DragEvent) => boolean) | false;
  // @ts-ignore
  sort?: boolean;
  // @ts-ignore
  disabled?: boolean;
  // @ts-ignore
  forceFallback?: boolean;
  // @ts-ignore
  fallbackOnBody?: boolean;
  // @ts-ignore
  fallbackTolerance?: number;
  // @ts-ignore
  draggable?: string | ((el: HTMLElement) => boolean);
}

// 拖拽事件对象
export interface DragEvent extends Event {
  item: HTMLElement;
  from: HTMLElement;
  to: HTMLElement;
  oldIndex: number | null;
  newIndex: number | null;
  oldDraggableIndex: number | null;
  newDraggableIndex: number | null;
  pullMode?: boolean | 'clone' | 'append' | 'prepend';
}

// 拖拽状态
export interface DragState {
  isDragging: boolean;
  isSorting: boolean;
  draggedElement: HTMLElement | null;
  draggedContext: any;
  sourceContext: any;
  targetContext: any;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
}

// 克隆函数
export type CloneFunction<T> = (item: T) => T;

// 拖拽选项
export interface DragOptions {
  group?: string | DragGroup;
  sort?: boolean;
  disabled?: boolean;
  animation?: number;
  easing?: string;
  forceFallback?: boolean;
  fallbackOnBody?: boolean;
  fallbackTolerance?: number;
  fallbackOffset?: { x: number; y: number };
  draggable?: string | ((el: HTMLElement) => boolean);
  handle?: string;
  ghostClass?: string;
  chosenClass?: string;
  dragClass?: string;
  dataIdAttr?: string;
  swapThreshold?: number;
  invertedSwapThreshold?: number;
  dragBubbleClass?: string;
  removeOnSpill?: boolean;
  inserted?: (element: HTMLElement, evt: DragEvent) => void;
  setData?: (dataTransfer: DataTransfer, dragEl: HTMLElement) => void;
}

// 组件拖拽上下文
export interface ComponentDragContext {
  component: ComponentNode;
  fromLibrary: string;
  originalId: string;
  isClone: boolean;
  timestamp: number;
}

// 画布拖拽上下文
export interface CanvasDragContext {
  component: ComponentNode;
  targetParentId?: string;
  targetIndex: number;
  isMove: boolean;
  isCopy: boolean;
  timestamp: number;
}

// 拖拽放置结果
export interface DropResult {
  component: ComponentNode;
  parentId?: string;
  index: number;
  success: boolean;
  error?: string;
}

// 嵌套容器配置
export interface NestedContainerConfig {
  enabled: boolean;
  level: number;
  maxLevel?: number;
  threshold: number; // 嵌套距离阈值
  showIndicator: boolean; // 显示嵌套指示器
}

// 拖拽视觉反馈
export interface DragVisualFeedback {
  ghostClass: string;
  chosenClass: string;
  dragClass: string;
  dragHandleClass?: string;
  showDragHandle: boolean;
  showDropIndicator: boolean;
  highlightOnDrag: boolean;
}

// 自动滚动配置
export interface AutoScrollConfig {
  enabled: boolean;
  sensitivity: number;
  scrollSpeed: number;
  scrollZones: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

// 拖拽性能配置
export interface DragPerformanceConfig {
  useVirtualScroll: boolean;
  itemSize: number;
  bufferSize: number;
  renderCount: number;
  enableThrottle: boolean;
  throttleDelay: number;
}

// 拖拽辅助线
export interface SnapGuideConfig {
  enabled: boolean;
  showGuides: boolean;
  snapThreshold: number;
  showDistance: boolean;
  guides: Array<{
    type: 'horizontal' | 'vertical' | 'grid';
    position: number;
    size: number;
  }>;
}

// 拖拽状态钩子
export interface DragHooks {
  onDragStart?: (evt: DragEvent) => void;
  onDragEnd?: (evt: DragEvent) => void;
  onAdd?: (evt: DragEvent) => void;
  onUpdate?: (evt: DragEvent) => void;
  onRemove?: (evt: DragEvent) => void;
  onChoose?: (evt: DragEvent) => void;
  onUnchoose?: (evt: DragEvent) => void;
  onSort?: (evt: DragEvent) => void;
  onFilter?: (evt: DragEvent) => void;
  onMove?: (evt: DragEvent, originalEvent: DragEvent) => void | boolean;
}

// 拖拽历史记录
export interface DragHistoryRecord {
  id: string;
  type: 'drag' | 'sort' | 'move' | 'clone';
  componentId: string;
  from: {
    parentId?: string;
    index: number;
  };
  to: {
    parentId?: string;
    index: number;
  };
  timestamp: number;
}

// 跨容器拖拽限制
export interface CrossContainerLimit {
  allowedFrom: string[];
  allowedTo: string[];
  blockedFrom?: string[];
  blockedTo?: string[];
  transform?: (component: ComponentNode, from: string, to: string) => ComponentNode;
}

// 拖拽验证器
export interface DragValidator {
  canDrag?: (component: ComponentNode) => boolean;
  canDrop?: (target: ComponentNode | null, dragged: ComponentNode) => boolean;
  canSort?: (component: ComponentNode) => boolean;
  validate?: (action: string, source: string, target: string, component: ComponentNode) => boolean;
}
