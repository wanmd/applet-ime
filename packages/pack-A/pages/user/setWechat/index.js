import { Request, toast } from '../../../../../utils/util.js'
let request = new Request()
let page = null
Page({
  data: {
    wechat : ''
  },

  input (e) {
    this.setData({wechat : e.detail.value})
  },

  confirm () {
    let wechat = this.data.wechat
    request.post('user/update', res => {
      if(res.success) {
        page.update('wechat', wechat)
        wx.navigateBack({
          
        })
      }else{
        toast(res.msg)  
      }
    }, { wechat: wechat}).showLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages()
    page = pages[pages.length - 2]
    this.setData({ wechat : page.data.userInfo.wechat})
  }
})