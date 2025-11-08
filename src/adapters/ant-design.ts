import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

export const AntDesignAdapter = {
  library: 'ant-design' as const,
  
  install(app: any) {
    app.use(Antd)
  },
  
  components: {
    Button: Antd.Button,
    Input: Antd.Input,
    Card: Antd.Card,
    Layout: Antd.Layout,
    Menu: Antd.Menu,
    Table: Antd.Table,
    Form: Antd.Form,
    FormItem: Antd.Form.Item,
    Modal: Antd.Modal,
    Message: Antd.message,
  }
}

export default AntDesignAdapter
