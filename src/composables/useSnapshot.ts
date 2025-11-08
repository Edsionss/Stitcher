/**
 * 快照系统组合式函数
 * 提供快照的创建、恢复、导入、导出功能
 */

import { ref } from 'vue'
import { snapshotManager, type SnapshotMetadata } from '../utils/snapshotManager'
import { useProjectStore } from '@/stores/project'
import { useCanvasStore } from '@/stores/canvas'
import { usePropertyStore } from '@/stores/property'
import { useHistoryStore } from '@/stores/history'
import { deepClone } from '../utils/compression'

export function useSnapshot() {
  const isCreating = ref(false)
  const isRestoring = ref(false)
  const isExporting = ref(false)

  const projectStore = useProjectStore()
  const canvasStore = useCanvasStore()
  const propertyStore = usePropertyStore()
  const historyStore = useHistoryStore()

  /**
   * 创建完整快照
   */
  const createFullSnapshot = async (description?: string): Promise<string | null> => {
    isCreating.value = true
    try {
      const snapshotId = snapshotManager.createFullSnapshot(
        {
          project: projectStore.currentProject,
          canvas: {
            zoom: canvasStore.zoom,
            device: canvasStore.device,
            showGrid: canvasStore.showGrid,
            gridSize: canvasStore.gridSize,
            snapToGrid: canvasStore.snapToGrid
          },
          property: {
            activeTab: propertyStore.activeTab,
            selectedComponent: propertyStore.selectedComponent
          },
          history: {
            history: historyStore.history,
            historyIndex: historyStore.historyIndex
          }
        },
        description
      )
      return snapshotId
    } catch (error) {
      console.error('Failed to create snapshot:', error)
      return null
    } finally {
      isCreating.value = false
    }
  }

  /**
   * 恢复快照
   */
  const restoreSnapshot = async (snapshotId: string): Promise<boolean> => {
    isRestoring.value = true
    try {
      const snapshot = snapshotManager.getSnapshot(snapshotId)
      if (!snapshot) {
        throw new Error('Snapshot not found')
      }

      // 恢复项目数据
      if (snapshot.project) {
        projectStore.setCurrentProject(deepClone(snapshot.project))
      }

      // 恢复画布数据
      if (snapshot.canvas) {
        if (snapshot.canvas.zoom !== undefined) {
          canvasStore.setZoom(snapshot.canvas.zoom)
        }
        if (snapshot.canvas.device) {
          canvasStore.setDevice(snapshot.canvas.device)
        }
        if (snapshot.canvas.showGrid !== undefined) {
          canvasStore.showGrid = snapshot.canvas.showGrid
        }
        if (snapshot.canvas.gridSize !== undefined) {
          canvasStore.setGridSize(snapshot.canvas.gridSize)
        }
        if (snapshot.canvas.snapToGrid !== undefined) {
          canvasStore.snapToGrid = snapshot.canvas.snapToGrid
        }
      }

      // 恢复属性面板数据
      if (snapshot.property) {
        if (snapshot.property.activeTab) {
          propertyStore.setActiveTab(snapshot.property.activeTab)
        }
        if (snapshot.property.selectedComponent) {
          propertyStore.setSelectedComponent(snapshot.property.selectedComponent)
        }
      }

      // 恢复历史记录
      if (snapshot.history) {
        if (snapshot.history.history) {
          historyStore.clear()
          snapshot.history.history.forEach((item: any) => {
            historyStore.pushHistory(item)
          })
        }
        if (snapshot.history.historyIndex !== undefined) {
          historyStore.historyIndex = snapshot.history.historyIndex
        }
      }

      return true
    } catch (error) {
      console.error('Failed to restore snapshot:', error)
      return false
    } finally {
      isRestoring.value = false
    }
  }

  /**
   * 获取所有快照
   */
  const getAllSnapshots = (): SnapshotMetadata[] => {
    return snapshotManager.getAllSnapshotsMetadata()
  }

  /**
   * 删除快照
   */
  const deleteSnapshot = (snapshotId: string): boolean => {
    return snapshotManager.deleteSnapshot(snapshotId)
  }

  /**
   * 清空所有快照
   */
  const clearAllSnapshots = (): void => {
    snapshotManager.clearAllSnapshots()
  }

  /**
   * 导出快照
   */
  const exportSnapshot = async (snapshotId: string): Promise<{ success: boolean; error?: any; data?: Blob }> => {
    isExporting.value = true
    try {
      const result = snapshotManager.exportSnapshot(snapshotId)
      return result
    } finally {
      isExporting.value = false
    }
  }

  /**
   * 导入快照
   */
  const importSnapshot = async (file: File): Promise<{ success: boolean; snapshotId?: string; error?: any }> => {
    try {
      const result = await snapshotManager.importSnapshot(file)
      return result
    } catch (error) {
      console.error('Failed to import snapshot:', error)
      return { success: false, error }
    }
  }

  /**
   * 获取快照大小
   */
  const getSnapshotSize = (snapshotId: string): number => {
    return snapshotManager.getSnapshotSize(snapshotId)
  }

  /**
   * 获取快照统计信息
   */
  const getStats = () => {
    return snapshotManager.getStats()
  }

  /**
   * 创建带时间戳的自动快照
   */
  const createAutoSnapshot = async (): Promise<string | null> => {
    const timestamp = new Date().toLocaleString()
    return createFullSnapshot(`Auto snapshot at ${timestamp}`)
  }

  /**
   * 创建带标签的快照
   */
  const createTaggedSnapshot = async (tag: string): Promise<string | null> => {
    return createFullSnapshot(`Tag: ${tag}`)
  }

  /**
   * 根据标签获取快照
   */
  const getSnapshotsByTag = (tag: string): SnapshotMetadata[] => {
    return getAllSnapshots().filter(s =>
      s.description?.includes(`Tag: ${tag}`)
    )
  }

  return {
    isCreating,
    isRestoring,
    isExporting,
    createFullSnapshot,
    restoreSnapshot,
    getAllSnapshots,
    deleteSnapshot,
    clearAllSnapshots,
    exportSnapshot,
    importSnapshot,
    getSnapshotSize,
    getStats,
    createAutoSnapshot,
    createTaggedSnapshot,
    getSnapshotsByTag
  }
}
