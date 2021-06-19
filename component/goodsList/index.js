// component/goodsList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    query: {
      type : Object,
      value : {}
    }
  },

  data: {
    selectIndex : -1,
    list : []
  },

  methods: {
    search () {
      this.setData({ list : []})
      this.selectComponent('#pagination').initLoad()
    },

    load (e) {
      let rows = e.detail.list
      let page = e.detail.page
      if (rows.length > 0) {
        let list = this.data.list
        rows.forEach(v => {
          list.push(v)
        })
        this.setData({ list: list })
      }
      
    },

    select (e) {
      let index = e.detail
      this.setData({ selectIndex : index})
      this.triggerEvent('select', this.data.list[index])
    }
  }
})
