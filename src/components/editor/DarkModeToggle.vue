<template>
  <button
    @click="toggleDark"
    class="p-2 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
  >
    <span class="material-symbols-outlined">
      {{ isDark ? 'light_mode' : 'dark_mode' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  updateDarkClass()
}

const updateDarkClass = () => {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  // 从 localStorage 读取主题偏好
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // 如果没有保存的偏好，使用系统偏好
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  updateDarkClass()
})
</script>
