import { Request, toast, formatDate } from '../../utils/util.js'
import { ALIYUN_URL } from '../../utils/config.js'
let request = new Request()
let app = getApp()
Page({
  data: {
    ALIYUN_URL: ALIYUN_URL,
    avatarWidth : 0,
    chatId : 0,
    result : 0,
    order : 0,
    chat : {
      picture: [],
      user : {},
      content : ''
    },
    quantity : 0,
    receiveUserList : [],
    height: {},
    currentIndex: 0,
    picture: []
  },

  swiperChange(e) {
    this.setData({ currentIndex: e.detail.current })
  },

  imageLoad(e) {
    let index = e.currentTarget.dataset.index
    let height = app.systemInfo.windowWidth * e.detail.height / e.detail.width
    let update = {}
    update[`height[${index}]`] = height + 'px'
    this.setData(update)
  },

  expandContent () {
    this.setData({ showEllipsis: !this.data.showEllipsis})
  },

  toOrder () {
    wx.navigateTo({
      url: './checkout/index',
    })
  },

  onLoad: function (options) {
    let chatId = options.chatId || 67
    let result = options.result || 0

    if(result != 2) {
      this.setData({result : 2})
    }
    if (chatId > 0){
      request.setMany(true)

      request.get('luck/draw', res => {
        if(res.success){
          if (result != 2) { 
              this.setData({ result: res.data.result, order: res.data.order })
          }
          
          var chat = res.data.chat
          chat.create_time = formatDate(chat.create_time)
          if (!Array.isArray(chat.picture)) {
            chat.picture = JSON.parse(chat.picture)
          }
          if(typeof chat.user === 'string') {
            chat.user = JSON.parse(chat.user)
          }
         
          this.setData({ chat: chat})
        }
      }, { id: chatId, result: result}).showLoading()

      request.get('luck/drawView', res => {
        if(res.success){
          let quantity = res.data.quantity
          let list = res.data.list
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