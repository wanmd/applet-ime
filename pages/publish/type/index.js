import { Request, toast } from '../../../utils/util.js'
import { assetsImages, ALIYUN_URL } from '../../../utils/config.js'
let request = new Request()
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userType: 0,
        baseUrl: ALIYUN_URL,
        assetsImages: assetsImages,
        guide: 'https://mp.weixin.qq.com/s/_fLRUdoOGAzdlgXwsVyQOQ',
        indexBannerList: [{
                url: '/applet-static/images/apply/banner-3.png',
            },
            {
                url: '/applet-static/images/apply/banner-4.png',
            }
        ],
        url: 'https://mp.weixin.qq.com/s/Qmb1KZ1cLA-K4qXIGgv9AA',
    },
    onLoad: function(options) {
        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
            // let userInfo = app.globalData.userInfo
        if (userInfo.user_type != 2) {
            request.get('user/userfield/user_type', res => {
                if (res.success) {
                    let userType = res.data.user_type
                    if (userType == 2) {
                        this.setData({ userType: userType })
                        userInfo.user_type = userType
                        wx.setStorage({
                            key: 'userinfo',
                            data: userInfo
                        })
                    }
                }
            }).showLoading()
        } else {
            this.setData({ userType: userInfo.user_type })
        }
        if (options.url) {
            this.setData({ url: options.url })
        }
    },
    navToing() {
        toast('此功能陆续开放中...')
    },
    urlTo(e) {
        console.log(e.currentTarget.dataset)
        let url = e.currentTarget.dataset.url
        wx.navigateTo({ url: `/pages/webview/webview?url=${this.data[url]}` });
    },
    navTo(e) {
        let dataset = e.currentTarget.dataset
        let type = dataset.type
        if (type != 1) {
            if (this.data.userType != 2) {
                wx.showModal({
                    title: '提示',
                    content: '该类型只有商家才能发布',
                    confirmText: '成为商家',
                    success: (res) => {
                        if (res.confirm) {
                            wx._navigateTo('/pages/applyMerchant/index')
                                // wx.redirectTo({
                                //   url: '/pages/applyMerchant/index',
                                // })
                        }
                    }
                })
                return
            }
        }
        getApp().requireLogin(dataset.url)
    },

})