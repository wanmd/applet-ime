import { Request, toast } from '../../../../../utils/util.js'
let request = new Request()
let page = null
Page({
  data: {
    nickname : ''
  },

  input (e) {
    this.setData({nickname : e.detail.value})
  },

  confirm () {
    let nickname = this.data.nickname
    request.post('user/update', res => {
      if(res.success) {
        page.update('nickname', nickname)
        wx.navigateBack({
          
        })
      }else{
        toast(res.msg)  
      }
    }, { nickname: nickname}).showLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages()
    page = pages[pages.length - 2]
    this.setData({ nickname : page.data.userInfo.nickname})
  }
})