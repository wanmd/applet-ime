import {
    Request,
    toast,
    navToIyou,
    rpxTopx
} from '../../utils/util.js'

let request = new Request()
let app = getApp()
let W = 0;
let H = 0;

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
                type: 'methods'
            }
        ],
        personManageList: [
            {
                image: '../../assets/images/user/homepage@2x.png',
                text: '个人主页',
                url: '/pages/store/index?storeId=' + wx.getStorageSync('userinfo').user_id,
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
            // {
            //     image: '../../assets/images/user/rebate@2x.png',
            //     text: '返利小金库',
            //     url: '',
            // },
            {
                image: '../../assets/images/user/lesson@2x.png',
                text: 'iME课堂',
                url: '',
            },
            {
                image: '../../assets/images/user/record@2x.png',
                text: '拿货记录',
                url: '../../packages/pack-A/pages/offer/index',
            },
            // {
            //     image: '../../assets/images/user/setting@2x.png',
            //     text: '设置',
            //     url: '',
            // },
            // {
            //     image: '../../assets/images/user/contact@2x.png',
            //     text: '联系我们',
            //     url: '',
            // },
            // {
            //     image: '../../assets/images/user/jifen@2x.png',
            //     text: '积分',
            //     url: '',
            // }
        ],
        showQr: false
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
            const { url, type } = e.currentTarget.dataset;
            if (type === 'methods') {// 调用方法
                this.getStoreQr()
            } else {
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
                    app.requireLogin(url)
                }
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
                    that.isToOrder({ q: res.result })
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
        navToIyou,
        getStoreQr() {
            let userInfo = wx._getStorageSync('userinfo')
            let req = new Request()
            req.setConfig('responseType', 'arraybuffer')
            req.get('qr/store', res => {
                // this.closeMark()
                let qrcode = wx.arrayBufferToBase64(res).replace(/[\r\n]/g, '')
                this.setData({ storeQr: qrcode, showQr: true })
                wx.nextTick(() => {
                    this.draw1()
                })
            }, { storeId: userInfo.user_id }).showLoading()
        },
        /**
         * canvas绘图相关，把文字转化成只能行数，多余显示省略号
         * ctx: 当前的canvas
         * text: 文本
         * contentWidth: 文本最大宽度
         * lineNumber: 显示几行
         */
        transformContentToMultiLineText(ctx, text, contentWidth, lineNumber) {
            if (!text) return [''];
            var textArray = text.split(""); // 分割成字符串数组
            var temp = "";
            var row = [];

            for (var i = 0; i < textArray.length; i++) {
                if (ctx.measureText(temp).width < contentWidth) {
                    temp += textArray[i];
                } else {
                    i--; // 这里添加i--是为了防止字符丢失
                    row.push(temp);
                    temp = "";
                }
            }
            row.push(temp);
            // 如果数组长度大于2，则截取前两个
            if (row.length > lineNumber) {
                var rowCut = row.slice(0, lineNumber);
                console.log(rowCut)
                var rowPart = '';
                if (rowCut.length <= 1) {
                    rowPart = rowCut[0];
                } else {
                    rowPart = rowCut[1];
                }
                var test = "";
                var empty = [];
                for (var a = 0; a < rowPart.length; a++) {
                    if (ctx.measureText(test).width < contentWidth) {
                        test += rowPart[a];
                    } else {
                        break;
                    }
                }
                empty.push(test); // 处理后面加省略号
                var group = empty[0] + '...'
                rowCut.splice(lineNumber - 1, 1, group);
                row = rowCut;
            }
            return row;
        },
        draw1() {
            let qrcode = this.data.storeQr
            let userInfo = wx._getStorageSync('userinfo');
            let avatar = userInfo.avatar
            let nickname = userInfo.nickname
            let remark = userInfo.remark
            let self = this
            const query = wx.createSelectorQuery()
            query.select('#canvas-modal1').boundingClientRect()
            query.exec(function(res) {
                W = res[0].width
                H = res[0].height
                var ctx = wx.createCanvasContext('firstCanvas1')
                ctx.setFillStyle('#FFE200')
                ctx.fillRect(0, 0, W, H)
                ctx.draw(true)
                    // 画背景
                wx.getImageInfo({
                        src: '/assets/images/bg_goods@2x.png',
                        success(res) {
                            ctx.drawImage('/assets/images/bg_goods@2x.png', 0, 0, res.width, res.height, 0, 0, rpxTopx(676), rpxTopx(1000))
                            ctx.draw(true)
    
                            ctx.beginPath();
                            ctx.arc(rpxTopx(340), rpxTopx(730), rpxTopx(160), 0, 360, false);
                            ctx.fillStyle = "#ffffff"; //填充颜色,默认是黑色
                            ctx.fill(); //画实心圆
                            ctx.closePath();
                            ctx.draw(true)
    
                        }
                    })
                    // 画头像
                wx.getImageInfo({
                    src: avatar,
                    success: function(res) {
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(rpxTopx(100), rpxTopx(80), rpxTopx(50), 0, 2 * Math.PI);
                        ctx.closePath();
                        // 下面就裁剪出一个圆形了，且坐标在 （50， 90）
                        ctx.clip();
                        ctx.drawImage(res.path, rpxTopx(50), rpxTopx(30), rpxTopx(100), rpxTopx(100));
                        ctx.restore();
                        ctx.draw(true);
                        // 画昵称
                        ctx.setFillStyle('#333333')
                        ctx.setFontSize(rpxTopx(32))
                        var nickname_ = self.transformContentToMultiLineText(ctx, nickname, rpxTopx(320), 1);
                        let nickname_length = nickname_[0].length;
                        let nickname_txt = nickname;
                        if (nickname_length < nickname.length) nickname_txt = nickname.substring(0, nickname_length) + '...';
                        ctx.fillText(nickname_txt, rpxTopx(170), rpxTopx(72))
                        ctx.draw(true)
    
                        ctx.setFillStyle('#333333')
                        ctx.setFontSize(rpxTopx(24))
                        var remark_ = self.transformContentToMultiLineText(ctx, remark, rpxTopx(320), 1);
                        let remark_length = remark_[0].length;
                        let remark_txt = remark;
                        if (remark_length < remark.length) remark_txt = remark.substring(0, remark_length) + '...';
                        ctx.fillText(remark_txt, rpxTopx(170), rpxTopx(112))
                        ctx.draw(true)
                    }
                })
    
    
    
                // 画二维码
                let d = new Date()
                const fsm = wx.getFileSystemManager()
                const filePath = `${wx.env.USER_DATA_PATH}/` + d.getTime() + '.png'
                const buffer = wx.base64ToArrayBuffer(qrcode)
    
                fsm.writeFile({
                    filePath,
                    data: buffer,
                    encoding: 'binary',
                    success() {
                        wx.getImageInfo({
                            src: filePath,
                            success: (res) => {
                                let qrSize = rpxTopx(300)
                                ctx.drawImage(res.path, 0, 0, res.width, res.height, rpxTopx(190), rpxTopx(580), qrSize, qrSize)
                                ctx.draw(true)
                            }
                        })
                    }
                })
            })
        },
        saveCard1() {
            let self = this
            wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: W,
                height: H,
                canvasId: 'firstCanvas1',
                success(res) {
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(res) {
                            wx.showToast({
                                title: '已下载至相册',
                                icon: 'success',
                                duration: 1500
                            })
                            self.setData({ showQr: false })
                                // self.toggleCard1()
                        },
                        fail() {
                            toast('保存失败')
                        }
                    })
                }
            })
        },
        closeMark() {
            this.setData({ showQr: false })
        },
        toggleCardHide() {
            this.closeMark()
        },
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