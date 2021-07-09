import {
    Request,
    toast,
    navToIyou
} from '../../utils/util.js'

let request = new Request()
let app = getApp()
Component({

    /**
     * 页面的初始数据
     */
    data: {
        showlink: 1,
        url: 'https://mp.weixin.qq.com/s/Qmb1KZ1cLA-K4qXIGgv9AA',
        showBindMobileModel: false,
        userType: 1,
        numbers: {},
        orderCount: {
            waitPayNum: 0,
            waitReceiveNum: 0,
            waitSendNum: 0,
            hasDoneNum: 0,
        },
        orderCount2: {
            waitPayNum: 0,
            waitReceiveNum: 0,
            waitSendNum: 0,
            hasDoneNum: 0,
        },
        userInfo: {
            avatar: '',
            nickname: ''
        },

        setUrl: '',
        shangjiaManageList: [
            {
                image: '../../assets/images/user/shanghu@2x.png',
                text: '商户设置',
                url: '/pages/merchant/index',
            },
            {
                image: '../../assets/images/user/chanpin@2x.png',
                text: '产品管理',
                url: '/pages/goodsManage/index',
            },
            {
                image: '../../assets/images/user/dingdan@2x.png',
                text: '订单管理',
                url: '../../packages/pack-A/pages/order/index',
            },
            {
                image: '../../assets/images/user/yonghu@2x.png',
                text: '用户管理',
                url: '../../packages/pack-A/pages/user/userManageMent/index',
            },
            {
                image: '../../assets/images/user/zuling@2x.png',
                text: '我的租赁',
                url: '../../packages/pack-A/pages/myRenting/index',
            },
            {
                image: '../../assets/images/user/qiugou@2x.png',
                text: '我的求购',
                url: '../../packages/pack-A/pages/myAskBuy/index',
            },
            {
                image: '../../assets/images/user/yingxiao@2x.png',
                text: '营销管理',
                url: '/pages/marketing/index',
            },
            {
                image: '../../assets/images/user/dianpu@2x.png',
                text: '店铺数据',
                url: '/packages/pack-A/pages/order/quantity/index',
            },
            {
                image: '../../assets/images/user/gongyinglian@2x.png',
                text: '供应链名片',
                url: '',
            }
        ],
        personManageList: [
            {
                image: '../../assets/images/user/homepage@2x.png',
                text: '个人主页',
                url: '/pages/merchant/index',
            },
            {
                image: '../../assets/images/user/shoucang@2x.png',
                text: '收藏夹',
                url: '/pages/collection/index',
            },
            {
                image: '../../assets/images/user/tongxunlu@2x.png',
                text: '通讯录',
                url: '/pages/mailList/index',
            },
            {
                image: '../../assets/images/user/liulan@2x.png',
                text: '浏览历史',
                url: '/pages/browse/index',
            },
            {
                image: '../../assets/images/user/dianzan@2x.png',
                text: '点赞',
                url: '',
            },
            {
                image: '../../assets/images/user/address@2x.png',
                text: '地址管理',
                url: '/pages/deliveryAddress/index',
            },
            {
                image: '../../assets/images/user/remark@2x.png',
                text: '建议留言',
                url: '',
            },
            {
                image: '../../assets/images/user/rebate@2x.png',
                text: '返利小金库',
                url: '',
            },
            {
                image: '../../assets/images/user/lesson@2x.png',
                text: 'iME课堂',
                url: '',
            },
            {
                image: '../../assets/images/user/record@2x.png',
                text: '拿货记录',
                url: '../../packages/pack-A/pages/myAskBuy/index',
            },
            {
                image: '../../assets/images/user/setting@2x.png',
                text: '设置',
                url: '',
            },
            {
                image: '../../assets/images/user/contact@2x.png',
                text: '联系我们',
                url: '',
            },
            {
                image: '../../assets/images/user/jifen@2x.png',
                text: '积分',
                url: '',
            }
        ]
    },
    methods: {
        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {},
        onShow() {
            request.setMany(true);
            let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo;
            if (userInfo) {
                this.setData({
                    userInfo: userInfo,
                    userType: userInfo.user_type
                })
            }
            this.getOrderCount(1);
            if (this.data.userType == 2) {
                this.getOrderCount(2);
            }
        },
        getOrderCount(type) {
            request.get('order/getOrderCount', res => {
                if (res.success) {
                    let orderCount = res.data.info;
                    if (type == 1) {
                        this.setData({
                            orderCount: orderCount
                        })
                    } else if (type == 2) {
                        this.setData({
                            orderCount2: orderCount
                        })
                    }
                } else {
                    toast(res.msg)
                }
            }, { type: type })
        },
        toMyPage() {
            app.requireLogin(`/pages/homepage/index?userId=${this.data.userInfo.user_id}`)
        },
        operate(e) {
            console.log(e);
            app.requireLogin(e.currentTarget.dataset.url)
        },

        close() {
            this.setData({
                showBindMobileModel: false
            })
        },
        getPhoneNumber(e) {
            this.setData({
                showBindMobileModel: false
            })
            if (e.detail.errMsg === 'getPhoneNumber:ok') {
                request.post('bindMobile', res => {
                    if (res.success) {
                        app.reloadUserInfo(() => {
                            app.globalData.userInfo = wx._getStorageSync('userinfo')
                            toast('授权成功')
                            console.log(this.data.setUrl)
                            wx.navigateTo({
                                url: this.data.setUrl
                            })
                        })
                    } else {
                        toast(res.msg)
                    }
                }, e.detail)
            }
        },
        isAuth_(e) {
            let userInfo = wx._getStorageSync('userinfo')
            if (!userInfo.nickname || !userInfo.isAuth) {
                wx._setStorageSync("nav_key", 'swit')
                app.requireLogin('/pages/user/index')
                return
                // }else if(!userInfo.isAuth) {
                // 	this.setData({
                // 		showBindMobileModel: true,
                // 		setUrl: e.currentTarget.dataset.url
                // 	})
                // 	return
            } else {
                console.log(e)
                app.requireLogin(e.currentTarget.dataset.url)
            }
        },
        development_() {
            toast('此功能陆续开放中...')
        },
        toWallet() {
            let userInfo = wx._getStorageSync('userinfo')
            if (!userInfo.nickname || !userInfo.isAuth) {
                wx._setStorageSync("nav_key", 'swit')
                app.requireLogin('/pages/user/index')
                    // this.setData({
                    // showBindMobileModel: true,
                    // setUrl: e.currentTarget.dataset.url
                    // })
                return
            }
            app.requireLogin('/pages/wallet/index')
        },
        toUnivercity(e) {
            let url = e.currentTarget.dataset.url
            wx.navigateTo({ url: `/pages/webview/webview?url=${this.data[url]}` });
        },
        isToOrder(options) {
            let userInfo = wx._getStorageSync('userinfo');
            if (options.q) {
                if (userInfo.user_type == 2) {
                    console.log(options)
                    let q = options.q;
                    q = decodeURIComponent(q)
                    let urlData = app.geturlData(q);
                    if (urlData && urlData.store_id && urlData.store_id == userInfo.user_id) {
                        console.log(options)
                        wx.navigateTo({
                            url: '../../packages/pack-A/pages/order/detail/index' + '?q=' + encodeURIComponent(q)
                        })
                    } else {
                        toast('老板，该订单不是您商家的订单哦！');
                    }
                } else {
                    toast('亲，只有商家才能扫码进去赚钱哦！');
                }
            }
        },
        getqr() {
            let that = this;
            wx.scanCode({
                success(res) {
                    console.log(res)
                        // toast(res.result);
                    that.isToOrder({ q: res.result })
                        //    wx.navigateTo({
                        //   url: '../../packages/pack-A/pages/order/detail/index'+'?q='+encodeURIComponent(res.result)
                        // })
                        // that.setData({ result: res.result });
                        // wx.showToast({
                        //   title: res.result,
                        //   icon: 'none',
                        //   duration: 5000
                        // });
                },
                fail(err) {
                    wx.showToast({
                        title: '扫码失败',
                        icon: 'none',
                        duration: 2000
                    })
                    console.log(err)
                }
            })
        },
        navToIyou
    },
    pageLifetimes: {
        show() { //获取位置
            if (typeof this.getTabBar === 'function' &&
                this.getTabBar()) {
                this.getTabBar().setData({
                    selectedIndex: 4
                })
            }
            // if (!app.globalData.userNumber) {
            request.get('user/number', res => {
                    app.globalData.userNumber = res.data
                    this.setData({
                        numbers: res.data
                    })
                })
                // }
        }
    }
})