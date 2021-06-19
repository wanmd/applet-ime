import { Request, toast, alert, queryParams } from '../../../../utils/util.js'
// import { Request, toast, alert, queryParams } from '../../utils/util.js';
let request = new Request();
let regionChangeInter = null;
let updateLocationInter = null;
const app = getApp();
let WIDTH = 0;
let HEIGHT = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedIndex: -1,
     cateList: [],
    cateText: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onInit();
  },
  onShow: function (){
    let userInfo =  wx.getStorageSync('userinfo') || app.globalData.userInfo;
    console.log(userInfo)
    this.setData({
      cateText: userInfo.user_status_flag,
    })
  },
  onInit (){
    request.setMany(true);
    // user_status_flag
    // this.getRedPacketRecord();

    this.getUserStatusFlag();
    
    // this.getLookRecord();

    // this.addLookRecord();

    // this.getShareOrderInfo();
    // this.getShareOrderList();
    // this.buy();
    // this.getMyImageTextList();
    // this.getMyImageTextList();
    // this.userinfo();
    // this.bankList();
    request.setMany(false)
  },
  // 获取用户标志状态列表
  getUserStatusFlag(){
    let data = {};
    request.get('common/getUserStatusFlag', res=>{
      if(res.success) {
        this.setData({ cateList: res.data.list})
      }else{
          wx._showToast(res.msg)
        // toast(res.msg)  
      }
      console.log(res)
    })
  },
  // 获取我的分享赚订单汇总信息
  getShareOrderInfo(){
    let data = {};
    request.get('user/getShareOrderInfo', res=>{
      console.log(res);
    }, data)
  },
  // 获取我的分享赚订单列表
  getShareOrderList(){
    let data = {};
    request.get('user/getShareOrderList', res=>{
      console.log(res);
    }, data)
  },
  // 订单在线支付
  buy(){
    let data = {};
    request.post('order/buy', res=>{
      console.log(res);
    }, data)
  },
  // 获取我的图文列表
  getMyImageTextList(){
    let data = {};
    request.get('user/getMyImageTextList', res=>{
      console.log(res);
    }, data)
  },
  // 获取我的产品图集列表
  getMyImageTextList(){
    let data = {};
    request.get('user/getMyImageTextList', res=>{
      console.log(res);
    }, data)
  },
  // 更新用户信息
  update(text){
    let data = {
      user_status_flag: text
    };
    request.post('user/update', res => {
      if(res.success) {
          wx._showToast('修改成功~')
          wx.navigateBack({
            delta: 2
          })
      }else{
          wx._showToast(res.msg)
        // toast(res.msg)  
      }
    }, data).showLoading()
  },
  // 获取用户信息
  userinfo(){
    let data = {};
    request.post('userinfo', res=>{
      console.log(res);
    }, data)
  },
  // 获取银行列表
  bankList(){
    let data = {};
    request.get('bank/list', res=>{
      console.log(res);
    }, data)
  },
  
  select(e){
    let val = e.detail;
    console.log(val)
    this.setData({
      cateText: val
    })
  },
  confirm__(){
    if(this.data.cateText==''){
      wx._showToast('请选择您要修改的状态~')
      return ;
    }
    this.update(this.data.cateText);
    // console.log("2223")
    // wx.switchTab({
    //   url: '../index/index'
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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