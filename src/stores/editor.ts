import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEditorStore = defineStore('editor', () => {
  // State
  const currentProject = ref<any>(null)
  const currentPage = ref<any>(null)
  const selectedComponents = ref<string[]>([])
  const isDirty = ref(false)

  // Getters
  const canUndo = ref(false)
  const canRedo = ref(false)

  // Actions
  function setCurrentProject(project: any) {
    currentProject.value = project
    isDirty.value = false
  }

  function setCurrentPage(page: any) {
    currentPage.value = page
    selectedComponents.value = []
  }

  function selectComponent(id: string, multi = false) {
    if (multi) {
      const index = selectedComponents.value.indexOf(id)
      if (index > -1) {
        selectedComponents.value.splice(index, 1)
      } else {
        selectedComponents.value.push(id)
      }
    } else {
      selectedComponents.value = [id]
    }
  }

  function clearSelection() {
    selectedComponents.value = []
  }

  return {
    // state
    currentProject,
    currentPage,
    selectedComponents,
    isDirty,
    canUndo,
    canRedo,
    // actions
    setCurrentProject,
    setCurrentPage,
    selectComponent,
    clearSelection,
  }
})
