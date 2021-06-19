// component/counter/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    quantity : {
      type : Number,
      value : 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value : 0,
    show : false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change (e) {
      let quantity = this.properties.quantity + e.currentTarget.dataset.offset
      this.triggerEvent('change', quantity)
    },

    toggle () {
      this.setData({ value: this.properties.quantity, show : !this.data.show})
    },

    decr () {
      let v = this.data.value
      if(v == 1){
        return
      }

      this.setData({value : v - 1})
    },

    incr() {
      let v = this.data.value
      this.setData({ value: v + 1 })
    },

    confirm () {
      this.triggerEvent('change', this.data.value)
      this.setData({show : false})
    }
  }
})
