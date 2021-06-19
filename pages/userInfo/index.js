import { Request, errorToast, toast } from '../../utils/util.js'
let request = new Request()
let app = getApp()
wx.Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    userInfo : {
      avatar: '',
      nickname: '',
    },
    form1: {
      avatar: '',
    },

  },
  input(e) {
    let target = e.currentTarget.dataset.target
    let form = e.currentTarget.dataset.form
    let _form = this.data[form]
    _form[target] = e.detail.value
    // if(target=='remarks') this.setData({length:_form[target].length})
    if(target=='avatar') this.setData({mobile:e.detail.value})
    this.setData({form:_form, avatar: e.detail.value});
    console.log("input")
    this.confirmImg();
  },
  confirmImg () {
    let avatar = 'https://static-2019.oss-cn-shenzhen.aliyuncs.com/thumb/' + this.data.avatar;
    request.post('user/update', res => {
      if(res.success) {
        this.update('avatar', avatar)
      }else{
        toast(res.msg)  
      }
    }, { avatar: avatar}).showLoading()
  },
  clearPic1(e) {
    console.log("clearPic1")
    let obj = {}
    let form = this.data[e.target.dataset.form]
    form[e.target.dataset.target] = ''
    obj[e.target.dataset.form] = form
    this.setData(obj)
  },
  setBackground () {
    wx.chooseImage({
        sourceType: ['album', 'camera'],
        count: 1,
        success: (res) => {
          const tempFilePaths = res.tempFilePaths
          wx.showLoading({
          
          })
          let task = request.upload('upload/uploadpic', tempFilePaths[0], res => {
            wx.hideLoading()
            res = JSON.parse(res)
            if (res.success) {
              let file = res.data.fileName
              this.update('background', file)
              let req = new Request()
              req.post('user/update', res => { }, { background : file})
            } else {
              errorToast('上传失败')
            }
          }, res => {
            errorToast('上传失败')
            this.setData({ uploadIng: false })
          })

        
        }
      })
  },

  update (key, value) {
    let update = {}
    let userInfo = Object.assign({}, this.data.userInfo)
    userInfo[key] = value
    update['userInfo.' + key] = value
    this.setData(update)
    
    wx.setStorage({
      key: 'userinfo',
      data: userInfo
    })

    app.globalData.userInfo[key] = value
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = Object.assign({}, app.globalData.userInfo)
    if (data) {
      if (data.label) {
        if (!Array.isArray(data.label)) {
          data.label = JSON.parse(data.label)
        }
      }
      this.setData({
        userInfo: data
      })
    }
  }
})