# 低代码设计器开发计划

## 项目概述
开发一个基于 Vue3 的可视化低代码设计器，支持拖拽式组件开发、多组件库兼容、响应式设计和主题切换。

## 开发目标

### 核心功能
1. ✅ 基础项目架构搭建
2. 🔄 可视化拖拽设计器
3. 🔄 组件属性编辑器
4. 🔄 多设备响应式切换
5. 🔄 主题系统（明/暗模式）
6. 📋 多组件库支持（shadcn-vue、Element Plus、Ant Design Vue）
7. 📋 项目保存与发布功能

---

## 阶段一：项目初始化与基础设施 ⏳ 预计 1-2 天

### 任务清单

#### 1.1 环境配置 [1 小时]
- [ ] 确认 Node.js 版本 (^20.19.0 || >=22.12.0)
- [ ] 安装 pnpm 包管理器
- [ ] 安装项目依赖
- [ ] 配置 IDE 插件（Vue 官方扩展）

#### 1.2 项目结构优化 [2 小时]
- [ ] 创建核心目录结构
  ```
  src/
  ├── components/
  │   ├── design/          # 设计器组件
  │   │   ├── Canvas/      # 画布
  │   │   ├── Toolbar/     # 工具栏
  │   │   ├── Sidebar/     # 侧边栏（组件库）
  │   │   ├── PropertyPanel/ # 属性面板
  │   │   └── PreviewPanel/ # 预览面板
  │   └── ui/              # 基础 UI 组件
  ├── stores/              # 状态管理
  ├── composables/         # 组合式函数
  ├── lib/                 # 工具库
  ├── types/               # 类型定义
  └── config/              # 配置文件
  ```
- [ ] 清理默认示例组件

#### 1.3 TypeScript 类型定义 [1 小时]
- [ ] 创建组件类型定义 `types/component.ts`
- [ ] 创建设计器类型定义 `types/design.ts`
- [ ] 创建主题类型定义 `types/theme.ts`
- [ ] 创建设备类型定义 `types/device.ts`

#### 1.4 工具库配置 [1 小时]
- [ ] 配置 Tailwind CSS
- [ ] 配置 shadcn-vue
- [ ] 配置 ESLint 和 Prettier
- [ ] 设置路径别名

---

## 阶段二：状态管理系统 ⏳ 预计 1 天

### 任务清单

#### 2.1 设计器状态管理 [4 小时]
**文件**: `stores/design.ts`

- [ ] 创建 Pinia store
- [ ] 实现组件树数据结构
- [ ] 实现当前选中组件状态
- [ ] 实现撤销/重做功能
  - 使用 history 栈记录操作
  - 支持快照保存
- [ ] 实现组件层级管理（z-index）
- [ ] 实现复制/粘贴功能

**关键数据结构**:
```typescript
interface ComponentNode {
  id: string;
  type: string;
  library: 'shadcn' | 'element' | 'antd';
  props: Record<string, any>;
  children: ComponentNode[];
  parentId?: string;
  style: Record<string, any>;
  events: Record<string, Function>;
  lifecycle: Record<string, Function>;
}
```

#### 2.2 组件库状态管理 [2 小时]
**文件**: `stores/components.ts`

- [ ] 创建组件库注册表
- [ ] 支持组件库切换
- [ ] 组件元数据管理
- [ ] 组件渲染器

#### 2.3 主题状态管理 [2 小时]
**文件**: `stores/theme.ts`

- [ ] 明/暗主题切换
- [ ] 自定义主题色配置
- [ ] CSS 变量注入
- [ ] 主题持久化（localStorage）

---

## 阶段三：拖拽系统实现 ⏳ 预计 1-2 天

**技术方案**: VueDraggablePlus

### 任务清单

#### 3.1 VueDraggablePlus 安装与配置 [1 小时]
**依赖文件**: `package.json`

- [ ] 安装 VueDraggablePlus
  ```bash
  pnpm add vuedraggable
  ```
- [ ] 创建拖拽工具函数 `lib/draggable.ts`
- [ ] 定义拖拽事件类型 `types/draggable.ts`
- [ ] 配置全局拖拽参数

#### 3.2 组件库面板实现 [4 小时]
**文件**: `components/design/Sidebar/ComponentLibrary.vue`

- [ ] 创建 Draggable 容器（克隆模式）
- [ ] 设计组件卡片 UI
- [ ] 组件分类展示（基础组件、表单组件、反馈组件等）
- [ ] 组件预览图
- [ ] 克隆配置（pull: 'clone'）
- [ ] 组件唯一 ID 生成逻辑
- [ ] 组件元数据绑定

**核心代码结构**:
```vue
<Draggable
  :list="componentList"
  :group="{ name: 'components', pull: 'clone', put: false }"
  :clone="cloneComponent"
  item-key="id"
>
  <template #item="{ element }">
    <ComponentCard :component="element" />
  </template>
</Draggable>
```

#### 3.3 画布容器实现 [5 小时]
**文件**: `components/design/Canvas/Canvas.vue`

- [ ] 创建主画布 Draggable 容器
- [ ] 实现组件渲染器
- [ ] 拖拽放置事件处理（@add）
- [ ] 组件位置更新事件（@update）
- [ ] 拖拽排序功能（:sort="true"）
- [ ] 选中状态可视化
  - 选中边框高亮
  - 拖拽手柄显示
  - 删除按钮
- [ ] 网格背景设置
- [ ] 空状态提示

**核心代码结构**:
```vue
<Draggable
  v-model="canvasComponents"
  :group="{ name: 'components', pull: false, put: true }"
  item-key="id"
  :sort="true"
  :animation="200"
  @add="handleComponentAdd"
  @update="handleComponentUpdate"
  @end="handleDragEnd"
>
  <template #item="{ element }">
    <div class="canvas-item" :class="{ active: element.id === selectedId }">
      <component :is="getComponent(element.type)" v-bind="element.props" />
    </div>
  </template>
</Draggable>
```

#### 3.4 嵌套拖拽支持 [2 小时]
- [ ] 子容器 Draggable 配置
- [ ] 嵌套层级数据结构
- [ ] 父子关系管理
- [ ] 嵌套拖拽事件处理
- [ ] 嵌套层级可视化（缩进显示）

**嵌套拖拽示例**:
```vue
<template v-if="element.children">
  <Draggable
    v-model="element.children"
    :group="{ name: 'components' }"
    item-key="id"
    class="nested-container"
  >
    <template #item="{ element: child }">
      <CanvasItem :component="child" />
    </template>
  </Draggable>
</template>
```

#### 3.5 拖拽事件处理与状态同步 [1.5 小时]
**文件**: `stores/design.ts`

- [ ] 组件添加事件处理
- [ ] 组件移动事件处理
- [ ] 组件删除事件处理
- [ ] 选中状态同步
- [ ] 历史记录更新
- [ ] 组件树结构更新

**事件处理函数**:
```typescript
const handleComponentAdd = (e: any) => {
  // 新组件添加到画布
  const component = e.item._underlying_vm_;
  updateCanvasComponents();
  updateHistory();
};

const handleComponentUpdate = (e: any) => {
  // 组件位置或顺序更新
  updateCanvasComponents();
};

const handleComponentRemove = (e: any) => {
  // 组件从画布移除
  removeComponent(e.item.dataset.id);
};
```

#### 3.6 拖拽高级配置与优化 [0.5 小时]
- [ ] 拖拽视觉样式配置
  - ghost-class（拖拽镜像）
  - chosen-class（选中状态）
  - drag-class（拖拽中状态）
- [ ] 性能优化
  - 禁用拖拽动画（:animation="150"）
  - 限制拖拽范围（direction 限制）
  - 虚拟滚动支持
- [ ] 移动端适配测试
- [ ] 触摸事件处理

**样式配置示例**:
```vue
<Draggable
  :animation="150"
  :ghost-class="'ghost-class'"
  :chosen-class="'chosen-class'"
  :drag-class="'drag-class'"
  :force-fallback="true" // 移动端优化
/>
```

#### 3.7 拖拽调试与测试 [1 小时]
- [ ] 添加调试日志
- [ ] 拖拽状态可视化（控制台输出）
- [ ] 组件树变化追踪
- [ ] 性能监控（拖拽帧率）
- [ ] 边界情况测试
  - 空画布拖拽
  - 单组件拖拽
  - 多选拖拽
  - 嵌套拖拽

---

## VueDraggablePlus 快速参考

### 核心 API

#### 基础属性
```vue
<template>
  <Draggable
    v-model="list"
    item-key="id"
    :group="groupConfig"
    :sort="true"
    :animation="200"
    :ghost-class="ghostClass"
    :chosen-class="chosenClass"
    :drag-class="dragClass"
  >
    <!-- 内容 -->
  </Draggable>
</template>

<script setup>
import Draggable from 'vuedraggable';

// 组件库面板（克隆模式）
const componentGroup = {
  name: 'components',
  pull: 'clone',    // 'clone' 复制 | true 移动 | false 不允许
  put: false        // true 接收 | false 不接收
};

// 画布容器（放置模式）
const canvasGroup = {
  name: 'components',
  pull: false,
  put: true
};
</script>
```

#### 关键事件
```vue
<Draggable
  @add="onAdd"        // 新元素添加时触发
  @update="onUpdate"  // 元素位置更新时触发
  @remove="onRemove"  // 元素移除时触发
  @end="onEnd"        // 拖拽结束时触发
  @start="onStart"    // 拖拽开始时触发
/>
```

#### 事件处理函数示例
```typescript
const onAdd = (evt: any) => {
  // evt.item: 被拖拽元素
  // evt.to: 目标容器
  // evt.from: 来源容器
  const newIndex = evt.newIndex;
  const component = evt.item._underlying_vm_;
  addComponent(component, newIndex);
};

const onUpdate = (evt: any) => {
  const oldIndex = evt.oldIndex;
  const newIndex = evt.newIndex;
  moveComponent(oldIndex, newIndex);
};

const onRemove = (evt: any) => {
  const component = evt.item._underlying_vm_;
  removeComponent(component.id);
};
```

#### 克隆函数
```typescript
const cloneComponent = (component: ComponentItem) => {
  return {
    ...component,
    id: `${component.id}-${Date.now()}`,
    props: { ...component.props },
    children: []
  };
};
```

#### 嵌套拖拽
```vue
<template #item="{ element }">
  <div class="parent-component">
    <component :is="getComponent(element.type)" v-bind="element.props" />
    <Draggable
      v-if="element.children?.length"
      v-model="element.children"
      :group="{ name: 'components' }"
      item-key="id"
      class="children-container"
    >
      <template #item="{ element: child }">
        <ChildComponent :component="child" />
      </template>
    </Draggable>
  </div>
</template>
```

### 性能优化配置

#### 大数据量优化
```vue
<Draggable
  v-model="largeList"
  item-key="id"
  :virtual-scroll="true"
  :item-size="60"
  :animation="150"
  :force-fallback="true"
/>
```

#### 移动端优化
```vue
<Draggable
  :force-fallback="true"  // 强制使用 HTML5 原生拖拽
  :fallback-on-body="true"
  :swap-threshold="0.65"
  :invert-swap="true"
/>
```

#### 视觉反馈
```vue
<Draggable
  :ghost-class="'drag-ghost'"
  :chosen-class="'drag-chosen'"
  :drag-class="'drag-drag'"
  :draggable="'.draggable-item'"
/>

<style>
.drag-ghost {
  opacity: 0.5;
  background: #ccc;
}
.drag-chosen {
  background: #f0f0f0;
  box-shadow: 0 0 0 2px #2b8cee;
}
.drag-drag {
  transform: rotate(5deg);
}
</style>
```

### 常见问题解决

#### 1. 拖拽后数据未更新
- 确保 `v-model` 绑定正确
- 使用深拷贝 `JSON.parse(JSON.stringify(obj))`
- 检查 `item-key` 唯一性

#### 2. 嵌套拖拽不生效
- 确保嵌套容器有 `:group` 配置
- 使用 `item-key` 绑定唯一 ID
- 检查 `v-if` 条件渲染

#### 3. 移动端无法拖拽
- 添加 `:force-fallback="true"`
- 确保容器有固定高度
- 检查触摸事件监听

#### 4. 性能问题
- 降低 `:animation` 值
- 开启 `:virtual-scroll`
- 使用 `:item-size` 固定高度
- 减少同时渲染的组件数量

---

## 阶段四：属性编辑器 ⏳ 预计 2 天

### 任务清单

#### 4.1 属性面板基础框架 [3 小时]
**文件**: `components/design/PropertyPanel/PropertyPanel.vue`

- [ ] 标签页切换（属性/样式/事件/高级）
- [ ] 动态表单渲染器
- [ ] 字段类型系统
  - 文本输入
  - 数字输入
  - 布尔值（开关）
  - 选择器
  - 颜色选择器
  - 尺寸输入（带单位）

#### 4.2 基础属性编辑 [4 小时]
- [ ] 文本内容编辑
- [ ] 尺寸属性（width/height）
- [ ] 位置属性（left/top）
- [ ] 可见性（display/visibility）
- [ ] 禁用/只读状态

#### 4.3 样式编辑器 [4 小时]
- [ ] CSS 属性分组
  - 布局
  - 尺寸
  - 外观（颜色、边框、阴影）
  - 字体
  - 动画
- [ ] 样式实时预览
- [ ] 样式重置功能
- [ ] 样式继承处理

#### 4.4 事件编辑器 [2 小时]
- [ ] 事件类型选择
- [ ] 事件处理器配置
- [ ] 支持的内置动作
  - 显示/隐藏
  - 跳转页面
  - 数据请求
- [ ] 自定义脚本支持

#### 4.5 高级配置 [1 小时]
- [ ] 生命周期钩子
- [ ] 数据绑定
- [ ] 条件渲染
- [ ] 循环渲染

---

## 阶段五：多设备响应式实现 ⏳ 预计 1 天

### 任务清单

#### 5.1 设备切换功能 [2 小时]
**文件**: `components/design/Toolbar/DeviceSelector.vue`

- [ ] 设备类型选择按钮
- [ ] 设备尺寸配置
  - 桌面：1920x1080
  - 平板：768x1024
  - 手机：375x667
- [ ] 自定义设备尺寸
- [ ] 设备旋转功能

#### 5.2 响应式画布 [3 小时]
- [ ] 画布尺寸动态调整
- [ ] 设备边框模拟
- [ ] 设备工具栏显示
- [ ] 设备信息显示

#### 5.3 响应式预览 [1 小时]
- [ ] 组件响应式属性配置
- [ ] 断点预览
- [ ] 设备间预览同步

#### 5.4 设备状态管理 [1 小时]
**文件**: `stores/device.ts`

- [ ] 当前设备状态
- [ ] 设备尺寸记录
- [ ] 预览模式切换

---

## 阶段六：主题系统 ⏳ 预计 1 天

### 任务清单

#### 6.1 主题切换功能 [2 小时]
**文件**: `components/design/Toolbar/ThemeToggle.vue`

- [ ] 明/暗主题切换按钮
- [ ] 主题状态持久化
- [ ] 系统主题监听
- [ ] 切换动画效果

#### 6.2 自定义主题色 [2 小时]
- [ ] 主题色选择器
- [ ] 预设主题方案
- [ ] 自定义主题保存
- [ ] 主题导入/导出

#### 6.3 组件库主题同步 [2 小时]
- [ ] shadcn-vue 主题适配
- [ ] Element Plus 主题适配
- [ ] Ant Design Vue 主题适配
- [ ] 统一主题变量

#### 6.4 CSS 变量管理 [1 小时]
- [ ] CSS 变量定义
- [ ] 动态主题注入
- [ ] 变量继承关系
- [ ] 样式作用域隔离

---

## 阶段七：组件库系统 ⏳ 预计 3-4 天

### 任务清单

#### 7.1 shadcn-vue 组件库集成 [1 天]
**优先级**: 🔴 高

- [ ] 安装 shadcn-vue
- [ ] 配置 Tailwind CSS 主题
- [ ] 基础组件适配
  - Button 按钮
  - Input 输入框
  - Select 选择器
  - Textarea 文本域
  - Checkbox 复选框
  - Radio 单选框
  - Switch 开关
  - Card 卡片
  - Dialog 对话框
  - Table 表格
  - Tabs 标签页
  - Accordion 手风琴
  - Alert 警告提示
  - Badge 徽章
  - Avatar 头像
  - Progress 进度条
  - Skeleton 骨架屏

#### 7.2 Element Plus 组件库 [1.5 天]
**优先级**: 🟡 中

- [ ] 安装 Element Plus
- [ ] 创建适配器层 `lib/adapters/element-adapter.ts`
- [ ] 组件属性映射
- [ ] 事件系统适配
- [ ] 样式主题同步
- [ ] 组件注册
  - ElButton
  - ElInput
  - ElSelect
  - ElRadio
  - ElCheckbox
  - ElSwitch
  - ElCard
  - ElDialog
  - ElTable
  - ElTabs
  - ElMessage
  - ElBadge

#### 7.3 Ant Design Vue 组件库 [1.5 天]
**优先级**: 🟡 中

- [ ] 安装 Ant Design Vue
- [ ] 创建适配器层 `lib/adapters/antd-adapter.ts`
- [ ] 组件属性映射
- [ ] 事件系统适配
- [ ] 样式主题同步
- [ ] 组件注册
  - AButton
  - AInput
  - ASelect
  - ARadio
  - ACheckbox
  - ASwitch
  - ACard
  - AModal
  - ATable
  - ATabs
  - AAlert
  - ABadge
  - AAvatar
  - AProgress

#### 7.4 组件库管理系统 [0.5 天]
- [ ] 组件库选择器
- [ ] 组件库切换逻辑
- [ ] 组件兼容性检查
- [ ] 组件库版本管理

---

## 阶段八：高级功能 ⏳ 预计 2-3 天

### 任务清单

#### 8.1 撤销/重做系统 [1 天]
- [ ] 历史记录管理
- [ ] 快照生成算法
- [ ] 内存优化（快照压缩）
- [ ] 快捷键支持（Ctrl+Z / Ctrl+Y）

#### 8.2 保存与发布功能 [1 天]
**文件**: `views/DesignStudio.vue`

- [ ] 项目数据结构定义
- [ ] 本地存储（localStorage/IndexedDB）
- [ ] 项目导入/导出（JSON）
- [ ] 代码生成功能
  - 生成 Vue 单文件组件
  - 生成页面配置文件
  - 生成路由配置
- [ ] 在线预览功能

#### 8.3 组件树视图 [0.5 天]
**文件**: `components/design/Sidebar/ComponentTree.vue`

- [ ] 层级结构展示
- [ ] 拖拽排序
- [ ] 组件锁定/解锁
- [ ] 组件隐藏/显示

#### 8.4 键盘快捷键 [0.5 天]
- [ ] 保存（Ctrl+S）
- [ ] 预览（Ctrl+P）
- [ ] 发布（Ctrl+Shift+P）
- [ ] 撤销/重做
- [ ] 复制/粘贴/删除

---

## 阶段九：测试与优化 ⏳ 预计 2 天

### 任务清单

#### 9.1 单元测试 [1 天]
- [ ] 状态管理测试（Pinia store）
- [ ] 工具函数测试
- [ ] 组件适配器测试
- [ ] 覆盖率报告

#### 9.2 E2E 测试 [0.5 天]
- [ ] 拖拽功能测试
- [ ] 属性编辑测试
- [ ] 主题切换测试
- [ ] 设备切换测试
- [ ] 多组件库兼容性测试

#### 9.3 性能优化 [0.5 天]
- [ ] 虚拟滚动（长列表）
- [ ] 组件懒加载
- [ ] 画布渲染优化
- [ ] 内存泄漏检查
- [ ] 包大小优化

---

## 阶段十：文档与发布 ⏳ 预计 1 天

### 任务清单

#### 10.1 开发文档 [0.5 天]
- [ ] API 文档
- [ ] 组件开发指南
- [ ] 扩展开发指南
- [ ] 最佳实践

#### 10.2 用户文档 [0.25 天]
- [ ] 快速开始指南
- [ ] 功能说明文档
- [ ] 常见问题解答

#### 10.3 部署准备 [0.25 天]
- [ ] 生产环境配置
- [ ] CI/CD 配置
- [ ] 版本发布流程

---

## 技术风险与应对

### 1. 组件库兼容性
**风险**: 不同组件库 API 差异大，适配复杂
**应对**: 建立统一的组件接口标准，开发适配器层

### 2. 拖拽系统与性能
**风险**: VueDraggablePlus 在大量组件时性能下降
**应对**:
- 使用 `:animation="150"` 降低动画开销
- 开启虚拟滚动 `:virtual-scroll="true"`
- 启用 `item-size` 优化计算
- 限制拖拽区域，减少 DOM 操作
- 考虑使用 `use` 优化计算属性

### 3. 嵌套拖拽复杂性
**风险**: 嵌套结构下拖拽逻辑复杂，容易出现父子关系错误
**应对**:
- 使用 VueDraggablePlus 的嵌套特性
- 严格管理组件树结构
- 添加父子关系验证逻辑
- 编写嵌套拖拽专项测试

### 4. 状态管理复杂度
**风险**: 组件树结构复杂，状态同步困难
**应对**: 使用不可变数据，引入 Immer

### 5. 响应式设计
**风险**: 多种设备适配复杂
**应对**: 建立标准设备预设，支持自定义尺寸

---

## 资源预估

### 人力投入
- **总开发周期**: 12-16 天
- **人力**: 1-2 名前端开发工程师
- **总工时**: 100-150 小时

### 外部依赖
- shadcn-vue
- Element Plus
- Ant Design Vue
- VueDraggablePlus
- Tailwind CSS

---

## 里程碑节点

1. **M1 - 基础架构完成** (第 2 天)
   - 项目结构搭建
   - 状态管理就绪
   - TypeScript 类型定义完成

2. **M2 - 拖拽系统完成** (第 5 天)
   - VueDraggablePlus 集成
   - 组件库面板（克隆拖拽）
   - 画布容器（放置拖拽）
   - 嵌套拖拽支持
   - 拖拽事件处理

3. **M3 - 属性编辑完成** (第 7 天)
   - 属性编辑器
   - 样式编辑器
   - 事件编辑

4. **M4 - 设备与主题** (第 9 天)
   - 多设备切换
   - 主题系统

5. **M5 - 组件库完成** (第 13 天)
   - shadcn-vue 集成
   - Element Plus 适配
   - Ant Design Vue 适配

6. **M6 - 高级功能** (第 16 天)
   - 撤销/重做
   - 保存发布
   - 测试优化

---

## 开发建议

1. **优先顺序**: 建议按阶段顺序开发，确保每阶段功能稳定后进入下一阶段

2. **测试驱动**: 在实现核心功能时，建议同时编写测试用例

3. **代码审查**: 关键模块（拖拽系统、状态管理）需要代码审查

4. **文档同步**: 重要 API 和架构变更需要及时更新文档

5. **性能监控**: 在开发过程中关注性能指标，避免后期重构

---

## 后续规划

### 短期目标
- [ ] 组件市场（预设模板）
- [ ] 团队协作功能
- [ ] 数据源管理
- [ ] 自定义脚本支持

### 长期目标
- [ ] 移动端设计器
- [ ] 多人实时协作
- [ ] 插件系统
- [ ] AI 辅助开发
- [ ] 国际化支持

---

**文档版本**: v1.0
**创建日期**: 2025-11-07
**最后更新**: 2025-11-07
**负责人**: 开发团队
