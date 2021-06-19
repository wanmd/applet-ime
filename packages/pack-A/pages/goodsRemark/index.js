// packages/pack-A/pages/goodsRemark/index.js
import { Request, toast } from '../../../../utils/util.js'
let request = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    remark: '',
    productRemarks: [],
    usedRemarkList: [],
    historyRemarkList: [],
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
    this.initData()
  },

  initData() {
    request.setMany(true);
    this.getRemarksUsed()
    this.getRemarksHistory()
  },

  // 常用产品备注
  getRemarksUsed() {
    request.get('lastsremark', res => {
        if (res.success) {
            this.setData({ usedRemarkList: res.data.list })
        } else {
            toast(res.msg)
        }
    }, {})
  },
  // 标签历史
  getRemarksHistory() {
    request.get('historyremark', res => {
        if (res.success) {
            this.setData({ historyRemarkList: res.data.list })
        } else {
            toast(res.msg)
        }
    }, {})
  },

  handleInput(e) {
    this.setData({
      remark: e.detail.value.substr(0,18)
    })
  },

  confirm() {
    // 只有一个备注
    this.setData({
      productRemarks: [{
        id: null,
        remark: this.data.remark
      }],
      remark: ''
    })
    
    
  },

  handleClick(e) {
    const { item } = e.currentTarget.dataset;
    this.setData({
      productRemarks: [...[item]],
    })
  },

  handleDelete(e) {
    const { remark } = e.currentTarget.dataset;
    const { productRemarks } = this.data;
    this.setData({
      productRemarks: productRemarks.filter(item => item.remark !== remark)
    })
  },

  handleSave() {
    var pages = getCurrentPages();
    var page = pages[pages.length - 2];
    
    let remark = '';
    this.data.productRemarks.forEach(item => {
      remark = remark + item.remark
    })
    
    page.setRemarks(remark)
    wx.navigateBack()
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