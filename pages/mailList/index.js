
Page({

  data: {
    selectedNav : 1,
    urls: ['mail/follows', 'mail/fans', 'mail/agent', 'mail/merchant'],
    topNavs: [{ type: 1, name: '关注' }, { type: 2, name: '粉丝' }, { type: 3, name: '我的代理' }, { type: 4, name: '我的商户' }],
    userList : []
  },

  toggleType (e) {
    let type = e.currentTarget.dataset.type
    let selectedNav = this.data.selectedNav
    if (selectedNav == type) {
      return
    }

    this.setData({ selectedNav: type, userList: []})
    wx.nextTick(() => {
      this.selectComponent('#pagination').initLoad()
    })
  },

  load (e) {
    let rows = e.detail.list
    let page = e.detail.page
    if (page == 1 && rows.length == 0) {
      this.setData({ userList: null })
    }
    if(rows.length > 0) {
      let userList = Object.assign([], this.data.userList)
      rows.forEach(row => {
        if(!row) {
          return
        }
        if (!(row.user instanceof Object)) {
          row.user = JSON.parse(row.user)
        }
        userList.push(row)
      })

      this.setData({ userList: userList})
    }
  },

  onLoad: function (opts) {
    if(opts.nav) this.setData({selectedNav:opts.nav})
  }
})