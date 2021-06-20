import { Request, toast } from '../../../utils/util.js'
let request = new Request()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bankList : [],
    formData : {
      wx_pay : '',
      ali_pay : '',
      bank_user : '',
      bank_account : '',
      bank_name : ''
    },

    step : 0
  },

  input (e) {
    let target = e.currentTarget.dataset.target
    let update = {}
    update[`formData.${target}`] = e.detail.value
    this.setData(update)
  },

  selectBank (e) {
    let index = parseInt(e.detail.value)
    let bank = this.data.bankList[index]
    this.setData({ 'formData.bank_name': bank.name})
  },

  submit () {
    var step = this.data.step

    let formData = this.data.formData
    if (formData.wx_pay === '' && formData.ali_pay === '' ) {
      toast('至少设置一种扫码支付方式')
      return
    }

    request.post('merchant/payset', res => {
      if(res.success){
        toast('设置成功')
        if (step == 1) {
          wx.redirectTo({
            url: '/pages/marketing/agent/index',
          })
        } else {
          wx.navigateBack()
        }
      }else{
        toast(res.msg)
      }
    },  formData).showLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.step) {
      this.setData({step : options.step})
    }
    request.setMany(true)
    request.get('bank/list', res => {
      if(res.success){
        this.setData({bankList : res.data})
      }
    })

    request.get('merchant/getpay', res => {
      if (res.success) {
        this.setData({ formData: res.data })
      }
    })


    request.setMany(false)
  }
})