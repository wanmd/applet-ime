import { Request, toast } from '../../utils/util.js'
let request = new Request()
let app = getApp()
Page({

  data: {
    storeId : 0,
    storeName : '',
    store : {
      avatar : '',
      nickname : ''
    },
    rule : {},
    assetsImages: app.assetsImages,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let storeId = options.storeId 
    request.setMany(true)
    request.get('agent/rule', res => {
      if(res.success) {
        let data = res.data;
        data.picture = JSON.parse(data.picture)
        this.setData({ rule : data})
      }
    }, {storeId : storeId})

    request.get('visit/user', res => {
      if (res.success) {
        this.setData({ store : res.data})
      } 
    }, { userId: storeId })

    request.setMany(false)

    this.setData({ storeId: storeId})
  },
  input(e) {
    let target = e.currentTarget.dataset.target
    let update = {}
    update['formData.' + target] = e.detail.value
    this.setData(update)
  },

  submit() {
    let storeName = this.data.store.nickname
    request.post('agent/apply', res => {
      if (res.success) {
        let params = res.data.wxparam
        params.success = () => {
          let pages = getCurrentPages()
          let page = pages[pages.length - 2]
          page.setData({ isAgent : true})
          wx.showModal({
            title: '申请代理成功',
            content: `您已成为${storeName}的代理`,
            showCancel : false,
            success : (res) => {
              if (res.confirm) {
                wx.navigateBack({
                  
                })
              }
            }
          })
        }

        params.fail = () => {
          toast('支付失败')
        }

        wx.requestPayment(params)
      } else {
        toast(res.msg)
      }
    }, { storeId: this.data.storeId}).showLoading()
  },

})