interface Module {
  name: string
  tag: string
  icon: string
  src: string
  search?: boolean
}

interface Modules {
  [key: string]: Module
}

export default {
  Modules: {
    componentsPanel: {
      name: '组件',
      tag: 'ComponentsLibrary',
      icon: 'Guide',
      src: '',
      search: true
    },
    datasourcePanel: {
      name: '数据源',
      tag: 'datasource',
      icon: 'Coin',
      src: '',
      search: false
    },
    helpPanel: {
      name: '帮助',
      tag: 'help',
      icon: 'ChatLineRound',
      src: '',
      search: true
    },
    templatePanel: {
      name: '模板',
      tag: 'template',
      icon: 'document-copy',
      src: ''
    }
  } as Modules,
  DefaultModule: 'componentsPanel'
}