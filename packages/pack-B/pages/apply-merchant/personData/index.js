import { Request, toast, formDate, validmobile } from '../../../../../utils/util.js';
let request = new Request();
let app = getApp();
wx.Page({
  data: {
    step: 1,//第一步是基本信息，第二是付款页，第三是代理付款信息，第四是代理设置
    length:0,
    getCodeUrl:'sms/merchantApply',
    form1: {
      is_agree: true,
      type: 2,
      operName: '',
      idcard: '',
      idcardImg1: '',
      idcardImg2: '',
      mobile: '',
      smsCode : ''
    },
    paydata:{},
    form2: {
      wx_pay : '',
      ali_pay : '',
      bank_user : '',
      bank_account : '',
      bank_name : ''
    },
    form3 : {
      fee : '',
      slogan: '',
      min_number: '',
      sale_service: '',
      remarks: '',
      picture:[]
    },
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opts) {
    if(opts.step) this.setData({step:opts.step})
    this.getBankList()
  },
  onShow(opts){

  },
  uploadPic(e) {
    let d = new Date()
    let file = e.detail.value
    let form3 = JSON.parse(JSON.stringify(this.data.form3))
    form3.picture.push(file)
    this.setData({ form3: form3})
  },
  clearPic1(e) {
    let obj = {}
    let form = this.data[e.target.dataset.form]
    form[e.target.dataset.target] = ''
    obj[e.target.dataset.form] = form
    this.setData(obj)
  },
  clearPic(e) {
    let index = parseInt(e.target.dataset.index)
    let form3 = this.data.form3
    form3.picture.splice(index, 1)
    this.setData({ form3: form3})
  },
  look() {
    wx.navigateTo({ url: '../protocol/index' });
  },
  switch1Change(e) {
    let formData = this.data.formData;
    formData.is_agree = e.detail.value;
    this.setData({
      formData: formData
    });
  },
  input(e) {
    console.log(e);
    
    let target = e.currentTarget.dataset.target
    let form = e.currentTarget.dataset.form
    let _form = this.data[form]
    _form[target] = e.detail.value
    if(target=='remarks') this.setData({length:_form[target].length})
    if(target=='mobile') this.setData({mobile:e.detail.value})
    this.setData({form:_form})
  },

  submit() {
    let formData = Object.assign({}, this.data.form1);
    // for (let k in formData) {
    //   if (formData[k] === '') {
    //     toast('请完整填写资料');
    //     return;
    //   }
    // }
    // if (!validmobile(formData.mobile)) {
    //   toast('手机号码不正确');
    //   return;
    // }
    this.post('/merchant/apply',formData).then(res=>{
      if(res.success){
        let data = JSON.stringify(res.data);
        wx._showToast('认证成功')
        
        this.setData({
          paydata:data,
          // step:'3'
        })
        wx.redirectTo({
          url: '../pay/index?data=' + data + '&type="business"'
        });
      }else{
        toast(res.msg);
      }
    })
  },
// 付款信息相关操作
  // 选择银行
  selectBank (e) {
    let index = parseInt(e.detail.value)
    let bank = this.data.bankList[index]
    this.setData({ 'form2.bank_name': bank.name})
  },
  submit2(){
    let form2 = this.data.form2
    if (form2.wx_pay === '' && form2.ali_pay === '' ) {
      toast('至少设置一种扫码支付方式')
      return
    }
    this.post('/merchant/payset',form2).then(res=>{
      if(res.success){
        wx._showToast('提交成功')
        this.setData({
          step:4
        })
      }else{
        toast(res.msg);
      }
    })
  },
  // 代理相关设置
  confirm () {
    let formData = Object.assign({}, this.data.form3)
    for (let k in formData) {
      if (formData[k] === '') {
        toast('请完整填写数据')
        return
      }
    }
    this.post('/agent/setrule',formData).then(res=>{
      if(res.success){
        toast('商家设置成功！')
        // wx._navigateTo('/pages/applyMerchant/pay/index?data=' + this.data.paydata)
        wx._navigateTo('../success/index')
      }else{
        toast(res.msg)
        return
      }
    })
  },
  getBankList(){
    this.get('/bank/list').then(res=>{
      if(res.success){
        this.setData({bankList : res.data})
      }
    })
  },

});
