import { create, NButton, NInput, NCard, NLayout, NMenu, NTable, NForm, NFormItem, NDialog, useMessage } from 'naive-ui'

export const NaiveUIAdapter = {
  library: 'naive-ui' as const,
  
  createNaive(app: any) {
    const naive = create({
      components: [
        NButton,
        NInput,
        NCard,
        NLayout,
        NLayoutHeader,
        NLayoutSider,
        NLayoutContent,
        NLayoutFooter,
        NMenu,
        NTable,
        NForm,
        NFormItem,
        NDialog,
      ]
    })
    app.use(naive)
  },
  
  components: {
    Button: NButton,
    Input: NInput,
    Card: NCard,
    Layout: NLayout,
    Menu: NMenu,
    Table: NTable,
    Form: NForm,
    FormItem: NFormItem,
    Dialog: NDialog,
  }
}

export default NaiveUIAdapter
