let app = getApp()
wx.Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo : {},
    applyLists: [
      {imgUrl:'apply/apply_item1.png', height: '529rpx'},
      {imgUrl:'apply/apply_item2.png'},
      {imgUrl:'apply/apply_item3.png'},
      {imgUrl:'apply/apply_item4.png'},
      {imgUrl:'apply/apply_item5.png'},
      {imgUrl:'apply/apply_item6.png'},
    ],
    swiperOpt:{
      indicatorDots: false,
      vertical: false,
      autoplay: true,
      interval: 3000,
      duration: 500,
      bannerUrl: '/assets/images/apply/',
    },
    assetsImages: app.assetsImages,
    youshiList : [
      {
        'icon': 'ic_b_apply1.png',
        name: '微电商新机遇新营收',
        content: '成为iME商家，赋能流量生态，助力社交+社区+社群电商!'
      },
      {
        'icon': 'ic_b_apply2.png',
        name: '一体化智能小程序',
        content: '还去买千篇一律的微商城？！上货、推广、运营就是一个接一个的坑...\niME解决微商痛点，为商家提供拓客、拉新、产品相册、营销、交易收款一站式服务！'
      },
      {
        'icon': 'ic_b_apply3.png',
        name: '深度裂变8亿微信流量价值',
        content: 'iME赋能微信流量生态，助力社交+社区 + 社群电商一站式小程序，让您的产品和微信用户0距离。面对面！全面卖货！'
      },
      {
        'icon': 'ic_b_apply4.png',
        name: '全方位社交+社群+社区营销',
        content: 'iME依托用户为中心的社交关系链构建流量场景，做裂变的倍增器，从而形成高效成交转化和复购，让您利润翻番！'
      },
      {
        'icon': 'ic_b_apply5.png',
        name: '超级营销插件助力流量转化',
        content: '全功能超级营销工具，让您的产品运营如虎添翼！设计新颖产品玩法，触达每一个潜在用户！'
      },
      {
        'icon': 'ic_b_apply6.png',
        name: '招商加盟一键代理让您瞬间裂变',
        content: '如果您还在单打独斗的做微商，那您就用iMe！成为商家，开启招商代理权限功能，让您的微电商事业赋能全网招商加盟、一键代理，快速扩大渠道和出货量，瞬间做强做大！'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = app.globalData.userInfo?app.globalData.userInfo:wx._getStorageSync('userinfo')
    this.setData({ userInfo })
  },
  nav() {
    wx.navigateTo({
      url: '/pages/applyMerchantType/index',
    })
  }
})