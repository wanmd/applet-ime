// packages/pack-A/pages/user/userManageMent/index.js
import { Request, toast } from '../../../../../utils/util.js'

let request = new Request()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
      1,2,3
    ],
    current: 0,
    quoteListKeyword: '',
    query2: {
      keyword: '',
      type: 1
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // this.initData()
  },

  initData() {
    request.get('visit/contactInfo', res => {
      if (res.success) {
            this.setData({ 
              dataList: res.data
           })
        }
    }, { ...this.data.query2 })
  },

  bindinput_(e) {
    this.setData({
      quoteListKeyword: e.detail.value
    })
  },

  search2() {
    this.initData()
  },

  changeCurrent(e) {
    const { current, type } = e.currentTarget.dataset;
    this.setData({
      current: Number(current),
      'query2.type': type
    })
    this.initData()
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