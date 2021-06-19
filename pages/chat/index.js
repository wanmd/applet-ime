import { Request, formatDate } from '../../utils/util.js'
let request = new Request()
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
	alwayShow:false,
    chatId : 0,
    chat : {
      content : '',
      picture : []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("chat=====options")
    console.log(options)
    let chatId = options.chatId
    this.setData({ chatId: chatId})
		
    request.get('chat/chat', res => {
      if(res.success){
        let data = res.data
        data.create_time = formatDate(data.create_time)
        if (!(data.user instanceof Object)) {
          data.user = JSON.parse(data.user)
        }
        if (!(Array.isArray(data.picture))) {
          data.picture = JSON.parse(data.picture)
        }

        this.setData({ chat: data})
      }
    }, { id: chatId})
  },

  onShareAppMessage: function () {
    var chatId = this.data.chatId
    let path = '/pages/index/index?scene=' + encodeURIComponent('?from=chat&chatId=' + chatId + '&fromUserId=' + app.globalData.userInfo.user_id)
    return {
      path: path,
      imageUrl: fileUrl(this.data.chat.picture[0]),
      title: '转发一个有趣的故事给你'
    }
  }
})