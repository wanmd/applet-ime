import { Request, toast, alert, parseTime } from '../../../../../../utils/util.js'
let request = new Request()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index : -1,
    orderId : 0,
    order : null,
    deliveryFee : 0,
    deliverOrder : '' //发货凭证
  },

  input (e) {
    this.setData({ deliveryFee: Number(e.detail.value)})
  },
  input1 (e) {
    let order = this.data.order;
    order.amount = Number(e.detail.value)
    this.setData({ order: order})
  },

  cancelOrder(e) {
    let index = this.data.index
    wx.showModal({
      title: '取消订单',
      content: '确定取消该订单吗？',
      success: (res) => {
        if (res.confirm == true) {
          let pages = getCurrentPages()
          let page = pages[pages.length - 2]
          page.confirmCallback(index)
          wx.navigateBack({
            
          })
        }

      }
    })
  },

  confirm (e) {
    let fee = this.data.deliveryFee
    if (fee < 0){
      toast('运费不能小于0元')
      return
    }

    let data = {
      formId: e.detail.formId,
      id : this.data.order.order_id,
      fee : fee
    }

    request.post('merchantOrder/confirm', res => {
      if(res.success){
        toast('确认成功')
        let pages = getCurrentPages()
        let page = pages[pages.length - 2]
        let orderList = page.data.orderList
        orderList.splice(this.data.index, 1)
        page.setData({ orderList: orderList})
        if(orderList.length <= 0){
          page.selectComponent('#pagination').initLoad()
        }
        wx.navigateBack({})
      }else{
        toast(res.msg)
      }
    }, data)

  },

  upload(e) {
    this.setData({ deliverOrder: e.detail.value })
  },

  confirmDeliver () { //确定已发货
    let deliverOrder = this.data.deliverOrder
    if (deliverOrder === '') {
      toast('请上传发货凭证')
      return
    }

    request.post('merchantOrder/deliver', res => {
      
      if (res.success) {
        toast('确认成功')
        let pages = getCurrentPages()
        let page = pages[pages.length - 2]
        let orderList = page.data.orderList
        orderList.splice(this.data.index, 1)
        page.setData({ orderList: orderList })
        if (orderList.length <= 0) {
          page.selectComponent('#pagination').initLoad()
        }

        wx.navigateBack({

        })

      }else{
        toast(res.msg)
      }


    }, { order: deliverOrder, id: this.data.orderId })
  },

  onLoad: function (options) {
    let orderId = options.orderId
    // orderId=8&index=0
    request.get('order/detail', res => {
      if(res.success){
        let order = res.data.order
        order.create_time = parseTime(order.create_time)
        order.merchant_confirm_time = parseTime(order.merchant_confirm_time)
        order.pay_time = parseTime(order.pay_time)
        order.deliver_time = parseTime(order.deliver_time)
        order.delivery = {
          consignee : order.consignee,
          mobile : order.mobile,
          province: order.province,
          city: order.city,
          district: order.district,
          address : order.address,
          remarks : order.remarks
        }
        this.setData({ order: order})
      }else{
        alert(res.msg)
      }
    }, { id: orderId})

    this.setData({ orderId: orderId, index: options.index})
  }
})