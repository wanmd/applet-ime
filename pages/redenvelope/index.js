import { Request, toast, formatDate } from '../../utils/util.js'
let request = new Request()
let app = getApp()
Page({
  data: {
    amount : 0,
    avatarWidth : 0,
    chatId : 0,
    chat : {
      picture: [],
      user : {},
      content : ''
    },
    quantity : 0,
    receiveUserList : []
  },

  expandContent () {
    this.setData({ showEllipsis: !this.data.showEllipsis})
  },

  onLoad: function (options) {
    let chatId = options.chatId
    let amount = options.amount || 0
    this.setData({ amount: amount})
    if (chatId > 0){
      request.setMany(true)

      request.get('redenvelope/redenvelope', res => {
        if(res.success){
          res.data.user = JSON.parse(res.data.user)
          res.data.create_time = formatDate(res.data.create_time)
          this.setData({chat : res.data})
        }
      }, { id: chatId}).showLoading()

      request.get('redenvelope/receiveView', res => {
        if(res.success){
          let quantity = res.data.quantity
          let list = res.data.list
          list.forEach((v, i) => {
            list[i] = JSON.parse(v)
          })

          this.setData({ quantity: quantity})
          let query = wx.createSelectorQuery()
          query.select('#user-container').boundingClientRect()
          query.exec(res => {
            let WIDTH = res[0].width
            if (quantity <= 10){
              this.setData({ avatarWidth: (WIDTH - 90) / 10, receiveUserList: list})
            }else{
              let query = wx.createSelectorQuery()
              query.select('#receive-count').boundingClientRect()
              query.exec(res => {
                let width = WIDTH - res[0].width
                let q = Math.ceil(width / 40)
                if ((q * 40 - 10) + res[0].width > WIDTH){
                  q --
                }
                list.splice(q)
                this.setData({ avatarWidth: 30, receiveUserList: list})
              })
            }
            
          })
          
        }
      }, { id: chatId })

      request.setMany(false)

      this.setData({chatId : chatId})
    }
  }
})