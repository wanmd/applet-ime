// pages/merchant/index.js
import { Request, timestampToTime, rpxTopx, toast } from '../../utils/util.js'
let app = getApp()
let W = 0
let H = 0
wx.Page({

  /**
   * 页面的初始数据
   */
  data: {
    showQr : false,
    storeQr : '',
    user:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let userinfo = wx.getStorageSync('userinfo')
    console.log(userinfo);
    
    let t = new Date()
    let m = (1 + t.getMonth())<10?'0'+ (1 + t.getMonth()):(1 + t.getMonth())
    let d = t.getDate() < 10 ?  '0' + t.getDate() : t.getDate() 
    let cut = t.getFullYear() + '-'  + m + '-' + d
    let t1 = timestampToTime(userinfo.merchant_begin)
    let t2 = timestampToTime(userinfo.merchant_annual_expire)
    this.setData({
      annual_expire:t2.ymd,
      begin_time:userinfo.merchant_begin==0?cut:t1.ymd,
      user: userinfo
    })
  },
  closeStroe() {
    console.log(1111);
    
    wx._showToast('功能升级中')
  },
  development_(){
    toast('此功能陆续开放中...')
  },
  closeMark(){
    this.setData({showQr:false})
  },
  toggleCardHide() {
    this.closeMark()
  },
  getStoreQr () {
    let req = new Request()
    req.setConfig('responseType', 'arraybuffer')
    req.get('qr/store', res => {
      this.closeMark()
      let qrcode = wx.arrayBufferToBase64(res).replace(/[\r\n]/g, '')
      this.setData({ storeQr: qrcode, showQr: true })
      wx.nextTick(() => {
        this.draw1()
      })
    },{storeId:this.data.storeId}).showLoading()
  },
  /**
   * canvas绘图相关，把文字转化成只能行数，多余显示省略号
   * ctx: 当前的canvas
   * text: 文本
   * contentWidth: 文本最大宽度
   * lineNumber: 显示几行
   */
  transformContentToMultiLineText(ctx, text, contentWidth, lineNumber) {
    if(!text) return [''];
    var textArray = text.split(""); // 分割成字符串数组
    var temp = "";
    var row = [];

    for (var i = 0; i < textArray.length; i++) {
      if (ctx.measureText(temp).width < contentWidth) {
        temp += textArray[i];
      } else {
        i--; // 这里添加i--是为了防止字符丢失
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);
    // 如果数组长度大于2，则截取前两个
    if (row.length > lineNumber) {
      var rowCut = row.slice(0, lineNumber);
      console.log(rowCut)
      var rowPart = '';
      if(rowCut.length<=1){
        rowPart = rowCut[0];
      }else{
        rowPart = rowCut[1];
      }
      var test = "";
      var empty = [];
      for (var a = 0; a < rowPart.length; a++) {
        if (ctx.measureText(test).width < contentWidth) {
          test += rowPart[a];
        } else {
          break;
        }
      }
      empty.push(test); // 处理后面加省略号
      var group = empty[0] + '...'
      rowCut.splice(lineNumber - 1, 1, group);
      row = rowCut;
    }
    return row;
  },
  draw1() {
    let qrcode = this.data.storeQr
    let userInfo = this.data.user
    let avatar = userInfo.avatar
    let nickname = userInfo.nickname
    let remark = userInfo.remark
    let self = this
    const query = wx.createSelectorQuery()
    query.select('#canvas-modal1').boundingClientRect()
    query.exec(function (res) {
      W = res[0].width
      H = res[0].height
      var ctx = wx.createCanvasContext('firstCanvas1')
      ctx.setFillStyle('#FFE200')
      ctx.fillRect(0, 0, W, H)
      ctx.draw(true)
      // 画背景
      wx.getImageInfo({
        src: '/assets/images/bg_goods@2x.png',
        success(res) {
          ctx.drawImage('/assets/images/bg_goods@2x.png', 0, 0, res.width, res.height, 0, 0, rpxTopx(676), rpxTopx(1000))
          ctx.draw(true)

          ctx.beginPath();
          ctx.arc(rpxTopx(340),rpxTopx(730),rpxTopx(160),0,360,false);
          ctx.fillStyle="#ffffff";//填充颜色,默认是黑色
          ctx.fill();//画实心圆
          ctx.closePath();
          ctx.draw(true)
        }
      })
			// 画头像
      wx.getImageInfo({
        src: avatar,
        success: function (res) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(rpxTopx(100), rpxTopx(80), rpxTopx(50), 0, 2*Math.PI);
          ctx.closePath();
          // 下面就裁剪出一个圆形了，且坐标在 （50， 90）
          ctx.clip();
          ctx.drawImage(res.path, rpxTopx(50), rpxTopx(30), rpxTopx(100), rpxTopx(100));
          ctx.restore();
          ctx.draw(true);
          // 画昵称
          ctx.setFillStyle('#333333')
          ctx.setFontSize(rpxTopx(32))
          var nickname_ = self.transformContentToMultiLineText(ctx, nickname, rpxTopx(320), 1);
          let nickname_length = nickname_[0].length;
          let nickname_txt = nickname;
          if(nickname_length<nickname.length) nickname_txt = nickname.substring(0,nickname_length)+'...';
          ctx.fillText(nickname_txt, rpxTopx(170), rpxTopx(72))
          ctx.draw(true)

          ctx.setFillStyle('#333333')
          ctx.setFontSize(rpxTopx(24))
          var remark_ = self.transformContentToMultiLineText(ctx, remark, rpxTopx(320), 1);
          let remark_length = remark_[0].length;
          let remark_txt = remark;
          if(remark_length<remark.length) remark_txt = remark.substring(0,remark_length)+'...';
          ctx.fillText(remark_txt, rpxTopx(170), rpxTopx(112))
          ctx.draw(true)
        }
      })


      // 画二维码
      let d = new Date()
      const fsm = wx.getFileSystemManager()
      const filePath = `${wx.env.USER_DATA_PATH}/` + d.getTime() + '.png'
      const buffer = wx.base64ToArrayBuffer(qrcode)
      fsm.writeFile({
        filePath,
        data: buffer,
        encoding: 'binary',
        success() {
          wx.getImageInfo({
            src: filePath,
            success: (res) => {  
              // let qrSize = rpxTopx(288)
              let qrSize = rpxTopx(300)
              ctx.drawImage(res.path, 0, 0,res.width,res.height,rpxTopx(190), rpxTopx(580), qrSize, qrSize)
              // ctx.drawImage(res.path, 0, 0,280, 280,  W / 2 - qrSize / 2 - rpxTopx(10), rpxTopx(570), qrSize, qrSize)
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
      canvasId: 'firstCanvas1',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '已下载至相册',
              icon: 'success',
              duration: 1500
            })
            self.setData({showQr:false})
            // self.toggleCard1()
          },
          fail() {
            toast('保存失败')
          }
        })
      }
    })
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

  }
})