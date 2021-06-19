// component/btn/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openType : {
      type : String,
      value : ''
    },
    formType: {
      type: String,
      value: ''
    },
    size : {
      type : String,
      value : "block"
    },
    radius : {
      type : String,
      value : '0rpx'
    },
    round : {
      type : Boolean,
      value : false
    },
    styleText : {
      type : String,
      value : ''
    },

    disabled : {
      type : Boolean,
      value : false
    }
  },
  observers : {
    radius (v) {
      this.setData({ borderRadius : v})
    } 
  },
  lifetimes : {
    ready () {
      if (this.properties.round){
        const query = this.createSelectorQuery()
        query.select('.btn').boundingClientRect(rect => {
          this.setData({ borderRadius: rect.height / 2 + 'px' })
        }).exec()
      }
      
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    borderRadius : '0rpx'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

})
