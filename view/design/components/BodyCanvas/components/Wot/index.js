import main from '@config/main.js'
const { createAsyncComponent, utils, Wot } = main

const WotCanvas = {
  name: 'WotCanvas',
  components: {},
  props: {
    config: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  created() {
    this.handelComponentValue()
  },
  mounted() {},
  computed: {
    bindValue() {
      const groupName = this.config.groupName
      if (groupName === 'form' || groupName === 'active') return this.formData[this.valueName]
      return undefined
    },
    onEvents() {
      // 使用深拷贝是个好习惯，避免修改原始传入的 config
      const onEvents = _.cloneDeep(this.config.onEvents || {})
      for (const key in onEvents) {
        const event = onEvents[key]
        onEvents[key] = () => {
          this.handlerOnEvents(event)
        }
      }
      return onEvents
    },
    utils() {
      return utils
    },
    valueName() {
      return this.config.valueName || this.props.valueName || this.config.id
    },
    props() {
      return this.config.props || {}
    },
    defaultValue() {
      return this.config.defaultValue || this.props.defaultValue
    }
  },
  watch: {
    config: {
      handler(newValue, oldValue) {
        this.handelComponentValue()
      },
      deep: true
    }
  },

  methods: {
    dateFormatter(val) {},
    //添加表单的v-model值
    handelComponentValue() {
      const groupName = this.config.groupName
      if (groupName === 'form' || groupName === 'active') {
        this.$set(this.formData, this.valueName, this.defaultValue)
      }
    },
    //手动更新表单值
    componentEmittedInput(inputValueOrFile, component) {
      let newValue = _.cloneDeep(inputValueOrFile)
      this.$set(this.formData, this.valueName, newValue)
      const requestVal =
        this.config.tag === 'wd-calendar'
          ? this.formatDate(_.cloneDeep(newValue), { rangeSeparator: this.props.DateRange, type: this.props.type })
          : newValue
      this.$bus.$emit('formChange', { name: this.valueName, requestVal, value: newValue })
    },
    //子组件事件操作父组件
    handlerOnEvents(event) {
      if (typeof event === 'function') {
        //默认操作父组件
        this.$bus.$emit('OnEvents', { parentEvent: event, config: this.config })
        return
      }
      const { child: childEvent, parent: parentEvent } = event
      if (typeof childEvent === 'function') {
        try {
          childEvent && childEvent.call(this, this.config) //触发子组件事件
        } catch (error) {
          console.error('操作子组件出错:', error)
        }
      }
      parentEvent && this.$bus.$emit('OnEvents', { parentEvent, config: this.config }) //触发父组件事件
    },
    defaultClick(item) {
      this.$bus.$emit('componentsClick', item)
    },
    /**
     * 高级智能日期格式化函数 (自动判断类型、格式可选、分隔符可配置)
     *
     * @param {Date|Array<Date>|null|undefined} value - 需要格式化的值。
     * @param {object} [options={}] - 配置选项。
     * @param {'YYYY-MM-DD' | 'YYYY-MM'} [options.format='YYYY-MM-DD'] - 输出的日期格式。
     * @param {string} [options.rangeSeparator=' ~ '] - 当判断为日期范围时，使用的连接符。
     *
     * @returns {string|Array<string>} - 格式化后的结果。
     *   - 单个日期或范围返回字符串。
     *   - 多个日期返回字符串数组。
     *   - 无效输入根据情况返回空字符串或空数组。
     */
    formatDate(value, options = {}) {
      // --- 1. 合并默认配置和用户传入的配置 ---
      const config = {
        format: 'YYYY-MM-DD', // 默认格式为年月日
        rangeSeparator: '-', // 默认范围分隔符
        ...options
      }
      const { type } = options
      if (type.includes('month')) {
        config.format = 'YYYY-MM'
      } else if (type.includes('date')) {
        config.format = 'YYYY-MM-DD'
      }
      /**
       * --- 2. 内部核心格式化工具 ---
       * 根据配置，将单个 Date 对象格式化成指定字符串
       */
      const formatSingle = date => {
        if (!(date instanceof Date) || isNaN(date)) return ''

        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')

        // 根据配置决定输出格式
        if (config.format === 'YYYY-MM') {
          return `${year}-${month}`
        }

        // 默认或指定为 YYYY-MM-DD
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      // --- 3. 智能判断和处理逻辑 ---

      // 处理无效输入
      if (!value) {
        // 如果期望的可能是多选结果，返回空数组，否则返回空字符串
        return Array.isArray(value) ? [] : ''
      }

      // A. 处理单个 Date 对象
      if (value instanceof Date) {
        return formatSingle(value)
      }

      // B. 处理数组
      if (Array.isArray(value)) {
        const validDates = value.filter(d => d instanceof Date && !isNaN(d))

        switch (validDates.length) {
          case 0:
            return [] // 空数组返回空数组
          case 1:
            // 数组中只有一个有效日期，按单个处理
            return formatSingle(validDates[0])
          case 2:
            // 数组中有两个有效日期，默认按“范围”处理
            const [start, end] = validDates.map(formatSingle)
            // 使用配置的分隔符
            return `${start} ${config.rangeSeparator} ${end}`
          default:
            // 两个以上，按“多选”处理，返回字符串数组
            return validDates.map(formatSingle)
        }
      }

      // 其他所有无效情况
      return ''
    }
  }
}
// 使用 import.meta.url 可以帮助我们构建一个相对于当前 JS 文件的路径
// 这比硬编码 '..' 更健壮
const templateUrl = new URL('index.html', import.meta.url).href
const cssUrl = new URL('index.css', import.meta.url).href
// 4. 关键：调用加载器，将自己包装成异步组件，然后导出
export default createAsyncComponent(WotCanvas, templateUrl, cssUrl)
