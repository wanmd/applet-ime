// var address_parse = require("./smartWeChat/js/address_parse");
import { Request, queryParams } from './utils/util.js';
const config = require('./config.js');
require('./utils/wxpack.js');
require('./utils/api.js');
import { assetsImages } from './utils/config.js';
const MsgQueue = require('./utils/msgqueue.js');
App({
    onLaunch: function(options) {
        // var options = {
        //   query: {
        //     invite_chatId: "0",
        //     invite_userid: 903399,
        //     scene: "%3Ffrom%3Dchat%26ci%3D%26fromUserId%3D903399",
        //   }
        // }
        this.autoUpdate()
        console.log('onLaunch');
        console.log(options);
        let inviter = options.query.inviter || 0;
        // console.log('inviter=======', inviter)
        // console.log("options=========");
        // console.log(options);
        let option = options.query;
        let scene = options.query.scene;
        if (scene) {
            scene = decodeURIComponent(scene);
            scene = queryParams(scene);
            // console.log("scene=========");
            // console.log(scene);
            if (scene.f === 's') { //店铺卡进来也绑定关系
                //来自邀请 si就是storeId
                inviter = scene.fi; //生成这个码的人id
            }
            if (scene.f === 'g') { //商品卡进来也绑定关系
                //来自邀请
                inviter = scene.fi; //邀请人
            }
            if (scene.f === 'i') {
                //来自邀请
                inviter = scene.iv; //邀请人
            }
            if (!inviter) {
                if (option.shareUserId) {
                    inviter = option.shareUserId
                } else if (option.fromUserId) {
                    inviter = option.fromUserId
                }
            }
            this.wxlogin(inviter);
        } else {
            if (!inviter) {
                if (option.shareUserId) {
                    inviter = option.shareUserId
                } else if (option.fromUserId) {
                    inviter = option.fromUserId
                }
            }
            this.wxlogin(inviter);
        }
        this.globalData.inviter = inviter;
        wx.getSystemInfo({
            success: res => {
                this.systemInfo = res;
            }
        });
        wx.hideTabBar()
    },
    autoUpdate: function() {
        var self = this
            // 获取小程序更新机制兼容
        if (wx.canIUse('getUpdateManager')) {
            const updateManager = wx.getUpdateManager()
                //1. 检查小程序是否有新版本发布
            updateManager.onCheckForUpdate(function(res) {
                // 请求完新版本信息的回调
                if (res.hasUpdate) {
                    //检测到新版本，需要更新，给出提示
                    wx.showModal({
                        title: '更新提示',
                        content: '检测到新版本，是否下载新版本并重启小程序？',
                        success: function(res) {
                            if (res.confirm) {
                                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                                self.downLoadAndUpdate(updateManager)
                            } else if (res.cancel) {
                                //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                                wx.showModal({
                                    title: '温馨提示~',
                                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                                    showCancel: false, //隐藏取消按钮
                                    confirmText: "确定更新", //只保留确定更新按钮
                                    success: function(res) {
                                        if (res.confirm) {
                                            //下载新版本，并重新应用
                                            self.downLoadAndUpdate(updateManager)
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            })
        } else {
            // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },
    /**
     * 下载小程序新版本并重启应用
     */
    downLoadAndUpdate: function(updateManager) {
        var self = this
        wx.showLoading();
        //静默下载更新小程序新版本
        updateManager.onUpdateReady(function() {
            wx.hideLoading()
                //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
        })
        updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
        })
    },
    onShow(opts) {
        //< 保存当前页面访问url(包括查询参数)
        this._getQueryLocation(opts);
    },
    broadcastUpdate: function() {
        console.log("broadcastUpdate");
        this.__updateProducerQueue.push(); // 推进消息事件
        let pages = getCurrentPages(); //当前页面栈
        if (pages.length > 1) {
            let beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
            beforePage.onLoad(); //触发父页面中的方法
        }
    },
    trace_debug: function(msg) {
        console.log(msg);
    },

    //< 获取查询URL Location
    _getQueryLocation(opts) {
        this.location = {
            href: '/' + this.route,
            uri: '/' + this.route,
            query: ''
        };
        let _qry = '';
        for (let t in opts) {
            if (typeof opts[t] != 'function') {
                _qry += t + '=' + opts[t] + '&';
            }
        }
        if ('' !== _qry) {
            _qry = _qry.substr(0, _qry.length - 1);
            this.location.href += '?' + _qry;
            this.location.query = _qry;
        }
    },
    wxlogin(inviter, callback) {
        // console.log("inviter=========");
        // console.log(inviter);
        let self = this;
        wx._showLoading()
            // wx._clearStorageSync()
        wx.login({
            success(res) {
                if (res.code) {
                    wx.promise
                        .post('/login', { code: res.code, inviter: inviter })
                        .then(result => {
                            wx._hideLoading()
                            if (result.code == 200) {
                                self.globalData.isLogin = true;
                                let token = result.data.token || '';
                                let user = result.data.user || '';
                                if (!(user instanceof Object)) {
                                    user = JSON.parse(user);
                                }
                                // 同步设置请求信息
                                wx._setStorageSync('token', token);
                                wx._setStorageSync('userinfo', user);
                                self.globalData.userInfo = user;
                                if (inviter && inviter > 0) {
                                    wx.promise
                                        .post('/visit/follow', { userId: inviter })
                                        .then(info => {
                                            if (info.success) {
                                                // wx._showToast('关注成功~')
                                            } else {
                                                // wx._showToast(info.msg);
                                            }
                                        });
                                }

                                if (typeof callback == 'function') {
                                    callback();
                                }
                            } else {
                                let userinfo_key = config.userinfo_key;
                                wx.setStorageSync(userinfo_key, '');
                            }
                        });
                } else {
                    console.log('登录失败！' + res.errMsg);
                }
            },
            fail(e) {
            }
        });
    },
    reloadUserInfo(callback, loading_txt) {
        //重新载入用户信息
        let self = this;
        self.globalData.userInfo = null;
        loading_txt = loading_txt || '';
        if ('' !== loading_txt) wx._showLoading(loading_txt);
        wx.login({
            success(res) {
                if (res.code) {
                    wx.promise.post('/login', { code: res.code }).then(result => {
                        wx._hideLoading();
                        if (result.code == 200 && result.success) {
                            self.globalData.isLogin = true;
                            let token = result.data.token || '';
                            let user = result.data.user || '';
                            if (!(user instanceof Object)) {
                                user = JSON.parse(user);
                            }
                            // 同步设置请求信息
                            // wx._setStorageSync('token', token);
                            wx._setStorageSync('userinfo', user);
                            self.globalData.userInfo = user;
                            if (typeof callback === 'function') {
                                console.log("callback=====callback")
                                // console.log(callback)
                                callback(result);
                            }
                        } else {
                            wx._showAlert({
                                content: res.msg,
                                success(res) {
                                    wx._navigateBack();
                                }
                            });
                        }
                    });
                } else {
                    console.log('登录失败！' + res.errMsg);
                }
            }
        });
    },
    requireLogin(url) {
        let user = wx.getStorageSync(config.userinfo_key) || this.globalData.userInfo
        if (!user ||
            !user.nickname ||
            user.nickname == '' ||
            !user.isAuth ||
            !user.user_id ||
            user.user_id == 0
        ) {
            if (url) {
                this.appLogin(url + (url.indexOf('?') > -1 ? '&' : '?') + 'login=true');
            } else {
                this.appLogin(url);
            }

        } else {
            // 表示已经授权获取微信信息
            let nav_key = wx.getStorageSync('nav_key');
            wx._removeStorageSync('nav_key');
            if (nav_key == 'swit') {
                wx._switchTab(url);
            } else {
                console.log(url);
                wx._navigateTo(url);
            }
        }
    },
    isAuthWxInfo(url) {
        let user = wx.getStorageSync(config.userinfo_key) || this.globalData.userInfo
        if (!user ||
            !user.nickname ||
            user.nickname == '' ||
            !user.isAuth ||
            !user.user_id ||
            user.user_id == 0
        ) {
            if (url) {
                this.appLogin(url + (url.indexOf('?') > -1 ? '&' : '?') + 'login=true');
            } else {
                this.appLogin(url);
            }

        } else {
            // 表示已经授权获取微信信息
            // let nav_key = wx.getStorageSync('nav_key');
            wx._removeStorageSync('nav_key');
            return true
        }
    },
    appLogin(url) {
        let user = wx.getStorageSync(config.userinfo_key) || this.globalData.userInfo
        let userinfo_key = config.userinfo_key;
        if (user && user.nickname && user.isAuth) {
            wx.setStorageSync(userinfo_key, '');
        }
        wx.setStorageSync('url_key', url);
        wx.navigateTo({
            url: '/pages/auth/index'
        });
    },
    formatDecimal(num, decimal_) {
        let decimal = decimal_ || 2;
        num = num.toString()
        let index = num.indexOf('.')
        if (index !== -1) {
            num = num.substring(0, decimal + index + 1)
        } else {
            num = num.substring(0)
        }
        return Number(parseFloat(num).toFixed(decimal))
    },
    geturlData(url) {
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.split("?");
            theRequest['url'] = str[0];
            str = str[1];
            console.log(str)
            var strs = str.split("&");
            console.log(strs)
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest
    },
    // 设置自定义导航
    setCustomNav() {
        // 解构取值
        const { system, statusBarHeight } = wx.getSystemInfoSync(); // statusBarHeight 顶部状态栏

        const { top: navTop, height: nav_button_height } = wx.getMenuButtonBoundingClientRect(); // 胶囊按钮与顶部的距离

        // 系统
        const isiOS = system.indexOf('iOS') > -1;
        
        // 导航栏的高度是根据系统写死的
        const navHeight = isiOS ? 48 : 48;
        
        // 因为状态栏的高度是变化的，所以顶部高度是变化的
        const topHeight = statusBarHeight + navHeight;
        
        // 结果
        const result = {
            statusBarHeight,
            navHeight,
            topHeight,
            navTop,
            nav_button_height
        };
        
        return result;
    },
    __updateProducerQueue: new MsgQueue.ProducerQueue('onUpdate'), //用于onUpdate事件广播通知
    appName: config.appData,
    systemInfo: null,
    assetsImages: assetsImages,
    globalData: {
        inviter: 0,
        userInfo: null,
        userNumber: null,
        city: null,
        isLogin: false,
        dynamics: {
            type: 1
        },
        // 商品规格
        // skuData: {
        //     goods_skuList: [],
        //     excel_skuList: []
        // },
        // 商品标签
        goodsLabel: [],
        // 商品私密备注
        productRemarks: []
    },

    newPublish: false
});
wx.app = getApp();
wx.Page = require('./utils/xpage.js');