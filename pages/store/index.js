import { Request, toast, rpxTopx, copyText, errorToast } from '../../utils/util.js';
import { assetsImages, ALIYUN_URL } from '../../utils/config.js';
let request = new Request();
let app = getApp();
let W = 0;
let H = 0;
wx.Page({
    data: {
        defaultimg: '/assets/images/default-jj.png',
        showlink: 0,
        thumb: false,
        showSelectShareType: 0,
        storeQr: '',
        storeId: 0,
        goodsName: '',
        query: { category: 0, goodsName: '' },
        query2: {
            store_id: '',
        },
        query3: {
            store_id: '',
            keyword: "",
            type: 2,
        },
        query4: {
            store_id: '',
            type: 2
        },
        user: {},
        goodsList: [],

        offerList: [],
        quoteListKeyword: '',
        quoteBuyFlag: true,

        editting: false,
        isSelf: false,
        showQr: false,
        wechat: '',
        phone: '',
        picture2: [],
        picture3: [],
        picture4: [],
        selectedNav: 0,
        topNavs: [{ type: 1, name: '首页' }, { type: 2, name: '上新' }, { type: 3, name: '报价' }, { type: 4, name: '产品图集' }],
        chatList: [],
        tmpMapList: [],
        isAgent: 0,
        pageHude: false,

        assetsImages: assetsImages,
        ALIYUN_URL,
        userInfo: {},
        backgroundIamge: '',
        // backgroundIamge: '',
        topHeight: 0,
        statusBarHeight: 0,
        navTop: 0,
        showType: 0,
        showShopCarPop: false,
        goods_id: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let selectedNav = this.data.selectedNav;
        if (options.type) {
            selectedNav = options.type;
        } else {
            selectedNav = 1;
        }
        this.setData({ selectedNav: selectedNav })
        console.log(options.storeId);
        let storeId = options.storeId || 0
        let query = this.data.query;
        let query2 = this.data.query2;
        let query3 = this.data.query3;
        let query4 = this.data.query4;
        query.storeId = storeId;
        query2.store_id = storeId;
        query3.store_id = storeId;
        query4.store_id = storeId;
        this.setData({ query: query, query2: query2, query3: query3, query4: query4 })
        console.log(storeId)
        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo;
        console.log(userInfo)
        this.setData({ userInfo: userInfo })
        if (storeId > 0 && storeId != userInfo.user_id) {
            // this.setData({ storeId: storeId, query: { storeId: storeId }, query2: { store_id: storeId } })
            request.get('user/user/' + storeId, res => {
                if (res.success) {
                    let user = res.data.user
                    if (!(user instanceof Object)) {
                        user = JSON.parse(user)
                    }
                    this.setData({ user: user })
                }
            })
        } else {
            // this.setData({ query: { storeId: storeId }, storeId: storeId, query2: { store_id: storeId } })
            let storeId = userInfo.user_id;
            this.setData({ isSelf: true, user: userInfo, storeId: options.storeId })
            this.setData({ query: { storeId: storeId }, storeId: storeId, query2: { store_id: storeId }, query3: { store_id: '', keyword: '', type: 2 }, query4: { store_id: storeId, type: 2 } })
        }

        // let userInfo = app.globalData.userInfo;
        // console.log(userInfo);
        // let userId = options.userId || 0
        // if (userId > 0 && userInfo.user_id != userId) {
        //   this.setData({
        //     'query2.userId': userId
        //   })
        //   request.get('user/user/' + userId, res => {
        //     if (res.success) {
        //       let user = res.data.user
        //       if (!(user instanceof Object)) {
        //         user = JSON.parse(user)
        //       }

        //       if (user.background) {
        //         user.background = fileUrl(user.background)
        //       }

        //       this.setData({
        //         userInfo: user
        //       })
        //     }
        //   })

        // } else {
        //   let userInfo = JSON.parse(JSON.stringify(Object.assign(app.globalData.userInfo)))
        //   if (userInfo.background) {
        //     userInfo.background = fileUrl(userInfo.background)
        //   }
        //   this.setData({
        //     isSelf: true,
        //     userInfo: userInfo
        //   })
        // }
    },
    onShow() {
        const { topHeight, statusBarHeight, navHeight, navTop } = app.setCustomNav();
        this.setData({
            topHeight, 
            statusBarHeight,
            navHeight,
            navTop
        })
        if (this.data.pageHude) {
            let selectedNav = this.data.selectedNav;
            if (selectedNav == 1) {
                this.selectComponent('#pagination').initLoad()
            } else if (selectedNav == 2) {
                this.selectComponent('#pagination2').initLoad()
            } else if (selectedNav == 3) {
                this.selectComponent('#pagination3').initLoad()
            } else if (selectedNav == 4) {
                this.selectComponent('#pagination4').initLoad()
            }
            this.setData({ editting: false })
                // this.load({ detail: { list: [], page: 1 } }, 1)
        }
    },
    onHide() {
        this.setData({ pageHude: true })
    },
    splitTime(val_) {
        return val_.split(" ") || [val_, ''];
    },
    copy(e) {
        let val = e.currentTarget.dataset.content;
        copyText(val)
    },
    getAgent() {
        let isAuth = app.isAuthWxInfo()
        if (!isAuth) {
            toast('需要授权获取您的用户信息')
            return
        }
        let user = this.data.user
        wx.navigateTo({
            url: `/pages/applyAgent/index?storeId=${user.user_id}&storeName=${user.nickname}`
        })
    },
    toggleSelectShareType() {
        var show = this.data.showSelectShareType
            // this.setData({ showSelectShareType : !show})
        if (show == 1) {
            show = 2
        } else {
            show = 1
        }
        this.setData({ showSelectShareType: show })
    },
    closeMark() {
        this.setData({ showQr: false })
        this.setData({ showSelectShareType: 2 })
    },
    toggleCardHide() {
        this.closeMark()
    },
    toggleEdit() {
        this.setData({ editting: !this.data.editting })
    },

    changeCategory(categoryId) {
        this.setData({ 'query.category': categoryId })
        wx.nextTick(() => {
            let pagination = this.selectComponent('#pagination')
            this.setData({ goodsList: [] })
            pagination.initLoad()
        })
    },

    load(e) {
        // console.log(e);
        let rows = e.detail.list
        let page = e.detail.page
        console.log(page)
        if (rows.length == 0 && page == 1) {
            this.setData({ goodsList: null })
            return
        }
        if (page == 1) {
            this.setData({ goodsList: [] })
        }
        let goodsList = Object.assign([], this.data.goodsList)
        rows.forEach(row => {
            if (!row) {
                return
            }
            goodsList.push(row)
        })

        this.setData({ goodsList: goodsList })
    },
    load1(e) {
        // console.log(e);
        let isAgent = e.detail.isAgent;
        let rows = e.detail.list
        let page = e.detail.page
        if (rows.length == 0 && page == 1) {
            this.setData({
                chatList: null
            })
            return
        }
        if (page == 1) {
            this.setData({ chatList: [], tmpMapList: [] })
        }

        let chatList = Object.assign([], this.data.chatList)
        if (rows.length > 0) {
            rows = rows.map((v, i) => {
                v.picture = JSON.parse(v.picture)
                return v
            })
            let tmpMapList = this.data.tmpMapList

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
                v.url += '?chatId=' + v.chat_id
                let date = new Date(v.create_time * 1000)
                let m = date.getMonth() + 1
                let d = date.getDate();
                // console.log(d)
                if (m < 10) {
                    m = '0' + m
                }
                if (d < 10) {
                    d = '0' + d
                }
                let k = m + '' + d
                if (k in tmpMapList) {
                    tmpMapList[k].list.push(v)
                    // console.log(tmpMapList)
                } else {
                    tmpMapList[k] = {
                        list: [v],
                        m: m,
                        d: d
                    }
                    chatList.push(tmpMapList[k])
                    // console.log(chatList)
                }
            })

            // console.log(chatList)
            this.setData({
                tmpMapList,
                isAgent: isAgent,
                chatList
            })
        }
    },
    load2(e) {
        let rows = e.detail.list
        let page = e.detail.page
            // let isAgent =  e.detail.isAgent;
        if (rows.length == 0 && page == 1) {
            this.setData({
                picture2: null
            })
            return
        }
        if (page == 1) {
            this.setData({ picture2: [] })
        }

        if (rows.length > 0) {
            rows = rows.map((v, i) => {
                v.picture = JSON.parse(v.picture) 
                return v
            })
            let picture2 = this.data.picture2

            rows.forEach(v => {
                picture2.push(v)
            })
            this.setData({
                picture2,
                // isAgent: isAgent
            })
        }
    },
    load3(e) {
        console.log(e);
        let rows = e.detail.list
        let page = e.detail.page
        console.log(e.detail)
            // let isAgent =  e.detail.isAgent;
        if (rows.length == 0 && page == 1) {
            this.setData({
                offerList: null
            })
            return
        }
        if (page == 1) {
            this.setData({ offerList: [] })
        }

        if (rows.length > 0) {
            let offerList = this.data.offerList;
            rows.forEach(v => {
                v.update_time = this.splitTime(v.update_time);
                offerList.push(v)
            })
            this.setData({
                offerList: offerList,
            })
        }
    },
    bindinput_(e) {
        let target = e.currentTarget.dataset.target
        let update = {}
        update[target] = e.detail.value
        this.setData(update)
    },
    search3() {
        let query3 = this.data.query3;
        query3.keyword = this.data.quoteListKeyword;
        this.setData({ query3: query3, offerList: [] })
        this.selectComponent('#pagination3').initLoad()
    },
    copyName(e) {
        var val = e.currentTarget.dataset.copy_name;
        copyText(val)
    },
    quoteBuy(e) {
        let id = e.currentTarget.dataset.id;
        // let id = e.currentTarget.dataset.chat_id;
        let quoteBuyFlag = this.data.quoteBuyFlag;
        if (!quoteBuyFlag) return
        this.setData({ quoteBuyFlag: false })
        request.post('chat/doQuote', res => {
            if (res.success) {
                toast('已完成')
            }
            this.setData({ quoteBuyFlag: true })
        }, { id: id })

    },

    deleteChat(e) {
        let index = e.currentTarget.dataset.index
        let chatId = this.data.goodsList[index].chat_id;
        let id = this.data.goodsList[index].id;
        wx.showModal({
            title: '删除产品',
            content: '确定删除这个产品吗',

            success: (res) => {
                if (res.confirm) {
                    request.delete('product/' + id,res=>{
                    if(res.code == 200){
                        toast('删除成功');
                        this.setData({
                            goodsList: this.data.goodsList.filter(item => item.id != id)
                        })
                    }else{
                        errorToast(res.msg)
                    }
                    }, {})
                }
            }
        })
    },

    edit(e) {
        let index = e.currentTarget.dataset.index
        let chatId = this.data.goodsList[index].chat_id
        let id = this.data.goodsList[index].id;
        wx.navigateTo({
            url: '/pages/publish/newChat/edit?chatId=' + chatId + '&id=' + id
        })
    },

    getStoreQr() {
        let req = new Request()
        req.setConfig('responseType', 'arraybuffer')
        req.get('qr/store', res => {
            this.closeMark()
            let qrcode = wx.arrayBufferToBase64(res).replace(/[\r\n]/g, '')
            this.setData({ storeQr: qrcode, showQr: true })
            wx.nextTick(() => {
                this.draw1()
            })
        }, { storeId: this.data.storeId }).showLoading()
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
        let userInfo = this.data.user
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
    contact() {
        let isAuth = app.isAuthWxInfo()
        if (!isAuth) {
            toast('需要授权获取您的用户信息')
            return
        }
        this.getConcentInfo(this.data.user.user_id)
        this.setData({
            showlink: 1
        })
    },
    capy(e) {
        let content = e.currentTarget.dataset.content;
        if (content == '') {
            wx.showToast({
                title: '暂无微信',
                icon: 'none',
                duration: 1500
            })
            return
        }
        wx.setClipboardData({
            data: content,
            success(res) {
                wx.getClipboardData({
                    success(res) {
                        console.log(res.data) // data
                    }
                })
            }
        })
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
    hideMark() {
        this.setData({
            showlink: 2
        })
    },
    toggleType(e) {
        let type = e.currentTarget.dataset.type
        let selectedNav = this.data.selectedNav
        if (selectedNav == type) {
            return
        }
        this.setData({ selectedNav: type, userList: [] })
        wx.nextTick(() => {
            // if(type == 2) this.getMyImageTextList();
            // if(type == 3) this.getMyImageTextList();
            // this.selectComponent('#pagination').initLoad()
        })
    },
    // bindinput_(e) {
    //     let val = e.detail.value;
    //     this.setData({ goodsName: val })
    // },
    search() {
        let query = this.data.query
        query.goodsName = this.data.goodsName;
        this.setData({ query: query })
        let pagination = this.selectComponent('#pagination');
        pagination.initLoad()
    },
    isToLogin() {
        let userInfo = wx._getStorageSync('userinfo')
        if (!userInfo.nickname || !userInfo.isAuth) {
            wx._setStorageSync("nav_key", 'swit')
            app.requireLogin('/pages/index/index')
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
    // 获取我的图文列表
    getMyImageTextList() {
        let data = { type: 2 };
        request.get('user/getMyImageTextList', res => {
            console.log(res);
            if (res.success) {
                this.setData({ picture2: res.data.list })
                this.setData({ picture4: res.data.list })
            } else {
                wx._showToast(res.msg)
            }
        }, data)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        let pages = getCurrentPages()
        let page = pages[pages.length - 1]
        let to = encodeURIComponent(page.route + '?storeId=' + this.data.storeId)
        console.log(to);
        let uesr_id = app.globalData.userInfo.user_id
        let path = '/pages/index/index?f=s&fi=' + uesr_id + '&path=' + to + '&fromUserId=' + uesr_id
        console.log(path);

        // let title = this.data.isSelf?'快进来看看我的iME社电吧，超值好物好服务！一件代发，代理兼职副业天天赚~':'我很喜欢这家iME社电，分享给亲，你也来看看吧~'
        // let title = this.data.isSelf ? '卖货！分销！代理！招商…！超值好物！分享躺赚！跟着我就赚钱！！！':'我很喜欢这家iME社电，分享给亲，你也来看看吧~'
        let title = this.data.isSelf ? '好生意，用iME！早用早赚钱！不用守店！0抽成！客户天天来！' : '我很喜欢这家iME社电，分享给亲，你也来看看吧~'
        return {
            path: path,
            title: title
        }
    },
    // 切换展示效果
    handleChangeShowType() {
        this.setData({
            showType: this.data.showType ? 0 : 1
        })
    },
    handleBack() {
        wx.navigateBack({
          delta: 1,
        })
    },
    isAuth_(e) {
        if(!this.isToLogin()) return;
        app.requireLogin(e.currentTarget.dataset.url)
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