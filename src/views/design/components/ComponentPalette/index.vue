<template>
  <div class="components-panel">
    <div class="components-panel__content">
      <!-- 左侧模块栏 -->
      <div class="components-panel__module-bar">
        <div
          class="components-panel__module-item"
          v-for="(item, index) in Modules"
          :key="item.id"
          :class="{ 'components-panel__module-item__active': currentModule.name === item.name }">
          <div class="components-panel__module-icon" @click="changeModulePanel(item, index)">
            <div class="components-panel__module-icon-item">
              <img v-if="item.src" :src="item.src" alt="" />
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <div class="components-panel__module-icon-item-name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧详情面板 -->
      <div class="components-panel__detail-pane" v-if="panelShow">
        <div class="components-panel__header">
          <div class="components-panel__title">{{ currentModule.name }}</div>
          <div class="components-panel__tools-group">
            <div class="components-panel__tool-item" v-for="item in Tools" @click="handlerTool(item)">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
          </div>
        </div>
        <div class="components-panel-search" v-if="currentModule && currentModule.search">
          <a-input v-model="searchVal" :placeholder="'搜索' + currentModule.name" allowClear>
            <template #addonBefore>
              <a-select v-model="searchType" style="width: 90px">
                <a-select-option :value="'Vant' + item" v-for="item in 2">{{ 'Vant' + item }}</a-select-option>
              </a-select>
            </template>
          </a-input>
        </div>
        <div class="components-panel__main">
          <!-- 详情主体内容 -->
          <component v-if="currentModule && currentModule.tag" :is="componentsMaps[currentModule.tag]"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ComponentsLibrary from './components/ComponentsLibrary/index.vue'
import { ref, reactive, onMounted, watch, readonly } from 'vue'
import { ComponentPalette } from '@config/index'
import _ from 'lodash'
const componentsMaps = {
  ComponentsLibrary: ComponentsLibrary
  // 如果有其他组件，也加在这里
}
const { Modules, DefaultModule } = ComponentPalette
const Tools = readonly([{ name: 'close', tips: '关闭', icon: 'CloseBold' }])
const currentModule = reactive(_.cloneDeep(Modules[DefaultModule])),
  panelShow = ref(true),
  searchVal = ref(''),
  searchType = ref('')
const changeModulePanel = (item, index) => {
  if (currentModule.name === item.name) {
    panelShow.value = panelShow.value ? false : true
  } else {
    panelShow.value = true
  }
  Object.assign(currentModule, item)
}

const handlerTool = (item, index) => {
  const { name } = item
  switch (name) {
    case 'close':
      panelShow.value = false
      break
    case 'fullscreen':
      break
    default:
      break
  }
}
</script>

<style scoped>
/* Block: components-panel */
.components-panel {
  max-width: 350px;
  height: 100%;
}

/* Element: 内容区域的包裹容器 */
.components-panel__content {
  display: flex;
  width: 100%;
  height: 100%;
}

/* Element: 左侧模块栏 */
.components-panel__module-bar {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding-top: 10px;
  width: 70px;
  align-items: center;
  border-right: #ccc 0.5px dashed;
}

/* Element: 模块栏中的单个项目 */
.components-panel__module-item {
  cursor: pointer;
  font-size: 20px;
  padding: 8px 0px;
  border-radius: 0.5rem;
  width: 53px;
}

.components-panel__module-item:hover {
  background-color: #d9ecff;
  color: #409eff;
}

.components-panel__module-item__active {
  background-color: #d9ecff;
  color: #409eff;
}

/* Element: 模块项目中的图标容器 */
.components-panel__module-icon {
}

/* 针对元素内特定标签的样式 */
.components-panel__module-icon i {
  font-weight: bolder !important;
}

.components-panel__module-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.components-panel__module-icon-item-name {
  font-size: 12px;
  color: #606266;
}

/* Element: 右侧详情面板 */
.components-panel__detail-pane {
  display: flex;
  flex-direction: column;
  /* 建议添加，因为 header 和 main 是垂直排列的 */
  width: 300px;
  border-right: #ccc 0.5px dashed;
}

/* Element: 详情面板的头部 */
.components-panel__header {
  display: flex;
  height: 45px;
  width: 100%;
  align-items: center;
  border-bottom: #ccc 0.5px dashed;
  padding: 5px;
  box-sizing: border-box;
  /* 建议添加，避免 padding 影响总宽度 */
}

/* Element: 头部标题 */
.components-panel__title {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  padding-left: 15px;
  /* 原有样式中的 display:flex 和 justify-content:left 是多余的，父元素已经是flex布局 */
}

/* Element: 头部右侧的工具组 */
.components-panel__tools-group {
  flex: 1;
  font-size: 18px;
  display: flex;
  justify-content: flex-end;
  /* flex-end 比 right 更标准 */
  font-weight: bold;
  gap: 8px;
  padding-right: 10px;
  /* 增加一些右边距，避免工具贴边 */
}

/* Element: 工具组中的单个工具项 */
.components-panel__tool-item {
  cursor: pointer;
}

/* Element: 详情面板的主体区域 */
.components-panel__main {
  flex-grow: 1;
  /* 使主体区域可以填充剩余的垂直空间 */
  overflow: auto;
  /* 如果内容溢出，则显示滚动条 */
}

.components-panel-search {
  padding: 18px 15px 9px 15px;
}
</style>
