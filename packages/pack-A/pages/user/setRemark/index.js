import { Request, toast } from '../../../../../utils/util.js'
let request = new Request()
let page = null
Page({
  data: {
    remark : ''
  },

  input (e) {
    this.setData({remark : e.detail.value})
  },

  confirm () {
    let remark = this.data.remark
    request.post('user/update', res => {
      if(res.success) {
        page.update('remark', remark)
        wx.navigateBack({
          
        })
      }else{
        toast(res.msg)  
      }
    }, { remark: remark}).showLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages()
    page = pages[pages.length - 2]
    this.setData({ remark : page.data.userInfo.remark})
  }
})