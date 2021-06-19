import { Request, toast, alert } from '../../utils/util.js'
let request = new Request()
let app = getApp()
wx.Page({

  /**
   * 页面的初始数据
   */
  data: {
    bargainId : 0,
    logList : [],
    bargain : {
      user : {
        
      }
    },
    chat : {},
    isEnd : false,
    expireTimeStr : '',
    id:'',
    path:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    if(opts&&opts.id){
      let pages = getCurrentPages()
      let page = pages[pages.length - 1]
      let path = '/'+page.route+'?id=' + opts.id
      this.setData({
        path:path,
        id:opts.id
      })
    }
  },
  onShow(){
    app.isAuthWxInfo(this.data.path)
    this.getbargainInfo(this.data.id)
    this.getHelpLog(this.data.id)
  },
  getbargainInfo(id) {
    request.setMany(true)
    request.get('bargain/bargain/' + id, res => {
      if(res.success) {
        let bargain = res.data.bargain
        if(bargain.user) {
          if(typeof bargain.user == 'string') {
            bargain.user = JSON.parse(bargain.user)
          }
        }else{ //自己的
          bargain.user = app.globalData.userInfo
        }
        let offset = res.data.chat.sale_price - res.data.chat.bargain_price //需要砍的
        let _price = res.data.chat.sale_price - bargain.current_price //已经砍的了
        bargain.progress = _price / offset * 100
        
        let expireTime = bargain.expire

        if (expireTime > 0 && bargain.status == 0) { //未过期，进行中
          let interval = setInterval(() => {
            expireTime --
            if (expireTime == 0) {
              clearInterval(interval)
              this.setData({ isEnd: true })
              return
            }

            let h = Math.floor(expireTime / 3600)
            let m = Math.floor((expireTime - h * 3600) / 60)
            let s = expireTime - h * 3600 - m * 60
            this.setData({ expireTimeStr : h + '小时' + m + '分钟' + s + '秒'})
          }, 1000)
        }else{
          this.setData({ isEnd : true})
        }
        this.setData({ bargain: bargain, chat: res.data.chat})
      }else{
        toast(res.msg)
      }
    }).showLoading()
  },
  getHelpLog(id) {
    request.get('bargain/helpLog/' + id, res => {
      if(res.success) {
        let list = res.data.list
        list.forEach(row => {
          if(typeof row.user == 'string') {
            row.user = JSON.parse(row.user)
          }
        })
        this.setData({ logList : res.data.list})
      }
    })
    request.setMany(false)
    this.setData({ bargainId : id})
  },
  bargain () {
    request.post('bargain/help/' + this.data.bargainId, res => {
      if(res.success) {
        let amount = res.data.amount
        alert('帮忙砍了' + amount + '元')
        let bargain = this.data.bargain
        bargain.isHelp = true
        bargain.current_price = bargain.current_price * 1 - amount * 1

        let offset = this.data.chat.sale_price - this.data.chat.bargain_price //需要砍的
        let _price = this.data.chat.sale_price - bargain.current_price //已经砍的了
        bargain.progress = _price / offset * 100

        let logList = this.data.logList
        var user = app.globalData.userInfo
        logList.unshift({amount : amount, user : user})
        this.setData({ bargain: bargain, logList: logList})
      }else{
        toast(res.msg)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // let pages = getCurrentPages()
    // let page = pages[pages.length - 1]
    // console.log(page.route);
    
    // let to = encodeURIComponent('/' + page.route + '?id=' + this.data.bargainId)
    let url = encodeURIComponent('pages/bargain/index?id='+ this.data.bargainId)
    let path = '/pages/index/index?fromUserId='+app.globalData.userInfo.user_id+'&path=' + url 
    return {
      title : '亲！快帮我砍一刀，我特别喜欢这个宝贝！',
      path: path
    }
  }
})