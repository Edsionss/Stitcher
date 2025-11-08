import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface HistoryItem {
  id: string
  type: 'add' | 'delete' | 'update' | 'move'
  timestamp: number
  data: any
  redoData?: any
}

export const useHistoryStore = defineStore('history', () => {
  const history = ref<HistoryItem[]>([])
  const historyIndex = ref(-1)
  const maxHistorySize = 100

  const canUndo = computed(() => historyIndex.value > 0)
  const canRedo = computed(() => historyIndex.value < history.value.length - 1)

  function pushHistory(item: Omit<HistoryItem, 'id' | 'timestamp'>) {
    const historyItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now()
    }

    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1)
    }

    history.value.push(historyItem)
    historyIndex.value++

    if (history.value.length > maxHistorySize) {
      history.value.shift()
      historyIndex.value--
    }
  }

  function undo() {
    if (!canUndo.value) return null
    const item = history.value[historyIndex.value]
    historyIndex.value--
    return item
  }

  function redo() {
    if (!canRedo.value) return null
    historyIndex.value++
    const item = history.value[historyIndex.value]
    return item
  }

  function clear() {
    history.value = []
    historyIndex.value = -1
  }

  return {
    history,
    historyIndex,
    canUndo,
    canRedo,
    pushHistory,
    undo,
    redo,
    clear,
  }
})
