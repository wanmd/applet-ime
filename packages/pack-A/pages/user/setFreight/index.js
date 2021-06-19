// packages/pack-A/pages/user/setFreight/index.js
import { Request, toast } from '../../../../../utils/util.js'
let request = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      {
        value: 1,
        label: '包邮'
      },
      {
        value: 2,
        label: '不包邮'
      }
    ],
    fee: {}
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
    this.getFreight()
  },

  // 获取运费模板
  getFreight() {
    request.get('feetemplate', res => {
      if (res.success) {
        this.setData({ 
          fee: res.data.list,
       })
      }
    }, {})
  },

  radioChange(e) {
    this.setData({
      'fee.type': Number(e.detail.value)
    })
  },

  formSubmit(e) {
    const { type, defaultNumber = 0, defaultPrice = 0, createNumber = 0,createPrice = 0 } = e.detail.value;
    const data = {
      type,
      config: {
        defaultNumber,defaultPrice,createNumber,createPrice
      }
    }
    request.post('feetemplate', res => {
        if (res.success) {
            toast('设置成功')
            var pages = getCurrentPages();
            var page = pages[pages.length - 2];
            
            page.setTemplate(data)
            wx.navigateBack()
        } else {
            toast(res.msg)
        }
    }, data).showLoading();

    


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