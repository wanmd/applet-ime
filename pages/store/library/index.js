import { Request, toast } from '../../../utils/util.js'
let request = new Request()
let app = getApp()
Page({
  data: {
    storeId: 0,
    query: {},
    user : {},
    goodsList : [],

    editting : false,

    isSelf : false
  },

  toggleEdit () {
    this.setData({editting : !this.data.editting})
  },

  load(e) {
    let rows = e.detail.list
    let page = e.detail.page
    if (rows.length == 0 && page == 1) {
      this.setData({ goodsList: null})
      return
    }
    let goodsList = Object.assign([], this.data.goodsList)
    rows.forEach(row => {
      if(!row) {
        return
      }
      goodsList.push(row)
    })

    this.setData({ goodsList: goodsList })
  },

  deleteChat (e) {
    let index = e.currentTarget.dataset.index
    let id = this.data.goodsList[index].id
    wx.showModal({
      title: '删除产品',
      content: '确定删除这个产品吗',

      success : (res) => {
        if(res.confirm) {
          request.delete('store/library/delete', res => {
            if(res.success) {
              let goodsList = this.data.goodsList
              goodsList.splice(index, 1)
              this.setData({goodsList : goodsList})
              if(goodsList.length == 0) {
                this.selectComponent('#pagination').initLoad()
              }
            } else {
              toast(res.msg)
            }
          }, { id: id})
        }
      }
    })
  },

  edit (e) {
    let index = e.currentTarget.dataset.index
    let chatId = this.data.goodsList[index].chat_id
    wx.navigateTo({
      url: '/pages/publish/chat/index?chatId=' + chatId
    })
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
    let pages = getCurrentPages()
    let page = pages[pages.length - 1]
    let to = encodeURIComponent('/' + page.route + '?storeId=' + this.data.storeId)
    let path = '/pages/index/index?path=' + to
    return {
      path: path
    }
  }
})