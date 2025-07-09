<template>
  <div class="header-panel">
    <!-- 左侧区域 -->
    <div class="header-panel__left-section">
      <div class="header-panel__icon"><img :src="AnalysisIconURL(SYSTEM_ICON)" alt="" /></div>
      <div class="header-panel__title-group">
        <div class="header-panel__title-item">
          {{ SYSTEM_NAME }}
        </div>
      </div>
      <div class="header-panel__version">
        <el-tag type="primary">{{ SYSTEM_VERSION_LABEL }} {{ SYSTEM_VERSION_NUMBER }}</el-tag>
      </div>
      <!-- <div class="header-panel__theme" @click="toggleTheme">
        <el-icon :class="currentTheme === 'light' ? 'el-icon-moon' : 'el-icon-sunny'"></el-icon>
      </div> -->
    </div>

    <!-- 中间模式切换区域 -->
    <div class="header-panel__mode-switcher">
      <div
        class="header-panel__mode-item"
        v-for="mode in SYSTEM_DEVICE_MODES"
        @click="changeMode(mode)"
        :class="{
          'header-panel__mode-item--active': mode.label === deviceMode?.label
        }">
        <div class="header-panel__mode-content">
          <div class="header-panel__mode-icon"><img :src="AnalysisIconURL(mode.icon)" alt="" /></div>
          <div class="header-panel__mode-label">
            {{ mode.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧操作按钮区域 -->
    <div class="header-panel__actions">
      <div class="header-panel__actions-group">
        <div class="header-panel__action-item" v-for="FUNCTIONS in SYSTEM_FUNCTIONS"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs } from 'vue'
import { WorkspaceHeader } from '@config/index'
import { useSystemStore } from '@stores/index'
import { storeToRefs } from 'pinia'
const {
  SYSTEM_CONFIG, //系统配置
  SYSTEM_DEFAULT_DEVICE_MODE, //默认模式
  SYSTEM_FUNCTIONS, //系统功能
  SYSTEM_ICON, //系统图标
  SYSTEM_DEVICE_MODES, //系统模式列表
  SYSTEM_NAME, //系统名称
  SYSTEM_VERSION_LABEL, //系统版本标签
  SYSTEM_VERSION_NUMBER //系统版本号
} = WorkspaceHeader
const systemStore = useSystemStore()

const { deviceMode } = storeToRefs(systemStore)
deviceMode.value = SYSTEM_DEVICE_MODES[SYSTEM_DEFAULT_DEVICE_MODE]
// 主题切换
const toggleTheme = () => {}
// 模式切换
const changeMode = mode => {
  deviceMode.value = mode
}
//  获取图标 URL
const AnalysisIconURL = url => {
  const completeUrl = `../../../../assets/${url} `
  return new URL(completeUrl, import.meta.url)
}
</script>

<style scoped>
.header-panel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 55px;
  border-bottom: #666 0.5px dashed;
}

/* --- 左侧区域 --- */

/* Element: 左侧容器 */
.header-panel__left-section {
  padding-left: 10px;
  flex: 1;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Element: 面板图标 */
.header-panel__icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
}

/* Element: 标题组 */
.header-panel__title-group {
  padding-left: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Element: 单个标题项 */
/* .header-panel__title-item {} */

/* Element: 版本号 */
.header-panel__version .el-tag {
  /* 对于第三方组件的内部样式，有时直接后代选择是较务实的方式 */
  font-size: 16px;
}

/* --- 中间区域 --- */

/* Element: 模式切换器容器 */
.header-panel__mode-switcher {
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* Element: 单个模式选项 */
.header-panel__mode-item {
  text-align: center;
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 5px;
  transition: background-color 0.2s;
  /* 增加过渡效果 */
  user-select: none;
}

/* Modifier: 选中状态的模式选项 */
.header-panel__mode-item:hover,
.header-panel__mode-item:active,
.header-panel__mode-item--active {
  background-color: #d9ecff;
}

/* 父元素 hover 时改变子元素样式，这是 BEM 允许的 */
.header-panel__mode-item:hover .header-panel__mode-label,
.header-panel__mode-item--active .header-panel__mode-label {
  color: #409eff;
}

/* Element: 模式选项的内容包裹器 */
.header-panel__mode-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

/* Element: 模式选项的图标 */
.header-panel__mode-icon {
  width: 24px;
  height: 24px;
}

/* Element: 模式选项的标签文本 */
.header-panel__mode-label {
  font-size: 12px;
  color: #666;
  transition: color 0.2s;
  /* 增加过渡效果 */
}

/* --- 右侧区域 --- */

/* Element: 右侧操作区容器 */
.header-panel__actions {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 10px;
}

/* Element: 按钮组 */
.header-panel__actions-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
}

/* Element: 单个操作项（按钮的包裹容器） */
/* .header-panel__action-item {} */

/* 主题切换按钮样式 */
.header-panel__theme {
  z-index: 1000;
  cursor: pointer;
  color: #409eff;
}
</style>
