import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ComponentNode } from '@/types/component'

export const useComponentTreeStore = defineStore('componentTree', () => {
  // State - 存储页面的组件树根节点
  const componentTree = ref<ComponentNode[]>([])

  // 计算属性：检查是否有组件
  const hasComponents = computed(() => componentTree.value.length > 0)

  // 计算属性：获取所有组件的扁平列表
  const flattenedComponents = computed(() => {
    const result: ComponentNode[] = []

    const flatten = (nodes: ComponentNode[]) => {
      nodes.forEach(node => {
        result.push(node)
        if (node.children && node.children.length > 0) {
          flatten(node.children)
        }
      })
    }

    flatten(componentTree.value)
    return result
  })

  /**
   * 添加组件到根节点
   */
  function addComponent(component: ComponentNode, parentId?: string) {
    if (!parentId) {
      // 添加到根节点
      componentTree.value.push(component)
    } else {
      // 添加到父组件的children中
      const parent = findComponentById(parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(component)
      }
    }
  }

  /**
   * 根据ID查找组件
   */
  function findComponentById(id: string): ComponentNode | null {
    const node = flattenedComponents.value.find(n => n.id === id)
    return node || null
  }

  /**
   * 根据ID删除组件
   */
  function deleteComponent(id: string) {
    const deleteRecursive = (nodes: ComponentNode[]): boolean => {
      const index = nodes.findIndex(n => n.id === id)
      if (index > -1) {
        nodes.splice(index, 1)
        return true
      }

      for (const node of nodes) {
        if (node.children && deleteRecursive(node.children)) {
          return true
        }
      }

      return false
    }

    deleteRecursive(componentTree.value)
  }

  /**
   * 更新组件
   */
  function updateComponent(id: string, updates: Partial<ComponentNode>) {
    const component = findComponentById(id)
    if (component) {
      Object.assign(component, updates)
    }
  }

  /**
   * 移动组件
   */
  function moveComponent(id: string, parentId?: string) {
    const component = findComponentById(id)
    if (!component) return

    // 删除原位置的组件
    deleteComponent(id)

    // 添加到新位置
    component.parentId = parentId
    addComponent(component, parentId)
  }

  /**
   * 获取组件的所有子组件
   */
  function getComponentChildren(id: string): ComponentNode[] {
    const component = findComponentById(id)
    return component?.children || []
  }

  /**
   * 获取组件的父组件ID
   */
  function getComponentParent(id: string): string | undefined {
    const component = findComponentById(id)
    return component?.parentId
  }

  /**
   * 清空组件树
   */
  function clearComponentTree() {
    componentTree.value = []
  }

  /**
   * 获取组件树的深度（用于验证层级）
   */
  function getComponentDepth(id: string, currentDepth = 0): number {
    const component = findComponentById(id)
    if (!component) return currentDepth

    let maxDepth = currentDepth
    if (component.children && component.children.length > 0) {
      for (const child of component.children) {
        const depth = getComponentDepth(child.id, currentDepth + 1)
        maxDepth = Math.max(maxDepth, depth)
      }
    }

    return maxDepth
  }

  /**
   * 批量添加组件
   */
  function addComponents(components: ComponentNode[], parentId?: string) {
    components.forEach(component => {
      addComponent(component, parentId)
    })
  }

  return {
    // State
    componentTree,

    // Computed
    hasComponents,
    flattenedComponents,

    // Actions
    addComponent,
    findComponentById,
    deleteComponent,
    updateComponent,
    moveComponent,
    getComponentChildren,
    getComponentParent,
    clearComponentTree,
    getComponentDepth,
    addComponents,
  }
})
