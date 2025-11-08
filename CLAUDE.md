# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**Stitcher** 是一个基于 Vue3 + TypeScript 的低代码可视化设计器平台，支持拖拽式组件开发、多设备响应式预览、主题切换和代码导出。

### 核心功能
- 🎨 可视化拖拽设计器
- 🔧 组件属性编辑器
- 📱 多设备响应式预览（桌面/平板/手机）
- 🎭 主题切换（明/暗模式）
- 💾 项目保存与代码导出
- 🔄 撤销/重做操作
- ⌨️ 快捷键支持

## 技术栈

- **框架**: Vue 3.5.22 (Composition API) + TypeScript 5.9.0
- **构建工具**: Vite 7.1.11
- **状态管理**: Pinia 3.0.3
- **路由**: Vue Router 4.6.3
- **UI库**: shadcn-vue 2.3.2 (基于 Radix UI + Tailwind CSS)
- **拖拽**: vuedraggable 4.1.0
- **测试**: Vitest 3.2.4 (单元测试) + Playwright 1.56.1 (E2E测试)
- **代码规范**: ESLint 9.37.0 + Prettier 3.6.2
- **样式**: Tailwind CSS 3.4.18
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

# 预览构建结果
pnpm preview
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
├── components/          # Vue 组件
│   ├── design/          # 设计器核心组件
│   │   ├── Canvas/      # 画布组件
│   │   ├── PropertyPanel/ # 属性面板
│   │   ├── Sidebar/     # 侧边栏（组件库）
│   │   ├── CodeExportModal.vue # 代码导出模态框
│   │   ├── PreviewModal.vue    # 预览模态框
│   │   ├── KeyboardShortcutsHelp.vue # 快捷键帮助
│   │   └── DesignEditor.vue    # 设计器主组件
│   ├── ui/              # shadcn-vue 基础组件
│   │   ├── button/
│   │   ├── card/
│   │   ├── dialog/
│   │   ├── dropdown-menu/
│   │   ├── input/
│   │   ├── select/
│   │   └── tabs/
│   ├── base/            # 基础组件
│   └── __tests__/       # 单元测试
├── views/               # 页面视图
│   ├── HomeView.vue     # 首页
│   └── AboutView.vue    # 关于页
├── stores/              # Pinia 状态管理
│   ├── design.ts        # 设计器状态（画布、组件树、选区、历史记录）
│   ├── device.ts        # 设备状态（多设备切换、响应式）
│   ├── theme.ts         # 主题状态（明/暗模式切换）
│   └── counter.ts       # 计数器示例
├── composables/         # Composition API
│   └── useKeyboardShortcuts.ts # 键盘快捷键
├── config/              # 配置文件
│   ├── components.config.ts    # 组件库配置
│   ├── device.config.ts        # 设备配置
│   └── drag.config.ts          # 拖拽配置
├── types/               # TypeScript 类型定义
│   ├── component.ts     # 组件相关类型
│   ├── design.ts        # 设计器类型
│   ├── device.ts        # 设备类型
│   ├── draggable.ts     # 拖拽类型
│   └── theme.ts         # 主题类型
├── lib/                 # 工具库
│   ├── component-renderer.ts # 组件渲染器
│   └── utils.ts         # 通用工具
├── utils/               # 工具函数
│   └── CodeGenerator.ts # 代码生成器
├── router/              # 路由配置
└── assets/              # 静态资源
```

### 核心架构模块

#### 1. 设计器状态管理 (stores/design.ts)
**核心功能**:
- 组件树管理（添加、删除、更新、移动、复制）
- 选区状态（单选、多选、框选）
- 撤销/重做历史记录（最多100条）
- 画布状态（缩放、网格、背景色）
- 工具切换（选择、框选、手绘）
- 复制/粘贴支持
- 快捷键绑定

**关键方法**:
- `addComponent()` - 添加组件
- `removeComponent()` - 删除组件
- `updateComponent()` - 更新组件
- `moveComponent()` - 移动组件
- `selectComponent()` - 选中组件
- `undo()` / `redo()` - 撤销/重做
- `duplicateComponent()` - 复制组件

#### 2. 设备管理 (stores/device.ts)
**支持设备**:
- 桌面设备 (1920×1080) - 默认
- iPad (768×1024)
- iPhone (375×812)

**核心功能**:
- 设备切换与模拟
- 方向控制（横屏/竖屏）
- 缩放管理（0.1x - 5x）
- 响应式断点 (sm/md/lg/xl/2xl)
- 设备检测

**关键方法**:
- `setCurrentDevice()` - 切换设备
- `setOrientation()` - 设置方向
- `setScale()` - 设置缩放
- `zoomIn()` / `zoomOut()` - 缩放控制

#### 3. 主题系统 (stores/theme.ts)
**主题支持**:
- 浅色主题（默认）
- 深色主题
- 自定义主题
- 系统主题跟随

**核心功能**:
- CSS变量管理
- Tailwind CSS dark mode
- 主题持久化（localStorage）
- 自定义主题创建
- 颜色工具（lighten/darken）

**主题变量**:
- 颜色系统 (primary, secondary, background, foreground等)
- 阴影系统 (sm, md, lg, xl)
- 圆角系统 (sm, md, lg, full)
- 字体系统 (size, family)
- 间距系统 (1-20)
- 过渡动画 (fast, normal, slow)

#### 4. 组件库配置 (config/components.config.ts)
**已集成的UI库**:
- shadcn-vue (主要，已启用)
- Element Plus (已配置，待集成)
- Ant Design Vue (已配置，待集成)

**组件分类**:
- 基础组件 (basic)
- 表单组件 (form)
- 布局组件 (layout)
- 反馈组件 (feedback)
- 导航组件 (navigation)
- 数据展示 (data)
- 高级组件 (advanced)

**预置组件**:
- Button, Input, Text, Card
- Container, Row, Column
- Spacer, Divider, Link, Image

#### 5. 键盘快捷键 (composables/useKeyboardShortcuts.ts)
**内置快捷键**:
- `Ctrl+Z` - 撤销
- `Ctrl+Y` 或 `Ctrl+Shift+Z` - 重做
- `Ctrl+C` - 复制
- `Ctrl+V` - 粘贴
- `Delete/Backspace` - 删除
- `Ctrl+A` - 全选
- `Escape` - 取消选择
- `Ctrl+S` - 保存

#### 6. 组件渲染器 (lib/component-renderer.ts)
- 动态组件渲染
- 属性适配
- 事件转换
- 样式处理

## 设计器核心功能实现

### 1. 拖拽系统
**实现方式**: HTML5 Drag & Drop API + vuedraggable

**关键特性**:
- 从组件库拖拽到画布
- 画布内组件排序
- 多选拖拽
- 吸附对齐
- 智能布局

### 2. 属性编辑器
**位置**: `components/design/PropertyPanel/PropertyPanel.vue`

**功能**:
- 基础属性编辑（文本、颜色、尺寸等）
- 样式编辑器（CSS属性可视化编辑）
- 事件处理器配置
- 实时预览更新

### 3. 多设备切换
**设备类型**:
- 桌面: 1920×1080
- 平板: 768×1024
- 手机: 375×812

**实现**:
```ts
// stores/device.ts
const currentDevice = ref<Device | null>(null);
const setCurrentDevice = (deviceId: string) => { ... };
const setScale = (scale: number) => { ... };
```

### 4. 主题切换系统
**支持功能**:
- 明/暗主题切换
- 自定义主题色
- 系统主题跟随
- 组件库主题同步

**实现**:
```ts
// stores/theme.ts
const applyTheme = (variables: Record<string, string>) => {
  const root = document.documentElement;
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  if (isDark.value) {
    root.classList.add('dark');
  }
};
```

### 5. 代码导出
**位置**: `utils/CodeGenerator.ts` + `components/CodeExportModal.vue`

**功能**:
- 生成 Vue SFC 代码
- 组件树结构导出
- 样式自动注入
- 完整的可运行代码

## 重要文件说明

### 配置文件
- `vite.config.ts` - Vite 构建配置（启用 Vue 脚本选项）
- `tsconfig.json` - TypeScript 配置
- `eslint.config.ts` - ESLint 规则
- `playwright.config.ts` - Playwright E2E 测试配置
- `vitest.config.ts` - Vitest 单元测试配置
- `tailwind.config.js` - Tailwind CSS 配置
- `components.json` - shadcn-vue 组件配置

### 主要入口
- `src/main.ts` - 应用入口
- `src/App.vue` - 根组件
- `src/router/index.ts` - 路由配置
- `src/assets/main.css` - 全局样式

### 设计器核心
- `src/stores/design.ts` - 设计器状态管理 (600行+)
- `src/stores/device.ts` - 设备状态管理
- `src/stores/theme.ts` - 主题状态管理
- `src/components/DesignEditor.vue` - 设计器主组件
- `src/composables/useKeyboardShortcuts.ts` - 快捷键支持
- `src/utils/CodeGenerator.ts` - 代码生成器

## 项目状态

**当前版本**: v0.5.0 (shadcn-vue集成版)

### ✅ 已完成功能
1. 基础项目架构与 TypeScript 类型系统
2. 设计器状态管理（组件树、选区、历史记录）
3. 设备管理系统（多设备切换、响应式）
4. 主题系统（明/暗模式、自定义主题）
5. 键盘快捷键支持
6. 组件库配置系统
7. shadcn-vue 基础组件集成
8. 代码导出功能
9. 预览模式
10. UI 完全重构（匹配设计稿）

### 🚧 待完成功能
1. 完整的拖拽系统（从组件库到画布）
2. 组件属性面板编辑器
3. Element Plus 集成
4. Ant Design Vue 集成
5. 项目保存/加载功能
6. 网格系统和吸附对齐
7. 多选框选功能
8. 组件层级管理（z-index）
9. 实时预览
10. 更多shadcn-vue组件

## 开发指南

### 添加新UI组件
1. **在 components.config.ts 中注册**:
```ts
export const COMPONENT_CONFIG = {
  SHADCN: {
    NewComponent: {
      type: 'NewComponent',
      name: 'NewComponent',
      category: 'basic',
      icon: 'icon-name',
      description: '组件描述',
      defaultProps: { /* 默认属性 */ },
    },
  },
};
```

2. **使用组件**:
```vue
<template>
  <NewComponent v-bind="component.props" />
</template>
```

### 添加新设备
1. **在 config/device.config.ts 中定义**:
```ts
PRESETS: {
  NEW_DEVICE: {
    id: 'new-device',
    type: 'mobile',
    name: '新设备',
    width: 375,
    height: 812,
    // ...
  },
}
```

2. **在代码中使用**:
```ts
const deviceStore = useDeviceStore();
deviceStore.setCurrentDevice('new-device');
```

### 创建自定义主题
```ts
const themeStore = useThemeStore();
const customTheme = themeStore.generateTheme('#ff0000', 'light');
themeStore.setTheme(customTheme.id);
```

## 已知问题

1. 组件库集成方案尚未完全实现（Element Plus、Ant Design Vue）
2. 拖拽系统需要进一步完善
3. 组件属性面板编辑器需要开发
4. 项目保存/加载功能待实现
5. 某些高级功能仍在开发中

## 参考资源

- [Vue 3 官方文档](https://vuejs.org/)
- [shadcn-vue 文档](https://www.shadcn-vue.com/)
- [Vite 文档](https://vitejs.dev/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Playwright 测试文档](https://playwright.dev/)
- [Vitest 单元测试文档](https://vitest.dev/)
