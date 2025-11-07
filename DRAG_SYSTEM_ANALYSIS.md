# 拖拽系统选型分析

## 三个库对比

### 1. interactjs ⭐⭐⭐⭐⭐

**定位**: 专业级拖拽/缩放/旋转库

**优点**:
- ✅ 功能最强大，支持拖拽、缩放、旋转、约束限制
- ✅ 性能优秀，适合大量元素
- ✅ 精确的碰撞检测和放置区域计算
- ✅ 支持多指触控（移动端友好）
- ✅ 成熟的库（维护 7+ 年）
- ✅ 丰富的事件系统（dragstart, dragmove, dragend, drop 等）

**缺点**:
- ❌ 学习曲线陡峭，API 较复杂
- ❌ 与 Vue 集成需要手动处理
- ❌ 包体积较大（~60KB）

**适用场景**:
- 复杂拖拽交互
- 需要精确控制
- 高性能要求

---

### 2. VueUse useDraggable ⭐⭐

**定位**: 轻量级组合式函数

**优点**:
- ✅ Vue 原生支持，API 简洁
- ✅ 轻量级（几 KB）
- ✅ TypeScript 支持好
- ✅ 易于上手和集成

**缺点**:
- ❌ 功能单一，仅基础拖拽
- ❌ 不支持多元素拖拽
- ❌ 碰撞检测能力弱
- ❌ 缺乏嵌套拖拽支持
- ❌ 移动端适配需额外处理

**适用场景**:
- 简单拖拽需求
- 轻量级应用

---

### 3. VueDraggablePlus ⭐⭐⭐⭐

**定位**: Vue3 专业拖拽库

**优点**:
- ✅ 专为 Vue3 设计，完美集成
- ✅ 支持列表拖拽排序
- ✅ 支持嵌套拖拽（多层级）
- ✅ 开箱即用的 Vue 组件
- ✅ 社区活跃，文档详细
- ✅ TypeScript 支持完整
- ✅ 支持触摸设备
- ✅ 丰富的配置选项
- ✅ 性能良好（支持虚拟列表）

**缺点**:
- ❌ 对于非列表场景配置稍复杂
- ❌ 在极端复杂拖拽场景下性能略低于 interactjs

**适用场景**:
- Vue3 拖拽应用 ✅
- 组件库面板拖拽 ✅
- 画布内拖拽排序 ✅
- 嵌套结构拖拽 ✅

---

## 低代码设计器需求分析

### 核心拖拽场景

1. **从组件面板拖拽到画布**
   - 列表拖拽
   - 放置到指定位置
   - 需要碰撞检测

2. **在画布内拖拽调整位置**
   - 组件移动
   - 精确坐标计算
   - 网格吸附

3. **组件层级调整**
   - 嵌套拖拽
   - 父子关系变更
   - 多元素排序

4. **跨容器拖拽**
   - 不同容器间移动
   - 保持组件属性

5. **选区拖拽**
   - 框选多个组件
   - 整体移动

---

## 推荐方案：VueDraggablePlus

### 为什么选 VueDraggablePlus？

#### 1. **完美匹配 Vue3 生态** ✅
- 原生 Vue3 Composition API 设计
- 与项目技术栈（Vue3 + TypeScript）完美契合
- 无需额外适配层

#### 2. **功能完整** ✅
- 支持所有核心拖拽场景
- 嵌套拖拽能力强大（画布多层级结构）
- 列表拖拽流畅（组件面板）

#### 3. **开发效率高** ✅
- 开箱即用的 `<Draggable>` 组件
- 配置简单，上手快
- 丰富的示例和文档

#### 4. **性能优秀** ✅
- 支持虚拟滚动（大数据量）
- 增量更新
- 移动端优化

#### 5. **社区活跃** ✅
- GitHub 7.5k+ stars
- 持续更新维护
- 问题响应快

---

## 实现方案

### 安装
```bash
pnpm add vuedraggable
# 或
pnpm add vuedraggable-plus
```

### 基础使用示例

#### 1. 组件面板拖拽
```vue
<template>
  <div class="component-panel">
    <Draggable
      v-model="componentList"
      :group="{ name: 'components', pull: 'clone', put: false }"
      :clone="cloneComponent"
      item-key="id"
    >
      <template #item="{ element }">
        <div class="component-item">
          {{ element.name }}
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Draggable from 'vuedraggable';

interface ComponentItem {
  id: string;
  name: string;
  type: string;
}

const componentList = ref<ComponentItem[]>([
  { id: '1', name: 'Button', type: 'button' },
  { id: '2', name: 'Input', type: 'input' },
  { id: '3', name: 'Card', type: 'card' },
]);

const cloneComponent = (item: ComponentItem) => {
  return {
    ...item,
    id: `${item.id}-${Date.now()}`, // 生成新 ID
  };
};
</script>
```

#### 2. 画布容器
```vue
<template>
  <div class="canvas">
    <Draggable
      v-model="canvasComponents"
      :group="{ name: 'components', pull: false, put: true }"
      item-key="id"
      :sort="true"
      @add="handleAdd"
      @update="handleUpdate"
    >
      <template #item="{ element }">
        <div
          class="canvas-item"
          :class="{ active: element.id === selectedId }"
          @click="selectComponent(element.id)"
        >
          <!-- 渲染实际组件 -->
          <component :is="getComponent(element.type)" v-bind="element.props" />
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Draggable from 'vuedraggable';

const canvasComponents = ref([]);
const selectedId = ref<string | null>(null);

const handleAdd = (e: any) => {
  // 组件添加到画布
  console.log('添加组件:', e.item);
};

const handleUpdate = (e: any) => {
  // 组件位置更新
  console.log('更新组件:', e.item);
};
</script>
```

#### 3. 嵌套拖拽（画布多层级）
```vue
<template>
  <div class="canvas">
    <Draggable
      v-model="canvasComponents"
      :group="{ name: 'components' }"
      item-key="id"
      :sort="true"
      :animation="200"
    >
      <template #item="{ element }">
        <div class="component-wrapper">
          <component
            :is="getComponent(element.type)"
            v-bind="element.props"
          />
          <!-- 嵌套容器拖拽 -->
          <Draggable
            v-if="element.children"
            v-model="element.children"
            :group="{ name: 'components' }"
            item-key="id"
            class="nested-container"
          >
            <template #item="{ element: child }">
              <div class="child-component">
                <component :is="getComponent(child.type)" v-bind="child.props" />
              </div>
            </template>
          </Draggable>
        </div>
      </template>
    </Draggable>
  </div>
</template>
```

#### 4. 选区拖拽
```vue
<template>
  <div class="canvas">
    <Draggable
      v-model="selectedComponents"
      :group="{ name: 'move' }"
      item-key="id"
      :disabled="!isDragging"
    >
      <template #item="{ element }">
        <div class="selected-item">
          {{ element.name }}
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Draggable from 'vuedraggable';

const isDragging = ref(false);

// 框选逻辑
const handleSelection = (selectedIds: string[]) => {
  selectedComponents.value = selectedComponents.value.filter(
    (item) => selectedIds.includes(item.id)
  );
};
</script>
```

---

## 组合方案

### 高级功能扩展

对于需要更精细控制的场景（如缩放、旋转），可以结合 CSS transform 和 Vue 响应式数据：

```vue
<template>
  <div
    class="draggable-element"
    :style="{
      transform: `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`,
    }"
  >
    <component :is="componentType" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const x = ref(0);
const y = ref(0);
const rotation = ref(0);
const scale = ref(1);
</script>
```

---

## 性能优化建议

### 1. 使用虚拟列表
```vue
<Draggable
  v-model="largeList"
  item-key="id"
  :virtual-scroll="true"
  :item-size="50"
/>
```

### 2. 动画优化
```vue
<Draggable
  :animation="150" // 降低动画时间提升性能
  :ghost-class="ghostClass"
  :chosen-class="chosenClass"
/>
```

### 3. 禁用不必要的功能
```vue
<Draggable
  :sort="true" // 仅在需要排序时启用
  :draggable="'.draggable-item'" // 指定可拖拽元素
  :direction="'vertical'" // 限制方向
/>
```

---

## 总结

**推荐 VueDraggablePlus**，原因：
- ✅ Vue3 生态完美匹配
- ✅ 功能完整，涵盖所有需求
- ✅ 开发效率高
- ✅ 性能优秀
- ✅ 社区支持好

**特殊情况**:
- 如果需要极致性能或复杂缩放旋转，可考虑 **interactjs**
- 如果只是简单拖拽，**VueUse** 就足够

对于低代码设计器，**VueDraggablePlus** 是最优选择！🚀
