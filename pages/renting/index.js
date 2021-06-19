import { Request, toast, formatDate, alert, fileUrl, rpxTopx } from '../../utils/util.js'
import { ALIYUN_URL } from '../../utils/config.js'
let W, H = 0
let request = new Request()
let app = getApp()
wx.Page({

    data: {
        ALIYUN_URL: ALIYUN_URL,
        id: '',
        chatId: '',
        rentingData: {},
        showlink: 0,
        user: {},
        query: {
            chatId: '',
        }
    },
    onLoad: function(opts) {
        if (opts.id) {
            this.setData({ id: opts.id, chatId: opts.chatId })
            this.init();
        } else {
            toast("访问错误!")
        }
    },
    onShow() {},

    init() {
        request.setMany(true);
        this.getWantBuyAPI();
        this.addVisitLeaseAPI();
    },
    // 获取用户信息弹窗
    contact(e, flag) {
        let user_id = e.currentTarget.dataset.user_id || "";
        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
        let isAuth = app.isAuthWxInfo()
        if (user_id == '') {
            toast('未获取到用户信息')
            return
        }
        if (!isAuth) {
            toast('需要授权获取您的用户信息')
            return
        }
        request.get('visit/contactInfo', res => {
            if (res.success) {
                if (flag) {
                    this.setData({
                        user: res.data
                    })
                    let phone = this.data.user.mobile;
                    this.callNumPhone({ currentTarget: { dataset: { phone: phone } } })
                } else {
                    this.setData({
                        showlink: 1,
                        user: res.data
                    })
                }
            }
        }, { userId: user_id })
    },
    // 隐藏用户信息弹窗
    hideMark() {
        this.setData({
            showlink: 2
        })
    },
    // 复制微信
    copy(e) {
        let content = e.currentTarget.dataset.content;
        console.log(content)
        if (content == '') {
            wx.showToast({
                title: '暂无微信',
                icon: 'none',
                duration: 1500
            })
            return
        }
        copyText(content)
    },
    // 拨打手机号
    callNumPhone(e) {
        let pnum = e.currentTarget.dataset.phone
        if (pnum == '') {
            wx.showToast({
                title: '暂无手机号',
                icon: 'none',
                duration: 1500
            })
            return
        }
        wx.makePhoneCall({
            phoneNumber: pnum
        })
    },
    // 拨打手机号
    getcallNumPhone(e) {
        let phone = this.data.user.mobile;
        if (this.data.user.mobile) {
            this.callNumPhone({ currentTarget: { dataset: { phone: phone } } })
        } else {
            this.contact(e, true)
        }
    },

    getWantBuyAPI() {
        let data = {
            id: this.data.id
        }
        request.get('chat/getLeaseInfo', res => {
            console.log(res);
            if (res.success) {
                let rentingData = res.data.info;
                this.setData({ rentingData: rentingData })
                if (rentingData.type == 1) {
                    wx.setNavigationBarTitle({
                        title: '求租详情'
                    })
                } else if (rentingData.type == 2) {
                    wx.setNavigationBarTitle({
                        title: '招租详情'
                    })
                }
            } else {
                toast(res.msg)
            }
        }, data).showLoading()
    },
    addVisitLeaseAPI() {
        let data = {
            chat_id: this.data.chatId,
            chat_lease_id: this.data.id
        }
        request.post('user/addVisitLease', res => {
            // console.log(res);
            if (res.success) {
                // let rentingData = res.data.info;
                // this.setData({ rentingData: rentingData })
            } else {
                toast(res.msg)
            }
        }, data)
    },
    // 跳转页面
    isAuth_(e) {
        if (!this.isToLogin()) return;
        app.requireLogin(e.currentTarget.dataset.url)
    },
    // 跳转前判断认证
    isToLogin() {
        let userInfo = wx._getStorageSync('userinfo')
        if (!userInfo.nickname || !userInfo.isAuth) {
            wx._setStorageSync("nav_key", 'swit')
            if (this.data.shareUserId != '') {
                app.requireLogin('/pages/dynamics/index?shareUserId=' + this.data.shareUserId)
            } else {
                app.requireLogin('/pages/dynamics/index')
            }
            return false;
        } else {
            return true;
        }
    },
    previewImage(e) {
        let img = e.currentTarget.dataset.img;
        let imgs = e.currentTarget.dataset.imgs;
        let urls = []
        let url = ALIYUN_URL + '/' + img
        for (let i = 0; i < imgs.length; i++) {
            let curl = ALIYUN_URL + '/' + imgs[i]
            urls.push(curl)
        }
        wx.previewImage({
            current: url,
            urls: urls
        })
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        var sceneStr = '?from=renting&&ci=' + this.data.chatId + '&id=' + this.data.id;
        sceneStr += '=g&fi=' + app.globalData.userInfo.user_id
            // var chatType = this.data.chat.chat_type
            // if (chatType == 4) {
        let sharer = app.globalData.userInfo.user_id
        sceneStr += ('&sharer=' + sharer)
        sceneStr += '&dst=share'
            // }

        sceneStr += ('&fromUserId=' + app.globalData.userInfo.user_id)

        // let path = '/pages/index/index?scene=' + encodeURIComponent(sceneStr)
        let path = '/pages/index/index?scene=' + encodeURIComponent(sceneStr) + 'chatId=' + encodeURIComponent(this.data.chatId) + "&shareUserId=" + app.globalData.userInfo.user_id
        console.log(path);
        let picture = this.data.rentingData.picture[0];
        return {
            path: path,
            imageUrl: fileUrl(picture),
            title: this.data.rentingData.content
        }
    }
})