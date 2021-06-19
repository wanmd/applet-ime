import { Request, toast, alert } from '../../../../../utils/util.js'
let request = new Request()
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:1,//用于判断是否审核
    data : {},
    show:false,
		title:'消费者保障金服务',
		content:['指根据iME平台条款和交易情况，以及相关消协、消费者协议的规定，通过iME平台发布的产品信息，并利用支付交易的方式向买家出售过程中，应履行的保真、如实描述义务，在指定交易期内保障买家在付款并收到产品实物，与卖家所售产品描述不符、商品存在质量问题情形下的权益，买家享有的理赔服务。卖家应根据iME平台条款之约定缴存，并在卖家关闭店铺时，在不存在交易纠纷的情况下，根据最终交易情况可申请退理此消费者权益保证金。'],
    modalFlag: false,
    userInfo: null,
    total: 298,
    assetsImages: app.assetsImages,
  },

  pay () {
    let orderNo = this.data.data.order_no||''
    request.post('merchant/pay', res => {
      if(res.success) {
        let params = res.data.wxparam
        params.success = () => {
          this.setData({modalFlag:true})

          // if(this.data.type=='business'){
          //   wx.redirectTo({
          //     url: '../business/index?step=3'
          //   })
          // }else{
          //   wx.redirectTo({
          //     url: '../personData/index?step=3'
          //   })
          // }
        }
        params.fail = () => {
          toast('支付失败')
        }

        wx.requestPayment(params)
      }else{
        toast(res.msg)
      }
    }, {no : orderNo}).showLoading()
  },

  onLoad: function (options) {
    // if(options.amount){

      let data = JSON.parse(options.data)
      let amount = data.amount || 0
      this.setData({ data: data,type:options.type,total: 298 + data.amount})
    // }else{
      // this.setData({ total: 298 })
    // }
    
  },
  show(){
    this.setData({show:true})
  },
  confim(){
    this.setData({show:false})
  },
  close(){
    this.setData({modalFlag:false})
  },
  cancel(){
    this.setData({modalFlag:false})
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        let userInfo = res.data
        if (userInfo) {
          wx.redirectTo({
            url: '/pages/store/index?storeId='+userInfo.user_id
          })
          this.setData({
            userInfo: data,
          })
        }
      },
    })
    
  },
  confirm2(){
    if(this.data.type=='business'){
      wx.redirectTo({
        url: '../business/index?step=4'
      })
    }else{
      wx.redirectTo({
        url: '../personData/index?step=4'
      })
    }
  }
})