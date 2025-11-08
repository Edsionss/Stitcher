<template>
  <div class="base-components">
    <!-- shadcn-vue Button 组件 -->
    <Button
      v-if="component.type === 'Button'"
      :variant="component.props.variant || 'default'"
      :size="component.props.size || 'default'"
      :disabled="component.props.disabled"
      v-bind="component.props"
    >
      {{ component.props.text || '按钮' }}
    </Button>

    <!-- shadcn-vue Input 组件 -->
    <Input
      v-else-if="component.type === 'Input'"
      :type="component.props.type || 'text'"
      :placeholder="component.props.placeholder"
      :disabled="component.props.disabled"
      v-bind="component.props"
    />

    <!-- shadcn-vue Card 组件 -->
    <Card
      v-else-if="component.type === 'Card'"
      v-bind="component.props"
    >
      <CardHeader v-if="component.props.title">
        <CardTitle>{{ component.props.title }}</CardTitle>
        <CardDescription v-if="component.props.description">
          {{ component.props.description }}
        </CardDescription>
      </CardHeader>
      <CardContent v-if="component.props.content">
        {{ component.props.content }}
      </CardContent>
      <slot />
    </Card>

    <!-- 文本组件 (HTML元素) -->
    <component
      v-else-if="component.type === 'Text'"
      :is="getTextTag(component.props)"
      v-bind="getTextProps(component.props)"
      v-html="component.props.text || component.props.content || '文本'"
      :class="getTextClasses(component.props)"
      :style="component.style"
    />

    <!-- 容器组件 -->
    <component
      v-else-if="component.type === 'Container'"
      :is="getContainerTag(component.props)"
      v-bind="component.props"
      :style="component.style"
      class="base-container"
    >
      <slot />
    </component>

    <!-- 行组件 -->
    <component
      v-else-if="component.type === 'Row'"
      :is="getRowTag(component.props)"
      v-bind="component.props"
      :style="component.style"
      class="base-row"
    >
      <slot />
    </component>

    <!-- 列组件 -->
    <component
      v-else-if="component.type === 'Column'"
      :is="getColumnTag(component.props)"
      v-bind="component.props"
      :style="component.style"
      class="base-col"
    >
      <slot />
    </component>

    <!-- 间距组件 -->
    <div
      v-else-if="component.type === 'Spacer'"
      :style="{
        height: component.props.size ? `${component.props.size}px` : '20px',
        ...component.style
      }"
      class="base-spacer"
    />

    <!-- 分隔线组件 -->
    <div
      v-else-if="component.type === 'Divider'"
      :class="getDividerClasses(component.props)"
      :style="component.style"
      class="base-divider"
    >
      <span
        v-if="component.props.text"
        class="divider-text"
      >
        {{ component.props.text }}
      </span>
    </div>

    <!-- 链接组件 -->
    <a
      v-else-if="component.type === 'Link'"
      :href="component.props.href || '#'"
      :target="component.props.target || '_self'"
      v-bind="component.props"
      :style="component.style"
      class="base-link"
      :class="getLinkClasses(component.props)"
    >
      {{ component.props.text || component.props.children || '链接' }}
    </a>

    <!-- 图片组件 -->
    <div
      v-else-if="component.type === 'Image'"
      class="base-image"
      :style="getImageStyle(component)"
    >
      <img
        v-if="component.props.src"
        :src="component.props.src"
        :alt="component.props.alt || ''"
        :class="getImageClasses(component.props)"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <div v-else class="image-placeholder">
        <span class="material-symbols-outlined text-4xl">image</span>
        <p class="text-sm text-slate-500 dark:text-slate-400">暂无图片</p>
      </div>
    </div>

    <!-- 未知组件 -->
    <div
      v-else
      class="unknown-component"
      :data-type="component.type"
      :style="component.style"
    >
      <div class="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
        <span class="material-symbols-outlined text-4xl text-slate-400 dark:text-slate-500 mb-2">
          extension
        </span>
        <p class="text-sm text-slate-600 dark:text-slate-400 font-medium">
          未实现组件: {{ component.type }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentNode } from '@/types/component';

// 导入 shadcn-vue 组件
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
  component: ComponentNode;
}

const props = defineProps<Props>();

// ========== 文本组件 ==========
const getTextTag = (props: any) => {
  const tagMap: Record<string, string> = {
    h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
    p: 'p', span: 'span', div: 'div',
  };
  return tagMap[props.tag || 'p'] || 'p';
};

const getTextProps = (props: any) => {
  const { tag, text, content, ...rest } = props;
  return rest;
};

const getTextClasses = (props: any) => {
  const classes = ['base-text'];
  if (props.bold) classes.push('font-bold');
  if (props.italic) classes.push('italic');
  if (props.underline) classes.push('underline');
  if (props.size) classes.push(`text-${props.size}`);
  if (props.color) classes.push(`text-${props.color}`);
  return classes;
};

// ========== 容器组件 ==========
const getContainerTag = (props: any) => props.tag || 'div';
const getRowTag = (props: any) => props.tag || 'div';
const getColumnTag = (props: any) => props.tag || 'div';

// ========== 分隔线组件 ==========
const getDividerClasses = (props: any) => {
  const classes = ['base-divider'];
  if (props.vertical) classes.push('vertical');
  if (props.dashed) classes.push('dashed');
  return classes;
};

// ========== 链接组件 ==========
const getLinkClasses = (props: any) => {
  const classes = ['base-link'];
  if (props.variant === 'primary') classes.push('link-primary');
  if (props.variant === 'secondary') classes.push('link-secondary');
  return classes;
};

// ========== 图片组件 ==========
const getImageStyle = (component: ComponentNode) => {
  const style: any = { ...component.style };
  if (component.props.width) style.width = component.props.width;
  if (component.props.height) style.height = component.props.height;
  return style;
};

const getImageClasses = (props: any) => {
  const classes = ['base-image-img'];
  if (props.rounded) classes.push('rounded');
  if (props.circle) classes.push('rounded-full');
  if (props.shadow) classes.push('shadow');
  return classes;
};

// ========== 事件处理 ==========
const handleImageLoad = (event: Event) => {
  console.log('图片加载成功', event);
};

const handleImageError = (event: Event) => {
  console.log('图片加载失败', event);
};
</script>

<style scoped>
.base-text {
  display: inline-block;
}

.base-container {
  display: block;
}

.base-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}

.base-col {
  display: block;
  flex: 1;
}

.base-spacer {
  display: block;
  flex-shrink: 0;
}

.base-divider {
  position: relative;
  display: flex;
  align-items: center;
  margin: 1rem 0;
  color: #e2e8f0;
}

.base-divider.vertical {
  width: 1px;
  height: auto;
  margin: 0 1rem;
}

.base-divider.vertical::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: currentColor;
}

.base-divider:not(.vertical)::before {
  content: '';
  flex: 1;
  height: 1px;
  background: currentColor;
}

.base-divider:not(.vertical)::after {
  content: '';
  flex: 1;
  height: 1px;
  background: currentColor;
}

.base-divider .divider-text {
  padding: 0 1rem;
  background: white;
  color: #64748b;
  font-size: 0.875rem;
}

:global(.dark) .base-divider .divider-text {
  background: #1e293b;
}

.base-link {
  display: inline-block;
  text-decoration: none;
  color: #2b8cee;
  transition: all 0.2s;
}

.base-link:hover {
  color: #1d7bd8;
  text-decoration: underline;
}

.base-link.link-primary {
  color: #2b8cee;
}

.base-link.link-secondary {
  color: #64748b;
}

.base-link.link-secondary:hover {
  color: #2b8cee;
}

.base-image {
  display: inline-block;
  position: relative;
}

.base-image-img {
  display: block;
  max-width: 100%;
  height: auto;
}

.base-image-img.rounded {
  border-radius: 0.375rem;
}

.base-image-img.rounded-full {
  border-radius: 9999px;
}

.base-image-img.shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.image-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
  color: #94a3b8;
}

:global(.dark) .image-placeholder {
  background: #1e293b;
  color: #64748b;
}

.base-button-wrapper {
  display: inline-block;
}

.base-input-wrapper {
  display: inline-block;
}

.base-card-wrapper {
  display: block;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

:global(.dark) .base-card-wrapper {
  background: #1e293b;
  border-color: #334155;
}

.card-header {
  margin-bottom: 0.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
}

:global(.dark) .card-title {
  color: #f1f5f9;
}

.card-content {
  color: #64748b;
}

:global(.dark) .card-content {
  color: #94a3b8;
}
</style>
