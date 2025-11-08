import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UIType } from '../adapters'

export interface Project {
  id: string
  name: string
  description: string
  uiLibrary: UIType
  pages: any[]
  createdAt: Date
  updatedAt: Date
}

export const useProjectStore = defineStore('project', () => {
  // State
  const currentProject = ref<Project | null>(null)
  const projects = ref<Project[]>([])
  const isLoading = ref(false)

  // Actions
  function createProject(data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    const project: Project = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    projects.value.push(project)
    currentProject.value = project
    return project
  }

  function updateProject(id: string, data: Partial<Project>) {
    const index = projects.value.findIndex(p => p.id === id)
    if (index > -1) {
      projects.value[index] = {
        ...projects.value[index],
        ...data,
        updatedAt: new Date()
      }
      if (currentProject.value?.id === id) {
        currentProject.value = projects.value[index]
      }
    }
  }

  function deleteProject(id: string) {
    projects.value = projects.value.filter(p => p.id !== id)
    if (currentProject.value?.id === id) {
      currentProject.value = null
    }
  }

  function setCurrentProject(project: Project | null) {
    currentProject.value = project
  }

  function getProjectById(id: string) {
    return projects.value.find(p => p.id === id)
  }

  return {
    // state
    currentProject,
    projects,
    isLoading,
    // actions
    createProject,
    updateProject,
    deleteProject,
    setCurrentProject,
    getProjectById,
  }
})
