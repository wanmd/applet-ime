import { Request, toast } from '../../../../../utils/util.js'
let request = new Request()
var numberInter = null
Page({
  data: {
    query : {
      status : 0
    },
    orderList: [],
    showConfirm: false,

    number1: 0,
    number2: 0
  },

  selectToggle (e) {
    let status = parseInt(e.currentTarget.dataset.status)
    if (this.data.query.status == status) {
      return
    }
    this.setData({ orderList : []})
    this.setData({ 'query.status': status})
    this.selectComponent('#pagination').initLoad()
  },

  load(e) {
    let rows = e.detail.list
    let page = e.detail.page
    let orderList = Object.assign([], this.data.orderList)
    rows.forEach(item => {
      item.delivery = { remarks: item.remarks, consignee: item.consignee, mobile: item.mobile, province: item.province, city: item.city, district: item.district, address: item.address }
      orderList.push(item)
    })

    this.setData({ orderList: orderList })
  },

  cancelOrder(e) {
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '取消订单',
      content: '确定取消该订单吗？',
      success : (res) => {
        if (res.confirm == true){
          this.confirmCallback(index)
        }
        
      }
    })
  },

  confirmCallback (index) {
    let orderId = this.data.orderList[index].order_id
    request.post('merchantOrder/cancel', res => {
      if (res.success) {
        let orderList = this.data.orderList
        orderList.splice(index, 1)
        this.setData({ orderList: orderList })
        toast('取消订单成功')
        if (orderList.length == 0) {
          this.selectComponent('#pagination').initLoad()
        }
      } else {
        toast(res.msg)
      }
    }, { orderId: orderId }).showLoading()
  },

  getNumber() {
    var req = new Request()
    req.get('merchantOrder/number', res => {
      if (res.success) {
        var data = res.data
        if ('number1' in data) {
          this.setData({ number1: data.number1 })
        }
        if ('number2' in data) {
          this.setData({ number2: data.number2 })
        }
      }
    })
  },

  onLoad() {
    this.getNumber()
    numberInter = setInterval(() => {
      this.getNumber()
    }, 3000)

  },

  onUnload() {
    clearInterval(numberInter)
  }

})
