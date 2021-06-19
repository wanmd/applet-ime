import { Request, toast } from '../../utils/util.js'
var app = getApp()
let request = new Request()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  callback (e) {
    request.post('bindMobile', res => {
      if(res.success) {
        getApp().reloadUserInfo()
        toast('绑定手机号码成功')
        wx.navigateBack({})
      }else{
        toast(res.msg)
      }
    }, e.detail)
  }
})