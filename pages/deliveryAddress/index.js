import { Request, toast, validmobile } from '../../utils/util.js'
let request = new Request()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    target : '',
    addressList : []
  },

  select (e) {
    if(this.data.target === 'select'){
      let address = this.data.addressList[e.currentTarget.dataset.index]
      let pages = getCurrentPages()
      wx.navigateBack({
        success : () => {
          pages[pages.length - 2].selectAddress(address)
        }
      })
    }
  },
  deleteAPI (id){
    let that = this;
    request.post('deliveryaddress/delete', res => {
      if (res.success) {
        request.setMany(true);
        that.getAddress();
        request.setMany(false);
        toast('删除成功')
      }
    }, {id: id})
  },
  deleteItem (e){
    let id = e.currentTarget.dataset.id;
    let that = this;
      wx.showModal({
        title: '提示',
        content: '是否删除这一条地址信息',
        success: function(res) {
          if(res.confirm) {
            console.log('用户点击确定')
            that.deleteAPI(id)
          }
          if(res.cancel) {
            console.log('用户点击取消')
          }
          
        }
      })
  },
  getAddress () {
    request.get('deliveryaddress', res => {
      if (res.success) {
        let address = res.data.address
        if (address.length > 0) {
          this.setData({ addressList: address })
        }
      }
    })
  },

  onLoad: function (options) {
    let target = options.target || ''
    if(target !== ''){
      this.setData({target : target})
    }
    if(options.id !== ''){
      this.setData({target : target})
    }
    this.getAddress()
    
  }
})