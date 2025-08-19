import utils from '@utils/index.js'
class Transition {
  constructor(pageInfo) {
    const { modules, ...pageData } = pageInfo
    this.pageInfo = pageInfo
    this.eventTypeDict = { 0: 'jump', 1: 'link', 2: 'clean' }
    this.componentMappers = {
      fnsrsbh: data => this.componentMappers.input(data),
      fnsrmc: data => this.componentMappers.input(data),
      frkrq: data => {
        const oldProps = data.props
        let result = this.componentMappers.date(data)
        result.props.type = 'monthrange'
        result.props['min-date'] = new Date('2017-01')
        result.props.paramsValue = this._getDateDefaultValue(oldProps).paramsValue
        result.props.defaultValue = this._getDateDefaultValue(oldProps).defaultValue
        return result
      },
      input: data => this._createBaseComponent(data, { tag: 'wd-input', valueName: 'inputValue' }),
      number: data =>
        this._createBaseComponent(data, {
          tag: 'wd-input',
          valueName: 'inputValue',
          extraProps: { type: 'number' }
        }),
      date: data => {
        const oldProps = data.props
        let result = this._createBaseComponent(data, { tag: 'wd-calendar', valueName: 'dateValue' })
        const dateValue = this._getDateDefaultValue(oldProps).endValue
        result.props.paramsValue = dateValue
        result.props.defaultValue = new Date(dateValue)
        result.props.DateRange = oldProps.range || '-'
        return result
      },
      select: data => {
        const { props, events, id } = data
        let { title, name, required, placeholder, defaultValue, params, radio } = props
        required = required == 'true' ? true : false
        const newProps = {
          label: title,
          valueName: name,
          required,
          placeholder,
          defaultValue,
          type: radio ? 'radio' : 'checkbox',
          columns: [
            { value: '101', label: '男装' },
            { value: '102', label: '奢侈品' },
            { value: '103', label: '女装' }
          ],
          params
        }
        const tag = 'wd-select-picker'
        return { id: id, tag, component: tag, valueName: name, props: newProps, events: events }
      },
      button: data => {
        const { props, events, id } = data
        const { title, name, params } = props
        const newProps = { label: title, valueName: name, params },
          tag = 'wd-button'
        let click = function (item) {}
        if (title === '查询') {
          newProps.parentStyle = { textAlign: 'right', padding: '15px 15px  10px 0px' }
          click = function (item) {
            this.recursionUpdateForm(this.componentsList, 'popupVisible', false) //关闭弹窗
            this.queryDataView()
          }
        }
        return {
          id: id,
          tag,
          props: newProps,
          events: events,
          component: tag,
          slot: `<span>${title}</span>`,
          click // 这里可以直接绑定事件处理函数
        }
      },
      table: data => {
        const { props, id, events } = data
        const { ...tableConfig } = props
        let newProps = {
          ...tableConfig,
          other: true,
          tag: 'table',
          loading: true,
          pageProps: { total: 1000, current: 1, pageSize: 10, pageSizeOptions: [10, 20, 30, 40, 50] }
        }
        return {
          id: id,
          tag: 'lay-table',
          component: 'lay-table',
          props: newProps,
          events: this._transitionEvents(events)
        }
      },
      echartsPie: data => {
        const { props } = data
        const otherOption = {
          series: [
            {
              ...props.series[0],
              radius: '50%',
              label: {
                show: true,
                position: 'outside', // 标签显示在外部
                // 格式化标签内容：显示名称、数值和百分比
                // \n 表示换行
                formatter: '{b}\n{c} \n({d}%)'
              },
              itemStyle: {
                color: function (params) {
                  // 自定义颜色数组
                  return blueGradientPalette[params.dataIndex % blueGradientPalette.length]
                }
              }
            }
          ]
        }
        return this._createBaseEcharts(data, otherOption)
      },
      echartsBarLine: data => {
        const { props } = data,
          otherOption = {
            grid: {
              left: '15%',
              right: '5%',
              bottom: '8%',
              top: '15%'
            },
            xAxis: props.xAxis,
            yAxis: props.yAxis,
            series: props.series.map(item => {
              return {
                ...item,
                tooltip: {
                  valueFormatter: function (value) {
                    return value + item.unit
                  }
                },
                label: {
                  show: true, // 显示标签
                  position: 'top', // 标签位置为柱状图顶部
                  formatter: '{c}' // 显示原始数据值
                },
                itemStyle: {
                  color: function (params) {
                    // 自定义颜色数组
                    return ['#4AA3F9', '#4EA6FF', '#4EB4FF', '#4ECAFF', '#4ED7FF'][params.dataIndex]
                  }
                }
              }
            })
          }
        return this._createBaseEcharts(data, otherOption)
      }
    }
    this.allComponents = this._flattenComponents(modules || []) //获取所有组件的平铺
    this.readyAllComponents = this._getReadyAllComponents(this.allComponents) //设置被连接的组件
    this.bindParamsDict = this._getBindParams(this.readyAllComponents)
    this.componentsConfig = this._generateComponentsConfig(this.componentMappers, this.readyAllComponents)
    this.defaultBindParams = this._getFormDefaultValue(
      this.componentsConfig.form[0].children || [],
      this.bindParamsDict
    )
    this.StitcherData = {
      ...pageData,
      componentsConfig: this.componentsConfig,
      bindParamsDict: this.bindParamsDict,
      defaultBindParams: this.defaultBindParams,
      BeforeCreate: function () {},
      Create: function () {
        const newDiv = document.createElement('div')
        newDiv.className = 'app-head'
        newDiv.setAttribute('data-title', this.StitcherData.name)
        // 确保 previewContainer 已经被挂载
        if (this.$refs.previewHeader) {
          this.$refs.previewHeader.appendChild(newDiv)
          headerComponent.renderNavBar()
          // querySelector 直接返回元素，如果没有找到则返回 null
          const searchBtn = document.querySelector('.head-search')
          // 直接判断 searchBtn 是否存在即可
          if (searchBtn) {
            searchBtn.addEventListener('click', () => {
              this.recursionUpdateForm(this.componentsList, 'popupVisible', true)
            })
          }
        }
      },
      Mounted: function () {},
      NextTick: function () {}
    }
    console.log('最终生成的组件配置:', this.StitcherData)
  }
  _filterParentComponent(pid) {
    return this.readyAllComponents.filter(item => item.id == pid)[0]
  }
  static async create(pageId, layui) {
    try {
      await utils.loadResources([
        '/BPAPP/admin/style/main.css',
        '/BPAPP/admin/common/main.js',
        '/BPAPP/admin/common/baseConst.js',
        '/BPAPP/admin/common/loading.js',
        '/BPAPP/admin/common/uni.webview.1.5.4.js',
        '/BPAPP/admin/common/ajaxBase.js',
        '/BPAPP/admin/common/until.js',
        '/BPAPP/admin/common/router.js',
        '/BPAPP/admin/common/bpbasedata.js',
        '/BPAPP/admin/common/component.js'
      ])
      const pageInfo = await new Promise((resolve, reject) => {
        layui.$.ajax({
          type: 'GET',
          url: '/api/dsjfx/report/' + pageId,
          dataType: 'json',
          loading: false,
          success: function (res) {
            if (res && res.code === 0) {
              resolve(res.data)
            } else {
              reject(new Error(res.msg || `获取页面数据失败，code: ${res.code}`))
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            reject(new Error(`网络请求失败: ${textStatus} - ${errorThrown}`))
          }
        })
      })
      const instance = new Transition(pageInfo)
      return instance
    } catch (error) {
      console.error('[Transition.create] 初始化过程中发生错误:', error)
      return null
    }
  }
  _createBaseComponent(data, { tag, valueName, extraProps = {} }) {
    const { props, events, id } = data
    const { title, name, required, placeholder, defaultValue, params } = props
    const newProps = {
      label: title,
      valueName: name,
      required: required === 'true' ? true : false,
      placeholder,
      defaultValue,
      params,
      ...extraProps
    }
    return { id: id, tag, component: tag, valueName: name, props: newProps, events }
  }
  _createBaseEcharts(data, otherOptions = {}) {
    const { props, id, type, events } = data,
      parentCardConfig = this._filterParentComponent(data.parentId),
      parentCardProps = parentCardConfig?.props || {},
      subLeft = props.text?.length * 18 + 9 || 7,
      title = { mainTitle: props.text || parentCardProps.title || '', subTitle: props.subtext || '' },
      baseOption = {
        title: [
          {
            // 2. 第一个对象：主标题，靠左定位
            text: title.mainTitle,
            left:
              //  props.titleAlign ||
              7, // 距离左侧2%
            top: 7,
            textStyle: {
              color: '#333',
              fontSize: 15,
              fontWeight: '600'
            }
          },
          {
            // 3. 第二个对象：作为副标题，靠右定位
            text: title.subTitle,
            left: subLeft, // 距离右侧2%
            top: 9, // 保持和主标题相同的 top 值，确保在同一行
            textStyle: {
              color: '#999',
              fontSize: 14,
              fontWeight: 'normal'
            }
          }
        ],

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            var result = ''
            params.forEach(function (item) {
              if (item.seriesName && item.value !== undefined) {
                result += `${item.seriesName}: ${item.value}<br/>`
              }
            })
            return result
          }
        },
        legend: {
          orient: 'horizontal',
          type: 'scroll',
          left: 7,
          right: 7,
          top: '30',
          show: props.legend,
          selectedMode: 'multiple' // 多选模式
        }
      },
      option = {
        ...baseOption,
        ...otherOptions
      }
    // const newEvents = []
    // events.forEach(event => {
    //   const {
    //       moduleId,
    //       fmbdx,
    //       type,
    //       trigger,
    //       triggerType,
    //       triggerObject,
    //       componentName,
    //       furl,
    //       furlName,
    //       eventType,
    //       paramList
    //     } = event,
    //     triggerParams = {}
    //   paramList.forEach(param => {
    //     const { targetName, targetId, sourceName } = param,
    //       from = sourceName.includes('-') ? sourceName.split('-')[1] : 'self',
    //       name = from === 'self' ? sourceName : sourceName.split('-')[0]
    //     triggerParams[targetName] = {
    //       bindId: targetId,
    //       source: {
    //         from,
    //         name
    //       }
    //     }
    //   })
    //   newEvents.push({
    //     trigger,
    //     triggerTargetId: fmbdx,
    //     triggerParams,
    //     eventType
    //     // eventType: this.eventTypeDict[type]
    //   })
    // })
    let newProps = {
      ...props,
      option,
      other: true,
      tag: 'lay-echarts',
      component: 'lay-echarts',
      chantType: type,
      loading: true,
      title: title.mainTitle
    }

    return {
      id: id,
      tag: 'lay-echarts',
      component: 'lay-echarts',
      props: newProps,
      events: this._transitionEvents(events)
    }
  }
  _flattenComponents(array) {
    let result = []
    const recursionFun = arr => {
      arr.forEach(item => {
        const { children, ...node } = item,
          { props } = node,
          newProps = { ...props, init: props.init === 'true' ? true : false },
          newNode = { ...node, props: newProps }
        result.push(newNode)
        if (children && children.length) {
          recursionFun(children)
        }
      })
    }
    recursionFun(array)
    return result
  }
  _transitionEvents(events) {
    const newEvents = []
    events.forEach(event => {
      const {
          moduleId,
          fmbdx,
          type,
          trigger,
          triggerType,
          triggerObject,
          componentName,
          furl,
          furlName,
          eventType,
          paramList
        } = event,
        triggerParams = {}
      paramList.forEach(param => {
        const { targetName, targetId, sourceName } = param,
          from = sourceName.includes('-') ? sourceName.split('-')[1] : 'self',
          name = from === 'self' ? sourceName : sourceName.split('-')[0]
        triggerParams[targetName] = {
          bindId: targetId,
          source: {
            from,
            name
          }
        }
      })
      newEvents.push({
        trigger,
        triggerTargetId: fmbdx,
        triggerParams,
        eventType
        // eventType: this.eventTypeDict[type]
      })
    })
    return newEvents
  }
  _getDateDefaultValue(oldProps) {
    const now = new Date(),
      nowYear = now.getFullYear(),
      nowMonth = now.getMonth() + 1,
      nowDay = now.getDate(),
      oldDefaultValue = oldProps.defaultValue,
      range = oldProps.range || '-'
    let startValue = '',
      endValue = ''
    if (oldDefaultValue == '${date-ssrq}') {
      //TODO 默认值是入库日期
      const defaultValue = this._getDefaultValueDict().defaultJson['最新税收日期'] || '',
        valYear = defaultValue.split('-')[0]
      // valMonth = defaultValue.split('-')[1]
      startValue = `${valYear}-01`
      endValue = defaultValue
    } else if (oldDefaultValue == '${date-lastMonth}') {
      //TODO 默认值是上个月
      startValue = `${nowYear}-${nowMonth - 1}-01`
      endValue = `${nowYear}-${nowMonth}-01`
    } else if (oldDefaultValue == '${date-now}') {
      //TODO 默认值是这个月
      startValue = `${nowYear}-${nowMonth}-01`
      endValue = `${nowYear}-${nowMonth}-${nowDay}`
    }
    return {
      defaultValue: [new Date(startValue), new Date(endValue)],
      startValue,
      endValue,
      paramsValue: `${startValue} ${range} ${endValue}`
    }
  }
  _getDefaultValueDict() {
    const dictData = JSON.parse(localStorage.getItem('search')) || {}
    const defaultArray = dictData.zhzs_default_value
    const defaultJson = {}
    defaultArray.map(item => {
      defaultJson[item.name] = item.value
    })
    return {
      dictData,
      defaultArray,
      defaultJson
    }
  }
  _generateComponentsConfig(dict, componentsList) {
    let result = { form: [], table: [], echarts: [] }
    componentsList.forEach(item => {
      const { type: componentType } = item
      if (dict[componentType]) {
        let newComponentConfig = dict[componentType](item)
        newComponentConfig._DEFAULT_CONFIG_PROPS = item
        newComponentConfig.isBeLink = item.isBeLink
        const dataViewCard = ({ title = '', style = {}, border = true }) => {
          return {
            tag: 'wd-cell-group',
            component: 'wd-cell-group',
            framework: 'wot',
            groupName: 'layout',
            children: [],
            props: {
              // title: title || '卡片',
              border: border,
              style: { margin: '15px 8px 5px 8px', ...style }
            }
          }
        }
        const dataViewConfig = {
          framework: 'layui',
          groupName: 'dataView',
          groupLabel: '数据展示'
        }
        if (componentType === 'table') {
          if (!result.table[0]) {
            result.table[0] = dataViewCard({ title: '数据视图' })
          }
          result.table[0].children.push({
            ...newComponentConfig,
            ...dataViewConfig
          })
        } else if (componentType.includes('echarts')) {
          if (!result.echarts[0]) {
            result.echarts[0] = dataViewCard({ title: '图表数据' })
          }
          result.echarts[0].children.push({
            ...newComponentConfig,
            ...dataViewConfig
          })
        } else {
          if (!result.form[0]) {
            result.form[0] = dataViewCard({})
          }
          result.form[0].children.push({ ...newComponentConfig, framework: 'wot', groupName: 'form' })
        }
      } else {
        console.error(`[Wot Transition] 组件类型 "${item.type}" 的转换器暂未定义。`)
      }
    })
    const searchElement = {
      component: 'wd-popup',
      valueName: 'popupVisible',
      defaultValue: false,
      children: [],
      props: {
        visible: false,
        position: 'bottom',
        round: true,
        label: '弹出层',
        tag: 'popup',
        style: { height: '50%', padding: '10px 5px' }
      },
      onEvents: {
        'click-modal'() {
          this.recursionUpdateForm(this.componentsList, 'popupVisible', false)
        }
      },
      slot: '',
      _DEFAULT_CONFIG_PROPS: { label: '弹出层', tag: 'popup' },
      id: 'KZNPH904',
      framework: 'wot',
      groupName: 'active',
      groupLabel: '反馈'
    }
    if (result.form[0]) {
      searchElement.children = result.form[0].children
    }
    const finalConfig = [
      searchElement,
      // result.form[0],
      result.echarts[0],
      result.table[0]
    ].filter(Boolean)
    result.componentsConfig = finalConfig
    // this._getDataViewInit(result)
    return result
  }
  _getBindParams(allComponents) {
    let result = {}
    allComponents.forEach(config => {
      const props = config.props
      props.params && (result[props.name] = props.params)
    })
    return result
  }
  _getDataViewInit(componentsConfig) {
    const { table, echarts, form, componentsConfig: componentsList } = componentsConfig,
      defaultParams = this._getFormDefaultValue(form[0].children || [])
    let tableList = table[0].children || []
    console.log('defaultParams', defaultParams)
    tableList = tableList.map(item => {
      const { props } = item
      if (props.init) {
        const { dataSource, page: isPage, pageProps } = props,
          { total = 1000, current: page, pageSize: limit } = pageProps || {},
          baseParams = { id: dataSource, limit, page }
        layui.$.ajax({
          url: '/api/dsjfx/data-source/preview',
          type: 'post',
          dataType: 'json',
          async: false,
          contentType: 'application/json',
          data: JSON.stringify({
            ...baseParams,
            page: 1,
            param: defaultParams
          }),
          success: function (res) {
            props.data = res.data || []
            pageProps.total = res.count
            return item
          }
        })
      }
    })
  }
  _getFormDefaultValue(componentsConfig, bindParamsDict = this.bindParamsDict) {
    let defaultParams = {}
    componentsConfig.forEach(item => {
      const props = item.props || {}
      const { defaultValue, paramsValue, valueName } = props
      if (bindParamsDict[valueName]) {
        const paramsIds = bindParamsDict[valueName].split(',')
        paramsIds.forEach(id => {
          defaultParams[id] = paramsValue || defaultValue
        })
      }
    })
    return defaultParams
  }
  _getReadyAllComponents(allComponentsList) {
    // 1. 深度克隆，确保不修改原始数据
    const resultComponentsList = _.cloneDeep(allComponentsList)

    // 2. 创建一个从 id 到组件的映射，用于快速查找
    // 这个操作的时间复杂度是 O(N)
    const componentMap = new Map()
    resultComponentsList.forEach(component => {
      componentMap.set(component.id, component)
    })

    // 3. 遍历所有组件和事件，直接通过 Map 修改目标组件
    // 这个操作的时间复杂度是 O(N * E)
    allComponentsList.forEach(component => {
      const events = component.events
      if (events && events.length) {
        events.forEach((event, index) => {
          const eventTargetId = event.fmbdx,
            selfId = event.moduleId,
            // 4. 使用 Map 进行 O(1) 复杂度的快速查找
            targetComponent = componentMap.get(eventTargetId),
            selfComponent = componentMap.get(selfId)
          selfComponent && (selfComponent.events[index].eventType = this.eventTypeDict[event.type])
          // 5. 如果找到了目标组件，就修改它
          if (targetComponent) {
            targetComponent.isBeLink = true
          }
        })
      }
    })

    // 6. 返回修改后的列表
    return resultComponentsList
  }
}

/**
 * 最终导出的函数，封装了所有异步逻辑，并通过回调函数返回结果。
 * @param {string} pageId - 页面ID
 * @param {object} layui - layui 实例
 * @param {function} onComplete - 【必需】当所有操作完成后的回调函数，它会接收到最终的数据
 */
function initializeWithCallback(pageId, layui, onComplete) {
  // 检查回调函数是否存在
  if (typeof onComplete !== 'function') {
    console.error('错误：必须提供一个 onComplete 回调函数！')
    return
  }

  // 使用 Promise.resolve() 来包装异步的 create 方法，这样可以用 .then() 链式调用
  // 这样写可以避免在顶层使用 async/await
  Promise.resolve(Transition.create(pageId, layui))
    .then(transitionInstance => {
      // 当 Transition.create 成功完成时
      if (transitionInstance) {
        // 调用传入的回调函数，并把最终的数据传给它
        onComplete(transitionInstance.StitcherData)
      } else {
        // 如果创建失败，也调用回调，但传入 null
        onComplete(null)
      }
    })
    .catch(error => {
      // 如果过程中出现任何未捕获的错误
      console.error('在 initializeWithCallback 中发生严重错误:', error)
      // 同样调用回调，传入 null 表示失败
      onComplete(null)
    })
}

// 默认导出这个新的、使用回调的函数
export default initializeWithCallback
