import { Request, toast } from '../../../../utils/util.js'
// import orderlist1 from '../../../../utils/mack/orderlist.js'
let request = new Request()
let app = getApp()
var numberInter = null
Page({
  data: {
    userType : 1,
    query: {
      status: 5,
      type: 2
    },
    orderList: [],
    showCancelConfirm: false,
    currentIndex: -1,

    pageHude: false,
    number1 : 0,
    number2: 0,
    timeDate: {},
    orderCount: {
      waitPayNum: 0,
      waitReceiveNum: 0,
      waitSendNum: 0,
      hasDoneNum: 0,
    },
  },

  selectToggle(e) {
    let status = parseInt(e.currentTarget.dataset.status)
    if (this.data.query.status == status) {
      return
    }
    this.setData({ orderList: [] })
    this.setData({ 'query.status': status })
    this.selectComponent('#pagination').initLoad()
  },

  load(e) {
    let rows = e.detail.list
    // let rows = orderlist1.data.list
    let page = e.detail.page
    let orderList = [];
    if(page == 1){
      orderList = [];
    }else{
      orderList = Object.assign([], this.data.orderList)
    }
    rows.forEach(item => {
      item.delivery = { remarks: item.remarks, consignee: item.consignee, mobile: item.mobile, province: item.province, city: item.city, district: item.district, address: item.address }
      orderList.push(item)
    })

    this.setData({ orderList: orderList })
  },

  updateOrderList (index) {
    let orderList = this.data.orderList
    orderList.splice(index, 1)
    this.setData({ orderList: orderList })
    if (orderList.length == 0) {
      this.selectComponent('#pagination').initLoad()
    }
  },

  cancelOrder(e) {
    let index = e.currentTarget.dataset.index
    this.setData({ currentIndex: index })
    this.setData({ showCancelConfirm: true })
  },

  cancelCallback(e) {
    this.setData({ showCancelConfirm: false })
    if (e.detail == 0) {
      let index = this.data.currentIndex
      let orderId = this.data.orderList[index].order_id
      request.post('order/cancel', res => {
        if (res.success) {
          toast('取消订单成功')
          this.updateOrderList(index)
        } else {
          toast(res.msg)
        }
      }, { orderId: orderId }).showLoading()
    }
  },


  confirmComplete (e) { //确定收货
    let index = e.currentTarget.dataset.index
    wx.showModal({
      title: '确定收货',
      content: '请确定已经收到商品',
      success : res => {
        if (res.confirm) {
          this.completeOrder(index)
        }
      }
    })
  },

  completeOrder (index) {
    let orderId = this.data.orderList[index].order_id
    request.post('order/complete', res => {
      if (res.success) {
        toast('确定成功')
        // this.updateOrderList(index)
        // app.requireLogin('./detail/index?orderId='+orderId)
        let query = this.data.query
        query.status = 4;
        this.onLoad(query)
      } else {
        toast(res.msg)
      }
    }, { id: orderId })
  },

  getNumber () {
    var req = new Request()
    req.get('order/number', res => {
      clearTimeout(numberInter)
      numberInter = setTimeout(() => {
        this.getNumber()
      }, 3000)
      if(res.success) {
        var data = res.data
        if('number1' in data) {
          this.setData({number1 : data.number1})
        }
        if ('number2' in data) {
          this.setData({ number2: data.number2 })
        }
      }
    })
  },
  getSellerCount () {
    request.get('order/getSellerCount', res => {
      if(res.success) {
        var data = res.data.info
        
        let timeDate = {
          year: '-',
          month: '-',
          day: '-',
        }
        if(data.date !='') {
          let timeArr = data.date.split('-');
          timeDate.year = timeArr[0];
          timeDate.month = timeArr[1];
          timeDate.day = timeArr[2];
        }
        this.setData({sellerCount : data, timeDate: timeDate})
      }
    })
  },
  getOrderCount(type) {
    request.setMany(true);
    request.get('order/getOrderCount', res => {
      if (res.success) {
        let orderCount = res.data.info;
          this.setData({
            orderCount: orderCount
          })
      } else {
        toast(res.msg)
      }
    }, {type: type})
  },
  onLoad (options) {
    let opt = options;
    if(opt&&opt.status){
      let query = {
        status: opt.status || 5,
        type: 2
      }
      this.setData({ query: query })
    }
    let userInfo = app.globalData.userInfo
    if (userInfo&&userInfo.user_type == 2) {
      this.setData({ userType: userInfo.user_type })
    }
    this.getSellerCount();
    this.getOrderCount(2);
  },
  onShow () {
    if(this.data.pageHude){
      // this.onLoad(this.data.query)
      request.get('order/list', res => {
        if (res.success && res.data.list.length > 0) {
          this.load({ detail: { list: res.data.list, page: 1 } }, 1)
        }
      }, { status: this.data.query.status, lastPk: 0, page: 1, pageSize: 20, type: 2 })
    }
  },
  onHide () {
    this.setData({ pageHude: true })

  },

  onUnload () {
    clearTimeout(numberInter)
  }

})
