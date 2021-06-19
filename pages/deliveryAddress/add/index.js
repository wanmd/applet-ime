import { Request, toast, validmobile } from '../../../utils/util.js'
let request = new Request()
let app = getApp()

Page({
  data: {
    id : 0,
    formData : {
      consignee : '',
      mobile : '',
      is_default : 0,
      province : '',
      city : '',
      district : '',
      address : ''
    }
  },

  input(e) {
    let target = e.currentTarget.dataset.target
    let value = e.detail.value
    let update = {}
    if(target == 'area'){
      update['formData.province'] = value[0]
      update['formData.city'] = value[1]
      update['formData.district'] = value[2]
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
          consignee : res.userName,
          mobile : res.telNumber,
          is_default : that.data.formData.is_default,
          province : res.provinceName,
          city : res.cityName,
          district : res.countyName,
          address : res.detailInfo
        }
        that.setData({ formData: formData })
        // console.log(res.userName)
        // console.log(res.postalCode)
        // console.log(res.provinceName)
        // console.log(res.cityName)
        // console.log(res.countyName)
        // console.log(res.detailInfo)
        // console.log(res.nationalCode)
        // console.log(res.telNumber)
      }
    })
  },
  confirm () {
    let formData = Object.assign({}, this.data.formData)
    if (formData.consignee === ''){
      toast('请填写收货人')
      return
    }

    if (formData.mobile === '') {
      toast('请填写手机号码')
      return
    }

    if (!validmobile(formData.mobile)){
      toast('手机号码格式不正确')
      return
    }

    if (formData.province === '' || formData.city === '' || formData.district === '') {
      toast('请选择省市区')
      return
    }

    if (formData.address === '') {
      toast('请填写详细地址')
      return
    }

    let id = this.data.id
    if(id > 0){

    }

    formData.id = id

    request.post(id > 0 ? 'deliveryaddress/edit' : 'deliveryaddress/add', res => {
      if(res.success){
        toast('保存成功')
        let pages = getCurrentPages()
        let page = pages[pages.length - 2]
        page.getAddress()
        wx.navigateBack({
          
        })
      }else{
        toast(res.msg)
      }
    }, formData).showLoading()
  },

  onLoad: function (options) {
    let barTitlle = '添加地址'
    let id = options.id
    if (id > 0){
      barTitlle = '编辑地址'
      this.setData({id : id})
      request.get('delivery/getAddress', res => {
        let address = res.data.address
        let formData = Object.assign({}, this.data.formData)
        for (let k in formData) {
          if (k in address) {
            formData[k] = address[k]
          }
        }

        this.setData({ formData: formData })
      }, { id: id}).showLoading()
    }

    wx.setNavigationBarTitle({
      title: barTitlle
    })
    
  }
})