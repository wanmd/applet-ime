import { Request, toast, alert } from '../../utils/util.js'
wx.Page({
  data: {
    status:0,
    navList : [
      { name: '抽奖', url: '/pages/lotteryTool/index'},
      { name: '砍价', url: '/pages/bargainTool/index' },
      // { name: '代理设置', url: './agent/index' }
    ],
    navList1 : [
      { name: '查看抽奖活动', url: '/pages/luckDrawManage/index'},
      { name: '查看砍价活动', url: '/pages/bargainManage/index'}
    ]
  },
  navTo (e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url : url
    })
  },
  changeStatus(e){
    this.setData({status:e.target.dataset.status})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})