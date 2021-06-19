import { Request, toast } from '../../../../../utils/util.js'
let request = new Request()
let page = null
Page({
  data: {
    labelName : '',
    label: []
  },

  input(e) {
    this.setData({ labelName : e.detail.value})
  },

  delete (e) {
    let index = e.currentTarget.dataset.index
    let label = this.data.label
    label.splice(index, 1)
    this.setData({label : label})
  },

  add () {
    let name = this.data.labelName
    if (name === '') {
      return
    }
    let label = this.data.label
    if(label.length >= 5) {
      toast('最多设置5个标签');
      return;
    }

    label.push(name)
    this.setData({ label: label, labelName : ''})
  },

  confirm() {
    let label = this.data.label
    request.post('user/update', res => {
      if (res.success) {
        page.update('label', label)
				getApp().broadcastUpdate();
				getApp().reloadUserInfo()
        wx.navigateBack({})
      } else {
        toast(res.msg)
      }
    }, { label: label }).showLoading()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages()
    page = pages[pages.length - 2]
    let label = page.data.userInfo.label
    if (label) {
      if (!Array.isArray(label)) {
        label = JSON.parse(label)
      }
      this.setData({ label: label })
    }
    
  }
})