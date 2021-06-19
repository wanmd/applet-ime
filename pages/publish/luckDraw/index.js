import { Request, toast, getDate } from '../../../utils/util.js'
let request = new Request()
let app = getApp()
Page({
  data: {
    today : '',
    tomorrow : '',
    goods : null,
		show:false,
		title:'抽奖活动玩法和抽奖规则说明',
		content:['1、中奖活动系活跃粉丝的营销工具，是产品推广和产品营销的利器，请卖家依据自身经营情况发布“抽奖”活动；','2、添加产品为参与本次抽奖活动的奖品；抽奖总人数为参与此次抽奖活动的用户总人数，数量为1—500；中奖人数为最低1—500人；活动开始时间与结束时间为抽奖活动的有效日期。','3、卖家需对自身发起的抽奖活动负责，用户中奖后将会在卖家订单管理的待发货中生成抽奖产品的待发货订单，请及时发货；若用户参与抽奖活动，中奖生成待发货订单后，卖家需在本次抽奖活动结束后3日内发货至买家提供的收货信息；若卖家未及时发货，中奖买家发起投诉后，平台依据投诉将处罚与商品等价金额的消费者保证金或金额，以及其它处罚。','4、卖家发布抽奖活动即表示已阅读和接受抽奖规则；','5、抽奖活动最终解释权归iME平台所有；'],
    formData : {
      chatType : 6,
      id : '',
      number : '',
      total : '',
      start_time : '',
      end_time : ''
    },
    maxVal:500
  },
	show(){
    this.setData({show:true})
  },
  input1(e) {
    let form = this.data.formData
    form.total = e.detail.value>this.data.maxVal?this.data.maxVal:e.detail.value
    this.setData({formData:form})
  },
  input2(e) {
    let form = this.data.formData
    form.number = e.detail.value>form.total?form.total:e.detail.value
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

    if (formData.number === '') {
      toast('中奖商品数量')
      return
    }

    if (formData.number < 1) {
      toast('中奖商品数量不能少于1')
      return
    }

    if (formData.total === '') {
      toast('抽奖总人数')
      return
    }

    if (formData.total < 1) {
      toast('抽奖总人数不能少于1')
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