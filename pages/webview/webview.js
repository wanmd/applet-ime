// pages/webview/webview.js
//获取应用实例
wx.Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    let url = opts.url ? decodeURIComponent(opts.url)+'#wechat_redirect' : '';
    console.log(url);
    this.setData({url: url})
  }
})
