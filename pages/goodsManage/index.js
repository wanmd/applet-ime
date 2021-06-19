// pages/goodsManage/index.js
import { Request, toast, errorToast } from '../../utils/util.js'
let request = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedNav: 0,
    topNavs: [{ type: 0, name: '销售中' }, { type: 1, name: '已下架' }],
    goodsList: [],
    query: {
      state: 1, // 状态：1-上架，2-下架
      keyword: '',
      categoryid: 0
    }
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

  },

  bindinput_(e) {
    this.setData({
      'query.keyword': e.detail.value
    })
  },

  search() {
    this.setData({ goodsList: []})
    wx.nextTick(() => {
      this.selectComponent('#pagination').initLoad()
    })
  },

  toggleType(e) {
    let type = e.currentTarget.dataset.type;
    let selectedNav = this.data.selectedNav;
    if (selectedNav == type) {
      return
    }
    this.setData({ 
      selectedNav: type,
      goodsList: [],
      'query.state':  type == 0 ? 1 : 2
    })
    wx.nextTick(() => {
      this.selectComponent('#pagination').initLoad()
    })
  },

  load (e) {
    let rows = e.detail.list
    let page = e.detail.page
    if (page == 1 && rows.length == 0) {
      this.setData({ goodsList: null })
    }
    if(rows.length > 0) {
      let goodsList = Object.assign([], this.data.goodsList)
      rows.forEach(row => {
        console.log(row);
        if(!row) {
          return
        }
        if (row.image_urls.indexOf(',')) {
          row.image_urls = row.image_urls.split(',')[0]
        }
        
        goodsList.push(row)
      })

      this.setData({ goodsList: goodsList})
    }
  },
  // 上下架
  handleState(e) {
    let { state, id } = e.currentTarget.dataset;
    let { goodsList } = this.data;
    let data = {
      id,
      state: state ==  1 ? 2 : 1
    }
    request.put('product/state',res=>{
      if(res.code == 200){
        toast(state == 1 ? '下架成功' : '上架成功');
        this.setData({
          goodsList: goodsList.filter(item => item.id != id)
        })
      }else{
        errorToast(res.msg)
      }
    }, data)
  },
  // 删除
  handleDelete(e) {
    const _this = this;
    wx.showModal({
      title: '确定删除吗？',
      showCancel: false, //隐藏取消按钮
      success: function(res) {
          if (res.confirm) {
            let { id } = e.currentTarget.dataset;
            request.delete('product/' + id,res=>{
              if(res.code == 200){
                toast('删除成功');
                _this.setData({
                  goodsList: goodsList.filter(item => item.id != id)
                })
              }else{
                errorToast(res.msg)
              }
            }, {})
          }
      }
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