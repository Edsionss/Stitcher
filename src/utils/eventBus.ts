/**
 * 事件总线系统
 * 用于组件间通信和状态变更通知
 */

export type EventCallback = (payload: any) => void

export class EventBus {
  private static instance: EventBus
  private events: Map<string, EventCallback[]>

  private constructor() {
    this.events = new Map()
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus()
    }
    return EventBus.instance
  }

  /**
   * 订阅事件
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }

    const callbacks = this.events.get(event)!
    callbacks.push(callback)

    // 返回取消订阅函数
    return () => {
      this.off(event, callback)
    }
  }

  /**
   * 订阅事件（一次性）
   */
  once(event: string, callback: EventCallback): () => void {
    const onceCallback = (payload: any) => {
      callback(payload)
      this.off(event, onceCallback)
    }
    return this.on(event, onceCallback)
  }

  /**
   * 取消订阅事件
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }

      // 如果没有回调了，删除事件
      if (callbacks.length === 0) {
        this.events.delete(event)
      }
    }
  }

  /**
   * 触发事件
   */
  emit(event: string, payload?: any): void {
    const callbacks = this.events.get(event)
    if (callbacks) {
      // 复制回调列表，避免在执行过程中修改列表
      const callbacksCopy = [...callbacks]
      callbacksCopy.forEach(callback => {
        try {
          callback(payload)
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error)
        }
      })
    }
  }

  /**
   * 清除所有事件监听器
   */
  clear(): void {
    this.events.clear()
  }

  /**
   * 清除指定事件的所有监听器
   */
  clearEvent(event: string): void {
    this.events.delete(event)
  }

  /**
   * 获取事件监听器数量
   */
  listenerCount(event: string): number {
    const callbacks = this.events.get(event)
    return callbacks ? callbacks.length : 0
  }

  /**
   * 获取所有事件名称
   */
  eventNames(): string[] {
    return Array.from(this.events.keys())
  }

  /**
   * 异步触发事件
   */
  async emitAsync(event: string, payload?: any): Promise<void> {
    const callbacks = this.events.get(event)
    if (callbacks) {
      const promises = callbacks.map(async (callback) => {
        try {
          await callback(payload)
        } catch (error) {
          console.error(`Error in async event handler for "${event}":`, error)
        }
      })
      await Promise.all(promises)
    }
  }
}

// 导出单例实例
export const eventBus = EventBus.getInstance()

// 预定义事件名称
export const Events = {
  // 组件相关
  COMPONENT_ADDED: 'component:added',
  COMPONENT_REMOVED: 'component:removed',
  COMPONENT_UPDATED: 'component:updated',
  COMPONENT_SELECTED: 'component:selected',
  COMPONENT_MOVED: 'component:moved',

  // 项目相关
  PROJECT_CREATED: 'project:created',
  PROJECT_UPDATED: 'project:updated',
  PROJECT_SAVED: 'project:saved',
  PROJECT_LOADED: 'project:loaded',

  // 画布相关
  CANVAS_ZOOM_CHANGED: 'canvas:zoom:changed',
  CANVAS_DEVICE_CHANGED: 'canvas:device:changed',
  CANVAS_CLEARED: 'canvas:cleared',

  // 属性面板相关
  PROPERTY_PANEL_TAB_CHANGED: 'property:panel:tab:changed',

  // 历史记录相关
  HISTORY_PUSHED: 'history:pushed',
  HISTORY_UNDONE: 'history:undone',
  HISTORY_REDONE: 'history:redone',
  HISTORY_CLEARED: 'history:cleared',

  // UI相关
  THEME_CHANGED: 'theme:changed',
  PANEL_TOGGLED: 'panel:toggled',

  // 拖拽相关
  DRAG_STARTED: 'drag:started',
  DRAG_ENDED: 'drag:ended',
  DROP_OCCURRED: 'drop:occurred',
} as const

export type EventName = typeof Events[keyof typeof Events]
