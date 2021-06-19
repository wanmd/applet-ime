import { Request, toast, formDate } from '../../utils/util.js'
let request = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo : {
      avatar: '',
      nickname : '',
      mobile : '',
      wechat : ''
    }
  },

  copy (e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.content,
      success(res) {
        wx.getClipboardData({
          success(res) {
            
          }
        })
      }
    })
  },

  call () {
    wx.makePhoneCall({
      phoneNumber : this.data.userInfo.mobile
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userId = options.userId
    request.get('visit/contactInfo', res => {
      if(res.success) {
        this.setData({ userInfo : res.data})
      }
    }, {userId : userId}).showLoading()
  }
})