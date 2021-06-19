import { Request, toast, rpxTopx } from '../../../utils/util.js'
let app = getApp()
let W = 0
let H = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar : '',
    nickname : '',
    qrcode : ''
  },

  draw () {
    let sef = this
    wx.showLoading()
    let qrcode = wx.getStorageSync('qrcode')
    let avatar = this.data.avatar
    let nickname = this.data.nickname

    const query = wx.createSelectorQuery()
    query.select('#canvasEl').boundingClientRect()
    query.exec(function (res) {
      W = res[0].width
      H = res[0].height

      let w = rpxTopx(96)
      let h = w

      var ctx = wx.createCanvasContext('firstCanvas')

      ctx.setFillStyle('#fff')
      ctx.fillRect(0, 0, W, H)

      ctx.setFillStyle('#333333')
      ctx.setTextAlign('center')
      ctx.setFontSize(rpxTopx(28))
      ctx.fillText(nickname, W / 2, h + h + rpxTopx(40), W)

      ctx.setFillStyle('#333333')
      ctx.setTextAlign('center')
      ctx.setFontSize(rpxTopx(48))
      ctx.fillText('我为IME代言', W / 2, h + h + rpxTopx(40) + rpxTopx(100), W)

      console.log('----------------------')
      let qrW = rpxTopx(240)
      let qrH = qrW
      

      ctx.draw(true);

      wx.showLoading({
        title: ''
      })
      wx.getImageInfo({
        src: avatar,
        success: function (res) {
          ctx.drawImage(res.path, 0, 0, 132, 132, (W / 2 - w / 2), w, w, h)
          ctx.draw(true);

          const fsm = wx.getFileSystemManager()
          const filePath = `${wx.env.USER_DATA_PATH}/qrcode.png`
          const buffer = wx.base64ToArrayBuffer(qrcode)
          fsm.writeFile({
            filePath,
            data: buffer,
            encoding: 'binary',
            success() {
              wx.getImageInfo({
                src: filePath,
                success: (res) => {
                  ctx.drawImage(res.path, 0, 0, 280, 280, (W / 2 - qrW / 2), h + h + rpxTopx(40) + rpxTopx(100) + rpxTopx(60), qrW, qrH)
                  ctx.draw(true)
                  wx.hideLoading()
                  sef.save()
                }
              })
            }
          })

        }
      })


    })
  },

  save () {
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: W,
      height: H,
      canvasId: 'firstCanvas',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success (res) {
          },
          fail () {
            toast('保存失败')
          }
        })
      }
    })

  },

  onLoad: function (options) {
    let userInfo = app.globalData.userInfo
    this.setData({avatar : userInfo.avatar, nickname : userInfo.nickname})


    let qrcode = wx.getStorageSync('qrcode')
    if (qrcode) {
      this.setData({ qrcode: 'data:image/png;base64,' + qrcode})
    } else {
      let request = new Request()
      request.setConfig('responseType', 'arraybuffer')
      request.get('invite/qrcode', res => {
        let qrcode = wx.arrayBufferToBase64(res).replace(/[\r\n]/g, '')
        this.setData({ qrcode: 'data:image/png;base64,' + qrcode })
        wx.setStorage({
          key: 'qrcode',
          data: qrcode
        })
      }).showLoading()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})