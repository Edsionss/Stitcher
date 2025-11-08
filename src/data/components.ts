/**
 * 组件库数据配置
 * 包含三套UI库的组件元数据
 */

import type { ComponentMeta, ComponentCategory } from '@/types/component'

/**
 * 组件分类中文映射
 */
export const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  layout: '布局',
  form: '表单',
  data: '数据',
  feedback: '反馈',
  navigation: '导航',
  basic: '基础'
}

/**
 * 组件库中文名称
 */
export const LIBRARY_LABELS = {
  'element-plus': 'Element Plus',
  'ant-design': 'Ant Design',
  'naive-ui': 'Naive UI'
}

/**
 * 基础组件定义
 */
const basicComponents: ComponentMeta[] = [
  {
    id: 'text',
    name: '文本',
    type: 'Text',
    category: 'basic',
    library: 'element-plus',
    icon: 'text_fields',
    description: '用于显示文本内容',
    tags: ['文本', '文字', 'Text'],
    isContainer: false,
    props: [
      { name: 'content', type: 'string', default: '文本内容', label: '文本内容', required: true },
      { name: 'tag', type: 'select', default: 'p', label: 'HTML标签', options: [
        { label: 'p标签', value: 'p' },
        { label: 'h1标签', value: 'h1' },
        { label: 'h2标签', value: 'h2' },
        { label: 'h3标签', value: 'h3' },
        { label: 'span标签', value: 'span' },
        { label: 'div标签', value: 'div' }
      ]},
      { name: 'fontSize', type: 'number', default: 14, label: '字体大小' },
      { name: 'fontWeight', type: 'select', default: 'normal', label: '字体粗细', options: [
        { label: '正常', value: 'normal' },
        { label: '中等', value: '500' },
        { label: '粗体', value: 'bold' }
      ]}
    ],
    events: [
      { name: 'click', label: '点击' }
    ],
    styles: [
      { category: 'typography', properties: ['fontSize', 'fontWeight', 'color', 'textAlign'] },
      { category: 'layout', properties: ['margin', 'padding'] }
    ]
  },
  {
    id: 'button',
    name: '按钮',
    type: 'Button',
    category: 'form',
    library: 'element-plus',
    icon: 'smart_button',
    description: '用于触发操作',
    tags: ['按钮', 'Button', '操作'],
    isContainer: false,
    props: [
      { name: 'text', type: 'string', default: '按钮', label: '按钮文字', required: true },
      { name: 'type', type: 'select', default: 'primary', label: '按钮类型', options: [
        { label: '主要', value: 'primary' },
        { label: '成功', value: 'success' },
        { label: '警告', value: 'warning' },
        { label: '危险', value: 'danger' },
        { label: '信息', value: 'info' },
        { label: '默认', value: 'default' }
      ]},
      { name: 'size', type: 'select', default: 'default', label: '尺寸', options: [
        { label: '大', value: 'large' },
        { label: '默认', value: 'default' },
        { label: '小', value: 'small' }
      ]},
      { name: 'disabled', type: 'boolean', default: false, label: '禁用' },
      { name: 'loading', type: 'boolean', default: false, label: '加载中' }
    ],
    events: [
      { name: 'click', label: '点击' }
    ],
    styles: [
      { category: 'typography', properties: ['fontSize', 'fontWeight', 'color'] },
      { category: 'layout', properties: ['margin', 'padding'] }
    ]
  },
  {
    id: 'image',
    name: '图片',
    type: 'Image',
    category: 'basic',
    library: 'element-plus',
    icon: 'image',
    description: '用于显示图片',
    tags: ['图片', 'Image', '媒体'],
    isContainer: false,
    props: [
      { name: 'src', type: 'string', default: '', label: '图片地址', required: true },
      { name: 'alt', type: 'string', default: '', label: '替代文本' },
      { name: 'fit', type: 'select', default: 'contain', label: '填充方式', options: [
        { label: 'contain', value: 'contain' },
        { label: 'cover', value: 'cover' },
        { label: 'fill', value: 'fill' },
        { label: 'none', value: 'none' },
        { label: 'scale-down', value: 'scale-down' }
      ]}
    ],
    events: [
      { name: 'load', label: '加载完成' },
      { name: 'error', label: '加载失败' }
    ],
    styles: [
      { category: 'layout', properties: ['width', 'height', 'margin', 'padding'] }
    ]
  }
]

/**
 * 布局组件定义
 */
const layoutComponents: ComponentMeta[] = [
  {
    id: 'container',
    name: '容器',
    type: 'Container',
    category: 'layout',
    library: 'element-plus',
    icon: 'crop_din',
    description: '基础容器组件',
    tags: ['容器', 'Container', '布局'],
    isContainer: true,
    allowChildren: ['*'],
    props: [
      { name: 'direction', type: 'select', default: 'vertical', label: '排列方向', options: [
        { label: '垂直', value: 'vertical' },
        { label: '水平', value: 'horizontal' }
      ]},
      { name: 'justify', type: 'select', default: 'start', label: '主轴对齐', options: [
        { label: '开始', value: 'start' },
        { label: '结束', value: 'end' },
        { label: '居中', value: 'center' },
        { label: '两端', value: 'space-between' },
        { label: '环绕', value: 'space-around' }
      ]},
      { name: 'align', type: 'select', default: 'start', label: '交叉轴对齐', options: [
        { label: '开始', value: 'start' },
        { label: '结束', value: 'end' },
        { label: '居中', value: 'center' },
        { label: '基线', value: 'baseline' },
        { label: '拉伸', value: 'stretch' }
      ]}
    ],
    events: [],
    styles: [
      { category: 'layout', properties: ['width', 'height', 'margin', 'padding', 'gap'] }
    ]
  },
  {
    id: 'card',
    name: '卡片',
    type: 'Card',
    category: 'layout',
    library: 'element-plus',
    icon: 'credit_card',
    description: '卡片容器组件',
    tags: ['卡片', 'Card', '容器', '面板'],
    isContainer: true,
    allowChildren: ['*'],
    props: [
      { name: 'title', type: 'string', default: '', label: '卡片标题' },
      { name: 'shadow', type: 'select', default: 'hover', label: '阴影时机', options: [
        { label: '从不', value: 'never' },
        { label: '悬停', value: 'hover' },
        { label: '总是', value: 'always' }
      ]},
      { name: 'bodyStyle', type: 'object', default: {}, label: '内容区样式' }
    ],
    events: [],
    styles: [
      { category: 'layout', properties: ['width', 'height', 'margin', 'padding'] },
      { category: 'border', properties: ['borderRadius', 'borderWidth', 'borderColor'] },
      { category: 'shadow', properties: ['boxShadow'] }
    ]
  }
]

/**
 * 表单组件定义
 */
const formComponents: ComponentMeta[] = [
  {
    id: 'input',
    name: '输入框',
    type: 'Input',
    category: 'form',
    library: 'element-plus',
    icon: 'text_fields',
    description: '文本输入框',
    tags: ['输入', 'Input', '表单', '文本'],
    isContainer: false,
    props: [
      { name: 'placeholder', type: 'string', default: '请输入', label: '占位符' },
      { name: 'type', type: 'select', default: 'text', label: '输入类型', options: [
        { label: '文本', value: 'text' },
        { label: '密码', value: 'password' },
        { label: '数字', value: 'number' },
        { label: '邮箱', value: 'email' },
        { label: '电话', value: 'tel' },
        { label: 'URL', value: 'url' }
      ]},
      { name: 'disabled', type: 'boolean', default: false, label: '禁用' },
      { name: 'readonly', type: 'boolean', default: false, label: '只读' },
      { name: 'clearable', type: 'boolean', default: true, label: '可清空' }
    ],
    events: [
      { name: 'input', label: '输入事件' },
      { name: 'change', label: '变化事件' },
      { name: 'focus', label: '获得焦点' },
      { name: 'blur', label: '失去焦点' }
    ],
    styles: [
      { category: 'typography', properties: ['fontSize', 'color'] },
      { category: 'layout', properties: ['width', 'margin', 'padding'] }
    ]
  },
  {
    id: 'select',
    name: '选择器',
    type: 'Select',
    category: 'form',
    library: 'element-plus',
    icon: 'expand_more',
    description: '下拉选择器',
    tags: ['选择', 'Select', '下拉', '表单'],
    isContainer: false,
    props: [
      { name: 'placeholder', type: 'string', default: '请选择', label: '占位符' },
      { name: 'multiple', type: 'boolean', default: false, label: '多选' },
      { name: 'disabled', type: 'boolean', default: false, label: '禁用' },
      { name: 'clearable', type: 'boolean', default: true, label: '可清空' }
    ],
    events: [
      { name: 'change', label: '变化事件' },
      { name: 'focus', label: '获得焦点' },
      { name: 'blur', label: '失去焦点' }
    ],
    styles: [
      { category: 'layout', properties: ['width', 'margin', 'padding'] }
    ]
  }
]

/**
 * 导航组件定义
 */
const navigationComponents: ComponentMeta[] = [
  {
    id: 'tabs',
    name: '标签页',
    type: 'Tabs',
    category: 'navigation',
    library: 'element-plus',
    icon: 'tab',
    description: '标签页容器',
    tags: ['标签页', 'Tabs', '导航'],
    isContainer: true,
    allowChildren: ['tab-pane'],
    defaultChildren: ['tab-pane', 'tab-pane'],
    props: [
      { name: 'type', type: 'select', default: 'text', label: '标签类型', options: [
        { label: '文字', value: 'text' },
        { label: '卡片', value: 'card' },
        { label: '边框卡片', value: 'border-card' }
      ]},
      { name: 'position', type: 'select', default: 'top', label: '位置', options: [
        { label: '上', value: 'top' },
        { label: '右', value: 'right' },
        { label: '下', value: 'bottom' },
        { label: '左', value: 'left' }
      ]}
    ],
    events: [
      { name: 'tab-click', label: '标签点击' },
      { name: 'tab-change', label: '标签切换' }
    ],
    styles: [
      { category: 'layout', properties: ['width', 'height', 'margin', 'padding'] }
    ]
  }
]

/**
 * 数据展示组件定义
 */
const dataComponents: ComponentMeta[] = [
  {
    id: 'table',
    name: '表格',
    type: 'Table',
    category: 'data',
    library: 'element-plus',
    icon: 'table_chart',
    description: '数据表格',
    tags: ['表格', 'Table', '数据'],
    isContainer: false,
    props: [
      { name: 'columns', type: 'array', default: [], label: '列配置' },
      { name: 'data', type: 'array', default: [], label: '数据源' },
      { name: 'stripe', type: 'boolean', default: false, label: '斑马纹' },
      { name: 'border', type: 'boolean', default: true, label: '边框' },
      { name: 'highlightCurrentRow', type: 'boolean', default: true, label: '高亮当前行' }
    ],
    events: [
      { name: 'select', label: '选择' },
      { name: 'select-all', label: '全选' },
      { name: 'row-click', label: '行点击' }
    ],
    styles: [
      { category: 'layout', properties: ['width', 'height', 'margin', 'padding'] }
    ]
  }
]

/**
 * 反馈组件定义
 */
const feedbackComponents: ComponentMeta[] = [
  {
    id: 'alert',
    name: '警告提示',
    type: 'Alert',
    category: 'feedback',
    library: 'element-plus',
    icon: 'report',
    description: '用于页面中展示重要的提示信息',
    tags: ['警告', 'Alert', '提示', '反馈'],
    isContainer: false,
    props: [
      { name: 'title', type: 'string', default: '提示', label: '标题' },
      { name: 'type', type: 'select', default: 'info', label: '类型', options: [
        { label: '成功', value: 'success' },
        { label: '警告', value: 'warning' },
        { label: '错误', value: 'error' },
        { label: '信息', value: 'info' }
      ]},
      { name: 'description', type: 'string', default: '', label: '描述' },
      { name: 'closable', type: 'boolean', default: true, label: '可关闭' },
      { name: 'showIcon', type: 'boolean', default: true, label: '显示图标' }
    ],
    events: [
      { name: 'close', label: '关闭' }
    ],
    styles: [
      { category: 'typography', properties: ['fontSize', 'color'] },
      { category: 'layout', properties: ['width', 'margin', 'padding'] }
    ]
  }
]

/**
 * 所有组件元数据
 */
export const ALL_COMPONENTS: ComponentMeta[] = [
  ...basicComponents,
  ...layoutComponents,
  ...formComponents,
  ...navigationComponents,
  ...dataComponents,
  ...feedbackComponents
]

/**
 * 按分类获取组件
 */
export const getComponentsByCategory = (category: string) => {
  return ALL_COMPONENTS.filter(c => c.category === category)
}

/**
 * 按库获取组件
 */
export const getComponentsByLibrary = (library: string) => {
  return ALL_COMPONENTS.filter(c => c.library === library)
}

/**
 * 搜索组件
 */
export const searchComponents = (keyword: string) => {
  const lowerKeyword = keyword.toLowerCase()
  return ALL_COMPONENTS.filter(c =>
    c.name.toLowerCase().includes(lowerKeyword) ||
    c.description?.toLowerCase().includes(lowerKeyword) ||
    c.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
  )
}

/**
 * 获取所有分类
 */
export const getAllCategories = (): ComponentCategory[] => {
  return ['basic', 'layout', 'form', 'data', 'feedback', 'navigation']
}