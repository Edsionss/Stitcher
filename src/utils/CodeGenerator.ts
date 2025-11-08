import type { ComponentNode } from '@/types/component';

export function generateTemplate(components: ComponentNode[]): string {
  return components.map(comp => generateComponentTemplate(comp)).join('\n  ');
}

export function generateComponentTemplate(component: ComponentNode): string {
  const indent = '  ';
  let template = '';

  switch (component.type) {
    case 'Text':
      template = `<${component.props.tag || 'p'}>${component.props.text || '文本'}</${component.props.tag || 'p'}>`;
      break;
    case 'Button':
      template = `<button class="btn">${component.props.text || '按钮'}</button>`;
      break;
    case 'Input':
      template = `<input type="${component.props.type || 'text'}" placeholder="${component.props.placeholder || ''}" class="input" />`;
      break;
    case 'Container':
      template = `<div class="container">${component.children?.map(child => generateComponentTemplate(child)).join('\n  ') || ''}</div>`;
      break;
    case 'Card':
      template = `<div class="card">
  <div class="card-header">${component.props.title || '标题'}</div>
  <div class="card-content">${component.props.content || '内容'}</div>
</div>`;
      break;
    case 'Image':
      template = `<img src="${component.props.src || ''}" alt="${component.props.alt || ''}" class="image" />`;
      break;
    case 'Link':
      template = `<a href="${component.props.href || '#'}" class="link">${component.props.text || '链接'}</a>`;
      break;
    default:
      template = `<div>${component.type}</div>`;
  }

  return indent + template;
}

export function generateJSX(components: ComponentNode[]): string {
  return components.map(comp => generateComponentJSX(comp, 2)).join('\n  ');
}

export function generateComponentJSX(component: ComponentNode, indentLevel: number): string {
  const indent = ' '.repeat(indentLevel);
  let jsx = '';

  switch (component.type) {
    case 'Text':
      jsx = `<${component.props.tag || 'p'}>${component.props.text || '文本'}</${component.props.tag || 'p'}>`;
      break;
    case 'Button':
      jsx = `<button>${component.props.text || '按钮'}</button>`;
      break;
    case 'Input':
      jsx = `<input type="${component.props.type || 'text'}" placeholder="${component.props.placeholder || ''}" />`;
      break;
    case 'Container':
      const children = component.children?.map(child => generateComponentJSX(child, indentLevel + 2)).join('\n') || '';
      jsx = `<div>
${children}
${indent}</div>`;
      break;
    default:
      jsx = `<div>${component.type}</div>`;
  }

  return indent + jsx;
}

export function generateHTMLString(components: ComponentNode[]): string {
  return components.map(comp => generateComponentHTML(comp, 2)).join('\n  ');
}

export function generateComponentHTML(component: ComponentNode, indentLevel: number): string {
  const indent = ' '.repeat(indentLevel);
  let html = '';

  switch (component.type) {
    case 'Text':
      html = `<${component.props.tag || 'p'}>${component.props.text || '文本'}</${component.props.tag || 'p'}>`;
      break;
    case 'Button':
      html = `<button>${component.props.text || '按钮'}</button>`;
      break;
    case 'Input':
      html = `<input type="${component.props.type || 'text'}" placeholder="${component.props.placeholder || ''}" />`;
      break;
    case 'Container':
      const children = component.children?.map(child => generateComponentHTML(child, indentLevel + 2)).join('\n') || '';
      html = `<div>
${children}
${indent}</div>`;
      break;
    case 'Card':
      html = `<div>
${indent}  <h3>${component.props.title || '标题'}</h3>
${indent}  <p>${component.props.content || '内容'}</p>
${indent}</div>`;
      break;
    case 'Image':
      html = `<img src="${component.props.src || ''}" alt="${component.props.alt || ''}" />`;
      break;
    case 'Link':
      html = `<a href="${component.props.href || '#'}">${component.props.text || '链接'}</a>`;
      break;
    default:
      html = `<div>${component.type}</div>`;
  }

  return indent + html;
}

export function generateScript(): string {
  return `// Generated script
// Add your logic here`;
}

export function generateStyle(): string {
  return `/* Base styles */
.container {
  padding: 1rem;
}

.card {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.5rem 0;
}

.card-header {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  background: #2b8cee;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
}

.link {
  color: #2b8cee;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.image {
  max-width: 100%;
  height: auto;
}
`;
}

export function generateVueSFC(rootComponents: ComponentNode[]): string {
  const template = generateTemplate(rootComponents);
  const script = generateScript();
  const style = generateStyle();

  return `<template>
${template}
</template>

<script setup lang="ts">
${script}
</script>

<style scoped>
${style}
</style>
`;
}

export function generateVueJSX(rootComponents: ComponentNode[]): string {
  const jsx = generateJSX(rootComponents);
  const script = generateScript();
  return `import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GeneratedComponent',
  setup() {
    ${script}
    return () => (
${jsx}
    );
  }
});
`;
}

export function generateHTML(rootComponents: ComponentNode[]): string {
  const html = generateHTMLString(rootComponents);
  // 使用 String.fromCharCode 避免字符串识别
  const scriptTag = String.fromCharCode(60, 115, 99, 114, 105, 112, 116, 62); // <script>
  const scriptEndTag = String.fromCharCode(60, 47, 115, 99, 114, 105, 112, 116, 62); // </script>

  return [
    '<!DOCTYPE html>',
    '<html lang="zh-CN">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '  <title>Generated Page</title>',
    '  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>',
    '</head>',
    '<body>',
    '  <div id="app">',
    html,
    '  </div>',
    '',
    '  ' + scriptTag,
    '  const { createApp } = Vue;',
    '',
    '  createApp({',
    '    data() {',
    '      return {}',
    '    },',
    '    methods: {}',
    '  }).mount(\'#app\');',
    '  ' + scriptEndTag,
    '</body>',
    '</html>'
  ].join('\n');
}
