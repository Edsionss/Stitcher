<template>
  <div
    ref="componentEl"
    class="group component-item relative flex flex-col p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-card cursor-grab active:cursor-grabbing hover:border-primary dark:hover:border-primary hover:shadow-sm transition-all"
  >
    <!-- 组件图标 -->
    <div
      class="flex items-center justify-center w-10 h-10 mx-auto mb-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors"
    >
      <span
        class="material-symbols-outlined text-xl text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors"
      >
        {{ component.icon }}
      </span>
    </div>

    <!-- 组件名称和描述 -->
    <div class="text-center">
      <p class="text-sm font-medium text-slate-900 dark:text-white mb-1.5 truncate">
        {{ component.name }}
      </p>
      <!-- Info icon with tooltip -->
      <div class="relative group/tooltip flex justify-center">
        <span
          class="material-symbols-outlined text-sm text-slate-400 dark:text-slate-500 cursor-help hover:text-slate-600 dark:hover:text-slate-300"
        >
          info
        </span>
        <div
          class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-lg"
        >
          {{ component.description || '暂无描述' }}
          <div
            class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-700"
          ></div>
        </div>
      </div>
    </div>

    <!-- 标签 -->
    <!-- <div class="flex flex-wrap gap-1 mt-1.5 justify-center">
      <span
        v-for="tag in component.tags.slice(0, 2)"
        :key="tag"
        class="px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
      >
        {{ tag }}
      </span>
      <span
        v-if="component.tags.length > 2"
        class="px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded"
      >
        +{{ component.tags.length - 2 }}
      </span>
    </div> -->

    <!-- 库标识 -->
    <div class="absolute top-2 right-2">
      <span
        class="px-1.5 py-0.5 text-xs font-medium rounded"
        :class="getLibraryClass(component.library)"
      >
        {{ getLibraryLabel(component.library) }}
      </span>
    </div>

    <!-- 容器标识 -->
    <div
      v-if="component.isContainer"
      class="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-green-500"
      title="可包含子组件"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import interact from 'interactjs'
import type { ComponentMeta, UILibrary } from '@/types/component'
import { useEditorStore } from '@/stores/editor'

interface Props {
  component: ComponentMeta
}

const props = defineProps<Props>()
const editorStore = useEditorStore()
const componentEl = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!componentEl.value) return

  let dragGhost: HTMLElement | null = null

  interact(componentEl.value).draggable({
    inertia: true,
    listeners: {
      start(event) {
        // Use the component data directly from props
        editorStore.startDragging(props.component, event.target, event.x0, event.y0)

        // Create the drag ghost
        dragGhost = event.target.cloneNode(true) as HTMLElement
        dragGhost.style.position = 'fixed'
        // Center the ghost on the cursor
        dragGhost.style.left = `${event.x0 - event.target.offsetWidth / 2}px`
        dragGhost.style.top = `${event.y0 - event.target.offsetHeight / 2}px`
        dragGhost.style.zIndex = '1000'
        dragGhost.style.pointerEvents = 'none'
        dragGhost.classList.add('opacity-75', 'shadow-xl')
        document.body.appendChild(dragGhost)
      },
      move(event) {
        if (dragGhost) {
          // Move the ghost with the cursor
          dragGhost.style.transform = `translate(${event.pageX - event.x0}px, ${event.pageY - event.y0}px)`
        }
      },
      end() {
        // Clean up
        if (dragGhost) {
          document.body.removeChild(dragGhost)
          dragGhost = null
        }
        editorStore.stopDragging()
      },
    },
  })
})

// 获取库标签样式
function getLibraryClass(library: UILibrary): string {
  const classMap = {
    'element-plus': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    'ant-design': 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
    'naive-ui': 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  }
  return classMap[library]
}

// 获取库标签文本
function getLibraryLabel(library: UILibrary): string {
  const labelMap = {
    'element-plus': 'EP',
    'ant-design': 'Ant',
    'naive-ui': 'NUI',
  }
  return labelMap[library]
}
</script>
