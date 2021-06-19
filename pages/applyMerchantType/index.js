import { Request, alert } from '../../utils/util.js'
let request = new Request()
let app = getApp()
Page({
  data: {
    number : 0,
    assetsImages: app.assetsImages,
  },

  dodo () {
    request.get('user/fansNumber', res => {
      if (res.success) {
        if(res.data.number < this.data.number) {
          alert('您的粉丝数不够' + this.data.number)
        }else{
        
          wx.navigateTo({
            url: '../../packages/pack-B/pages/apply-merchant/personData/index'
          })
        }
      }
    })
  },

  onLoad: function (options) {
    request.get('merchant/personApplyFansNumber', res => {
      if(res.success) {
        this.setData({ number : res.data.number})
      }
    })
  }
})