import {
    Request, toast, alert, queryParams 
  } from '../../../../utils/util.js'
let request = new Request();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList : [],
    query: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo =  wx.getStorageSync('userinfo') || app.globalData.userInfo 
    this.setData({
      userInfo: userInfo
    })
    this.onInit();
  },
  onInit (){
    request.setMany(true);

    request.setMany(false)
  },
  load(e) {
    console.log(e);
    let rows = e.detail.list
    let page = e.detail.page
    console.log(page)
    if (rows.length == 0 && page == 1) {
      this.setData({ goodsList: null})
      return
    }
    if (page == 1) {
      this.setData({ goodsList: []})
    }
    let goodsList = Object.assign([], this.data.goodsList)
    rows.forEach(row => {
      if(!row) {
        return
      }
      goodsList.push(row)
    })

    this.setData({ goodsList: goodsList })
  },
  toGoodsDetail(e) {
    wx._navigateTo(`/pages/goods/index?chatId=${e.currentTarget.dataset.chatid}`)
  },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})