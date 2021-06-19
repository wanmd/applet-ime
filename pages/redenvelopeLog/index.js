import { Request, toast, parseTime } from '../../utils/util.js'
let request = new Request()
Page({
  data: {
    type : 1,
    numbers : {},
    logList : []
  },

  toggle (e) {
    let type = parseInt(e.currentTarget.dataset.type)
    if(type == this.data.type) {
      return
    }
    this.setData({ type : type, logList : [], numbers : {}})

    this.selectComponent('#pagination').initLoad()
    this.getNumber()
  },

  getNumber () {
    let url = this.data.type == 1 ? 'redenvelope/receiveNumber' : 'redenvelope/redenvelopeNumber'
    request.get(url, res => {
      if(res.success) {
        this.setData({ numbers : res.data})
      }
    })
  },

  load (e) {
    let rows = e.detail.list
    let page = e.detail.page
    if(rows.length > 0) {
      let logList = this.data.logList
      rows.forEach(row => {
        row.add_time = parseTime(row.add_time)
        logList.push(row)
      })
      this.setData({ logList: logList})
    }
  },

  navTo (e) {
    let index = parseInt(e.currentTarget.dataset.index)
    let log = this.data.logList[index]
    let chatId = log.chat_id
    let type = log.type
    let amount = log.amount
    if (type == 1) {
      wx.navigateTo({
        url: `/pages/redenvelope/index?chatId=${chatId}&amount=${amount}`
      })
    }else{
      wx.navigateTo({
        url: `/pages/goods/index?chatId=${chatId}&amount=${amount}`
      })
    }
  },

  onLoad: function (options) {
    this.getNumber()
  }
})