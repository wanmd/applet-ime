// pages/productCategory/index.js
import { Request, toast } from '../../utils/util.js'
let request = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    parentid: 0,
    categoryList: [],
    categoryList_2: [],
    show: false,
    currentSelect: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      parentid: options.parentid || 0
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
    this.getProductCategory( 0)
  },

  // 产品品类列表
  getProductCategory(parentid) {
    request.get('product/categories', res => {
        if (res.success) {
            this.setData({ categoryList: res.data.list })
            
        } else {
            toast(res.msg)
        }
    }, {parentid})
  },

  handleSelect(e) {
    const { id, name } = e.currentTarget.dataset;
    const callback = (res) => {
      console.log(res);
      
      this.setData({
        show: true,
        categoryList_2: res.data.list,
        parent: e.currentTarget.dataset
      })
    }
    request.get('product/categories',callback, {parentid: id})
  },
  // 选中二级
  handleSelectProductCategory(e) {
    const { item, index } = e.currentTarget.dataset;
    const { categoryList_2, parent } = this.data;

    this.setData({
      categoryList_2: categoryList_2.map(vitem => {
        vitem.active = false;
        if(vitem.id === item.id) {
          vitem.active = true;
          vitem.parent = parent;
          this.setData({
            currentSelect: vitem
          })
        }
        return vitem
      })
    })
  },

  handleSave() {
    var pages = getCurrentPages();
    var page = pages[pages.length - 2];
    
    page.setProductCategoryId(this.data.currentSelect)
    wx.navigateBack()
  },

  handleClose() {
    this.setData({
      show: false,
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