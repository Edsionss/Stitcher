/**
 * 数据持久化工具
 * 提供localStorage的封装、导入导出功能
 */

export class PersistenceManager {
  private static instance: PersistenceManager
  private readonly STORAGE_PREFIX = 'stitcher_'

  private constructor() {}

  static getInstance(): PersistenceManager {
    if (!PersistenceManager.instance) {
      PersistenceManager.instance = new PersistenceManager()
    }
    return PersistenceManager.instance
  }

  /**
   * 保存数据到localStorage
   */
  set<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(this.STORAGE_PREFIX + key, serializedValue)
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  /**
   * 从localStorage获取数据
   */
  get<T>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(this.STORAGE_PREFIX + key)
      if (item === null) {
        return defaultValue
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      return defaultValue
    }
  }

  /**
   * 删除localStorage中的数据
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(this.STORAGE_PREFIX + key)
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
    }
  }

  /**
   * 清空所有数据
   */
  clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }

  /**
   * 检查存储是否可用
   */
  isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  /**
   * 获取所有存储的键
   */
  getAllKeys(): string[] {
    const keys: string[] = []
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          keys.push(key.replace(this.STORAGE_PREFIX, ''))
        }
      })
    } catch (error) {
      console.error('Failed to get keys from localStorage:', error)
    }
    return keys
  }

  /**
   * 导出所有数据为JSON
   */
  exportAll(): string {
    const data: Record<string, any> = {}
    this.getAllKeys().forEach(key => {
      const value = this.get(key)
      if (value !== undefined) {
        data[key] = value
      }
    })
    return JSON.stringify(data, null, 2)
  }

  /**
   * 从JSON导入数据
   */
  importFromJSON(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString) as Record<string, any>
      Object.entries(data).forEach(([key, value]) => {
        this.set(key, value)
      })
    } catch (error) {
      console.error('Failed to import from JSON:', error)
      throw new Error('Invalid JSON format')
    }
  }

  /**
   * 导出指定键的数据为JSON
   */
  exportKeys(keys: string[]): string {
    const data: Record<string, any> = {}
    keys.forEach(key => {
      const value = this.get(key)
      if (value !== undefined) {
        data[key] = value
      }
    })
    return JSON.stringify(data, null, 2)
  }

  /**
   * 获取存储使用大小
   */
  getStorageSize(): number {
    let total = 0
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return total
  }

  /**
   * 格式化存储大小
   */
  getFormattedStorageSize(): string {
    const bytes = this.getStorageSize()
    if (bytes < 1024) {
      return bytes + ' B'
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB'
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }
  }
}

// 导出单例实例
export const persistence = PersistenceManager.getInstance()

// Pinia持久化插件
import type { PiniaPluginContext } from 'pinia'

export const piniaPersistencePlugin = (context: PiniaPluginContext) => {
  const { store } = context

  // 标记为持久化的store
  const persistStores = [
    'project',
    'canvas',
    'property',
    'history'
  ]

  if (persistStores.includes(store.$id)) {
    // 从localStorage恢复状态
    const savedState = persistence.get(`store_${store.$id}`)
    if (savedState) {
      store.$patch(savedState)
    }

    // 监听状态变化并保存
    store.$subscribe((mutation, state) => {
      persistence.set(`store_${store.$id}`, state)
    })
  }
}
