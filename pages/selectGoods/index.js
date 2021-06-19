// pages/selectGoods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query : {
      goodsName : ''
    },
    goods : null
  },

  input (e) {
    this.setData({ 'query.goodsName' : e.detail.value})
  },

  search () {
    this.selectComponent('#goodsList').search()
  },

  select (e) {
    this.setData({ goods : e.detail})
  },

  confirm () {
    let pages = getCurrentPages()
    let parent = pages[pages.length - 2]
    parent.confirmGoods(this.data.goods)
    wx.navigateBack()
  },

  onLoad: function (options) {

  }
})