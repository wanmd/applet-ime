import { Request, parseTime } from '../../../utils/util.js'
let app = getApp()
Page({
  data: {
    numbers : {},
    logList : []
  },

  load (e) {
    let rows = e.detail.list
    let page = e.detail.page
    if(page == 1 && rows.length == 0) {
      this.setData({ logList : null})
      return
    }

    if (rows.length > 0) {
      let logList = this.data.logList
      rows.forEach(row => {
        row.register_time = parseTime(row.register_time, '{y}-{m}-{d}')
        logList.push(row)
      })
      this.setData({ logList: logList })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let req = new Request()
    req.get('invite/number', res => {
      if(res.success) {
        this.setData({ numbers : res.data})
      }
    })
  },

  onShareAppMessage: function () {
    let userId = app.globalData.userInfo.user_id
    return {
      title : '一个好玩又赚钱的小程序',
      path: 'pages/index/index?inviter=' + userId
    }
  }
})