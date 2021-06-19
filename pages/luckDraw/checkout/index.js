import { Request, toast, formDate, alert } from '../../../utils/util.js'
let request = new Request()
let app = getApp()
var page = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address : null,
    store : {},
    chat : {},
    remark : ''
  },

  selectAddress (address) {
    this.setData({ address: address})
  },

  input (e) {
    this.setData({ remark: e.detail.value})
  },

  confirm () {
    let address = this.data.address
    if(address == null){
      toast('请选择收货地址')
      return
    }

    let addressId = address.id
    let remark = this.data.remark

    request.post('luck/order', res => {
        if(res.success){
          page.setData({order : 1})
          alert('提交成功，请等候商家发货')
          wx.navigateBack({
            
          })
        }else{
          toast(res.msg)
        }
    }, { address: addressId, remark: remark, id: this.data.chat.chat_id}).showLoading()
  },

  onLoad: function (options) {
    var pages = getCurrentPages()
    page = pages[pages.length - 2]
    var chat = page.data.chat
    this.setData({store : chat.user, chat : chat})
  }
})