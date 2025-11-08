import { create } from 'naive-ui'
import { 
  NButton, 
  NInput, 
  NCard, 
  NLayout, 
  NMenu, 
  NTable, 
  NForm, 
  NFormItem, 
  NDialog 
} from 'naive-ui'

export const NaiveUIAdapter = {
  library: 'naive-ui' as const,
  
  createNaive(app: any) {
    const naive = create({
      components: [
        NButton,
        NInput,
        NCard,
        NLayout,
        NMenu,
        NTable,
        NForm,
        NFormItem,
        NDialog,
      ]
    })
    app.use(naive)
  },
  
  components: {} as any
}

export default NaiveUIAdapter
