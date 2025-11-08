/**
 * 项目数据持久化组合式函数
 * 提供项目数据的导入/导出/保存/恢复功能
 */

import { ref } from 'vue'
import { persistence } from '../utils/persistence'
import { useProjectStore } from '../stores/project'
import { useCanvasStore } from '../stores/canvas'
import { usePropertyStore } from '../stores/property'
import { useHistoryStore } from '../stores/history'

export function useProjectPersistence() {
  const isExporting = ref(false)
  const isImporting = ref(false)
  const projectStore = ref(useProjectStore())
  const canvasStore = ref(useCanvasStore())
  const propertyStore = ref(usePropertyStore())
  const historyStore = ref(useHistoryStore())

  /**
   * 导出当前项目为JSON文件
   */
  const exportProject = async () => {
    isExporting.value = true
    try {
      const projectData = {
        project: projectStore.value.currentProject,
        canvas: {
          zoom: canvasStore.value.zoom,
          device: canvasStore.value.device,
          showGrid: canvasStore.value.showGrid,
          gridSize: canvasStore.value.gridSize,
          snapToGrid: canvasStore.value.snapToGrid
        },
        property: {
          activeTab: propertyStore.value.activeTab,
          selectedComponent: propertyStore.value.selectedComponent
        },
        history: {
          history: historyStore.value.history,
          historyIndex: historyStore.value.historyIndex
        },
        metadata: {
          exportTime: new Date().toISOString(),
          version: '1.0.0'
        }
      }

      const jsonString = JSON.stringify(projectData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      const fileName = `stitcher-project-${Date.now()}.json`
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return { success: true, fileName }
    } catch (error) {
      console.error('Export failed:', error)
      return { success: false, error }
    } finally {
      isExporting.value = false
    }
  }

  /**
   * 从JSON文件导入项目
   */
  const importProject = async (file: File): Promise<{ success: boolean; error?: any }> => {
    isImporting.value = true
    try {
      const text = await file.text()
      const data = JSON.parse(text) as {
        project?: any
        canvas?: any
        property?: any
        history?: any
        metadata?: any
      }

      // 验证数据格式
      if (!data.metadata || !data.metadata.version) {
        throw new Error('Invalid project file format')
      }

      // 恢复项目数据
      if (data.project) {
        projectStore.value.setCurrentProject(data.project)
        if (data.project.id) {
          projectStore.value.updateProject(data.project.id, data.project)
        }
      }

      // 恢复画布数据
      if (data.canvas) {
        if (data.canvas.zoom !== undefined) {
          canvasStore.value.setZoom(data.canvas.zoom)
        }
        if (data.canvas.device) {
          canvasStore.value.setDevice(data.canvas.device)
        }
        if (data.canvas.showGrid !== undefined) {
          canvasStore.value.showGrid = data.canvas.showGrid
        }
        if (data.canvas.gridSize !== undefined) {
          canvasStore.value.setGridSize(data.canvas.gridSize)
        }
        if (data.canvas.snapToGrid !== undefined) {
          canvasStore.value.snapToGrid = data.canvas.snapToGrid
        }
      }

      // 恢复属性面板数据
      if (data.property) {
        if (data.property.activeTab) {
          propertyStore.value.setActiveTab(data.property.activeTab)
        }
        if (data.property.selectedComponent) {
          propertyStore.value.setSelectedComponent(data.property.selectedComponent)
        }
      }

      // 恢复历史记录
      if (data.history) {
        if (data.history.history) {
          historyStore.value.clear()
          data.history.history.forEach((item: any) => {
            historyStore.value.pushHistory(item)
          })
        }
        if (data.history.historyIndex !== undefined) {
          historyStore.value.historyIndex = data.history.historyIndex
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Import failed:', error)
      return { success: false, error }
    } finally {
      isImporting.value = false
    }
  }

  /**
   * 保存到localStorage
   */
  const saveToLocal = () => {
    try {
      const projectData = {
        project: projectStore.value.currentProject,
        canvas: {
          zoom: canvasStore.value.zoom,
          device: canvasStore.value.device,
          showGrid: canvasStore.value.showGrid,
          gridSize: canvasStore.value.gridSize,
          snapToGrid: canvasStore.value.snapToGrid
        },
        property: {
          activeTab: propertyStore.value.activeTab,
          selectedComponent: propertyStore.value.selectedComponent
        },
        history: {
          history: historyStore.value.history,
          historyIndex: historyStore.value.historyIndex
        },
        metadata: {
          saveTime: new Date().toISOString(),
          version: '1.0.0'
        }
      }

      persistence.set('current_project', projectData)
      return { success: true }
    } catch (error) {
      console.error('Save failed:', error)
      return { success: false, error }
    }
  }

  /**
   * 从localStorage恢复
   */
  const loadFromLocal = () => {
    try {
      const data = persistence.get('current_project') as {
        project?: any
        canvas?: any
        property?: any
        history?: any
        metadata?: any
      } | undefined
      if (!data) {
        return { success: false, error: 'No saved data found' }
      }

      // 恢复项目数据
      if (data.project) {
        projectStore.value.setCurrentProject(data.project)
        if (data.project.id) {
          projectStore.value.updateProject(data.project.id, data.project)
        }
      }

      // 恢复画布数据
      if (data.canvas) {
        if (data.canvas.zoom !== undefined) {
          canvasStore.value.setZoom(data.canvas.zoom)
        }
        if (data.canvas.device) {
          canvasStore.value.setDevice(data.canvas.device)
        }
        if (data.canvas.showGrid !== undefined) {
          canvasStore.value.showGrid = data.canvas.showGrid
        }
        if (data.canvas.gridSize !== undefined) {
          canvasStore.value.setGridSize(data.canvas.gridSize)
        }
        if (data.canvas.snapToGrid !== undefined) {
          canvasStore.value.snapToGrid = data.canvas.snapToGrid
        }
      }

      // 恢复属性面板数据
      if (data.property) {
        if (data.property.activeTab) {
          propertyStore.value.setActiveTab(data.property.activeTab)
        }
        if (data.property.selectedComponent) {
          propertyStore.value.setSelectedComponent(data.property.selectedComponent)
        }
      }

      // 恢复历史记录
      if (data.history) {
        if (data.history.history) {
          historyStore.value.clear()
          data.history.history.forEach((item: any) => {
            historyStore.value.pushHistory(item)
          })
        }
        if (data.history.historyIndex !== undefined) {
          historyStore.value.historyIndex = data.history.historyIndex
        }
      }

      return { success: true }
    } catch (error) {
      console.error('Load failed:', error)
      return { success: false, error }
    }
  }

  /**
   * 清空所有数据
   */
  const clearAll = () => {
    persistence.clear()
    projectStore.value.setCurrentProject(null)
    historyStore.value.clear()
    return { success: true }
  }

  /**
   * 获取存储统计信息
   */
  const getStorageStats = () => {
    return {
      size: persistence.getStorageSize(),
      formattedSize: persistence.getFormattedStorageSize(),
      keys: persistence.getAllKeys()
    }
  }

  return {
    isExporting,
    isImporting,
    exportProject,
    importProject,
    saveToLocal,
    loadFromLocal,
    clearAll,
    getStorageStats
  }
}
