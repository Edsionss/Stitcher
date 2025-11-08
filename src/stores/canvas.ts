import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type DeviceType = 'desktop' | 'tablet' | 'mobile'

export const useCanvasStore = defineStore('canvas', () => {
  // State
  const zoom = ref(100)
  const device = ref<DeviceType>('desktop')
  const showGrid = ref(true)
  const gridSize = ref(8)
  const snapToGrid = ref(true)

  // Getters
  const canvasWidth = computed(() => {
    if (device.value === 'desktop') return 1920
    if (device.value === 'tablet') return 768
    return 375
  })

  const canvasHeight = computed(() => {
    if (device.value === 'desktop') return 1080
    if (device.value === 'tablet') return 1024
    return 667
  })

  // Actions
  function setZoom(value: number) {
    zoom.value = Math.max(25, Math.min(200, value))
  }

  function setDevice(type: DeviceType) {
    device.value = type
  }

  function toggleGrid() {
    showGrid.value = !showGrid.value
  }

  function setGridSize(size: number) {
    gridSize.value = size
  }

  function toggleSnapToGrid() {
    snapToGrid.value = !snapToGrid.value
  }

  return {
    // state
    zoom,
    device,
    showGrid,
    gridSize,
    snapToGrid,
    // getters
    canvasWidth,
    canvasHeight,
    // actions
    setZoom,
    setDevice,
    toggleGrid,
    setGridSize,
    toggleSnapToGrid,
  }
})
