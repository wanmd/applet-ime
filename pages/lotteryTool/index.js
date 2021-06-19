import { Request, toast, fileUrl, parseTime } from '../../utils/util.js'
import { timestampToTime } from '../../utils/util.js'
let request = new Request()
let app = getApp()
wx.Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_active:3,
    defaultimg:'/assets/images/default-jj.png',
  },

  onLoad: function (options) {
    
    let userinfo = wx.getStorageSync('userinfo')
    let t = new Date()
    let m = (1 + t.getMonth())<10?'0'+ (1 + t.getMonth()):(1 + t.getMonth())
    let d = t.getDate() < 10 ?  '0' + t.getDate() : t.getDate() 
    let cut = t.getFullYear() + '-'  + m + '-' + d
    let t1 = timestampToTime(userinfo.merchant_begin)
    let t2 = timestampToTime(userinfo.merchant_annual_expire)
    this.setData({
      annual_expire:t2.ymd,
      begin_time:userinfo.merchant_begin==0?cut:t1.ymd,
    })
  },
  tobuy(){
    wx.showToast({
      title: '此功能暂无开放',
      icon: 'none',
      duration: 1500
    })
    
  },
  toset(){

  },
  selectItem(e) {
    let idx = e.target.dataset.index;
    this.setData({
      current_active:idx
    })

  },
  onShareAppMessage: function () {

  }
})