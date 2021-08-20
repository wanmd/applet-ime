import { Request, toast, validmobile } from '../../../../../utils/util.js'
import { ALIYUN_URL } from '../../../../../utils/config.js'
let request = new Request()
let app = getApp()
Page({

  data: {
	  ALIYUN_URL,
    formData : {
	  is_agree:true,
      type : 1,
      operName : '',
      idcard : '',
      idcardImg1 : '',
      idcardImg2: '',
      merchantName : '',
      address : '',
      licenseCode : '',
      licenseImg : '',
      storeImg: '',
      storeInnerImg: '',
      mobile : '',
      //smsCode : ''
    }
  },
  look(){
	wx.navigateTo({url:'../protocol/index'})
  },
  switch1Change(e){
	let formData = this.data.formData ;
	formData.is_agree = e.detail.value;
	this.setData({
		formData:formData
	})
  },
  input (e) {
    let target = e.currentTarget.dataset.target
    let update = {}
    update['formData.' + target] = e.detail.value
    this.setData(update)
  },

  submit () {
    let formData = Object.assign({}, this.data.formData)
	if(!formData.is_agree){
		toast('请同意协议')
		return
	}
    for (let k in formData) {
      if(formData[k] === '') {
        toast('请完整填写资料')
        return
      }
    }
	
    if (!validmobile(formData.mobile)) {
      toast('手机号码不正确')
      return
    }
    request.post('merchant/apply', res => {
      if(res.success) {
        let data= JSON.stringify(res.data)
        wx.redirectTo({
          url: '../pay/index?data=' + data
        })
      }else {
        toast(res.msg)
      }
    }, formData).showLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }
})