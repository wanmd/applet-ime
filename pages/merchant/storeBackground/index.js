// pages/merchant/storeBackground/index.js
import {
  Request,
  toast,
  errorToast
} from '../../../utils/util.js'

let request = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData : {
      store_background: '',
      store_quote_state: ''
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
    let userInfo =  wx.getStorageSync('userinfo') || app.globalData.userInfo;
    console.log(userInfo);
    this.setData({
      userInfo,
      'formData.store_quote_state': userInfo.store_quote_state,
      'formData.store_background': userInfo.store_background,
    })
  },

  input(e) {
    this.setData({
      'formData.store_quote_state': e.detail.value
    })
  },

  setBackground () {
    wx.chooseImage({
        sourceType: ['camera'],
        count: 1,
        success: (res) => {
          const tempFilePaths = res.tempFilePaths
          wx.showLoading({
          })
          let task = request.upload('upload/uploadpic', tempFilePaths[0], res => {
            wx.hideLoading()
            res = JSON.parse(res)
            if (res.success) {
              let file = res.data.fileName;
              this.setData({
                'formData.store_background': file
              })
            } else {
              errorToast('上传失败')
            }
          }, res => {
            errorToast('上传失败')
            this.setData({ uploadIng: false })
          })
        }
      })
  },

  update (key, value) {
    let update = {}
    let userInfo = Object.assign({}, this.data.userInfo)
    userInfo[key] = value
    update['userInfo.' + key] = value
    this.setData(update)
    
    wx.setStorage({
      key: 'userinfo',
      data: userInfo
    })

    app.globalData.userInfo[key] = value
  },

  submit () {
    // 更新用户信息
    let req = new Request();
    let { store_background, store_quote_state } = this.data.formData;
    if (!store_quote_state) {
      toast('请填写报价说明');
      return
    }
    if (!store_background) {
      toast('请添加店铺背景图/报价单广告图片');
      return
    }
    req.post('user/update', res => { }, { 
      store_background,
      store_quote_state
    })
    // 更新本地存储
    this.update('store_quote_state', store_quote_state)
    this.update('store_background', store_background)
    wx.navigateTo({
      url: '/pages/userInfo/index',
    })
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