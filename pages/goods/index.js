import { Request, toast, formatDate, alert, fileUrl, rpxTopx, maskNumber } from '../../utils/util.js'
import { ALIYUN_URL } from '../../utils/config.js'
let W, H = 0
let request = new Request()
let app = getApp()
wx.Page({

  data: {
    ALIYUN_URL: ALIYUN_URL,
    chatId : 89,
    sharer: 0,
    chat : {
      user : {}
    },
    height : {},
    currentIndex : 0,
    picture : [],
    formId : '',
    qrcode : '',
    showCard : false,
    userType: 1,
    showSelectShareType : 0,

    showGoodsQr : false,
    showlink:0,
    wechat:'',
    phone:'',
    goodsProductFlag: false,

    productNum: 1,

    buyBtnType: null,
    hintVal: '',
    shareUserId: '',
    padd_r270: false,
    storeCommonParam: null,
    showShopCarPop: !true,
    goods_id: null,
    user: '',
    needSelectType: true, //需不需要再进行操作按钮选择
    type: ''
  },
  onLoad: function (opts) {
    console.log("goods=======opts");
    console.log(opts);
    let pages = getCurrentPages()
    let page = pages[pages.length - 1]
    let path = '/'+page.route+'?flag=goods'
    let options = ''
    for(let k in opts) {
      options+='&'+k + '=' + opts[k] 
    }
    path+=options
    if(opts.shareUserId){
      path+= '&shareUserId='+opts.shareUserId
      app.wxlogin()
    }
    console.log(path);
    this.setData({
      path:path,
      chatId:opts.chatId
    })
    request.setMany(true)
    this.getGoodsDetail(this.data.chatId)
    this.addVisitGoods(this.data.chatId)
    this.getShareChatDetail()
    request.setMany(false)
    if(opts.dst === 'share') {
      this.setData({
        sharer:opts.sharer||0
      })
    }
    // console.error(opts.shareUserId)
    let userInfo =  wx.getStorageSync('userinfo') || app.globalData.userInfo 
    this.setData({
      userInfo: userInfo
    })
    if(opts&& opts.shareUserId) {
      this.setData({
        shareUserId: opts.shareUserId
      })
    }
  },
  onShow() {

    let userInfo =  wx.getStorageSync('userinfo') || app.globalData.userInfo 
    if(userInfo){
      if(this.data.shareUserId){
        app.wxlogin()
      }
      this.setData({
        userType: userInfo.user_type
      })

    }else{
       app.reloadUserInfo(() => {
        let userInfo =  wx.getStorageSync('userinfo') || app.globalData.userInfo 
        this.setData({
          userType: userInfo.user_type
        })
       })
    }
  },
  isAuth_(e) {
    if(!this.isToLogin()) return;
        app.requireLogin(e.currentTarget.dataset.url)
  },
  isAuth1_(e) {
    if(!this.isToLogin()) return;
  },
  getStoreCommonParam(user_id){
    // request.get('user/getStoreCommonParam', res => {
    //   if(res.success){
    //     this.setData({storeCommonParam : res.data})
    //   }else{
    //     toast(res.msg)
    //   }
    // }).showLoading()
    request.get('user/getStoreParam', res => {
      if(res.success){
        this.setData({storeCommonParam : res.data.info})
      }else{
        // toast(res.msg)
      }
    }, { user_id: user_id}).showLoading()
  },
  getGoodsDetail(chatId){
    request.get('chat/chat', res => {
      if(res.success){
        let data = res.data
        if(!(data.user instanceof Object)) {
          data.user = JSON.parse(data.user)
        }
        if (!Array.isArray(data.picture)) {
          data.picture = JSON.parse(data.picture)
        }
        let storeCommonParam =  data.buyNotice || null;
        data.price = (data.isAgent && data.chat_type != 5) ? data.agent_price: data.sale_price;
        data.agent_price = (!data.isAgent && !this.data.userType.isVip) ? maskNumber(data.agent_price) : data.agent_price;
        
        this.setData({chat : data, storeCommonParam: storeCommonParam, goods_id: data.product_id, user: JSON.stringify(data.user)})
        if(this.data.chat.chat_type==5 || (this.data.shareUserId!=''&&this.data.shareUserId!='0')){
          this.setData({
            padd_r270: true
          })
        }
        // this.getStoreCommonParam(data.user.user_id)
      }else{
        if(res.code == 404){
          wx._showAlert({
              content:res.msg,
              success(res){
              wx._navigateBack()
            }
          })
        }else{
          toast(res.msg)
        }
      }
    }, { id: chatId}).showLoading()
  },
  addVisitGoods(chatId){
    request.post('user/addVisitGoods', res => {
      if(res.success){
        console.log(res.success)
      }else{
          toast(res.msg)
      }
    }, { chatId: chatId}).showLoading()
  },
  getShareChatDetail(){
    let sharer = parseInt(this.data.sharer || 0)
    let userId = app.globalData.userInfo && app.globalData.userInfo.user_id
    if (sharer != userId) {
      //不是自己分享出去的
      request.post('chat/grabShareAmount', res => {

      }, { chatId: this.data.chatId, sharer: sharer})
    }
  },
  capy(e){
    let content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      data: content,
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  callNumPhone(e){
    let pnum = e.currentTarget.dataset.phone
    if(pnum=='') {
      wx._showToast('号码为空');
      return
    }
    wx.makePhoneCall({
      phoneNumber: pnum
    })
  },
  previewImage (e) {
    let img = e.currentTarget.dataset.img;
    let imgs = e.currentTarget.dataset.imgs;
    let urls = []
    let url = ALIYUN_URL + '/' + img
    for(let i=0;i<imgs.length;i++){
      let curl = ALIYUN_URL + '/' + imgs[i]
      urls.push(curl)
    }
    wx.previewImage({
    current: url,
    urls: urls 
    })
  },
  linkTa(){
    this.setData({showlink:1})
  },
  hideMark(){
    this.setData({showlink:2})
  },
  isToLogin(){
    let userInfo = wx._getStorageSync('userinfo')
    if (!userInfo.nickname||!userInfo.isAuth) {
      app.requireLogin(this.data.path)
      return false;
    }else{
      return true;
    }
  },
  toggleSelectShareType () {
    if(!this.isToLogin()) return;
    var show = this.data.showSelectShareType
    // this.setData({ showSelectShareType : !show})
    if(show==1){
      show = 2
    }else{
      show = 1
    }
    this.setData({ showSelectShareType : show});
    return ;
  },

  toggleCard () {
    var showCard = this.data.showCard
    this.setData({ showCard: !showCard})
    if (!showCard) {
      this.closeMark()
      wx.nextTick(() => {
        this.card()
      })
    }
  },
  toggleCardHide (){
    this.setData({ storeQr: '' ,showCard:false})
  },
  card () {
    if (this.data.qrcode === '') {
    let userInfo =  wx.getStorageSync('userinfo') || app.globalData.userInfo 
      // let data = { chatId: this.data.chatId, shareUserId: userInfo.user_id };
      let data = { chatId: this.data.chatId};
      // if(this.data.shareUserId!=''&&this.data.shareUserId!=0) data.shareUserId = this.data.shareUserId;
      let req = new Request()
      req.setConfig('responseType', 'arraybuffer')
      req.get('qr/chat', res => {
        let qrcode = wx.arrayBufferToBase64(res).replace(/[\r\n]/g, '')
        this.setData({ qrcode: qrcode })
        wx.nextTick(() => {
          this.draw()
        })
      }, data).showLoading()
    }else{
      this.draw()
    }
    
  },
  getTextWidth(text) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d"); 
    var metrics = context.measureText(text);
    return metrics.width;
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
  draw() {
    let qrcode = this.data.qrcode
    let chat = this.data.chat
    let pic = fileUrl(chat.cover)
    let userInfo = chat.user
    let avatar = userInfo.avatar
    let nickname = userInfo.nickname
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

      // 画头像
      wx.getImageInfo({
        src: avatar,
        success: function (res) {
          ctx.save();
          ctx.beginPath();
          // 下面是先定位要开个圆形的位置，50 和 90 分别就是圆的圆心的 x 坐标和 y 坐标，25 是半径，后面的两个参数就是起始和结束，这样就能画好一个圆了
          // 1:圆心的 x 坐标,2:圆心的 y 坐标,3:圆的半径,4/5起始弧度
          ctx.arc(rpxTopx(100), rpxTopx(100), rpxTopx(50), 0, 2*Math.PI);
          ctx.closePath();
          // 下面就裁剪出一个圆形了，且坐标在 （50， 90）
          ctx.clip();
          // drawImage
          // 1:path:
          // 2:需要绘制到画布中的，imageResource的矩形（裁剪）选择框的左上角 x 坐标
          // 3:需要绘制到画布中的，imageResource的矩形（裁剪）选择框的左上角 y 坐标
          // 4:需要绘制到画布中的，imageResource的矩形（裁剪）选择框的宽度
          // 5:需要绘制到画布中的，imageResource的矩形（裁剪）选择框的高度
          // 6:imageResource的左上角在目标 canvas 上 x 轴的位置
          // 7:imageResource的左上角在目标 canvas 上 y 轴的位置
          // 8:在目标画布上绘制imageResource的宽度，允许对绘制的imageResource进行缩放
          // 9:在目标画布上绘制imageResource的高度，允许对绘制的imageResource进行缩放
          ctx.drawImage(res.path, rpxTopx(50), rpxTopx(50), rpxTopx(100), rpxTopx(100));
          ctx.restore();
          ctx.draw(true);
        }
      })
      console.log(pic)
      // 画背景
      wx.getImageInfo({
        src: pic,
        success(res) {
          var w = 0
          var h = 0
          var l = 0
          var t = 0
          var baseSize = 504
          var baseSize_ = 504
          var w_h__bar = res.width/res.height;

          if(w_h__bar>1){
              h = baseSize
              w = h*w_h__bar
              l = (res.width-res.height)/2
              baseSize_ = res.height
          }else{
              w = baseSize
              h = w/w_h__bar
              t = (res.height-res.width)/2
              baseSize_ = res.width
          }
          // –drawImage(Imageimg,float sx,float sy,float sw,float sh,float dx,float dy,float dw,float dh)
          // •从sx、sy处截取sw、sh大小的图片，绘制dw、dh大小到dx、dy处
          ctx.drawImage(res.path, l, t, baseSize_, baseSize_, rpxTopx(120), rpxTopx(180), rpxTopx(baseSize), rpxTopx(baseSize))
          ctx.draw(true)
        }
      })
      // 画分享赚收益
      wx.getImageInfo({
        src: '/assets/images/iconbg@2x.png',
        success(res) {
          let __l = 460,
              __t = 70;
          // ctx.drawImage('/assets/images/iconbg@2x.png', 0, 0, res.width, res.height, rpxTopx(460), rpxTopx(100), rpxTopx(res.width/2), rpxTopx(res.height/2))
          ctx.drawImage('/assets/images/iconbg@2x.png', 0, 0, res.width, res.height, rpxTopx(__l), rpxTopx(__t), rpxTopx(res.width/2), rpxTopx(res.height/2))
          ctx.draw(true)

          ctx.setFillStyle('#ffffff')
          ctx.setFontSize(rpxTopx(22))
          // ctx.font=rpxTopx(22)+" Bebas";
          ctx.fillText('¥ '+chat.fina_sale_price, rpxTopx(__l+80), rpxTopx(__t+25))
          ctx.draw(true)
          ctx.setFillStyle('#ffffff')
          ctx.setFontSize(rpxTopx(18))
          ctx.fillText('分享赚收益', rpxTopx(__l+70), rpxTopx(__t+50))
          ctx.draw(true)
        }
      })
      

      // 画点赞
      wx.getImageInfo({
        src: '/assets/images/dianzan.png',
        success(res) {
          ctx.drawImage('/assets/images/dianzan.png', 0, 0, res.width, res.height, rpxTopx(20), rpxTopx(590), rpxTopx(res.width), rpxTopx(res.height))
          ctx.draw(true)
        }
      })
      // 画昵称
      ctx.setFillStyle('#333333')
      ctx.setFontSize(rpxTopx(24))

      var nickname_ = self.transformContentToMultiLineText(ctx, nickname, rpxTopx(180), 1);
      let nickname_length = nickname_[0].length;
      let nickname_txt = nickname;
      if(nickname_length<nickname.length) nickname_txt = nickname.substring(0,nickname_length)+'...';
      ctx.fillText(nickname_txt, rpxTopx(170), rpxTopx(90))
      ctx.draw(true)
      // 画分享推荐
      ctx.setFillStyle('#333333')
      ctx.setFontSize(rpxTopx(20))
      ctx.fillText('iME好物分享', rpxTopx(170), rpxTopx(120))
      ctx.draw(true)

      // 画底部二维码区域
      ctx.setFillStyle('#FFE200')
      ctx.fillRect(0, rpxTopx(730), W, H - rpxTopx(730))
      ctx.draw(true)
      // 画商品名称位置
      let text = []
      var goods_name = self.transformContentToMultiLineText(ctx, chat.goods_name, rpxTopx(200), 2);
      // console.log(goods_name)
     for(let i=0;i<goods_name.length;i++){
        let dirh = rpxTopx(750+ 40 * i) 
        ctx.setFillStyle('#333333')
        ctx.setFontSize(rpxTopx(28))
        ctx.fillText(goods_name[i], rpxTopx(50), dirh)
        ctx.draw(true)
     }
     // for(let i=0;i<chat.goods_name.length;i++){
     //   if(chat.goods_name.length<=12){
     //    text[0] = chat.goods_name
     //   }else if(chat.goods_name.length>12 && chat.goods_name.length<=24){
     //    text[0] = chat.goods_name.slice(0, 12)
     //    text[1] = chat.goods_name.slice(12, chat.goods_name.length)
     //   }else if(chat.goods_name.length>24){
     //    text[0] = chat.goods_name.slice(0, 12)
     //    text[1] = chat.goods_name.slice(12, 22) + '...'
     //   }
     // }
     // for(let i=0;i<text.length;i++){
     //   let dirh = rpxTopx(750+ 40 * i) 
     //    ctx.setFillStyle('#333333')
     //    ctx.setFontSize(rpxTopx(28))
     //    ctx.fillText(text[i], rpxTopx(50), dirh)
     //    ctx.draw(true)
     // }
      // 画商品价格
      ctx.setFontSize(rpxTopx(44))
      ctx.setFillStyle('#000000')
      ctx.fillText('￥' + chat.sale_price, rpxTopx(50), rpxTopx(860))
      ctx.draw(true)
      // 画标语
      ctx.setFillStyle('#333333')
      ctx.setFontSize(rpxTopx(24))
      ctx.fillText('好产品，分享赚，天天赚', rpxTopx(50), rpxTopx(910))
      ctx.draw(true)

      // 画微信扫码
      ctx.setFillStyle('#333333')
      ctx.setFontSize(rpxTopx(24))
      ctx.fillText('长按识别/微信扫码', rpxTopx(50), rpxTopx(950))
      ctx.draw(true)



      ctx.beginPath();
      ctx.arc(rpxTopx(520),rpxTopx(840),rpxTopx(130),0,360,false);
      ctx.fillStyle="#ffffff";//填充颜色,默认是黑色
      ctx.fill();//画实心圆
      ctx.closePath();
      ctx.draw(true)

      // 画二维码
      console.log(qrcode);
      
      let d = new Date()
      const fsm = wx.getFileSystemManager()
      const filePath = `${wx.env.USER_DATA_PATH}/` + d.getTime() + '.png'
      const buffer = wx.base64ToArrayBuffer(qrcode)
      console.log(qrcode)
      console.log(filePath)
      console.log(buffer)
      fsm.writeFile({
        filePath,
        data: buffer,
        encoding: 'binary',
        success() {
          wx.getImageInfo({
            src: filePath,
            success: (res) => {
              let qrSize = rpxTopx(240)
              ctx.drawImage(res.path, 0, 0, res.width, res.height, rpxTopx(400), rpxTopx(720), qrSize, qrSize)
              ctx.draw(true)
            }
          })
        }
      })
    })
  },
  longpress(e) {
    let content = e.currentTarget.dataset.content;
    wx.setClipboardData({
      //准备复制的数据
      data: content,
      success: function (res) {
        wx._showToast('已复制到粘贴板');
      }
    });
  },
  saveCard() {
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
            wx.showToast({
              title: '已下载至相册',
              icon: 'success',
              duration: 1500
            })
            // self.toggleCard()
          },
          fail() {
            toast('保存失败')
          }
        })
      }
    })

  },

  swiperChange (e) {
    this.setData({ currentIndex: e.detail.current})
  },
  imageLoad (e) {
    let index = e.currentTarget.dataset.index
    let height = app.systemInfo.windowWidth * e.detail.height / e.detail.width
    let update = {}
    update[`height[${index}]`] = height + 'px'
  let arr = []
  arr.push(update)
    this.setData(update)
  },
  addCart (e) {
    if(!this.isToLogin()) return;
    this.setData({ 
        buyBtnType : "addCart",
        goodsProductFlag : true
      })

    
  },
  unnowBuy (){
    this.setData({ 
        buyBtnType : null,
        goodsProductFlag : false
      })
  },
  nowBuy (e){
    if(!this.isToLogin()) return;
    this.setData({ 
        buyBtnType : "nowBuy",
        goodsProductFlag : true
    })
  },
  nowBuy2 (e){
    if(!this.isToLogin()) return;
    if(this.data.userInfo.isVip == 1){
      this.setData({ 
          buyBtnType : "nowBuy2",
          goodsProductFlag : true
      })
    }else{
      // toast('请购买会员')
      wx.navigateTo({
        url: '../../packages/pack-A/pages/vip/index',
      });
    }
  },
  input(e) {
    let hintVal = e.detail.value
    this.setData({hintVal: hintVal})
    // console.log(this.data.hintVal)
  },
  // 加入购物车
  confirm__1 (){
    this.unnowBuy.call(this)
    if(this.data.chat.chat_type==5){
      toast('砍价商品不支持加入购物车')
      return
    }
    let isAuth = app.isAuthWxInfo()
    if(!isAuth) {
      toast('需要授权获取您的用户信息')
      return
    }
    console.log("====cart/add======")
    console.log({id: this.data.chatId, remark: this.data.hintVal||'', shareUserId: this.data.shareUserId, quantity : this.data.productNum})
    request.post('cart/add', res => {
      if(res.success){
        toast('加入购物车成功')
      }else{
        toast(res.msg)
      }
    }, { id: this.data.chatId, remark: this.data.hintVal||'', shareUserId: this.data.shareUserId||0, quantity : this.data.productNum}).showLoading()
  },
  // 立即支付
  confirm__2 (){
    this.unnowBuy.call(this);
    let chatId = this.data.chatId,
        goodsNum = this.data.productNum,
        remark = this.data.hintVal||'';
        // merchantId = this.data.chat.user.user_id;
    wx.navigateTo({
      url: '../../packages/pack-A/pages/checkout/index?chatId=' + chatId + "&goodsNum=" + goodsNum + "&remark=" + remark + "&type=2&shareUserId=" + this.data.shareUserId + '&=1',
    });
    // toast('开始微信支付')
  },
  // 会员立即支付
  confirm__3 (){
    this.unnowBuy.call(this);
    let chatId = this.data.chatId,
        goodsNum = this.data.productNum,
        remark = this.data.hintVal||'';
        // merchantId = this.data.chat.user.user_id;
    wx.navigateTo({
      url: '../../packages/pack-A/pages/checkout/index?chatId=' + chatId + "&goodsNum=" + goodsNum + "&remark=" + remark + "&type=2&shareUserId=" + this.data.shareUserId + '&buyType=2',
    });
    // toast('开始微信支付')
  },
  //数量加减
  operaTap: function(e) {
    var flag = e.currentTarget.dataset.flag;
    let chnum = flag == '-' ? -1 : 1;
    let productNum = parseInt(this.data.productNum) + chnum;
    if (productNum < 1) {
      productNum = 1;
    }
    console.log(productNum)
    this.setData({
      productNum: productNum
    });
  },
  // 占位
  emptytap: function() {},
  //直接编辑数量
  upNumber: function(e) {
    var number = e.detail.value;
    var reg = /^[0-9]+$/;
    if (!reg.test(number) || number <= 0) {
      goods.quantity = goods_number; //恢复
      this.setData({ cartList: ret });
      this.total();
      wx._showAlert('请输入正整数');
      return false;
    }
    number = parseInt(number);
    this.setData({ productNum: number });
  },

  goOnBargain () {
    if(!this.isToLogin()) return;
    wx.navigateTo({
      url: '/pages/bargain/index?id=' + this.data.chat.bargain_id
    })
  },

  selectAddress(address) {
    setTimeout(() => {
      this.bargain(address.id)
    }, 500)
  },

  toBargain (e) {
    if(!this.isToLogin()) return;
    this.setData({ formId : e.detail.formId})
    let isAuth = app.isAuthWxInfo(`/pages/deliveryAddress/index?target=select&id=${this.data.chat.bargain_id}`)
    if(isAuth){
      wx.navigateTo({
        url: '/pages/deliveryAddress/index?target=select&id='+this.data.chat.bargain_id
      })
    }
  },

  bargain (addressId) {
    request.post('bargain/start', res => {
      if (res.success) {
        wx.navigateTo({
          url: '/pages/bargain/index?id=' + res.data.id,
          fail : function(e){
            console.log(e)
          },
          success : function(){
            console.log('success')
          }
        })
      } else {
        toast(res.msg)
      }
    }, { id: this.data.chatId, address: addressId, formId: this.data.formId}).showLoading()
  },
  closeMark(){
    this.setData({ showSelectShareType : 2})
  },

  getStoreQr () {
    let req = new Request()
    req.setConfig('responseType', 'arraybuffer')
    req.get('qr/store', res => {
      this.closeMark()
      let storeQr = wx.arrayBufferToBase64(res).replace(/[\r\n]/g, '')
      this.setData({ storeQr: storeQr})
      wx.nextTick(() => {
        this.draw1()
      })
    },{storeId:this.data.chat.user.user_id}).showLoading()
  },
  draw1() {
    let storeQr = this.data.storeQr
    let chat = this.data.chat
    let userInfo = chat.user
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
          // ctx.arc(rpxTopx(330),rpxTopx(710),rpxTopx(154),0,360,false);
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
      const buffer = wx.base64ToArrayBuffer(storeQr)
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
  onShareAppMessage: function () {
    var sceneStr = '?from=g&ci=' + this.data.chatId
    sceneStr += '=g&fi=' + app.globalData.userInfo.user_id
    var chatType = this.data.chat.chat_type
    if (chatType == 4) {
      let sharer = app.globalData.userInfo.user_id
      sceneStr += ('&sharer=' + sharer)
      sceneStr += '&dst=share'
    }

    sceneStr += ('&fromUserId=' + app.globalData.userInfo.user_id)

    // let path = '/pages/index/index?scene=' + encodeURIComponent(sceneStr)
    let path = '/pages/index/index?scene=' + encodeURIComponent(sceneStr)+'chatId=' + encodeURIComponent(this.data.chatId) + "&shareUserId=" + app.globalData.userInfo.user_id
    console.log(path);
    
    return {
      path: path,
      imageUrl: fileUrl(this.data.chat.picture[0]),
      title: this.data.chat.goods_name
    }
  },
  // 
  handleShowPop(e) {
    const { type } = e.currentTarget.dataset;
    const { chat } = this.data;
    console.log(chat);

    if(type === 'agent' && !chat.isAgent) {
      const { nickname, user_id } = chat ? chat.user : wx.getStorageSync('userinfo');
      wx.navigateTo({
        url: `/pages/applyAgent/index?storeId=${user_id}&storeName=${nickname}`,
      })
      return
    }
    
    this.setData({
      showShopCarPop: true,
      needSelectType: false,
      type
    })
  }
})