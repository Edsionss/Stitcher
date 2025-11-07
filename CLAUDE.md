# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Stitcher** 是一个基于 Vue3 的低代码可视化设计器平台，支持拖拽式组件开发、多组件库兼容、响应式设计和主题切换。

### 核心功能
- 🎨 可视化拖拽设计器
- 🔧 组件属性编辑器
- 📱 多设备响应式预览（桌面/平板/手机）
- 🎭 主题切换（明暗模式）
- 🔌 多组件库支持（shadcn-vue、Element Plus、Ant Design Vue）
- 💾 项目保存与发布
- 🔄 撤销/重做操作

## 技术栈

- **框架**: Vue 3 (Composition API) + TypeScript
- **构建工具**: Vite 7.x
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **UI库**: shadcn-vue
- **测试**: Vitest (单元测试) + Playwright (E2E测试)
- **代码规范**: ESLint 9.x + Prettier 3.x
- **Node版本**: ^20.19.0 || >=22.12.0

## 常用开发命令

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
# 启动开发服务器 (http://localhost:5173)
pnpm dev
```

### 构建生产版本
```bash
# 类型检查 + 构建
pnpm build

# 仅构建
pnpm build-only
```

### 测试
```bash
# 运行单元测试 (Vitest)
pnpm test:unit

# 运行 E2E 测试 (Playwright)
pnpm test:e2e

# 安装 Playwright 浏览器
npx playwright install

# 指定项目运行 E2E 测试
pnpm test:e2e --project=chromium

# 运行特定测试文件
pnpm test:e2e tests/example.spec.ts

# 调试模式
pnpm test:e2e --debug
```

### 代码质量
```bash
# ESLint 检查 + 自动修复
pnpm lint

# Prettier 格式化
pnpm format
```

### 类型检查
```bash
pnpm type-check
```

## 架构设计

### 目录结构
```
src/
├── assets/              # 静态资源
├── components/          # Vue 组件
│   ├── design/          # 设计器相关组件
│   │   ├── Canvas/      # 画布组件
│   │   ├── Toolbar/     # 工具栏组件
│   │   ├── Sidebar/     # 侧边栏组件
│   │   └── PropertyPanel/ # 属性面板组件
│   └── ui/              # 基础 UI 组件 (shadcn-vue)
├── views/               # 页面视图
│   └── DesignStudio/    # 设计工作室页面
├── stores/              # Pinia 状态管理
│   ├── design.ts        # 设计器状态
│   ├── components.ts    # 组件库状态
│   ├── theme.ts         # 主题状态
│   └── device.ts        # 设备状态
├── router/              # 路由配置
├── types/               # TypeScript 类型定义
│   ├── component.ts     # 组件类型
│   ├── design.ts        # 设计器类型
│   └── theme.ts         # 主题类型
├── composables/         # Composition API 逻辑复用
│   useDragDrop.ts       # 拖拽逻辑
│   useComponentRender.ts # 组件渲染逻辑
│   └── useTheme.ts      # 主题切换逻辑
└── lib/                 # 工具库
    ├── component-registry.ts # 组件注册表
    └── utils.ts         # 通用工具
```

### 核心架构模块

#### 1. 设计器状态管理 (stores/design.ts)
- 当前选中的组件
- 画布组件树结构
- 撤销/重做历史记录
- 组件层级管理

#### 2. 组件库管理系统 (stores/components.ts)
- 组件库注册与切换
- 组件元数据定义
- 组件渲染器

#### 3. 主题系统 (stores/theme.ts)
- 明/暗主题切换
- 自定义主题色配置
- CSS 变量管理

#### 4. 设备适配 (stores/device.ts)
- 当前预览设备类型（桌面/平板/手机）
- 响应式断点管理

## 组件库兼容方案

### 1. shadcn-vue（主要 UI 库）

**安装**:
```bash
pnpm add shadcn-vue
```

**优势**:
- 高度可定制
- 基于 Tailwind CSS
- 现代化设计
- 组件组合能力强

**使用示例**:
```vue
<template>
  <Button variant="default" size="default">
    点击按钮
  </Button>
</template>
```

### 2. Element Plus 兼容方案

**安装**:
```bash
pnpm add element-plus
```

**策略**:
- 通过组件适配器模式统一接口
- 将 Element Plus 组件封装为标准组件
- 支持属性映射和事件转换

**实现**:
```ts
// lib/element-adapter.ts
export function adaptElementProps(elementProps: any) {
  return {
    ...elementProps,
    // 属性转换逻辑
  };
}
```

### 3. Ant Design Vue 兼容方案

**安装**:
```bash
pnpm add ant-design-vue
```

**策略**:
- 同样使用适配器模式
- 统一组件 API 接口
- 支持样式主题同步

## 设计器核心功能实现

### 1. 拖拽系统

**实现方式**: HTML5 Drag & Drop API + Vue3 Draggable

**关键文件**:
- `composables/useDragDrop.ts` - 拖拽逻辑
- `components/design/Canvas/` - 画布容器
- `components/design/Sidebar/` - 组件列表

**拖拽流程**:
1. 从组件面板拖拽组件
2. 在画布上释放
3. 解析组件类型和默认属性
4. 创建组件实例并添加到画布
5. 更新设计状态树

### 2. 属性编辑器

**位置**: `components/design/PropertyPanel/`

**功能**:
- 基础属性编辑（文本、颜色、尺寸等）
- 高级属性编辑（事件绑定、数据源等）
- 样式编辑器（CSS 属性可视化编辑）
- 生命周期钩子配置

**实现思路**:
- 动态表单生成器
- 基于组件元数据的属性配置
- 实时预览更新

### 3. 多设备切换

**设备类型**:
- 桌面: 1920x1080
- 平板: 768x1024
- 手机: 375x667

**实现**:
```ts
// stores/device.ts
export const useDeviceStore = defineStore('device', () => {
  const currentDevice = ref<'desktop' | 'tablet' | 'mobile'>('desktop');
  const deviceSizes = {
    desktop: { width: 1920, height: 1080 },
    tablet: { width: 768, height: 1024 },
    mobile: { width: 375, height: 667 }
  };
  return { currentDevice, deviceSizes };
});
```

### 4. 主题切换系统

**支持功能**:
- 明/暗主题切换
- 自定义主题色
- 组件库主题同步

**实现**:
```ts
// stores/theme.ts
export const useThemeStore = defineStore('theme', () => {
  const theme = ref<'light' | 'dark'>('light');
  const primaryColor = ref('#2b8cee');

  // CSS 变量注入
  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', theme.value);
  };

  return { theme, primaryColor, applyTheme };
});
```

## 开发指南

### 添加新组件库支持

1. **创建适配器**:
```ts
// lib/adapters/new-library-adapter.ts
export class NewLibraryAdapter {
  adapt(component: any) {
    // 转换组件为标准格式
  }
}
```

2. **注册组件库**:
```ts
// stores/components.ts
const adapter = new NewLibraryAdapter();
registerLibrary('new-lib', adapter);
```

3. **在组件面板中注册**:
```ts
// 组件元数据
const componentMeta = {
  name: 'NewComponent',
  library: 'new-lib',
  props: { /* 属性定义 */ },
  events: { /* 事件定义 */ }
};
```

### 添加新组件

1. **在组件库中定义**:
```ts
// lib/component-registry.ts
export const registerComponent = (meta: ComponentMeta) => {
  // 注册组件元数据
};
```

2. **创建组件适配器** (如果使用第三方库):
```ts
// lib/adapters/button-adapter.ts
export function ButtonAdapter(props: any) {
  return {
    // 返回标准化的 props
  };
}
```

3. **在设计器中使用**:
```vue
<!-- 动态渲染组件 -->
<component
  :is="getComponent(component.type)"
  v-bind="component.props"
  @click="handleClick"
/>
```

## 重要文件说明

### 配置文件
- `vite.config.ts` - Vite 构建配置
- `tsconfig.json` - TypeScript 配置
- `eslint.config.ts` - ESLint 规则
- `playwright.config.ts` - Playwright E2E 测试配置
- `vitest.config.ts` - Vitest 单元测试配置

### 主要入口
- `src/main.ts` - 应用入口
- `src/App.vue` - 根组件
- `src/router/index.ts` - 路由配置

### 设计器核心
- `src/stores/design.ts` - 设计器状态管理
- `src/components/design/` - 设计器核心组件
- `src/composables/useDragDrop.ts` - 拖拽功能
- `src/lib/component-registry.ts` - 组件注册表

## 项目状态

当前项目处于初始化阶段，基础架构已搭建完成。下一步需要实现：
1. 设计器核心功能（拖拽、画布、属性面板）
2. 组件库管理系统
3. 主题系统
4. 设备切换功能

## 参考资源

- [Vue 3 官方文档](https://vuejs.org/)
- [shadcn-vue 文档](https://www.shadcn-vue.com/)
- [Vite 文档](https://vitejs.dev/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
