// component/radio/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value : {
      type: String,
      optionalTypes: [Number],
      value: ''
    },

    checked : {
      type : Boolean,
      value : false
    },
    opacity : {
      type : String,
      value : "1"
    },
    display : {
      type : String,
      value : "inline-block"
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change () {
      this.triggerEvent('change', this.properties.value)
    }
  }
})
