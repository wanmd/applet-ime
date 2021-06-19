import {
  Request,
  toast,
  rpxTopx,
  parseTime
} from '../../../../utils/util.js'
let request = new Request()
let app = getApp()
let W = 0
let H = 0
Component({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    vipInfo: false,
    vipInfoFlag: false,
    qrcode : '',
    price: 99,
    storeQr: false,
    assetsImages: app.assetsImages,
    qrcodeBase: ''

  },
  methods: {
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
      let userInfo =  wx.getStorageSync('userinfo') || app.globalData.userInfo 
      this.setData({
        userInfo: userInfo
      })
      if(userInfo.isVip==1){
        this.setData({
          vipInfo: true
        })
      }else{
        this.getVipPrice();
      }
      let qrcodeBase = wx.getStorageSync('qrcode');
      let qrcode = wx.getStorageSync('vipqrcode');
      if (qrcode) {
        this.setData({ qrcode: qrcode, qrcodeBase: qrcodeBase })
      } else {
        let request = new Request()
        request.setConfig('responseType', 'arraybuffer')
        request.get('qr/invite', res => {
          let qrcode = res
            qrcode = 'data:image/png;base64,' + wx.arrayBufferToBase64(res);
            let qrcodeBase = wx.arrayBufferToBase64(res).replace(/[\r\n]/g, '')
          this.setData({ qrcode: qrcode, qrcodeBase: qrcodeBase })
          wx.setStorage({
            key: 'vipqrcode',
            data: qrcode
          })
          wx.setStorage({
            key: 'qrcode',
            data: qrcodeBase
          })
        }).showLoading()
      }
    },
    getVipPrice(){
      request.get('user/getVipParam', res => {
          this.setData({ price: res.data.price })
        }).showLoading();
    },
    onShow(){
     
    },
    selectOne(){
      let vipInfo = !this.data.vipInfo;
      this.setData({
        vipInfo: vipInfo
      })
    },
    showInfo(){
      wx.navigateTo({
        url: './info/index'
      })
    },
    buyVip (){
      if (!this.data.vipInfo){
        toast('请勾选会员协议')
        return
      }
      let data = {
        share_user_id: ''
      }
      request.post('user/applyVip', res => {
        if(res.success){
          let params = res.data.wxparam
          params.success = () => {
            toast('提交成功')
            app.wxlogin('', ()=>{
              wx.switchTab({
                url: 'pages/index/index'
              })
            })
          },
          params.fail = () => {
            toast('支付失败');
          }

          wx.requestPayment(params)
        }else{
          toast(res.msg)
        }
      }, data).showLoading()

    },
    showCord(){
      if(this.data.userInfo.isVip==0){
          toast('亲 你还没有成为iME会员 无法保存分享iME会员金卡哦')
      }else{
        this.setData({
          storeQr: true
        })
        if(this.data.storeQr){
          wx.nextTick(() => {
            this.draw()
          })
        }
      }
    },
    toggleCardHide(){
      this.setData({
        storeQr: false
      })
      
    },
    draw () {
      let userInfo = app.globalData.userInfo
      let avatar = userInfo.avatar
      let self = this
      const query = wx.createSelectorQuery()
      query.select('#canvas-vipcrde').boundingClientRect()
      query.exec(function (res) {
        console.log(res)
        W = res[0].width
        H = res[0].height
        var ctx = wx.createCanvasContext('vipcrde')
        // ctx.setFillStyle('#DBB972')
        // ctx.setGlobalAlpha(0)
        // ctx.clearColor(1,1,1,0);
        // renderer = new THREE.WebGLRenderer({
        //   canvas: canvas,
        //   antialias: true
        // });
        ctx.fillRect(0, 0, W, H)
        ctx.draw(true)

        wx.getImageInfo({
          src: '/assets/images/vip/vip_crde1.png',
          // src: this.data.assetsImages + 'vip/vip_crde1.png',
          success(res) {
            console.log(res.width);
            console.log(res.height);
            let imgH = res.height/res.width*W
            ctx.drawImage('/assets/images/vip/vip_crde1.png', 0, 0, res.width, res.height, 0, 0 , W, imgH)
            // ctx.drawImage(this.data.assetsImages + 'vip/vip_crde1.png', 0, 0, res.width, res.height, 0, 0 , W, imgH)
            ctx.draw(true)

            ctx.beginPath();
            ctx.arc( rpxTopx(591), rpxTopx(320), rpxTopx(60),0,360,false);
            ctx.fillStyle="#ffffff";//填充颜色,默认是黑色
            ctx.fill();//画实心圆
            ctx.closePath();
            ctx.draw(true)
          }
        })

        wx.getImageInfo({
          src: avatar,
          success: function (res) {
            console.log(res.width);
            console.log(res.height);
            let imgW = rpxTopx(res.width)
            let imgH = rpxTopx(res.height)
            




            ctx.save();


            ctx.arc(W / 2, rpxTopx(27) + rpxTopx(106) / 2, rpxTopx(53), 0, 2*Math.PI);
            ctx.fillStyle="#FFEAB5";//填充颜色,默认是黑色
            ctx.fill();//画实心圆
            ctx.closePath();
            ctx.draw(true)


            ctx.beginPath();
            // 下面是先定位要开个圆形的位置，50 和 90 分别就是圆的圆心的 x 坐标和 y 坐标，25 是半径，后面的两个参数就是起始和结束，这样就能画好一个圆了
            // 1:圆心的 x 坐标,2:圆心的 y 坐标,3:圆的半径,4/5起始弧度
            // ctx.arc(rpxTopx(ctx.drawImage), rpxTopx(235), rpxTopx(60), 0, 2*Math.PI);
            // ctx.closePath();
            // 下面就裁剪出一个圆形了，且坐标在 （50， 90）
            // ctx.clip();
            // ctx.drawImage(res.path, 0, 0), rpxTopx(res.width),rpxTopx(res.height),rpxTopx(100),rpxTopx(100),rpxTopx(100),rpxTopx(100));
            

            ctx.arc(W / 2, rpxTopx(30) + rpxTopx(100) / 2, rpxTopx(50), 0, 2*Math.PI);
            // ctx.fillStyle="#ffffff";//填充颜色,默认是黑色
            // ctx.fill();//画实心圆
            ctx.closePath();
            // 下面就裁剪出一个圆形了，且坐标在 （50， 90）
            ctx.clip();
                
            ctx.drawImage(res.path, 0, 0, res.width, res.height, W / 2 - rpxTopx(100) / 2, rpxTopx(30) ,rpxTopx(100),rpxTopx(100));
            // ctx.drawImage(res.path, rpxTopx(280), rpxTopx(140), rpxTopx(res.width),rpxTopx(res.height),rpxTopx(100),rpxTopx(100));

            ctx.restore();
            ctx.draw(true);

            // 画昵称
            ctx.setFillStyle('#FFFACD')
            ctx.setFontSize(rpxTopx(24))
            ctx.fillText(userInfo.nickname,(W - ctx.measureText(userInfo.nickname).width) * 0.5 ,rpxTopx(162));
            // ctx.fillText(userInfo.nickname, rpxTopx(0), rpxTopx(142))
            ctx.draw(true)
            
            // 画id
            ctx.setFillStyle('#FBEBC7')
            ctx.setFontSize(rpxTopx(24))
            ctx.fillText('NO’'+userInfo.user_id, rpxTopx(231), rpxTopx(349))
            ctx.draw(true)

          }
        })


        let d = new Date()
        const fsm = wx.getFileSystemManager()
        const filePath = `${wx.env.USER_DATA_PATH}/` + d.getTime() + '.png'
        const buffer = wx.base64ToArrayBuffer(self.data.qrcodeBase)
        fsm.writeFile({
          filePath,
          data: buffer,
          encoding: 'binary',
          success() {
            wx.getImageInfo({
              src: filePath,
              success: (res) => {
                let imgW = rpxTopx(res.width)
                let imgH = rpxTopx(res.height)

                let qrSize = rpxTopx(288)
                ctx.drawImage(res.path, 0, 0, res.width, res.height, rpxTopx(538), rpxTopx(267),rpxTopx(106),rpxTopx(106));
                // ctx.drawImage(res.path, 0, 0, 280, 280, W / 2 - qrSize / 2, rpxTopx(444),rpxTopx(100),rpxTopx(100))
                ctx.draw(true)
              }
            })
          }
        })


      })
    },


    saveCard1() {
      let self = this
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: W,
        height: H,
        canvasId: 'vipcrde',
        success(res) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              toast('您的iME会员金卡已保存到相册')
              self.toggleCardHide()
            },
            fail() {
              toast('保存失败')
            }
          })
        }
      })

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

      var data = encodeURIComponent('?f=i&iv=' + app.globalData.userInfo.user_id)
      console.log(data);
      
      return {
        path: '/pages/index/index?scene=' + data,
        title : '成为iME会员，每天不管在哪里都是会员价！全平台！全商家！超优惠！'
      }
    }

  },
})
