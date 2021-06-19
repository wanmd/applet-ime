import { Request, toast, formatDate, alert, fileUrl, rpxTopx } from '../../utils/util.js'
import { ALIYUN_URL } from '../../utils/config.js'
let W, H = 0
let request = new Request()
let app = getApp()
wx.Page({

    data: {
        ALIYUN_URL: ALIYUN_URL,
        chatId: '',
        askBuyData: {},
        comment: '',
        commentList: [],
        showlink: 0,
        focus: false,
        query: {
            chatId: '',
        }
    },
    onLoad: function(opts) {
        if (opts.id) {
            let focus = opts.focus == 1 ? true : false;
            this.setData({ chatId: opts.id, focus: focus, query: { chatId: opts.id } })
            this.init();
        } else {
            toast("访问错误!")
        }
    },
    onShow() {

    },
    load(e, last = 0) {
        let rows = e.detail.list
        let page = e.detail.page
        if (rows.length == 0 && page == 1) {
            this.setData({ commentList: [], ajaxFlag: true })
            return
        }
        if (rows.length > 0) {
            let commentList = this.data.commentList;
            rows.forEach(v => {
                // v.picture = JSON.parse(v.picture)
                if (last == 0) {
                    commentList.push(v)
                } else {
                    commentList.unshift(v)
                }
            })
            this.setData({ commentList: commentList })
        }
        this.setData({ ajaxFlag: true })
    },
    init() {
        request.setMany(true);
        this.getWantBuyAPI();
    },
    contact(e) {
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
                this.setData({
                    showlink: 1,
                    user: res.data
                })
            }
        }, { userId: user_id })
    },
    hideMark() {
        this.setData({
            showlink: 2
        })
    },
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
    input(e) {
        let target = e.currentTarget.dataset.target
        let update = {}
        update[target] = e.detail.value
        this.setData(update)
    },
    fasong() {
        let data = {
            chat_id: this.data.chatId,
            content: this.data.comment
        }
        request.setMany(true);
        request.post('chat/wantBuyReply', res => {
            console.log(res);
            if (res.success) {
                this.setData({ commentList: [], comment: '' })
                    // this.getWantBuyReplyList('init');
                this.selectComponent('#pagination').initLoad()
            } else {
                toast(res.msg)
            }
        }, data).showLoading()
    },
    getWantBuyAPI() {
        let data = {
            chat_id: this.data.chatId
        }
        request.get('chat/getMyWantBuyInfo', res => {
            console.log(res);
            if (res.success) {
                let askBuyData = res.data.info;
                // if (askBuyData.picture.length > 0) {
                //     askBuyData.picture = [...askBuyData.picture, ...askBuyData.picture, ...askBuyData.picture]
                //     askBuyData.picture = [...askBuyData.picture, ...askBuyData.picture, ...askBuyData.picture]
                // }
                this.setData({ askBuyData: askBuyData })
            } else {
                toast(res.msg)
            }
        }, data).showLoading()
    },
    isAuth_(e) {
        if (!this.isToLogin()) return;
        app.requireLogin(e.currentTarget.dataset.url)
    },
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
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        var sceneStr = '?from=ask&ci=' + this.data.chatId
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
        let picture = this.data.askBuyData.picture[0];
        return {
            path: path,
            imageUrl: fileUrl(picture),
            title: this.data.askBuyData.content
        }
    }
})