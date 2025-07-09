<template>
  <div class="framework-panel">
    <div class="framework-panel__accordion">
      <div v-for="framework in componentsArray" :key="framework.componentName" class="framework-panel__item">
        <div class="framework-panel__header" @click="toggleFramework(framework.componentName)">
          <span class="framework-panel__label">
            <i :class="framework.icon"></i>
            {{ framework.componentName }}
          </span>
          <i
            :class="[
              'framework-panel__arrow',
              'el-icon-arrow-down',
              { 'framework-panel__arrow--collapsed': activeFrameworkName !== framework.componentName }
            ]"></i>
        </div>
        <div class="framework-panel__content" v-if="activeFrameworkName === framework.componentName">
          <van-tabs color="#409EFF" v-model="activeTabs[framework.componentName]">
            <van-tab v-for="group in framework.group" :title="group.label" :name="group.name" :key="group.name">
              <div class="group-list">
                <div class="group-list__item" v-for="children in group.group" :key="children.name">
                  <div class="group-list__header" @click="foldItem(framework.componentName, children.name)">
                    <div class="group-list__label">{{ children.label }}</div>
                    <i
                      :class="[
                        'group-list__icon',
                        'el-icon-arrow-down',
                        { 'group-list__icon--collapsed': !isGroupOpen(framework.componentName, children.name) }
                      ]"></i>
                  </div>
                  <div
                    class="core-panel__item-content"
                    v-show="isGroupOpen(framework.componentName, children.name)">
                    <draggable
                      :list="children.children"
                      :group="{ name: 'itxst', pull: 'clone', put: false }"
                      :force-fallback="true"
                      :animation="300"
                      :sort="false"
                      :clone="item => onClone(item, children, framework)"
                      chosen-class="drag-zone__item--chosen"
                      class="drag-zone">
                      <transition-group tag="div" class="drag-zone__group">
                        <div class="drag-zone__item" v-for="(item, index) in children.children" :key="item.id">
                          {{ item.props.label }}
                        </div>
                      </transition-group>
                    </draggable>
                  </div>
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
</script>

<style scoped>
/* Block: framework-panel */
.framework-panel {
  width: 100%;
  height: 100%;
  /* background-color: #fff; */
}

/* Element: framework-panel__accordion (顶级手风琴容器) */
.framework-panel__accordion {
  border-bottom: 1px solid #e4e7ed;
}

/* Element: framework-panel__item (每个UI框架项) */
.framework-panel__item {
  border-top: 1px solid #e4e7ed;
}

.framework-panel__item:first-child {
  border-top: none;
}

/* Element: framework-panel__header (框架项的头部) */
.framework-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  cursor: pointer;
  /* background-color: #fafafa; */
  font-weight: 600;
  font-size: 15px;
  transition: background-color 0.2s;
}

.framework-panel__header:hover {
  /* background-color: #f5f5f5; */
  background-color: #d9ecff;
  color: #409eff;
}

/* Element: framework-panel__label, framework-panel__arrow (头部内的元素) */
.framework-panel__label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.framework-panel__arrow {
  transition: transform 0.3s;
}

/* Modifier: framework-panel__arrow--collapsed (箭头的折叠状态) */
.framework-panel__arrow--collapsed {
  transform: rotate(-90deg);
}

/* Element: framework-panel__content (框架项的内容区域) */
.framework-panel__content {
  padding: 0 10px 10px 10px;
}

/* --- 内部组件分组样式 (依然遵循BEM，但以 'group-list' 为新Block) --- */
.group-list {
  border-top: 1px solid #f0f0f0;
}

.group-list__item {
  border-bottom: 1px solid #f0f0f0;
}

.group-list__item:last-child {
  border-bottom: none;
}

.group-list__header {
  font-size: 14px;
  /* color: #606266; */
  font-weight: 500;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
}

.group-list__label {
  flex: 1;
}

.group-list__icon {
  display: flex;
  justify-content: right;
  transition: transform 0.3s;
}

.group-list__icon--collapsed {
  transform: rotate(-90deg);
}

.core-panel__item-content {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* --- 拖拽组件区域样式 (以 'drag-zone' 为新Block) --- */
.drag-zone {
  padding: 10px 5px;
}

.drag-zone__group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.drag-zone__item {
  width: 48%;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border: 1px solid #e9e9eb;
  border-radius: 0.5rem;
  font-size: 14px;
  /* color: #303133; */
  /* 明确拖拽手势 */
  /* cursor: grab;   */
  cursor: move;
  /* --- 动效核心：为所有变化的属性添加平滑过渡 --- */
  transition: all 0.25s ease-in-out;
  /* 添加一个透明边框，防止 hover 和 chosen 时跳动 */
  transition: background-color 0.2s, border-color 0.2s;
}

.drag-zone__item:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Modifier: for vuedraggable's chosen class */
.drag-zone__item--chosen {
  background-color: #f0f8ff;
  /* 选中时给一个淡蓝色背景 */
  border: solid 2px #3089dc !important;
}
</style>
