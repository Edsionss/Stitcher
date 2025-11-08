import { defineStore } from 'pinia'
import { ref } from 'vue'

export type PanelTab = 'properties' | 'styles' | 'events' | 'advanced'

export const usePropertyStore = defineStore('property', () => {
  // State
  const activeTab = ref<PanelTab>('properties')
  const selectedComponent = ref<any>(null)
  const properties = ref<Record<string, any>>({})

  // Actions
  function setActiveTab(tab: PanelTab) {
    activeTab.value = tab
  }

  function setSelectedComponent(component: any) {
    selectedComponent.value = component
    if (component) {
      properties.value = { ...component.props }
    }
  }

  function updateProperty(key: string, value: any) {
    properties.value[key] = value
    if (selectedComponent.value) {
      selectedComponent.value.props[key] = value
    }
  }

  function clearSelection() {
    selectedComponent.value = null
    properties.value = {}
  }

  return {
    // state
    activeTab,
    selectedComponent,
    properties,
    // actions
    setActiveTab,
    setSelectedComponent,
    updateProperty,
    clearSelection,
  }
})
