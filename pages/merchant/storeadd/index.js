import { Request, toast, validmobile } from '../../../utils/util.js'
let request = new Request()
let app = getApp()

Page({
  data: {
    id : 0,
    formData : {
      // consignee : '',
      // mobile : '',
      // is_default : 0,
      m_prov : '',
      m_city : '',
      m_dist : '',
      m_street : ''
    }
  },

  input(e) {
    let target = e.currentTarget.dataset.target
    let value = e.detail.value
    let update = {}
    if(target == 'area'){
      update['formData.m_prov'] = value[0]
      update['formData.m_city'] = value[1]
      update['formData.m_dist'] = value[2]
    } else if (target == 'is_default'){
      update[`formData.${target}`] = value ? 1 : 0
    }else{
      update[`formData.${target}`] = value
    }
    
    this.setData(update)
  }, 

  changeDefault (e) {
    console.log(e)
  },
  getWXdeliver (){
    let that = this;
    wx.chooseAddress({
      success (res) {
        let formData = {
          // consignee : res.userName,
          // mobile : res.telNumber,
          // is_default : that.data.formData,
          m_prov : res.provinceName,
          m_city : res.cityName,
          m_dist : res.countyName,
          m_street : res.detailInfo
        }
        that.setData({ formData: formData })
        // console.log(res.userName)
        // console.log(res.postalCode)
        // console.log(res.m_provName)
        // console.log(res.m_cityName)
        // console.log(res.countyName)
        // console.log(res.detailInfo)
        // console.log(res.nationalCode)
        // console.log(res.telNumber)
      }
    })
  },
  confirm () {
    let formData = Object.assign({}, this.data.formData)
    // if (formData.consignee === ''){
    //   toast('请填写收货人')
    //   return
    // }

    // if (formData.mobile === '') {
    //   toast('请填写手机号码')
    //   return
    // }

    // if (!validmobile(formData.mobile)){
    //   toast('手机号码格式不正确')
    //   return
    // }

    if (formData.m_prov === '' || formData.m_city === '' || formData.m_dist === '') {
      toast('请选择省市区')
      return
    }

    if (formData.m_street === '') {
      toast('请填写详细地址')
      return
    }

    let id = this.data.id
    if(id > 0){

    }

    // formData.id = id

    request.post('user/update', res => {
      if(res.success){
        toast('保存成功')
        app.wxlogin();
        let pages = getCurrentPages()
        let page = pages[pages.length - 2]
        // page.getAddress()
        wx.navigateBack({})
      }else{
        toast(res.msg)
      }
    }, formData).showLoading()
  },

  onLoad: function () {
    let userInfo =  wx.getStorageSync('userinfo') || app.globalData.userInfo 
    
    let formData = {
      m_prov : userInfo.m_prov,
      m_city : userInfo.m_city,
      m_dist : userInfo.m_dist,
      m_street : userInfo.m_street,
    }
    this.setData({
      userInfo: userInfo,
      formData: formData
    })
    
  }
})