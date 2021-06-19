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
    }
  },

  observers : {
    checked(checked) {
      this.setData({ isChecked : checked})
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isChecked : false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    change () {
      let isChecked = !this.data.isChecked
      this.setData({ isChecked: isChecked})
      this.triggerEvent('change', { value: isChecked})
    }
  }
})
