import { Request, rpxTopx, parseTime } from '../../utils/util.js'
let app = getApp()
let W = 0
let H = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logList : [],
    numbers : {},
    showPoster : false,
    qrcode : '',
    assetsImages: app.assetsImages,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let qrcode = wx.getStorageSync('qrcode')
    if (qrcode) {
      this.setData({ qrcode: qrcode })
    } else {
      let request = new Request()
      request.setConfig('responseType', 'arraybuffer')
      request.get('qr/invite', res => {
        let qrcode = wx.arrayBufferToBase64(res).replace(/[\r\n]/g, '')
        this.setData({ qrcode: qrcode })
        wx.setStorage({
          key: 'qrcode',
          data: qrcode
        })
      }).showLoading()
    }

    let req = new Request()
    req.get('invite/number', res => {
      if (res.success) {
        this.setData({ numbers: res.data })
      }
    })
  },
  toggleShowPoster () {
    var showPoster = this.data.showPoster
    this.setData({ showPoster: !showPoster})
    if (!showPoster) {
      wx.nextTick(() => {
        this.draw()
      })
    }
  },

  draw () {
    let userInfo = app.globalData.userInfo
    let avatar = userInfo.avatar
    let self = this
    const query = wx.createSelectorQuery()
    query.select('#canvas-modal').boundingClientRect()
    query.exec(function (res) {
      W = res[0].width
      H = res[0].height
      var ctx = wx.createCanvasContext('firstCanvas')
      ctx.setFillStyle('#FFE200')
      ctx.fillRect(0, 0, W, H)
      ctx.draw(true)


      wx.getImageInfo({
        src: avatar,
        success: function (res) {
          console.log(res.width);
          console.log(res.height);
          ctx.save();
					ctx.beginPath();
					// 下面是先定位要开个圆形的位置，50 和 90 分别就是圆的圆心的 x 坐标和 y 坐标，25 是半径，后面的两个参数就是起始和结束，这样就能画好一个圆了
					// 1:圆心的 x 坐标,2:圆心的 y 坐标,3:圆的半径,4/5起始弧度
          ctx.arc(rpxTopx(344), rpxTopx(235), rpxTopx(60), 0, 2*Math.PI);
					ctx.closePath();
					// 下面就裁剪出一个圆形了，且坐标在 （50， 90）
					ctx.clip();
          ctx.drawImage(res.path, rpxTopx(280), rpxTopx(170), rpxTopx(res.width),rpxTopx(res.height),rpxTopx(100),rpxTopx(100));

					ctx.restore();
					ctx.draw(true);

        }
      })

      wx.getImageInfo({
        src: '/assets/images/dyrbg@2x.png',
        success(res) {
          console.log(res.width);
          console.log(res.height);
          
          ctx.drawImage('/assets/images/dyrbg@2x.png', 0, 0, res.width, res.height, 0, 0, rpxTopx(res.width), rpxTopx(res.height))
          ctx.draw(true)

          ctx.beginPath();
          ctx.arc( W / 2, rpxTopx(588), rpxTopx(154),0,360,false);
          ctx.fillStyle="#ffffff";//填充颜色,默认是黑色
          ctx.fill();//画实心圆
          ctx.closePath();
          ctx.draw(true)
        }
      })

      

      let d = new Date()
      const fsm = wx.getFileSystemManager()
      const filePath = `${wx.env.USER_DATA_PATH}/` + d.getTime() + '.png'
      const buffer = wx.base64ToArrayBuffer(self.data.qrcode)
      fsm.writeFile({
        filePath,
        data: buffer,
        encoding: 'binary',
        success() {
          wx.getImageInfo({
            src: filePath,
            success: (res) => {
              let qrSize = rpxTopx(288)
              ctx.drawImage(res.path, 0, 0, 280, 280, W / 2 - qrSize / 2, rpxTopx(444), qrSize, qrSize)
              ctx.draw(true)
            }
          })
        }
      })


    })
  },

  save() {
    let self = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: W,
      height: H,
      canvasId: 'firstCanvas',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            self.toggleShowPoster()
          },
          fail() {
            toast('保存失败')
          }
        })
      }
    })

  },

  load(e) {
    let rows = e.detail.list
    let page = e.detail.page
    console.log(rows);
    
    if (page == 1 && rows.length == 0) {
      this.setData({ logList: null })
      return
    }

    if (rows.length > 0) {
      let logList = this.data.logList
      rows.forEach(row => {
        row.add_time = parseTime(row.add_time, '{y}-{m}-{d}')
        logList.push(row)
      })
      this.setData({ logList: logList })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var data = encodeURIComponent('?f=i&iv=' + app.globalData.userInfo.user_id)
    console.log(data);
    
    return {
      path: '/pages/index/index?scene=' + data,
      title : '我代言我赚钱！开店卖货引流拓客代理分销！线上线下互通互卖每天赚钱！好产品就要分享！'
    }
  }
})