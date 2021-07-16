// pages/merchant/service/index.js
import {
  Request,
  toast,
} from '../../../utils/util.js'
let request = new Request()
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [
      {
        name: '7天无理由退换',
        active: false
      },
      {
        name: '特殊商品不退换',
        active: false
      },
      {
        name: '极速退款',
        active: false
      },
      {
        name: '退货包运费',
        active: false
      },
      {
        name: '降价补差价',
        active: false
      },
      {
        name: '全场包邮',
        active: false
      },
      {
        name: '有WIFI',
        active: false
      },
      {
        name: '有宝宝椅',
        active: false
      },
      {
        name: '无烟区',
        active: false
      },
      {
        name: '有包厢',
        active: false
      },
      {
        name: '24小时营业',
        active: false
      },
      {
        name: '母婴室',
        active: false
      },
      {
        name: '随时退',
        active: false
      },
      {
        name: '推荐自提',
        active: false
      },
      {
        name: '过期退',
        active: false
      },
      {
        name: '当天发货',
        active: false
      },
      {
        name: '假一赔十',
        active: false
      },
      {
        name: '正品保证',
        active: false
      },
    ]
  },

  handleCheck(e) {
    const { index } = e.currentTarget.dataset;
    let update = {};
    update[`dataList[${index}].active`] = !this.data.dataList[index].active
    this.setData(update)
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

  submit() {
    let dataList = this.data.dataList.filter(item => item.active);
    console.log(dataList);
    let string_dataList = '';
    let length = dataList.length;
    dataList.forEach((item, index) => {
      string_dataList += item.name + (index + 1 == length ? '' : ',')
    })
    console.log(string_dataList);
    request.post('user/update', res => {
      if(res.success) {
        // 更新本地存储
        this.update('service_setting', string_dataList)
        wx.navigateBack({})
      }else{
        toast(res.msg)  
      }
    }, { service_setting: string_dataList }).showLoading()
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

    if (userInfo.service_setting) {
      let data = userInfo.service_setting.split(',');
      let active_dataList = [];
      data.forEach(item => {
        active_dataList.push({
          active: true,
          name: item
        })
      })
      let orginData = this.data.dataList;
      orginData.forEach(item => {
        active_dataList.forEach(aitem => {
          if (item.name == aitem.name) {
            item.active = true
          }
        })
      })
      this.setData({
        dataList: orginData
      }) 
    }
    
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