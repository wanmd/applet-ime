import { Request, toast, getDate } from '../../../utils/util.js'
let request = new Request()
let app = getApp()
Page({
  data: {
    today : '',
    tomorrow : '',
    goods : null,
		show:false,
		title:'砍价活动玩法和抽奖规则说明',
		content:['1、砍价活动系活跃粉丝的营销工具，是产品推广和产品营销的利器，请卖家依据自身经营情况发布“砍价”活动；','2、添加产品为参与本次砍价活动的奖品；商家发布砍价活动的产品数量为参与此次砍价活动的产品数，数量为1-200；砍价底价为用户砍价的最低价格，价格为0-参与活动的产品零售价；活动开始时间与结束时间为砍价活动的有效日期；砍价有效期为用户发起砍价直到成功砍至底价的有效时间范围。','3、卖家需对自身发起的砍价活动负责，用户砍价成功后将会在卖家订单管理的待发货中生成抽奖产品的待发货订单，请卖家及时发货；若用户参与砍价活动成功，并成功生成待发货订单，卖家需在本次砍价活动结束后3日内发货至买家提供的收货信息；若卖家未及时发货，中奖买家发起投诉后，平台将依据投诉处罚与商品等价金额的消费者保证金或金额，以及其它处罚;','4、卖家发布砍价活动即表示已阅读和接受抽奖规则；','抽奖活动最终解释权归iME平台所有.'],
    formData : {
      chatType : 5,
      id : '',
      stock : 0,
      bargain_price : 0,
      start_time : '',
      end_time : '',
      expire : ''
    },
    maxVal:200
  },
	show(){
    this.setData({show:true})
  },
  input1(e) {
    let form = this.data.formData
    if(!this.data.goods) {
      wx._showToast('请选择商品')
      this.setData({formData:form})
       return
    }
    form.stock = Number(e.detail.value)>this.data.maxVal?this.data.maxVal:Number(e.detail.value) 
    this.setData({formData:form})
  },
  input2(e) {
    let form = this.data.formData
    if(!this.data.goods) {
      wx._showToast('请选择商品')
      this.setData({formData:form})
       return
    }
    form.bargain_price = Number(e.detail.value)>this.data.goods.sale_price?this.data.goods.sale_price:Number(e.detail.value)
    this.setData({formData:form})
  },
  input(e) {
    let target = e.currentTarget.dataset.target
    let update = {}
    update['formData.' + target] = e.detail.value
    this.setData(update)
  },
  confirmGoods (goods) {
    this.setData({ goods: goods, 'formData.id' : goods.id})
  },

  confirm () {
    let formData = this.data.formData

    if (!formData.id){
      toast('请选择商品')
      return
    }

    if (formData.stock === '') {
      toast('请输入库存数')
      return
    }

    if (formData.stock < 1) {
      toast('库存数不能少于1')
      return
    }

    if (formData.bargain_price === '') {
      toast('请输入底价')
      return
    }

    if (formData.bargain_price < 0) {
      toast('红包数量不能小于0')
      return
    }

    if (formData.start_time === '') {
      toast('请选择活动开始时间')
      return
    }

    if (formData.end_time === '') {
      toast('请选择活动结束时间')
      return
    }

    if (formData.expire === '') {
      toast('请填写砍价有效期')
      return
    }

    if (formData.expire < 0.5) {
      toast('红包数量不能小于0.5小时')
      return
    }

    request.post('publish', res => {
      if (res.success) {
        toast('发布成功')
        app.newPublish = true
        wx.navigateBack({
          delta: 3
        })
      } else {
        toast(res.msg)
      }
    }, formData)
  },

  onLoad: function (options) {
    let today = getDate()
    let tomorrow = getDate(1)
    this.setData({ today: today, tomorrow: tomorrow})
  }
})