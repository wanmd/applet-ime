import { Request, toast, validmobile } from '../../../utils/util.js'
// let request = new Request()
let app = getApp()

Page({
  data: {
    id : 0,
    dataInfo: '',
    formData : {
      sendInfo: '',
      soldInfo: '',
      buyInfo: '',
    }
  },

  input(e) {
    let target = e.currentTarget.dataset.target
    let value = e.detail.value
    let update = {}
    update[`formData.${target}`] = value
    console.log(e)
    console.log(target)
    console.log(value)
    
    this.setData(update)
  }, 

  changeDefault (e) {
    console.log(e)
  },
  confirm () {
    let formData = Object.assign({}, this.data.formData)
    if (formData.sendInfo === ''){
      toast('请填写发货说明')
      return
    }

    if (formData.soldInfo === '') {
      toast('请填写售后服务')
      return
    }
    if (formData.buyInfo === '') {
      toast('请填写退换须知')
      return
    }


    let req = new Request();
    req.post('user/setStoreParam', res => {
      if(res.success){
        toast('保存成功')
        wx.navigateBack({
        })
      }else{
        toast(res.msg)
      }
    }, formData).showLoading()
  },
  getInfo(){
    let req = new Request();
    req.get('user/getStoreCommonParam', res => {
      if(res.success){
        this.setData({dataInfo : res.data})
      }else{
        toast(res.msg)
      }
    })
  },
  getData(){
    let req = new Request();
    req.get('user/getStoreParam', res => {
      console.log(res)
      let formData = {
        sendInfo: res.data.info.send_info,
        soldInfo: res.data.info.sold_info,
        buyInfo: res.data.info.buy_info,
      }
      this.setData({ formData: formData })
    })
  },
  onLoad: function (options) {
      this.getData();
      this.getInfo();
  }
})