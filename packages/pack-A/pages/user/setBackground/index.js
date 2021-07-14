// pages/userInfo/setBackground/index.js
import {
  Request,
  toast,
  errorToast
} from '../../../../../utils/util.js'

let request = new Request()
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    background: ''
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
      background: userInfo.background
    })
  },

  setBackground () {
    wx.chooseImage({
        sourceType: ['album', 'camera'],
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
                background: file
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

  confirm() {
    // 更新用户信息
    let req = new Request();
    let file = this.data.background;
    req.post('user/update', res => { }, { background : file})
    // 更新本地存储
    this.update('background', file)
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