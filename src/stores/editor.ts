import { defineStore } from 'pinia'
import type { ComponentMeta } from '@/types/component'

interface EditorState {
  // Dragging state
  isDragging: boolean
  draggedComponent: ComponentMeta | null
  draggedElement: HTMLElement | null
  dragStartX: number
  dragStartY: number

  // Selection state
  selectedComponents: string[]
}

export const useEditorStore = defineStore('editor', {
  state: (): EditorState => ({
    // Dragging
    isDragging: false,
    draggedComponent: null,
    draggedElement: null,
    dragStartX: 0,
    dragStartY: 0,

    // Selection
    selectedComponents: []
  }),

  actions: {
    // Dragging actions
    startDragging(component: ComponentMeta, element: HTMLElement, startX: number, startY: number) {
      this.isDragging = true
      this.draggedComponent = component
      this.draggedElement = element
      this.dragStartX = startX
      this.dragStartY = startY
      this.disableTextSelection()
    },
    stopDragging() {
      this.isDragging = false
      this.draggedComponent = null
      this.draggedElement = null
      this.dragStartX = 0
      this.dragStartY = 0
      this.enableTextSelection()
    },

    // Text selection control
    disableTextSelection() {
      document.body.classList.add('no-text-selection')
    },
    enableTextSelection() {
      document.body.classList.remove('no-text-selection')
    },

    // Selection actions
    selectComponent(id: string, multiSelect = false) {
      if (!multiSelect) {
        this.selectedComponents = [id]
      } else {
        const index = this.selectedComponents.indexOf(id)
        if (index > -1) {
          this.selectedComponents.splice(index, 1)
        } else {
          this.selectedComponents.push(id)
        }
      }
    },
    clearSelection() {
      this.selectedComponents = []
    }
  }
})