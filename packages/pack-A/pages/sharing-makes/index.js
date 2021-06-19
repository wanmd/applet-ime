import { Request, toast, alert, queryParams } from '../../../../utils/util.js'
// import { Request, toast, alert, queryParams } from '../../utils/util.js';
let request = new Request();
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMFlag: false,
    tapList: { 1: '今天', 2: '昨天', 3 : '近7天', 4: '上月'},
    tapIndex: 1,
    assetsImages: app.assetsImages,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onInit();
  },
  onInit (){
    request.setMany(true);

    this.getShareOrderInfo();
    // this.getShareOrderList();  

    request.setMany(false)
  },
  // 获取我的分享赚订单汇总信息
  getShareOrderInfo(){
    let data = {};
    request.get('user/getShareOrderInfo', res=>{
      console.log(res);
      if(res.success) {
          this.setData({
            shareInfo: res.data.info
          })
      }else{
          wx._showToast(res.msg)
        // toast(res.msg)  
      }
    }, data).showLoading()
  },
  // 获取我的分享赚订单列表
  getShareOrderList(){
    let data = {
      page: 1,
      pageSize: 20,
    };
    request.get('user/getShareOrderList', res=>{
      console.log(res);
      if(res.success) {
          this.setData({
            logList: res.data.list.info
          })
      }else{
          wx._showToast(res.msg)
        // toast(res.msg)  
      }
    }, data).showLoading()
  },
  SMHide(){
    this.setData({SMFlag: false})
  },
  SMShow(){
    this.setData({SMFlag: true})
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
    var data = encodeURIComponent('?f=i&iv=' + app.globalData.userInfo.user_id)
    console.log(data);
    
    return {
      path: '/pages/index/index?scene=' + data,
      title : '简简单单分享赚！分销！分佣！代理！副业！刚需管道收入！'
    }
  }
})