import * as ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

export const ElementPlusAdapter = {
  library: 'element-plus' as const,
  
  install(app: any) {
    app.use(ElementPlus)
  },
  
  components: {
    Button: ElementPlus.ElButton,
    Input: ElementPlus.ElInput,
    Card: ElementPlus.ElCard,
    Container: ElementPlus.ElContainer,
    Header: ElementPlus.ElHeader,
    Aside: ElementPlus.ElAside,
    Main: ElementPlus.ElMain,
    Footer: ElementPlus.ElFooter,
    Menu: ElementPlus.ElMenu,
    MenuItem: ElementPlus.ElMenuItem,
    SubMenu: ElementPlus.ElSubMenu,
    Table: ElementPlus.ElTable,
    TableColumn: ElementPlus.ElTableColumn,
    Form: ElementPlus.ElForm,
    FormItem: ElementPlus.ElFormItem,
    Dialog: ElementPlus.ElDialog,
    Message: ElementPlus.ElMessage,
  }
}

export default ElementPlusAdapter
