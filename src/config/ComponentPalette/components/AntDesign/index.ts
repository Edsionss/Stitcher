// 定义组件项接口
interface ComponentItem {
  label: string;
  tag: string;
}

// 定义组件组接口
interface ComponentGroup {
  groupLabel?: string;
  groupName?: string;
  label?: string;
  name?: string;
  groupComponents: ComponentItem[];
}

// 定义组件库接口
interface ComponentLibrary {
  componentsType?: string;
  componentsName?: string;
  componentsIcon?: string;
  name?: string;
  label?: string;
  icon?: string;
  group: ComponentGroup[];
}

// 定义框架配置接口
interface FrameworkConfig {
  GroupType: string;
  GroupName: string;
  Icon: string;
  ComponentLibrary: ComponentLibrary[];
}

const AntDesignConfig: FrameworkConfig = {
  GroupType: 'BASE',
  GroupName: 'WotDesign',
  Icon: 'el-icon-mobile-phone',
  ComponentLibrary: [
    {
      componentsType: 'base',
      componentsName: '基础组件',
      componentsIcon: 'el-icon-menu',
      group: [
        {
          groupLabel: '表单',
          groupName: 'form',
          groupComponents: [
            {
              label: '输入框',
              tag: 'input'
            },
            {
              label: '数字输入框',
              tag: 'inputNumber'
            },
            {
              label: '选择器',
              tag: 'picker'
            },
            {
              label: '多功能选择器',
              tag: 'selectPicker'
            },
            {
              label: '日期时间选择器',
              tag: 'datetimePicker'
            },
            {
              label: '单选框',
              tag: 'radio'
            },
            {
              label: '复选框',
              tag: 'checkbox'
            },
            {
              label: '开关',
              tag: 'switch'
            },
            {
              label: '滑块',
              tag: 'slider'
            },
            {
              label: '评分',
              tag: 'rate'
            },
            {
              label: '上传',
              tag: 'uploader'
            }
          ]
        },
        {
          label: '布局',
          name: 'layout',
          groupComponents: [
            {
              label: '单元格',
              tag: 'cell'
            },
            {
              label: '单元格组',
              tag: 'cellGroup'
            },
            {
              label: '分割线',
              tag: 'divider'
            }
          ]
        },
        {
          label: '反馈',
          name: 'feedback',
          groupComponents: [
            {
              label: '弹出层',
              tag: 'popup'
            },
            {
              label: '对话框',
              tag: 'dialog'
            },
            {
              label: '轻提示',
              tag: 'toast'
            },
            {
              label: '加载',
              tag: 'loading'
            }
          ]
        },
        {
          label: '展示',
          name: 'display',
          groupComponents: [
            {
              label: '按钮',
              tag: 'button'
            },
            {
              label: '标签',
              tag: 'tag'
            },
            {
              label: '进度条',
              tag: 'progress'
            },
            {
              label: '图片',
              tag: 'img'
            }
          ]
        }
      ]
    },
    {
      name: 'special',
      label: '特色组件',
      icon: 'el-icon-menu',
      group: []
    },
    {
      name: 'custom',
      label: '自定组件',
      icon: 'el-icon-menu',
      group: []
    }
  ]
}

export default AntDesignConfig