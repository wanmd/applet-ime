// custom-tab-bar/index.js
Component({

  properties: {
    scene : {
      type : String,
      value : ''
    },
    current : {
      type : Number,
      value : -1
    }
  },

  data: {
    selectedIndex : 0,
    tabList : [
      {
        text : '首页',
        name : 'home',
        pagePath: "/pages/index/index",
        iconPath: "./images/home.png",
        selectedIconPath: "./images/home_act.png"
      },
      {
        text: '动态',
        name: 'dynamics',
        pagePath: "/pages/dynamics/index",
        iconPath: "./images/dynamics.png",
        selectedIconPath: "./images/dynamics_act.png"
      },
      {},
      {
        text: '购物车',
        name: 'dynamics',
        pagePath: "/pages/cart/index",
        iconPath: "./images/cart.png",
        selectedIconPath: "./images/cart_act.png"
      },
      {
        text: '我的',
        name: 'user',
        pagePath: "/pages/user/index",
        iconPath: "./images/user.png",
        selectedIconPath: "./images/user_act.png"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab (e) {
      const index = Number(e.currentTarget.dataset.index)
      if (index == this.properties.current){
        return
      }
      let tab = this.data.tabList[index]
      wx.reLaunch({
        url: tab.pagePath
      })
      
    },

    publish () {
      wx.navigateTo({
        url: '/pages/publish/type/index'
      })
    }
  }
})
