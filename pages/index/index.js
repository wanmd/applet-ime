import { Request, toast, alert, queryParams, formatDate, fileUrl, copyText } from '../../utils/util.js'
import { bannerUrl, ALIYUN_URL } from '../../utils/config.js'
let request = new Request()
let app = getApp()
let onShowTime = null;
wx.Page({
    // Component({
    data: {
        baseUrl: ALIYUN_URL,
        bannerUrl: bannerUrl,
        isFirst: true,
        chatList: [],
        bargain: {},
        userType: 1,
        showSelectShareType: 0,
        assetsImages: app.assetsImages,
        chatId: 0,
        shareUserId: '',
        invite_chatId: '',
        ajaxFlag: false,
        sharedataset: {},

        currentType: 1,

        // offerList: [],

        quoteList: [],
        quoteListKeyword: '',
        query: {
            keyword: '',
        },
        query2: {
            keyword: '',
            type: 1
        },

        askBuyList: [],
        askBuyListKeyword: '',
        query3: {
            keyword: ''
        },

        rentingList: [],
        rentingType: 0,
        leaseBannerList: [],
        rentingListKeyword: '',
        query4: {
            keyword: '',
            type: 0,
        },
        indicatorDots: false,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 500,

        quoteBuyFlag: true,
        loadFlag1: false,
        loadFlag2: false,
        loadFlag3: false,
        loadFlag4: false,
        bannerUrl: bannerUrl,

        navTop: 0,
        nav_button_height: 0,


        guide: 'https://mp.weixin.qq.com/s/_fLRUdoOGAzdlgXwsVyQOQ',
        indexBannerList: [{
                url: '/applet-static/images/apply/banner-4.png',
                link: 'https://mp.weixin.qq.com/s/_fLRUdoOGAzdlgXwsVyQOQ'
            },
            {
                url: '/applet-static/images/apply/banner-5.png',
                link: 'https://mp.weixin.qq.com/s/LRzj7IjSgoaC9QroO0Vs0Q'
            },
            {
                url: '/applet-static/images/apply/banner-6.png',
                link: 'https://mp.weixin.qq.com/s/pr4jE-LCk5iSoCKXfCYVzQ'
            }
        ],


        showlink: 0,
        iME_time: '2021-06-02',
        showShopCarPop: false,
        // goods_id: null
        // showShopCarPop: true,
        goods_id: 40
    },
    urlTo(e) {
        console.log(e.currentTarget.dataset)
        let url = e.currentTarget.dataset.url
        wx.navigateTo({ url: `/pages/webview/webview?url=${url}` });
    },
    handleChangeKeyword(e) {
        this.setData({
            'query.keyword': e.detail.value
        })
    },
    load(e, last = 0) {
        let rows = e.detail.list
        let page = e.detail.page
        if (rows.length == 0 && page == 1) {
            this.setData({ chatList: [], ajaxFlag: true })
            return
        }
        if (rows.length > 0) {
            let chatList = this.data.chatList
            rows.forEach(v => {
                switch (v.chat_type) {
                    case 1:
                        v.url = '/pages/chat/index';
                        break;
                    case 2:
                    case 4:
                    case 5:
                        v.url = '/pages/goods/index';
                        break;
                }
                if (v.chat_id == this.data.invite_chatId) {
                    v.url += '?chatId=' + v.chat_id + "&shareUserId=" + this.data.shareUserId;
                } else {
                    v.url += '?chatId=' + v.chat_id;
                }
                v.create_time = formatDate(v.create_time)
                v.picture = JSON.parse(v.picture);
                // 截取9张
                // v.picture = v.picture.slice(0,9)
                if (last == 0) {
                    chatList.push(v)
                } else {
                    chatList.unshift(v)
                }
            })
            this.setData({ chatList: chatList })
        }
        this.setData({ ajaxFlag: true })
    },
    load2(e, last = 0) {
        let rows = e.detail.list
        let page = e.detail.page
        if (rows.length == 0 && page == 1) {
            this.setData({ quoteList: [], ajaxFlag: true })
            return
        }
        if (rows.length > 0) {
            let quoteList = this.data.quoteList;
            rows.forEach(v => {
                v.update_time = this.splitTime(v.update_time);
                if (last == 0) {
                    quoteList.push(v)
                } else {
                    quoteList.unshift(v)
                }
            })
            this.setData({ quoteList: quoteList })
        }
        this.setData({ ajaxFlag: true })
    },
    load3(e, last = 0) {
        let rows = e.detail.list
        let page = e.detail.page
        if (rows.length == 0 && page == 1) {
            this.setData({ askBuyList: [], ajaxFlag: true })
            return
        }
        if (rows.length > 0) {
            let askBuyList = this.data.askBuyList;
            rows.forEach(v => {
                // v.picture = JSON.parse(v.picture)
                if (last == 0) {
                    askBuyList.push(v)
                } else {
                    askBuyList.unshift(v)
                }
            })
            this.setData({ askBuyList: askBuyList })
        }
        this.setData({ ajaxFlag: true })
    },
    load4(e, last = 0) {
        let rows = e.detail.list
        let page = e.detail.page
        if (rows.length == 0 && page == 1) {
            this.setData({ rentingList: [], ajaxFlag: true })
            return
        }
        if (rows.length > 0) {
            let rentingList = this.data.rentingList;
            rows.forEach(v => {
                // v.picture = JSON.parse(v.picture)
                if (last == 0) {
                    rentingList.push(v)
                } else {
                    rentingList.unshift(v)
                }
            })
            this.setData({ rentingList: rentingList })
        }
        this.setData({ ajaxFlag: true })
    },
    search4Type(e) {
        let type = e.currentTarget.dataset.type;
        let query4 = this.data.query4;
        if (this.data.rentingType != type) {
            query4.type = type;
            query4.keyword = '';
            this.setData({ rentingType: type, query4: query4, rentingList: [], rentingListKeyword: '', query4: query4 });
            this.paginationInit();
        }
        this.setData({ rentingType: type });
    },
    bindinput_(e) {
        let target = e.currentTarget.dataset.target
        let update = {}
        update[target] = e.detail.value
        this.setData(update)
    },
    search() {
        let query = this.data.query;
        this.setData({ query: query, quoteList: [] })
        this.paginationInit();
        // let pagination2 = this.selectComponent('#pagination2')
        // pagination2.initLoad()
    },
    search2() {
        let query2 = this.data.query2;
        query2.keyword = this.data.quoteListKeyword;
        this.setData({ query2: query2, quoteList: [] })
        this.paginationInit();
        // let pagination2 = this.selectComponent('#pagination2')
        // pagination2.initLoad()
    },
    search3() {
        let query3 = this.data.query3;
        query3.keyword = this.data.askBuyListKeyword;
        this.setData({ query3: query3, askBuyList: [] })
        this.paginationInit();
    },
    search4() {
        let query4 = this.data.query4;
        query4.keyword = this.data.rentingListKeyword;
        this.setData({ query4: query4, rentingList: [] })
        this.paginationInit();
    },
    copyName(e) {
        var val = e.currentTarget.dataset.copy_name;
        copyText(val)
    },
    toggleType(e) {
        let currentType = e.currentTarget.dataset.type;
        if (currentType == this.data.currentType) return;
        app.globalData.dynamics.type = currentType;
        this.setData({ currentType })
        this.setLoadFlag();
    },

    collect(e) {
        let dataset = e.currentTarget.dataset
        let index = dataset.index
        let chatId = dataset.id
        let collect = dataset.collect || 0;
        console.log(collect);
        
        request.get(!collect ? 'chat/collect' : 'chat/uncollect', res => {
            if (res.success) {
                let update = {}
                update[`chatList[${index}].collect`] = collect == 0 ? 1 : 0
                this.setData(update)
            } else {
                toast(res.msg)
            }
        }, { id: chatId })
    },


    praise(e) {
        let dataset = e.currentTarget.dataset
        let index = dataset.index
        let chatId = dataset.id
        let praise = dataset.praise
        request.get(praise == 0 ? 'chat/praise' : 'chat/unpraise', res => {
            if (res.success) {
                let update = {}
                update[`chatList[${index}].praise`] = praise == 0 ? 1 : 0
                this.setData(update)
            } else {
                toast(res.msg)
            }
        }, { id: chatId })
    },

    down(e) {
        let _this = this;
        let index = e.currentTarget.dataset.index
        let urls = _this.data.chatList[index].picture;
        let urlsNum = urls.length;
        let num = 0;

        wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
                wx.getSetting({
                    success(res) {
                        if (res.authSetting['scope.writePhotosAlbum']) {
                            wx.showLoading({ title: '下载中...' })
                            urls.forEach(url => {
                                wx.downloadFile({
                                    url: ALIYUN_URL + '/' + url,
                                    success: res => {
                                        wx.saveImageToPhotosAlbum({
                                            filePath: res.tempFilePath,
                                            success: res => {
                                                console.log(res)
                                                num++
                                                wx.hideLoading()
                                                if (num == urlsNum) {
                                                    num = 0
                                                    wx.showToast('已下载至相册')
                                                }
                                            },
                                            fail: res => {
                                                console.log(res)
                                                wx.hideLoading()
                                            }
                                        })
                                        console.log(res)
                                    },
                                    fail: res => {
                                        wx.hideLoading()
                                        console.log(res)
                                    }
                                })
                            })
                        } else {
                            wx.hideLoading()
                            wx._showAlert('您已拒绝系统相册权限，您可以在小程序设置界面（右上角 - 关于 - 右上角 - 设置）进行授权设置。');
                            return;
                        }
                    }
                })
            },
            fail: function() {
                wx._showAlert('您已拒绝系统相册权限，您可以在小程序设置界面（右上角 - 关于 - 右上角 - 设置）进行授权设置。');
                return;
            }
        })
    },


    toBargain(e) {
        let formId = e.detail.formId
        let index = e.target.dataset.index
        this.setData({ 'bargain.formId': formId, 'bargain.index': index })
        wx.navigateTo({
            url: '/pages/deliveryAddress/index?target=select'
        })
    },

    selectAddress(address) {
        setTimeout(() => {
            let bargain = this.data.bargain
            let chat = this.data.chatList[bargain.index]
            let index = bargain.index
            request.post('bargain/start', res => {
                if (res.success) {
                    let bargainId = res.data.id
                    let update = {}
                    update[`chatList[${index}].bargain`] = 1
                    update[`chatList[${index}].bargain_id`] = bargainId
                    this.setData(update)
                    wx.navigateTo({
                        url: '/pages/bargain/index?id=' + bargainId
                    })
                } else {
                    toast(res.msg)
                }
            }, { id: chat.chat_id, address: address.id, formId: bargain.formId }).showLoading()
        }, 500)
    },

    goOnBargain(e) {
        let bargainId = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '/pages/bargain/index?id=' + bargainId
        })
    },
    getConcentInfo(userId) {
        let isAuth = app.isAuthWxInfo()
        if (!isAuth) {
            toast('需要授权获取您的用户信息')
            return
        }
        request.get('visit/contactInfo', res => {
            if (res.success) {
                this.setData({ userInfo: res.data, phone: res.data.mobile, wechat: res.data.wechat })
            }
        }, { userId: userId })
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
    quoteBuy(e) {
        let id = e.currentTarget.dataset.id;
        let quoteBuyFlag = this.data.quoteBuyFlag;
        if (!quoteBuyFlag) return
        this.setData({ quoteBuyFlag: false })
        request.post('chat/doQuote', res => {
            if (res.success) {
                toast('下单成功', 600)
            }
            this.setData({ quoteBuyFlag: true })
        }, { id: id })
    },
    getLeaseBannerList() {
        request.get('chat/getLeaseBannerList', res => {
            if (res.success) {
                let leaseBannerList = res.data.list;
                this.setData({ leaseBannerList: leaseBannerList })
            } else {
                toast(res.msg)
            }
        }, {})
    },
    onLoad: function(options) {
        // let currentType = getApp().globalData.dynamics.type || 1;
        // this.getLeaseBannerList();
        let currentType = 1
        this.setData({
            currentType: currentType
        })
        if (options && options.shareUserId) {
            this.setData({
                invite_chatId: options.invite_chatId,
                shareUserId: options.shareUserId
            })
        }
        this.dellScence(options);
    },
    onShow() {
        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
            // let currentType = app.globalData.dynamics.type || 1;
        let currentType = 1
        const { navTop, nav_button_height } = app.setCustomNav();
        
        this.setData({
            currentType: currentType,
            navTop, 
            nav_button_height
        })

        if (!this.data.isFirst && app.newPublish) {
            this.setLoadFlag('init');
            app.newPublish = false;
            console.log('init')
        } else if (this.data.isFirst) {
            this.setLoadFlag('no_load');
            this.setData({ isFirst: false })
        } else {
            // this.setLoadFlag('no_load');
            console.log('hide__show')
        }
        if (userInfo) {
            this.setData({
                userInfo: userInfo,
                userType: userInfo.user_type
            })
        } else {
            app.reloadUserInfo(() => {
                let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
                this.setData({
                    userInfo: userInfo,
                    userType: userInfo.user_type
                })
            })
        }
        this.getTabBar().setData({
            selectedIndex: 0
        });

    },

    setLoadFlag(type) {
        let currentType = this.data.currentType;
        let data = {
            loadFlag1: false,
            loadFlag2: false,
            loadFlag3: false,
            loadFlag4: false,
        }
        if (currentType == 1) {
            data['chatList'] = [];
        } else if (currentType == 2) {
            data['quoteList'] = [];
        } else if (currentType == 3) {
            data['askBuyList'] = [];
        } else if (currentType == 4) {
            data['rentingList'] = [];
        }
        if (type == 'init') this.setData(data);
        data['loadFlag' + currentType] = true;
        this.setData(data);
        if (type == 'no_load') this.paginationInit();
    },
    paginationInit() {
        let currentType = this.data.currentType;
        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
        if ((currentType == 2 || currentType == 3) && userInfo && userInfo.user_type != 2) return;
        this.selectComponent('#pagination' + currentType).initLoad();
    },
    splitTime(val_) {
        return val_.split(" ") || [val_, ''];
    },
    onShareAppMessage: function(e) {
        console.log(e);

        if (e.from === 'button') {

            var queryStr = '?'

            let chat = this.data.chatList[this.data.sharedataset.index]
            console.log(chat);
            let chatId = chat.chat_id
            let chatType = chat.chat_type
            let from = (chatType == 2 || chatType == 4 || chatType == 5) ? 'g' : 'chat'

            queryStr += ('from=' + from)
            queryStr += ('&ci=' + chatId)
                // queryStr += ('&fi=' + app.globalData.userInfo.user_id)
            queryStr += ('&fromUserId=' + app.globalData.userInfo.user_id)

            if (chatType == 4) {
                let sharer = app.globalData.userInfo.user_id
                queryStr += ('&sharer=' + sharer)
                queryStr += '&dst=share'
            }

            var data = {
                // path: '/pages/goods/index?invite_chatId=' + encodeURIComponent(this.data.chatId) + "&shareUserId=" + app.globalData.userInfo.user_id
                path: '/pages/index/index?scene=' + encodeURIComponent(queryStr) + '&invite_chatId=' + this.data.chatId + "&shareUserId=" + app.globalData.userInfo.user_id
            }

            if (chatType == 1) {
                data.title = '分享一个有趣的故事给你'
            } else {
                data.title = chat.goods_name
            }

            if (chat.picture && chat.picture.length > 0) {
                data.imageUrl = fileUrl(chat.picture[0])
            }
            console.log(data);

            return data

        } else {
            // var queryStr = '?'

            // let chat = ''
            // let chatId = ''
            // let chatType = ''
            // let from = (chatType == 2 || chatType == 4 || chatType == 5) ? 'd' : 'chat'

            // queryStr += ('from=' + from)
            // queryStr += ('&ci=' + chatId)
            // queryStr += ('&fromUserId=' + app.globalData.userInfo.user_id)

            // if (chatType == 4) {
            //   let sharer = app.globalData.userInfo.user_id
            //   queryStr += ('&sharer=' + sharer)
            //   queryStr += '&dst=share'
            // }

            // var data = {
            //   // path: '/pages/goods/index?invite_chatId=' + encodeURIComponent(this.data.chatId) + "&shareUserId=" + app.globalData.userInfo.user_id
            //   path: '/pages/index/index?scene=' + encodeURIComponent(queryStr) + '&invite_chatId=' + encodeURIComponent(this.data.chatId) + "&shareUserId=" + app.globalData.userInfo.user_id
            // }
            // if(chatType == 1) {
            //   data.title = '分享一个有趣的故事给你'
            // }else{
            //   data.title = chat.goods_name
            // }

            // if(chat.picture&&chat.picture.length > 0) {
            //   data.imageUrl = fileUrl(chat.picture[0])
            // }

            // return data  

        }
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
    appStror() {
        if (this.isToLogin()) {
            wx.navigateTo({
                url: '../applyMerchant/index'
            })
        }
    },
    /**
     * 显示/关闭分享弹窗
     */
    toggleSelectShareType(e) {
        if (!this.isToLogin()) return;
        let dataset = e.currentTarget.dataset
        let sharedataset = dataset
        let chatId = dataset.id
        console.log(chatId)
        let show = this.data.showSelectShareType
        console.log(show)
        if (show == 1) {
            show = 2
        } else {
            show = 1
        }
        this.setData({ showSelectShareType: show, chatId: chatId, sharedataset: sharedataset })
    },
    /**
     * 关闭 产品卡/小程序码 弹窗
     */
    toggleCardHide() {
        this.setData({ storeQr: '', showCard: false })
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
    // 处理分享的：由于暂时没有找到好的办法让页面的onload在onlanch执行后再执行
    dellScence(options) {
        let _this = this
        let userId
        if (app.globalData.isLogin == false) {
            setTimeout(() => {
                _this.dellScence(options)
            }, 1000);
            return;
        }

        this.isToOrder(options)
        let scene = options.scene;

        console.log("index===options")
        console.log(options)
        if (scene) {
            scene = queryParams(decodeURIComponent(scene));
            if (scene.f) {
                scene.from = scene.f;
            }
            if (scene.iv) {
                scene.inviter = scene.iv;
                userId = scene.iv

            }
            if (scene.fi) {
                // 来自谁
                userId = scene.fi
                scene.fromUserId = scene.fi;
            } else if (options.fromUserId) {
                userId = options.fromUserId
                scene.fromUserId = options.fromUserId;
            } else if (options.shareUserId) {
                userId = options.shareUserId
                scene.shareUserId = options.shareUserId;
            } else if (scene && scene.shareUserId && scene.shareUserId > 0) {
                userId = scene.shareUserId;
                scene.shareUserId = options.shareUserId;
            }
            if (options.inviter) userId = options.inviter
            if (userId) {
                // wx._showToast('关注成功')
                this.post('/visit/follow', { userId: userId }).then(res => {
                    if (res.success) {
                        // wx._showToast('关注成功~')
                    } else {
                        // wx._showToast(res.msg);
                    }
                })
            }

            let from = scene.from;
            console.log("index===options====from")
            console.log(from)
                // 动态列表
            if (from === 'd') {
                // var url = '/pages/dynamics/index';
                var url = '/pages/index/index';
                if (scene.d == 's') {
                    url += '&dst=share&s=' + scene.s
                }
                if (userId) {
                    url += '&shareUserId=' + userId;
                }
                wx.navigateTo({
                    url: url
                });
            }
            // 商品列表
            if (from === 'g') {
                var url = '/pages/goods/index?chatId=' + scene.ci;
                if (scene.d == 's') {
                    url += '&dst=share&s=' + scene.s;
                }
                if (userId) {
                    url += '&shareUserId=' + userId;
                }
                console.log(url)
                wx.navigateTo({
                    url: url
                });
            }
            // 其他文章
            else if (from === 'chat') {
                console.log(scene.ci);
                wx.navigateTo({
                    url: '/pages/chat/index?chatId=' + scene.ci
                });
            } else if (from === 's') {
                wx.navigateTo({
                    url: '/pages/store/index?storeId=' + scene.si
                });
            }
            // 求购
            else if (from === 'ask') {
                let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
                console.log(from);
                console.log(scene.ci);
                if (userInfo && userInfo.user_type == 2) {
                    wx.navigateTo({
                        url: '/pages/askBuy/index?id=' + scene.ci
                    });
                } else {
                    app.globalData.dynamics.type = 3;
                    wx._switchTab('/pages/dynamics/index')
                }
            }
            // 求购
            else if (from === 'renting') {
                wx.navigateTo({
                    url: '/pages/renting/index?chatId=' + scene.ci + '&id=' + scene.id
                });
                // let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
                // if (userInfo && userInfo.user_type == 2) {
                // } else {
                //     app.globalData.dynamics.type = 4;
                //     wx._switchTab('/pages/dynamics/index')
                // }
            }

            this.setData({ show_page: true })
        }

        if (options.fromUserId && options.fromUserId > 0) {
            // wx._showToast('关注成功')
            this.post('/visit/follow', { userId: options.fromUserId }).then(res => {
                if (res.success) {
                    // wx._showToast('关注成功~')
                } else {
                    // wx._showToast(res.msg);
                }
            })
        }

        let path = options.path || "";
        if (path !== "") {
            path = decodeURIComponent(path);
            wx.redirectTo({
                url: '/' + path
            });
        }
        this.setData({ show_page: true })
    },

    handleScan() {
        // 允许从相机和相册扫码
        const _this = this;
        wx.scanCode({
            success (res) {
                toast(res.result)
            console.log(res)
                _this.setData({
                    'query.keyword': res.result
                })
            }
        })
    },

    // 处理iME官方小助手的发布时间
    // 发布时间5分钟以内显示具体时间，超过5-30分钟显示刚刚，
    // 超过30-60 显示多少分钟前，
    // 超过1-24i小时，显示多少小时前，
    // 超过1天后显示多少天前，多少月前,由通用的微博、微信展示规则最好。
    handleImeiTime(create_time) {
        let time = create_time || '2021-06-02';
        const currentTime = new Date().getTime();
        const createTime = new Date(time).getTime();
        const diff = currentTime - createTime;
        
        if (diff < 5*60*1000) {
            return time
        } else if (diff < 30*60*1000) {
            return '刚刚'
        } else if(diff < 60*60*1000) {
            const diffMinutes = Math.floor(diff/(60*1000));
            return  `${diffMinutes}分钟前`
        } else if(diff < 24*60*60*1000) {
            const diffHours = Math.floor(diff/(60*60*1000));
            return  `${diffHours}小时前`
        } else {
            const diffDays = Math.floor(diff/(60*60*1000*24));
            return  `${diffDays}天前`
        }
    },
    // 购物车弹框
    showGoodsPopup(e) {
        if (!this.isToLogin()) return;
        // 产品id
        const { goods_id } = e.currentTarget.dataset;
        
        this.setData({
            showShopCarPop: true,
            goods_id 
        })
    }

})