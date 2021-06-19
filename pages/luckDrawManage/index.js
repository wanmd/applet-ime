import { Request, toast, fileUrl, parseTime } from '../../utils/util.js'
let request = new Request()
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: {},
    chatList : [],
    isSelf: false,
    userInfo : {}
  },

  load(e) {
    let rows = e.detail.list
    let page = e.detail.page
    console.log(rows)
    if (rows.length > 0) {
      let chatList = this.data.chatList
      rows.forEach(v => {
        v.end_time = parseTime(v.end_time, '{y}-{m}-{d}')
        chatList.push(v)
      })

      this.setData({ chatList: chatList })
    }
  },

  onLoad: function (options) {
    
  },

  onShareAppMessage: function () {

  }
})