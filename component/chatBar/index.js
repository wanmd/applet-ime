import { ALIYUN_URL } from '../../utils/config.js';
import { Request, toast } from '../../utils/util.js';
let request = new Request();
let app = getApp()
Component({
    properties: {
        urls: {
            type: Array,
            value: []
        },

        userId: {
            type: Number,
            value: 0
        },
        chatId: {
            type: Number,
            value: 0
        },
        collectId: {
            type: Number,
            value: 0
        },
        collectStatus: {
            type: Boolean,
            value: false
        },

        praiseStatus: {
            type: Boolean,
            value: false
        },

        exclude: {
            type: Array,
            value: []
        },
        content: {
            type: String,
            value: ''
        },
        type: {
            type: String,
            value: '1'
        },
    },

    lifetimes: {
        attached() {
            let exclude = this.properties.exclude;
            let userId = this.properties.userId;
            this.setData({
                showDown: !exclude.includes('down'),
                showCollect: !exclude.includes('collect'),
                showContact: !exclude.includes('contact'),
                showPraise: !exclude.includes('praise'),
                type: this.properties.type,
            });
        }
    },

    observers: {
        collectId(collectStatus) {
            this.setData({ collect_id: collectId });
        },
        collectStatus(collectStatus) {
            this.setData({ collect_status: collectStatus });
        },
        praiseStatus(praiseStatus) {
            this.setData({ praise_status: praiseStatus });
        }
    },

    data: {
        collect_id: 0,
        collect_status: false,
        praise_status: false,
        showDown: false,
        showCollect: false,
        showContact: false,
        showPraise: false,
        showlink: 0,
        downOk: false
    },
    methods: {
        downOkHide() {
            this.setData({ downOk: false });
        },
        down() {
            let isAuth = app.isAuthWxInfo()
            if (!isAuth) {
                toast('需要授权获取您的用户信息')
                return
            }
            let urls = this.properties.urls;
            let urlsNum = urls.length;
            let num = 0;

            let content = this.data.content;
            wx.setClipboardData({
                data: content,
                success(res) {
                    wx.getClipboardData({
                        success(res) {
                            console.log(res.data); // data
                            // toast('复制成功')
                            // this.downOk = true;
                        }
                    });
                }
            });
            wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                    wx.getSetting({
                        success(res) {
                            if (res.authSetting['scope.writePhotosAlbum']) {
                                wx.showLoading({ title: '下载中...' });
                                urls.forEach(url => {
                                    wx.downloadFile({
                                        url: ALIYUN_URL + '/' + url,
                                        success: res => {
                                            wx.saveImageToPhotosAlbum({
                                                filePath: res.tempFilePath,
                                                success: res => {
                                                    console.log(res);
                                                    num++;
                                                    wx.hideLoading();
                                                    if (num == urlsNum) {
                                                        num = 0;
                                                        this.setData({ downOk: true });
                                                        // wx.showToast({
                                                        //     title: '已下载至相册',
                                                        //     icon: 'success',
                                                        //     duration: 1500
                                                        // })
                                                    }
                                                },
                                                fail: res => {
                                                    console.log(res);
                                                    wx.hideLoading();
                                                }
                                            });
                                            console.log(res);
                                        },
                                        fail: res => {
                                            wx.hideLoading();
                                            console.log(res);
                                        }
                                    });
                                });
                            } else {
                                wx.hideLoading();
                                wx._showAlert(
                                    '您已拒绝系统相册权限，您可以在小程序设置界面（右上角 - 关于 - 右上角 - 设置）进行授权设置。'
                                );
                                return;
                            }
                        }
                    });
                },
                fail: function() {
                    wx._showAlert(
                        '您已拒绝系统相册权限，您可以在小程序设置界面（右上角 - 关于 - 右上角 - 设置）进行授权设置。'
                    );
                    return;
                }
            });
        },
        // 收藏
        collect() {
            let isAuth = app.isAuthWxInfo()
            if (!isAuth) {
                toast('需要授权获取您的用户信息')
                return
            }
            let chatId = this.properties.chatId;
            let collectStatus = this.data.collect_status;
            if (collectStatus) {
                //取消收藏
                request.get(
                    'chat/uncollect',
                    res => {
                        if (res.success) {
                            this.setData({ collect_status: false });
                        } else {
                            toast(res.msg);
                        }
                    }, { id: chatId }
                );
            } else {
                //收藏
                request.get(
                    'chat/collect',
                    res => {
                        if (res.success) {
                            this.setData({ collect_status: true });
                        } else {
                            toast(res.msg);
                        }
                    }, { id: chatId }
                );
            }
        },
        gouwuche() {
            wx.switchTab({
                url: '/pages/cart/index'
            })
        },
        // 点赞
        praise() {
            let isAuth = app.isAuthWxInfo()
            if (!isAuth) {
                toast('需要授权获取您的用户信息')
                return
            }
            let chatId = this.properties.chatId;
            let praiseStatus = this.data.praise_status;
            request.get(
                praiseStatus == false ? 'chat/praise' : 'chat/unpraise',
                res => {
                    if (res.success) {
                        this.setData({ praise_status: !praiseStatus });
                    } else {
                        toast(res.msg);
                    }
                }, { id: chatId }
            );
        },
        copy(e) {
            let isAuth = app.isAuthWxInfo()
            if (!isAuth) {
                toast('需要授权获取您的用户信息')
                return
            }
            let content = e.currentTarget.dataset.content;
            console.log(content);
            if (!content) {
                wx.showToast({
                    title: '暂无微信',
                    icon: 'none',
                    duration: 1500
                });
                return;
            }
            wx.setClipboardData({
                data: content,
                success(res) {
                    wx.getClipboardData({
                        success(res) {
                            console.log(res.data); // data
                        }
                    });
                }
            });
        },
        callNumPhone(e) {
            let isAuth = app.isAuthWxInfo()
            if (!isAuth) {
                toast('需要授权获取您的用户信息')
                return
            }
            let pnum = e.currentTarget.dataset.phone;
            if (!pnum) {
                wx.showToast({
                    title: '暂无手机号',
                    icon: 'none',
                    duration: 1500
                });
                return;
            }
            wx.makePhoneCall({
                phoneNumber: pnum
            });
        },
        hideMark() {
            this.setData({
                showlink: 2
            });
        },
        getConcentInfo(userId) {
            request.get(
                'visit/contactInfo',
                res => {
                    if (res.success) {
                        this.setData({ userInfo: res.data });
                    }
                }, { userId: userId }
            );
        },
        contact() {
            let isAuth = app.isAuthWxInfo()
            if (!isAuth) {
                toast('需要授权获取您的用户信息')
                return
            }
            this.getConcentInfo(this.properties.userId);
            this.setData({
                showlink: 1
            });
        }
    }
});