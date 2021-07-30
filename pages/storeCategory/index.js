// pages/goodsCategoryManageNew/index.js
import {
  Request,
  toast
} from '../../utils/util.js'

let request = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    treeData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { storeId } = options;
    this.setData({ 
      storeId
    })
    if (storeId) {
      wx.setNavigationBarTitle({
        title: '商品分类查看',
      })
    }
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
    this.getTrees(0)
  },

  getTrees(parentid) {
    request.get('category/trees', res => {
        if (res.success) {
            // let orderCount = res.data.info;
            console.log(res);
            const { list } = res.data;
            this.setData({
              treeData: list,
            })
            
        } else {
            toast(res.msg)
        }
    }, { parentid, storeId: this.data.storeId || null })
  },

  handleCheck(e) {
    console.log(e);
    const { treeData } = this.data;
    const { id, index,  parentIndex} = e.currentTarget.dataset;
    const son = `treeData[${parentIndex}].son`;

    let checkSonList = treeData[parentIndex].son;
    let newCheckSonList = checkSonList.map((sitem, sindex) => {
      sitem.active = false;
      sitem.parentId = treeData[`${parentIndex}`]['id'];
      sitem.parentName = treeData[`${parentIndex}`]['name'];
      if(sindex == index) {
        sitem.active = true;
      }
      return sitem
    })
    this.setData({
      [son]: newCheckSonList
    })
    console.log(newCheckSonList);
    
  },

  // 保存
  handleSave() {
    let sonList = [];
    let categoryIds = [];
    const { treeData } = this.data;
    treeData.forEach(item => {
      if (item.son.length) { 
        sonList = sonList.concat(item.son)
      }
    })
    sonList.forEach(item => {
      if (item.active) {
        categoryIds.push({
          id: item.id,
          name: item.name,
          parentId: item.parentId,
          parentName: item.parentName
        })
      }
    })
    var pages = getCurrentPages();
    var page = pages[pages.length - 2];
    
    page.setCategoryIds(categoryIds)
    wx.navigateBack()
  },

  // 编辑
  handleEdit() {
    wx.navigateTo({
      url: '/pages/storeCategory/edit',
    })
  },
  // 分类筛选商品列表
  handleSearchGoods(e) {
    const { id } = e.currentTarget.dataset;
    var pages = getCurrentPages();
    var page = pages[pages.length - 2];
    
    page.changeCategory(id)
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