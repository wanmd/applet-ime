// component/cell/index.js
Component({
  options : {
    multipleSlots : true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    isLink : {
      type : Boolean,
      value : false
    },

    border: {
      type: Boolean,
      value: true
    },

    url : {
      type : String,
      value : ''
    },

    title : {
      type : String,
      optionalTypes : [Number],
      value : ''
    },

    content : {
      type : String,
      optionalTypes: [Number],
      value : ''
    },

    arrow : {
      type : Boolean,
      value : true
    },

    clear: {
      type: Boolean,
      value: false
    },

    height : {
      type : String,
      value : '80rpx'
    }
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
    clear () {
      this.triggerEvent('clear')
    }
  }
})
