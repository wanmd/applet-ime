import { Request, toast } from '../../../../../utils/util.js'
let request = new Request()
let page = null
Page({
  data: {
    mobile : ''
  },

  input (e) {
    this.setData({mobile : e.detail.value})
  },

  confirm () {
    let mobile = this.data.mobile
    request.post('user/update', res => {
      if(res.success) {
        page.update('mobile', mobile)
        wx.navigateBack({
          
        })
      }else{
        toast(res.msg)  
      }
    }, { mobile: mobile}).showLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages()
    page = pages[pages.length - 2]
    this.setData({ mobile : page.data.userInfo.mobile})
  }
})