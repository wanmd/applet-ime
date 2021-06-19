// custom-tab-bar/index.js
Component({

    properties: {

    },

    data: {
        selectedIndex: 0,
        tabList: [

            {
                text: '动态',
                name: 'dynamics',
                pagePath: "/pages/index/index",
                // iconPath: "./images/home.png",
                // selectedIconPath: "./images/home_act.png"
                iconPath: "./images/dynamics.png",
                selectedIconPath: "./images/dynamics_act.png"
            },
            {
                text: '报价',
                name: 'askBuy',
                pagePath: "/pages/dynamics/index",
                // iconPath: "./images/dynamics.png",
                // selectedIconPath: "./images/dynamics_act.png"
                iconPath: "./images/askBuy.png",
                selectedIconPath: "./images/askBuy_act.png"
            },
            {
                name: 'publish',
                iconPath: "./images/publish.png"
            },
            {
                text: '购物车',
                name: 'cart',
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
        switchTab(e) {
            const index = e.currentTarget.dataset.index;
            if (this.getTabBar().__data__.selectedIndex === index) return
            let tab = this.data.tabList[index]
            console.log(index);
            if (index == 3 || index == 1 || index == 0) {
                wx._setStorageSync("nav_key", 'swit')
                getApp().requireLogin(tab.pagePath);
                return
            }
            wx.switchTab({
                url: tab.pagePath,
                success: () => {
                    this.setData({
                        selectedIndex: index
                    })
                }
            })

        },

        publish() {
            let url = '/pages/publish/type/index'
            getApp().requireLogin(url)
        }
    }
})