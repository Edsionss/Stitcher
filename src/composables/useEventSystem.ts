/**
 * 事件系统组合式函数
 * 提供简单的事件监听和触发接口
 */

import { ref, onMounted, onUnmounted } from 'vue'
import { eventBus, Events, type EventCallback } from '../utils/eventBus'
import { stateListener } from '../utils/stateListener'
import { useProjectStore } from '@/stores/project'
import { useCanvasStore } from '@/stores/canvas'
import { usePropertyStore } from '@/stores/property'
import { useHistoryStore } from '@/stores/history'

/**
 * 事件系统组合式函数
 */
export function useEventSystem() {
  /**
   * 监听事件
   */
  function on(event: string, callback: EventCallback): () => void {
    return eventBus.on(event, callback)
  }

  /**
   * 监听事件（一次性）
   */
  function once(event: string, callback: EventCallback): () => void {
    return eventBus.once(event, callback)
  }

  /**
   * 取消事件监听
   */
  function off(event: string, callback: EventCallback): void {
    eventBus.off(event, callback)
  }

  /**
   * 触发事件
   */
  function emit(event: string, payload?: any): void {
    eventBus.emit(event, payload)
  }

  /**
   * 异步触发事件
   */
  async function emitAsync(event: string, payload?: any): Promise<void> {
    await eventBus.emitAsync(event, payload)
  }

  /**
   * 获取监听器数量
   */
  function listenerCount(event: string): number {
    return eventBus.listenerCount(event)
  }

  /**
   * 获取所有事件名称
   */
  function eventNames(): string[] {
    return eventBus.eventNames()
  }

  /**
   * 清除事件监听器
   */
  function clearEvent(event: string): void {
    eventBus.clearEvent(event)
  }

  /**
   * 清除所有事件监听器
   */
  function clearAllEvents(): void {
    eventBus.clear()
  }

  return {
    on,
    once,
    off,
    emit,
    emitAsync,
    listenerCount,
    eventNames,
    clearEvent,
    clearAllEvents,
    Events
  }
}

/**
 * 状态监听组合式函数
 */
export function useStateListener() {
  const projectStore = useProjectStore()
  const canvasStore = useCanvasStore()
  const propertyStore = usePropertyStore()
  const historyStore = useHistoryStore()

  /**
   * 初始化状态监听
   */
  function initStateListeners(): () => void {
    const unsubscribers: (() => void)[] = []

    // 监听项目store
    unsubscribers.push(
      stateListener.listenToStore(projectStore, {
        storeId: 'project',
        stateKeys: ['currentProject', 'projects'],
        emitEvents: true
      })
    )

    // 监听画布store
    unsubscribers.push(
      stateListener.listenToStore(canvasStore, {
        storeId: 'canvas',
        stateKeys: ['zoom', 'device', 'showGrid', 'gridSize', 'snapToGrid'],
        emitEvents: true
      })
    )

    // 监听属性面板store
    unsubscribers.push(
      stateListener.listenToStore(propertyStore, {
        storeId: 'property',
        stateKeys: ['activeTab', 'selectedComponent'],
        emitEvents: true
      })
    )

    // 监听历史记录store
    unsubscribers.push(
      stateListener.listenToStore(historyStore, {
        storeId: 'history',
        stateKeys: ['history', 'historyIndex'],
        emitEvents: true
      })
    )

    // 返回取消所有监听的函数
    return () => {
      unsubscribers.forEach(fn => fn())
    }
  }

  /**
   * 获取快照
   */
  function getSnapshot(storeId: string) {
    return stateListener.getSnapshot(storeId)
  }

  /**
   * 清除监听器
   */
  function clearStore(storeId: string) {
    stateListener.clearStore(storeId)
  }

  /**
   * 清除所有监听器
   */
  function clearAll() {
    stateListener.clearAll()
  }

  return {
    initStateListeners,
    getSnapshot,
    clearStore,
    clearAll
  }
}

/**
 * 自动初始化状态监听的组合式函数
 */
export function useAutoStateListener() {
  const { initStateListeners, getSnapshot, clearStore, clearAll } = useStateListener()
  const unsubscribe = ref<(() => void) | null>(null)

  onMounted(() => {
    unsubscribe.value = initStateListeners()
  })

  onUnmounted(() => {
    if (unsubscribe.value) {
      unsubscribe.value()
    }
  })

  return {
    getSnapshot,
    clearStore,
    clearAll
  }
}

/**
 * 预定义的事件监听Hook
 */
export function useProjectEvents(callback: (event: string, payload: any) => void) {
  const { on } = useEventSystem()

  onMounted(() => {
    const unsubscribers = [
      on(Events.PROJECT_CREATED, payload => callback(Events.PROJECT_CREATED, payload)),
      on(Events.PROJECT_UPDATED, payload => callback(Events.PROJECT_UPDATED, payload)),
      on(Events.PROJECT_SAVED, payload => callback(Events.PROJECT_SAVED, payload)),
      on(Events.PROJECT_LOADED, payload => callback(Events.PROJECT_LOADED, payload))
    ]

    onUnmounted(() => {
      unsubscribers.forEach(fn => fn())
    })
  })
}

/**
 * 画布事件监听Hook
 */
export function useCanvasEvents(callback: (event: string, payload: any) => void) {
  const { on } = useEventSystem()

  onMounted(() => {
    const unsubscribers = [
      on(Events.CANVAS_ZOOM_CHANGED, payload => callback(Events.CANVAS_ZOOM_CHANGED, payload)),
      on(Events.CANVAS_DEVICE_CHANGED, payload => callback(Events.CANVAS_DEVICE_CHANGED, payload)),
      on(Events.CANVAS_CLEARED, payload => callback(Events.CANVAS_CLEARED, payload))
    ]

    onUnmounted(() => {
      unsubscribers.forEach(fn => fn())
    })
  })
}
