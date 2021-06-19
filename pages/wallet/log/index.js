import { parseTime } from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logType: { 1: '抢红包', 2: '产品红包', 3 : '平台红包', 4: '奖励', 5: '代理收入', 6:'提现', 7:'分享赚', 8:'产品订单'},
    // logType: { 1: 'LBS红包', 2: '产品红包', 3 : '平台红包', 4: '奖励', 5: '代理收入', 6:'提现'},
    logList : []
  },

  load (e) {
    let rows = e.detail.list
    if(rows.length > 0) {
      let logList = this.data.logList
      rows.forEach(row => {
        row.add_time = parseTime(row.add_time)
        logList.push(row)
      })

      this.setData({ logList: logList})
    }
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