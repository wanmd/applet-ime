let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content : {
      type : String,
      value : ''
    },
	alwayShow:{
		type : Boolean,
		value:false
	},
    styleText : {
      type : String,
      value : ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showEllipsis: true,
    showExpand: false,
    text : ''
  },

  observers : {
    content (v) {
      if(v === '') return
      this.setData({text : v})
      wx.nextTick(() => {
        let windowWidth = app.systemInfo.windowWidth
        let query = this.createSelectorQuery()
        query.select('#content').boundingClientRect()
        query.exec(res => {
          let h = res[0].height * (750 / windowWidth)
          if (h > 130) {
            this.setData({ showExpand: true })
          } else {
            this.setData({ showEllipsis: false })
          }
        })
      })
      
    }
  },

  methods: {
    expandContent () {
      this.setData({ showEllipsis: !this.data.showEllipsis})
    }
  }
})
