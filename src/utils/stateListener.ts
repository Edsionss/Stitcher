/**
 * 状态监听器系统
 * 用于监听Pinia store的变更并触发相应事件
 */

import { eventBus, Events } from './eventBus'

export interface StoreSnapshot {
  [key: string]: any
}

/**
 * 监听器配置
 */
export interface ListenerConfig {
  storeId: string
  stateKeys: string[]
  emitEvents: boolean
}

/**
 * 状态监听器类
 */
export class StateListener {
  private static instance: StateListener
  private unsubscribeFns: Map<string, () => void> = new Map()
  private snapshots: Map<string, StoreSnapshot> = new Map()

  private constructor() {}

  static getInstance(): StateListener {
    if (!StateListener.instance) {
      StateListener.instance = new StateListener()
    }
    return StateListener.instance
  }

  /**
   * 监听store的变更
   */
  listenToStore(
    store: any,
    config: ListenerConfig
  ): () => void {
    const { storeId, stateKeys, emitEvents = true } = config

    // 保存初始快照
    this.snapshots.set(storeId, this.captureSnapshot(store, stateKeys))

    // 订阅store变更
    const unsubscribe = store.$subscribe(
      (mutation: any, newState: any) => {
        const oldSnapshot = this.snapshots.get(storeId)
        const newSnapshot = this.captureSnapshot(newState, stateKeys)

        // 触发变更事件
        if (emitEvents) {
          this.emitStoreEvents(storeId, mutation, oldSnapshot, newSnapshot)
        }

        // 更新快照
        this.snapshots.set(storeId, newSnapshot)
      },
      { detached: true }
    )

    // 保存取消订阅函数
    const key = `${storeId}_${Date.now()}`
    this.unsubscribeFns.set(key, unsubscribe)

    return () => {
      unsubscribe()
      this.snapshots.delete(storeId)
      this.unsubscribeFns.delete(key)
    }
  }

  /**
   * 捕获store快照
   */
  private captureSnapshot(store: any, stateKeys: string[]): StoreSnapshot {
    const snapshot: StoreSnapshot = {}
    stateKeys.forEach(key => {
      snapshot[key] = store[key]
    })
    return snapshot
  }

  /**
   * 触发store相关事件
   */
  private emitStoreEvents(
    storeId: string,
    mutation: any,
    oldSnapshot: StoreSnapshot | undefined,
    newSnapshot: StoreSnapshot
  ) {
    // 根据mutation type和storeId判断事件类型
    if (storeId === 'project') {
      this.handleProjectMutation(mutation, oldSnapshot, newSnapshot)
    } else if (storeId === 'canvas') {
      this.handleCanvasMutation(mutation, newSnapshot)
    } else if (storeId === 'property') {
      this.handlePropertyMutation(mutation, newSnapshot)
    } else if (storeId === 'history') {
      this.handleHistoryMutation(mutation, newSnapshot)
    } else if (storeId === 'component') {
      this.handleComponentMutation(mutation, newSnapshot)
    }
  }

  /**
   * 处理项目store的变更
   */
  private handleProjectMutation(
    mutation: any,
    oldSnapshot: StoreSnapshot | undefined,
    newSnapshot: StoreSnapshot
  ) {
    switch (mutation.type) {
      case '$patch':
        if (newSnapshot?.currentProject) {
          if (!newSnapshot.currentProject.id) {
            eventBus.emit(Events.PROJECT_CREATED, newSnapshot.currentProject)
          } else {
            eventBus.emit(Events.PROJECT_UPDATED, newSnapshot.currentProject)
          }
        }
        break
    }
  }

  /**
   * 处理画布store的变更
   */
  private handleCanvasMutation(mutation: any, newSnapshot: StoreSnapshot) {
    switch (mutation.type) {
      case 'setZoom':
        eventBus.emit(Events.CANVAS_ZOOM_CHANGED, newSnapshot.zoom)
        break
      case 'setDevice':
        eventBus.emit(Events.CANVAS_DEVICE_CHANGED, newSnapshot.device)
        break
    }
  }

  /**
   * 处理属性面板store的变更
   */
  private handlePropertyMutation(mutation: any, newSnapshot: StoreSnapshot) {
    if (mutation.type === 'setActiveTab') {
      eventBus.emit(Events.PROPERTY_PANEL_TAB_CHANGED, newSnapshot.activeTab)
    }
  }

  /**
   * 处理历史记录store的变更
   */
  private handleHistoryMutation(mutation: any, newSnapshot: StoreSnapshot) {
    if (mutation.type === 'pushHistory') {
      eventBus.emit(Events.HISTORY_PUSHED, newSnapshot.history)
    }
  }

  /**
   * 处理组件store的变更
   */
  private handleComponentMutation(mutation: any, newSnapshot: StoreSnapshot) {
    // 根据mutation类型触发相应事件
    if (mutation.type === 'direct') {
      // 直接修改
    }
  }

  /**
   * 获取store的当前快照
   */
  getSnapshot(storeId: string): StoreSnapshot | undefined {
    return this.snapshots.get(storeId)
  }

  /**
   * 清除所有监听器
   */
  clearAll(): void {
    this.unsubscribeFns.forEach(fn => fn())
    this.unsubscribeFns.clear()
    this.snapshots.clear()
  }

  /**
   * 清除指定store的监听器
   */
  clearStore(storeId: string): void {
    const prefix = `${storeId}_`
    const keysToDelete: string[] = []

    this.unsubscribeFns.forEach((fn, key) => {
      if (key.startsWith(prefix)) {
        fn()
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => {
      this.unsubscribeFns.delete(key)
    })

    this.snapshots.delete(storeId)
  }
}

// 导出单例实例
export const stateListener = StateListener.getInstance()
