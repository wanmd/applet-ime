import { Request, toast } from '../../utils/util.js'
let request = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    productLabels: [],
    usedLabels: [],
    historyLabels: [],
    label: '',
    historyRemarkList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      productid: options.productid
    })
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
    this.getLabelsByProduct()
    this.getLabelsUsed()
    this.getLabelsHistory()
  },

  // 产品标签列表
  getLabelsByProduct() {
    const { productid } = this.data;
    if (!productid) return;
    request.get('labels', res => {
        if (res.success) {
            this.setData({ productLabels: res.data.list })
        } else {
            toast(res.msg)
        }
    }, {productid: this.data.productid || 0})
  },
  // 最近标签
  getLabelsUsed() {
    request.get('label/used', res => {
        if (res.success) {
            this.setData({ usedLabels: res.data.list })
        } else {
            toast(res.msg)
        }
    }, {})
  },
  // 标签历史
  getLabelsHistory() {
    request.get('/label/history', res => {
        if (res.success) {
            this.setData({ historyLabels: res.data.list })
        } else {
            toast(res.msg)
        }
    }, {})
  },

  handleInput(e) {
    this.setData({
      label: e.detail.value.substr(0,6)
    })
  },

  confirm() {
    const { productLabels } = this.data;
    if (productLabels.length < 3) {
      this.setData({
        productLabels: [...this.data.productLabels, ...[{
          id: null,
          name: this.data.label
        }]],
        label: ''
      })
    }
  },

  handleDelete(e) {
    const { name } = e.currentTarget.dataset;
    const { productLabels } = this.data;
    this.setData({
      productLabels: productLabels.filter(item => item.name !== name)
    })
  },

  handleCheck(e) {
    const { productLabels } = this.data;
    const { item } = e.currentTarget.dataset;
    
    if (!productLabels.includes(item) && productLabels.length <3) {
      this.setData({
        productLabels: [...this.data.productLabels, ...[item]]
      })
    }
  },

  handleSave() {
    var pages = getCurrentPages();
    var page = pages[pages.length - 2];
    
    let label = '';
    this.data.productLabels.forEach(item => {
      label = label + item.name + ','
    })
    
    page.setLabels(label.substr(0, label.length -1))
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