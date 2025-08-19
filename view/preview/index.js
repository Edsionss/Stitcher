// 创建Vue实例
import PreviewCanvas from './components/PreviewCanvas/index.js'
import Transition from './transition.js'
Vue.component('preview-canvas', PreviewCanvas)
import main from '@config/main.js'
const { createAsyncComponent, utils } = main
const previewComponents = {
  name: 'Preview',
  components: {},
  data() {
    return {
      StitcherData: {},
      componentsList: [],
      formData: {}, //页面响应式表单数据
      requestFormData: {}, //页面请求数据的表单数据（处理过的表单数据）
      activeData: {},
      pageId: '',
      bindParamsDict: {},
      requestBindParams: {},
      headerComponent: null
    }
  },
  beforeCreate() {},
  created() {
    const query = this.$route.query
    const { pageId, ...params } = query
    query?.pageId && (this.pageId = pageId)
    Transition(this.pageId, layui, data => {
      if (data) {
        // 在这里，可以安全地进行赋值和后续操作
        this.StitcherData = data // 赋值给组件数据
        this.componentsList = data.componentsConfig.componentsConfig // 获取组件列表
        this.bindParamsDict = data.bindParamsDict || {} // 获取绑定参数字典
        this.requestBindParams = data.defaultBindParams || {} // 获取默认绑定参数
        this.initFormData() // 初始化表单数据
        Object.assign(this.requestFormData, params)
        Object.assign(this.formData, params)
        if (this.StitcherData.Create) {
          this.StitcherData.Create.bind(this)()
          this.headerComponent = _.cloneDeep(headerComponent)
          headerComponent.back = pageName => {
            this.routerBack(pageName)
          }
        }
      } else {
        // 处理初始化失败的情况
        console.error('页面初始化失败，未能获取到数据。')
      }
    })
  },
  mounted() {
    // 监听表单数据变化并更新组件数据
    this.$bus.$on('formChange', data => {
      const { name, value, requestVal } = data
      this.recursionUpdateForm(this.componentsList, name, value)
      this.$set(this.requestFormData, name, requestVal || value)
      this.requestBindParams = this.getDataSourceParams()
      console.log('参数改变', this.requestFormData)
    })
    // 监听组件点击事件
    this.$bus.$on('componentsClick', item => {
      item.click && item.click.bind(this)(item)
    })
    // 监听表格分页变化事件
    this.$bus.$on('tablePageChange', data => {
      this.requestTableData(data)
    })
    // 监听图表的数据请求
    this.$bus.$on('echartsGetData', data => {
      this.requestEchartsData(data)
    })
    // //监听图表的点击事件
    // this.$bus.$on('echartsEvent', data => {
    //   this.echartsEvent(data)
    // })
    // 调用 StitcherData 的 Mounted 方法，如果存在的话
    this.StitcherData.Mounted && this.StitcherData.Mounted.bind(this)()
    this.$nextTick(() => {
      // 调用 StitcherData 的 NextTick 方法，如果存在的话
      this.StitcherData.NextTick && this.StitcherData.NextTick.bind(this)()
    })
    //监听子组件的v-on
    this.$bus.$on('OnEvents', data => {
      const { config, parentEvent } = data
      typeof parentEvent === 'function' && parentEvent.call(this, config)
    })
    //监听页面的联动事件
    this.$bus.$on('onPageEvent', data => {
      const { config } = data,
        tag = config.tag
      const { targetComponent, ...eventParams } = this.getEventParams(data)
      this.pageEvents({ eventParams: eventParams.resultParams, data: { ...data, targetComponent } })
    })
  },
  beforeDestroy() {
    // 在组件销毁前，移除所有事件监听器
    this.$bus.$off('formChange')
    this.$bus.$off('componentsClick')
    this.$bus.$off('tablePageChange')
    this.$bus.$off('echartsGetData')
    this.$bus.$off('OnEvents')
    this.$bus.$off('onPageEvent')
    headerComponent = this.headerComponent
  },
  watch: {
    requestFormData: {
      handler(newValue, oldValue) {
        this.$store.commit('setPreviewFormData', newValue)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {},
  methods: {
    routerBack(pageName) {
      const vueHistoryLength = this.$store.state.vueHistoryLength
      console.log('', pageName, vueHistoryLength)
      if (vueHistoryLength > 1) {
        this.headerComponent.back(pageName)
        // this.$router.back()
        // this.$store.commit('backVueHistoryLength')
      } else {
        this.headerComponent.back(pageName)
      }
    },
    // 递归将树形结构转换为一维数组
    recursion(array) {
      let result = []
      const recursionFun = array => {
        array.forEach(item => {
          const { children, ...node } = item
          result.push(node)
          if (children && children.length) {
            recursionFun(children)
          }
        })
      }
      recursionFun(array)
      return result
    },
    // 递归更新表单数据
    recursionUpdateForm(array, valueName, newVal) {
      for (const item of array) {
        const itemValueName = item.valueName || item.id
        if (itemValueName == valueName) {
          this.$set(item, 'defaultValue', newVal)
          this.$set(item.props, 'defaultValue', newVal)
          this.$set(this.formData, valueName, newVal)
          return true // 找到了，返回 true 并终止所有层级的循环
        }
        if (item.children && item.children.length > 0) {
          // 递归调用，如果子调用返回了 true，说明找到了，也立刻终止当前循环
          if (this.recursionUpdateForm(item.children, valueName, newVal)) {
            return true
          }
        }
      }
      return false // 在当前层级没找到
    },
    //初始化表单数据
    initFormData() {
      const tiledArray = this.recursion(this.componentsList)
      tiledArray.forEach(item => {
        const valueName = item.valueName || item.id,
          groupName = item.groupName
        if (!this.formData.hasOwnProperty(valueName)) {
          if (groupName === 'form' || groupName === 'active') {
            const Val = item.defaultValue || item.props.paramsValue || item.props.defaultValue
            this.$set(this.formData, valueName, Val)
            this.$set(this.requestFormData, valueName, Val)
          }
        }
      })
    },
    //查询所有数据展示组件
    queryDataView(components = this.componentsList) {
      const flattenedComponents = this.recursion(components)
      flattenedComponents.forEach(config => {
        if (config.groupName === 'dataView' && !config.isBeLink) {
          const { tag, props, id: componentId } = config // 解构出组件ID
          this.updateComponentValueById(componentId, 'props', { ...props, loading: true })
          if (tag === 'lay-table') {
            this.requestTableData({ config, pageProps: props.pageProps })
          } else if (tag === 'lay-echarts') {
            // ECharts 的逻辑也应遵循此模式
            this.requestEchartsData(config)
          }
        }
      })
    },
    // 请求数据源的通用方法
    requestDataSource(where, done) {
      layui.$.ajax({
        url: '/api/dsjfx/data-source/preview',
        type: 'post',
        dataType: 'json',
        loading: false,
        contentType: 'application/json',
        data: JSON.stringify(where),
        success: res => {
          done && done.bind(this)(res)
          AppLoading.close()
        },
        error: err => {
          console.error('数据源请求失败:', err)
          AppLoading.close()
        }
      })
    },
    // 请求表格数据
    requestTableData(data) {
      const { config, pageProps } = data,
        { id: componentId, props } = config,
        { curr: page, limit, current, pageSize } = pageProps,
        where = { ...this.getRequestParams(config), limit: limit || pageSize, page: page || current }
      this.requestDataSource(where, res => {
        const oldProps = _.cloneDeep(props),
          newPageProps = { ...oldProps.pageProps, total: res.count, current: page, pageSize: limit },
          newProps = { ...oldProps, data: res.data || [], pageProps: newPageProps, loading: false }
        this.updateComponentValueById(componentId, 'props', newProps)
      })
    },
    getEventParams(data) {
      const { event, config } = data,
        paramsDict = { form: this.requestFormData }
      let resultParams = {},
        baseParams = {},
        targetComponent
      if (config.tag.includes('echarts')) {
        const { echartsParams } = data
        paramsDict.self = echartsParams.data
      } else if (config.tag.includes('table')) {
        const { params, val, pageId } = data
        paramsDict.self = params
      }
      const { triggerTargetId, triggerParams } = event,
        where = {}
      for (const key in triggerParams) {
        const item = triggerParams[key],
          itemSource = item.source,
          paramsSource = paramsDict[itemSource.from],
          paramValue = paramsSource[itemSource.name]
        where[item.bindId] = paramValue
      }
      if (event.eventType === 'link') {
        targetComponent = this.findComponentById(this.componentsList, triggerTargetId)
        baseParams = { id: targetComponent.props.dataSource }
      }
      resultParams = {
        ...baseParams,
        param: where
      }
      return { resultParams, targetComponent }
    },
    pageEvents({ eventParams, data }) {
      const { type, config, targetComponent } = data,
        tag = config.tag,
        isEcharts = tag.includes('echarts'),
        isTable = tag.includes('table')
      if (type === 'link') {
        AppLoading.show({
          text: '加载中,请稍等...'
        })
        isEcharts && this.requestEchartsData(targetComponent, eventParams)
      } else if (type === 'jump') {
        const { pageId } = data,
          { param: params } = eventParams
        let query = '?pageId=' + pageId
        for (const key in params) {
          const value = params[key]
          query += '&' + key + '=' + encodeURIComponent(value)
        }
        const url = 'MobileCode/view/main/index.html#/previewNext' + query
        console.log(url)

        isTable && menuTools.MenuItemClick(pageId, url)
      }
    },
    // 图表联动事件处理
    echartsEvent({ eventParams, data }) {
      // resultParams = this.getEventParams(data)
      const { type } = data
      if (type === 'link') {
        AppLoading.show({
          text: '加载中,请稍等...'
        })
        this.requestEchartsData(targetComponent, eventParams)
      }
    },
    //请求echarts数据
    requestEchartsData(data, where) {
      const { props, id } = data,
        { option } = props
      where = where || this.getRequestParams(data)
      this.requestDataSource(where, res => {
        const chartData = res.data || [],
          newOption = { ..._.cloneDeep(option), data: chartData },
          newProps = { ..._.cloneDeep(props), option: newOption, loading: false, init: true }
        this.updateComponentValueById(id, 'props', newProps)
      })
    },
    //拼接好请求参数
    getRequestParams(config) {
      const param = this.getDataSourceParams()
      const { props } = config // 解构出组件ID
      const { dataSource } = props,
        baseParams = { id: dataSource },
        where = {
          ...baseParams,
          param
        }
      return where
    },
    // 获取数据源参数
    getDataSourceParams(bindParamsDict = this.bindParamsDict, formData = this.requestFormData) {
      let resultParams = {}
      for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
          const item = formData[key]
          if (bindParamsDict[key]) {
            const paramsIds = bindParamsDict[key].split(',')
            paramsIds.forEach(id => {
              resultParams[id] = item
            })
          }
        }
      }
      return resultParams
    },
    // 根据组件ID查找组件
    findComponentById(componentList = this.componentList, id) {
      for (const component of componentList) {
        if (component.id === id) {
          return component // 找到了，返回对象引用
        }
        if (component.children && component.children.length) {
          const found = this.findComponentById(component.children, id)
          if (found) {
            return found // 在子节点中找到了
          }
        }
      }
      return null // 没找到
    },
    //根据组件id更新值
    updateComponentValueById(id, valueName, newValue) {
      const targetComponent = this.findComponentById(this.componentsList, id)
      if (targetComponent) {
        // 使用 this.$set 来更新数据，确保响应式！
        this.$set(targetComponent, valueName, newValue)
        // console.log('组件数据已响应式更新:', targetComponent)
      } else {
        console.error(`未能找到ID为 ${id} 的组件进行更新。`)
      }
    }
  }
}
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
export default createAsyncComponent(previewComponents, templateUrl, cssUrl)
