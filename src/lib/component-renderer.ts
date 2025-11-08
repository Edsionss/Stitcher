// 组件渲染器
// 负责将 ComponentNode 转换为实际可渲染的 Vue 组件

import type { ComponentNode, ComponentLibrary } from '@/types/component';

// shadcn-vue 组件映射
const SHADCN_COMPONENTS: Record<string, any> = {
  Button: null, // 将在集成 shadcn-vue 后替换为实际组件
  Input: null,
  Card: null,
  Text: null,
  Image: null,
  Container: null,
  Row: null,
  Column: null,
  Spacer: null,
  Divider: null,
  Link: null,
};

// Element Plus 组件映射
const ELEMENT_COMPONENTS: Record<string, any> = {
  Button: null,
  Input: null,
  Card: null,
  Text: null,
  Image: null,
  Container: null,
  Row: null,
  Column: null,
  Spacer: null,
  Divider: null,
  Link: null,
};

// Ant Design Vue 组件映射
const ANT_COMPONENTS: Record<string, any> = {
  Button: null,
  Input: null,
  Card: null,
  Text: null,
  Image: null,
  Container: null,
  Row: null,
  Column: null,
  Spacer: null,
  Divider: null,
  Link: null,
};

// 组件库映射表
const LIBRARY_MAP: Record<ComponentLibrary, Record<string, any>> = {
  shadcn: SHADCN_COMPONENTS,
  element: ELEMENT_COMPONENTS,
  antd: ANT_COMPONENTS,
};

/**
 * 组件渲染器类
 */
export class ComponentRenderer {
  /**
   * 根据组件节点获取实际渲染的组件
   */
  static getComponent(component: ComponentNode): any {
    const { type, library } = component;

    // 获取组件库映射
    const libraryComponents = LIBRARY_MAP[library];

    if (!libraryComponents) {
      console.warn(`未知的组件库: ${library}`);
      return this.getFallbackComponent(type);
    }

    // 获取实际组件
    let actualComponent = libraryComponents[type];

    // 如果没有找到，使用回退组件
    if (!actualComponent) {
      console.warn(`组件库 ${library} 中未找到组件: ${type}`);
      actualComponent = this.getFallbackComponent(type);
    }

    return actualComponent;
  }

  /**
   * 获取回退组件
   * 当找不到匹配的组件时使用
   */
  private static getFallbackComponent(type: string) {
    // 返回一个通用的包装组件
    return {
      name: 'FallbackComponent',
      props: {
        type: { type: String, default: type },
      },
      template: `
        <div class="fallback-component" :data-type="type">
          <div class="p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div class="text-center text-slate-500 dark:text-slate-400">
              <span class="material-symbols-outlined text-4xl mb-2">extension</span>
              <p class="text-sm font-medium">未实现组件</p>
              <p class="text-xs mt-1">类型: {{ type }}</p>
            </div>
          </div>
        </div>
      `,
    };
  }

  /**
   * 适配组件属性
   * 将内部属性格式转换为目标组件库需要的格式
   */
  static adaptProps(component: ComponentNode): Record<string, any> {
    const { type, library, props = {}, style = {} } = component;
    const adaptedProps: Record<string, any> = {};

    // 基础属性适配
    Object.keys(props).forEach(key => {
      const value = props[key];
      switch (library) {
        case 'shadcn':
          adaptedProps[key] = value;
          break;
        case 'element':
          // Element Plus 属性名转换
          adaptedProps[this.convertToElementProp(key)] = value;
          break;
        case 'antd':
          // Ant Design Vue 属性名转换
          adaptedProps[this.convertToAntProp(key)] = value;
          break;
        default:
          adaptedProps[key] = value;
      }
    });

    // 添加样式
    if (Object.keys(style).length > 0) {
      adaptedProps.style = { ...style };
    }

    return adaptedProps;
  }

  /**
   * 转换为 Element Plus 属性名
   */
  private static convertToElementProp(key: string): string {
    const conversionMap: Record<string, string> = {
      'className': 'class',
      'class': 'class',
      'onClick': '@click',
    };
    return conversionMap[key] || key;
  }

  /**
   * 转换为 Ant Design Vue 属性名
   */
  private static convertToAntProp(key: string): string {
    const conversionMap: Record<string, string> = {
      'className': 'className',
      'class': 'className',
      'onClick': 'onClick',
    };
    return conversionMap[key] || key;
  }

  /**
   * 渲染组件
   */
  static render(component: ComponentNode) {
    const VueComponent = this.getComponent(component);
    const adaptedProps = this.adaptProps(component);

    return {
      component: VueComponent,
      props: adaptedProps,
    };
  }

  /**
   * 注册组件到库
   */
  static registerComponent(
    library: ComponentLibrary,
    type: string,
    component: any
  ) {
    if (!LIBRARY_MAP[library]) {
      throw new Error(`未知的组件库: ${library}`);
    }

    LIBRARY_MAP[library][type] = component;
  }

  /**
   * 批量注册组件
   */
  static registerComponents(
    library: ComponentLibrary,
    components: Record<string, any>
  ) {
    Object.entries(components).forEach(([type, component]) => {
      this.registerComponent(library, type, component);
    });
  }
}

// 默认导出
export default ComponentRenderer;
