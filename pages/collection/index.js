// pages/collection/index.js
import { Request, toast } from '../../utils/util.js'
import { ALIYUN_URL } from '../../utils/config.js'

let request = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: ALIYUN_URL,
    currentType: 0,
    // 产品列表
    productList: [],
    // 图文列表
    normalList: [],
    quoteListKeyword: '',
    query: {
      keyword: '',
      chattype: 2
    },
    query2  : {
      keyword: '',
      chattype: 1
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data);
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

  bindinput_(e) {
    this.setData({
      'query.keyword': e.detail.value
    })
  },

  search2() {
    let query = this.data.query;
    this.setData({ query: query, productList: [] })
    this.paginationInit();
  },

  paginationInit() {
    this.selectComponent('#pagination1').initLoad();
},

  toggleType(e) {
    const { current, type } = e.currentTarget.dataset;
    if (current == this.data.currentType) return;
  
    this.setData({ 
      currentType: current,
      // dataList: []
      'query.chattype': type
    })
    this.setLoadFlag(type)
  },

  setLoadFlag(type) {
    let currentType = this.data.currentType;
    let data = {};
    if (currentType == 0) {
        data['productList'] = [];
    } else if (currentType == 1) {
        data['normalList'] = [];
    }
    this.setData(data);
},

  load(e, last = 0) {
    let rows = e.detail.list;
    let page = e.detail.page;

    if (rows.length == 0 && page == 1) {
      this.setData({ productList: [] })
      return
    }
    if (rows.length > 0) {
        let productList = this.data.productList;
        rows.forEach(v => {
            if (last == 0) {
                productList.push(v)
            } else {
                productList.unshift(v)
            }
        })
        this.setData({ productList: productList })
    }
  },

  load2(e, last = 0) {
    let rows = e.detail.list;
    let page = e.detail.page;

    if (rows.length == 0 && page == 1) {
      this.setData({ normalList: [] })
      return
    }
    if (rows.length > 0) {
        let normalList = this.data.normalList;
        rows.forEach(v => {
            if (last == 0) {
                normalList.push(v)
            } else {
                normalList.unshift(v)
            }
        })
        this.setData({ normalList: normalList })
    }
  },

  nav(e) {
    wx.navigateTo({
      url: '/pages/goods/index?chatId=' + e.currentTarget.dataset.id,
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