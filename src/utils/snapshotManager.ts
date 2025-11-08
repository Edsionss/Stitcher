/**
 * 快照管理系统
 * 提供状态快照的序列化、反序列化、压缩和增量快照功能
 */

import { compressToUTF16, decompressFromUTF16 } from './compression'

export interface SnapshotMetadata {
  id: string
  timestamp: number
  type: 'full' | 'incremental'
  size: number
  description?: string
}

export interface SnapshotData {
  project?: any
  canvas?: any
  property?: any
  history?: any
  component?: any
  metadata: SnapshotMetadata
}

export class SnapshotManager {
  private static instance: SnapshotManager
  private snapshots: Map<string, SnapshotData> = new Map()
  private maxSnapshots = 50
  private compressEnabled = true

  private constructor() {}

  static getInstance(): SnapshotManager {
    if (!SnapshotManager.instance) {
      SnapshotManager.instance = new SnapshotManager()
    }
    return SnapshotManager.instance
  }

  /**
   * 创建完整快照
   */
  createFullSnapshot(
    stores: {
      project?: any
      canvas?: any
      property?: any
      history?: any
      component?: any
    },
    description?: string
  ): string {
    const snapshotId = `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const snapshot: SnapshotData = {
      project: stores.project,
      canvas: stores.canvas,
      property: stores.property,
      history: stores.history,
      component: stores.component,
      metadata: {
        id: snapshotId,
        timestamp: Date.now(),
        type: 'full',
        size: 0,
        description
      }
    }

    // 序列化快照
    const serialized = JSON.stringify(snapshot)
    let storedSnapshot = serialized

    // 压缩快照
    if (this.compressEnabled) {
      storedSnapshot = compressToUTF16(serialized)
    }

    snapshot.metadata.size = storedSnapshot.length

    this.snapshots.set(snapshotId, {
      ...snapshot,
      // 存储压缩后的数据
      project: undefined,
      canvas: undefined,
      property: undefined,
      history: undefined,
      component: undefined,
      compressed: storedSnapshot
    } as any)

    // 清理旧快照
    this.cleanupOldSnapshots()

    return snapshotId
  }

  /**
   * 创建增量快照
   */
  createIncrementalSnapshot(
    previousSnapshotId: string,
    changes: any,
    description?: string
  ): string | null {
    const previous = this.snapshots.get(previousSnapshotId)
    if (!previous) {
      console.warn('Previous snapshot not found, creating full snapshot instead')
      return this.createFullSnapshot(changes, description)
    }

    const snapshotId = `snapshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const snapshot: SnapshotData = {
      project: changes.project,
      canvas: changes.canvas,
      property: changes.property,
      history: changes.history,
      component: changes.component,
      metadata: {
        id: snapshotId,
        timestamp: Date.now(),
        type: 'incremental',
        size: 0,
        description
      }
    }

    // 序列化快照
    const serialized = JSON.stringify(snapshot)
    let storedSnapshot = serialized

    // 压缩快照
    if (this.compressEnabled) {
      storedSnapshot = compressToUTF16(serialized)
    }

    snapshot.metadata.size = storedSnapshot.length

    this.snapshots.set(snapshotId, {
      ...snapshot,
      project: undefined,
      canvas: undefined,
      property: undefined,
      history: undefined,
      component: undefined,
      compressed: storedSnapshot
    } as any)

    // 清理旧快照
    this.cleanupOldSnapshots()

    return snapshotId
  }

  /**
   * 获取快照数据
   */
  getSnapshot(snapshotId: string): SnapshotData | null {
    const snapshot = this.snapshots.get(snapshotId)
    if (!snapshot) return null

    // 如果是压缩存储，需要解压
    if ((snapshot as any).compressed) {
      const decompressed = this.compressEnabled
        ? decompressFromUTF16((snapshot as any).compressed)
        : (snapshot as any).compressed

      try {
        const parsed = JSON.parse(decompressed)
        return parsed
      } catch (error) {
        console.error('Failed to parse snapshot:', error)
        return null
      }
    }

    return snapshot
  }

  /**
   * 获取所有快照元数据
   */
  getAllSnapshotsMetadata(): SnapshotMetadata[] {
    return Array.from(this.snapshots.values()).map(s => s.metadata)
  }

  /**
   * 删除快照
   */
  deleteSnapshot(snapshotId: string): boolean {
    return this.snapshots.delete(snapshotId)
  }

  /**
   * 清空所有快照
   */
  clearAllSnapshots(): void {
    this.snapshots.clear()
  }

  /**
   * 清理旧快照
   */
  private cleanupOldSnapshots(): void {
    if (this.snapshots.size <= this.maxSnapshots) return

    // 按时间戳排序
    const sorted = Array.from(this.snapshots.entries()).sort(
      (a, b) => a[1].metadata.timestamp - b[1].metadata.timestamp
    )

    // 删除最旧的快照
    const toDelete = sorted.slice(0, this.snapshots.size - this.maxSnapshots)
    toDelete.forEach(([id]) => {
      this.snapshots.delete(id)
    })
  }

  /**
   * 计算快照大小
   */
  getSnapshotSize(snapshotId: string): number {
    const snapshot = this.snapshots.get(snapshotId)
    return snapshot?.metadata.size || 0
  }

  /**
   * 获取所有快照的总大小
   */
  getTotalSize(): number {
    return Array.from(this.snapshots.values()).reduce(
      (total, snapshot) => total + snapshot.metadata.size,
      0
    )
  }

  /**
   * 格式化大小显示
   */
  getFormattedSize(bytes: number): string {
    if (bytes < 1024) {
      return bytes + ' B'
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + ' KB'
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
    }
  }

  /**
   * 导出快照到文件
   */
  exportSnapshot(snapshotId: string): { success: boolean; error?: any; data?: Blob } {
    const snapshot = this.getSnapshot(snapshotId)
    if (!snapshot) {
      return { success: false, error: 'Snapshot not found' }
    }

    try {
      const jsonString = JSON.stringify(snapshot, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      return { success: true, data: blob }
    } catch (error) {
      return { success: false, error }
    }
  }

  /**
   * 从文件导入快照
   */
  importSnapshot(file: File): Promise<{ success: boolean; snapshotId?: string; error?: any }> {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        try {
          const json = e.target?.result as string
          const snapshot = JSON.parse(json) as SnapshotData

          const snapshotId = `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          snapshot.metadata.id = snapshotId

          this.snapshots.set(snapshotId, snapshot)
          resolve({ success: true, snapshotId })
        } catch (error) {
          resolve({ success: false, error })
        }
      }

      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file' })
      }

      reader.readAsText(file)
    })
  }

  /**
   * 设置压缩模式
   */
  setCompression(enabled: boolean): void {
    this.compressEnabled = enabled
  }

  /**
   * 获取快照统计信息
   */
  getStats() {
    const total = this.snapshots.size
    const totalSize = this.getTotalSize()
    const full = Array.from(this.snapshots.values()).filter(s => s.metadata.type === 'full').length
    const incremental = total - full

    return {
      total,
      full,
      incremental,
      totalSize: this.getFormattedSize(totalSize),
      maxSnapshots: this.maxSnapshots
    }
  }
}

// 导出单例实例
export const snapshotManager = SnapshotManager.getInstance()
