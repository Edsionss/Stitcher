import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

export const AntDesignAdapter = {
  library: 'ant-design' as const,
  
  install(app: any) {
    app.use(Antd)
  },
  
  components: {} as any
}

export default AntDesignAdapter
