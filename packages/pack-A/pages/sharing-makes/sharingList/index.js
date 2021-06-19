import { Request, toast, alert, queryParams, parseTime } from '../../../../../utils/util.js'
// import { Request, toast, alert, queryParams } from '../../../utils/util.js';
let request = new Request();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // logType: { 1: 'LBS红包', 2: '产品红包', 3 : '平台红包', 4: '奖励', 5: '代理收入', 6:'提现'},
    // logType: { 1: '抢红包', 2: '产品红包', 3 : '平台红包', 4: '奖励', 5: '代理收入', 6:'提现', 7:'分享赚', 8:'产品订单'},
    logList : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onInit();
  },
  onInit (){
    request.setMany(true);

    this.getShareOrderList ();

    request.setMany(false)
  },
  // 获取我的红包记录
  getShareOrderList (){
    let data = {};
    request.get('user/getShareOrderList', res=>{
      console.log(res);
      if(res.success) {
        let logList = res.data.list;
          logList.forEach(item => {
            item.pay_time = parseTime(item.pay_time);
          })

          this.setData({
            logList: logList
          })
      }else{
          wx._showToast(res.msg)
        // toast(res.msg)  
      }
    }, data).showLoading()
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