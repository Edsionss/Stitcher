// 组件库配置
export const COMPONENT_CONFIG = {
  // 默认组件库
  DEFAULT_LIBRARY: 'shadcn' as const,

  // 组件分类
  CATEGORIES: {
    BASIC: {
      id: 'basic',
      name: '基础组件',
      icon: 'box',
      order: 1,
    },
    FORM: {
      id: 'form',
      name: '表单组件',
      icon: 'edit',
      order: 2,
    },
    FEEDBACK: {
      id: 'feedback',
      name: '反馈组件',
      icon: 'message-circle',
      order: 3,
    },
    LAYOUT: {
      id: 'layout',
      name: '布局组件',
      icon: 'layout',
      order: 4,
    },
    NAVIGATION: {
      id: 'navigation',
      name: '导航组件',
      icon: 'menu',
      order: 5,
    },
    DATA: {
      id: 'data',
      name: '数据展示',
      icon: 'table',
      order: 6,
    },
    ADVANCED: {
      id: 'advanced',
      name: '高级组件',
      icon: 'layers',
      order: 7,
    },
  },

  // shadcn-vue 组件映射
  SHADCN: {
    Button: {
      type: 'Button',
      name: 'Button',
      category: 'basic',
      icon: 'mouse-pointer',
      description: '触发操作的按钮',
      defaultProps: {
        variant: 'default',
        size: 'default',
        text: '按钮',
        disabled: false,
      },
    },
    Input: {
      type: 'Input',
      name: 'Input',
      category: 'form',
      icon: 'type',
      description: '文本输入框',
      defaultProps: {
        type: 'text',
        placeholder: '请输入',
        disabled: false,
      },
    },
    Text: {
      type: 'Text',
      name: 'Text',
      category: 'basic',
      icon: 'text-fields',
      description: '文本组件',
      defaultProps: {
        tag: 'p',
        text: '这是一段文本',
        bold: false,
        italic: false,
        size: 'base',
        color: 'default',
      },
    },
    Container: {
      type: 'Container',
      name: 'Container',
      category: 'layout',
      icon: 'crop-din',
      description: '容器组件',
      defaultProps: {
        tag: 'div',
        padding: 'md',
      },
    },
    Row: {
      type: 'Row',
      name: 'Row',
      category: 'layout',
      icon: 'view-week',
      description: '行布局',
      defaultProps: {
        gap: 'md',
      },
    },
    Column: {
      type: 'Column',
      name: 'Column',
      category: 'layout',
      icon: 'view-column',
      description: '列布局',
      defaultProps: {
        span: 1,
      },
    },
    Spacer: {
      type: 'Spacer',
      name: 'Spacer',
      category: 'layout',
      icon: 'height',
      description: '间距组件',
      defaultProps: {
        size: 20,
      },
    },
    Divider: {
      type: 'Divider',
      name: 'Divider',
      category: 'layout',
      icon: 'horizontal-rule',
      description: '分隔线',
      defaultProps: {
        vertical: false,
        dashed: false,
        text: '',
      },
    },
    Link: {
      type: 'Link',
      name: 'Link',
      category: 'basic',
      icon: 'link',
      description: '链接组件',
      defaultProps: {
        text: '链接文本',
        href: '#',
        target: '_self',
        variant: 'default',
      },
    },
    Image: {
      type: 'Image',
      name: 'Image',
      category: 'basic',
      icon: 'image',
      description: '图片组件',
      defaultProps: {
        src: '',
        alt: '',
        width: 200,
        height: 150,
        rounded: false,
        circle: false,
        shadow: false,
      },
    },
    Card: {
      type: 'Card',
      name: 'Card',
      category: 'layout',
      icon: 'credit-card',
      description: '卡片容器',
      defaultProps: {
        title: '卡片标题',
        content: '卡片内容',
        padding: 'md',
        shadow: 'sm',
      },
    },
  },

  // Element Plus 组件映射
  ELEMENT: {
    Button: {
      type: 'Button',
      name: 'Button',
      category: 'basic',
      icon: 'mouse-pointer',
      description: '按钮组件',
      defaultProps: {
        type: 'primary',
        size: 'default',
        text: '按钮',
        disabled: false,
      },
    },
    Input: {
      type: 'Input',
      name: 'Input',
      category: 'form',
      icon: 'type',
      description: '输入框组件',
      defaultProps: {
        type: 'text',
        placeholder: '请输入内容',
        disabled: false,
      },
    },
    Text: {
      type: 'Text',
      name: 'Text',
      category: 'basic',
      icon: 'text-fields',
      description: '文本组件',
      defaultProps: {
        tag: 'p',
        text: '这是一段文本',
      },
    },
    Card: {
      type: 'Card',
      name: 'Card',
      category: 'layout',
      icon: 'credit-card',
      description: '卡片组件',
      defaultProps: {
        title: '卡片标题',
        content: '卡片内容',
      },
    },
  },

  // Ant Design Vue 组件映射
  ANTD: {
    Button: {
      type: 'Button',
      name: 'Button',
      category: 'basic',
      icon: 'mouse-pointer',
      description: '按钮组件',
      defaultProps: {
        type: 'primary',
        size: 'middle',
        text: '按钮',
        disabled: false,
      },
    },
    Input: {
      type: 'Input',
      name: 'Input',
      category: 'form',
      icon: 'type',
      description: '输入框组件',
      defaultProps: {
        placeholder: '请输入内容',
        disabled: false,
      },
    },
    Text: {
      type: 'Text',
      name: 'Text',
      category: 'basic',
      icon: 'text-fields',
      description: '文本组件',
      defaultProps: {
        tag: 'p',
        text: '这是一段文本',
      },
    },
    Card: {
      type: 'Card',
      name: 'Card',
      category: 'layout',
      icon: 'credit-card',
      description: '卡片组件',
      defaultProps: {
        title: '卡片标题',
        content: '卡片内容',
      },
    },
  },

  // 组件库适配器
  ADAPTERS: {
    shadcn: {
      name: 'shadcn-vue',
      enabled: true,
      version: 'latest',
      adapter: 'shadcn-adapter',
    },
    element: {
      name: 'Element Plus',
      enabled: false,
      version: 'latest',
      adapter: 'element-adapter',
    },
    antd: {
      name: 'Ant Design Vue',
      enabled: false,
      version: 'latest',
      adapter: 'antd-adapter',
    },
  },

  // 默认属性
  DEFAULT_PROPS: {
    button: {
      text: '按钮',
      variant: 'default',
      size: 'default',
      disabled: false,
    },
    input: {
      placeholder: '请输入',
      disabled: false,
      readonly: false,
    },
    card: {
      title: '卡片标题',
      padding: 'md',
    },
  },

  // 样式继承
  STYLE_INHERITANCE: {
    enabled: true,
    inheritProps: ['color', 'size', 'variant', 'disabled'],
    overrideProps: [],
  },

  // 事件映射
  EVENT_MAPPING: {
    click: 'onClick',
    change: 'onChange',
    input: 'onInput',
    focus: 'onFocus',
    blur: 'onBlur',
  },
};

// 组件库工具函数
export const componentUtils = {
  // 获取组件库
  getLibraryComponents: (library: string): Record<string, any> => {
    const config = COMPONENT_CONFIG;
    const key = `${library.toUpperCase()}_COMPONENTS` as keyof typeof config;
    return config[key] as Record<string, any> || {};
  },

  // 获取组件分类
  getCategory: (categoryId: string): any => {
    return Object.values(COMPONENT_CONFIG.CATEGORIES).find(cat => cat.id === categoryId);
  },

  // 按分类分组组件
  groupByCategory: (components: any[]): Record<string, any[]> => {
    return components.reduce((acc, comp) => {
      const category = comp.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(comp);
      return acc;
    }, {});
  },

  // 验证组件兼容性
  validateCompatibility: (component: any, targetLibrary: string): boolean => {
    // 基础验证逻辑
    if (!component || !targetLibrary) return false;

    // 检查是否已适配
    const adapter = COMPONENT_CONFIG.ADAPTERS[targetLibrary as keyof typeof COMPONENT_CONFIG.ADAPTERS];
    return adapter?.enabled === true;
  },

  // 生成组件唯一ID
  generateComponentId: (): string => {
    return `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },
};
