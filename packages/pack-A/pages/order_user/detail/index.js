import { Request, toast, alert, copyText, parseTime } from '../../../../../utils/util.js'
import { ALIYUN_URL } from '../../../../../utils/config.js'
let request = new Request()
var numberInter = null
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ALIYUN_URL,
        assetsImages: app.assetsImages,
        baseUrl: ALIYUN_URL,
        orderId: 0,
        index: -1,
        showCancelConfirm: false,
        order: null,
        orderStatus: '',
        payType: {},
        payOrder: '',
        showlink: 0,

        resultName: '',
        result: '',

        receiveId: null,
        order_no: null,

        surplusTime: 0,
        endTime: 0,
        surplusObj: {
            day: "0",
            hou: "00",
            min: "00",
            sec: "00"
        },
        isShowTime: true,
        flagTime: true,
        otherUserInfo: {},
        total_price: 0,
        hx_flag: true,
        hx_val: '',

        vip_price: 0,
        amount_price: 0,

        verify_flag: false,
        selfPay_pic: false
    },

    copy() {
        copyText(this.data.payType.bank_account)
    },
    copyTxt(e) {
        let val = e.currentTarget.dataset.content;
        copyText(val)
    },

    upload(e) {
        this.setData({ payOrder: e.detail.value })
    },

    cancelOrder() {
        this.setData({ showCancelConfirm: true })
    },

    cancelCallback(e) {
        if (e.detail == 1) {
            this.setData({ showCancelConfirm: false })
            return
        }
        let pages = getCurrentPages()
        let page = pages[pages.length - 2]
        page.setData({ currentIndex: this.data.index })
        page.cancelCallback(e)
        wx.navigateBack({

        })
    },

    confirmBuy() {
        let receiveId = this.data.receiveId
        let order_no = this.data.order_no;
        if (receiveId == null) {
            toast('请选择收货地址')
            return
        }

        request.post('order/buy', res => {
            if (res.success) {
                let params = res.data.wxparam
                params.success = () => {
                        toast('支付成功')
                        this.onLoad({ 'orderId': this.data.orderId, 'index': this.data.index });
                        // setTimeout(function(){
                        //   wx.redirectTo({
                        //     url: '../index'
                        //   })
                        // }, 1000)
                    },
                    params.fail = () => {
                        toast('支付失败')
                    }

                wx.requestPayment(params)
            } else {
                toast(res.msg)
            }
        }, { receiveId: receiveId, orderNo: order_no, type: 2 }).showLoading()
    },
    confirm() {
        let payOrder = this.data.payOrder
        if (payOrder === '') {
            toast('请上传支付凭证')
            return
        }

        request.post('order/pay', res => {
            if (res.success) {
                toast('确定成功')
                let pages = getCurrentPages()
                let page = pages[pages.length - 2]
                page.updateOrderList(this.data.index)
                wx.navigateBack({})
            } else {
                toast(res.msg)
            }
        }, { order: payOrder, id: this.data.orderId })
    },
    cancel() {
        this.setData({ verify_flag: false })
    },
    confirmComplete() { //确定收货
        if (this.data.order.express_no != '') {
            wx.showModal({
                title: '确定收货',
                content: '确认快递信息并收货？',
                success: res => {
                    if (res.confirm) {
                        this.confirmCompleteApi()
                    }
                }
            })
        } else {
            this.setData({ verify_flag: true })
        }
    },
    confirmCompleteApi() { //确定收货
        let orderId = this.data.orderId

        request.post('order/complete', res => {
            if (res.success) {
                toast('确定成功')
                wx.redirectTo({
                        url: '../index?status=4'
                    })
                    // wx.navigateBack({})
                    // app.requireLogin('packages/pack-A/pages/order_user/index?status=4')
                    // this.onLoad({'orderId': this.data.orderId, 'index' : this.data.index});
                    // wx.redirectTo({
                    // url: '../index'
                    // })
            } else {
                toast(res.msg)
            }
        }, { id: orderId })
    },
    // 一键匹配拼单
    confirmGroupOrder() {
        let orderId = this.data.orderId

        request.post('order/group', res => {
            if (res.success) {
                toast('拼单成功')
                wx.redirectTo({
                        url: '../index?status=2'
                    })
                    // wx.navigateBack({})
                    // app.requireLogin('packages/pack-A/pages/order_user/index?status=4')
                    // this.onLoad({'orderId': this.data.orderId, 'index' : this.data.index});
                    // wx.redirectTo({
                    // url: '../index'
                    // })
            } else {
                toast(res.msg)
            }
        }, { orderId })
    },

    capy(e) {
        let content = e.currentTarget.dataset.content;
        if (content == '') {
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
    getqr() {
        // charSet: "UTF-8"
        // errMsg: "scanCode:ok"
        // rawData: "WVQyMDQ4MDI5MzYwMDM5"
        // result: "YT2048029360039"
        // scanType: "CODE_128"
        let that = this;
        wx.scanCode({
            success(res) {
                console.log(res)
                that.setData({ result: res.result });
                wx.showToast({
                    title: res.result,
                    icon: 'none',
                    duration: 5000
                });
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
    callNumPhone(e) {
        let pnum = e.currentTarget.dataset.phone;
        if (pnum == '') {
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
        request.setMany(true)
        request.get(
            'visit/contactInfo',
            res => {
                if (res.success) {
                    this.setData({ otherUserInfo: res.data });
                    request.setMany(false)
                }
            }, { userId: userId }
        );
    },
    contact() {
        this.getConcentInfo(this.properties.userId);
        this.setData({
            showlink: 1
        });
        // wx.navigateTo({
        //   url: '/pages/contact/index?userId=' + this.properties.userId,
        // })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let orderId = options.orderId
        var that = this;
        request.setMany(true);
        request.get('order/detail', res => {
            if (res.success) {
                let order = res.data.order

                let receiveId = order.receiveId
                let order_no = order.order_no

                that.getConcentInfo(order.store.user_id)

                order.create_time = parseTime(order.create_time)
                order.merchant_confirm_time = parseTime(order.merchant_confirm_time)
                order.pay_time = parseTime(order.pay_time)
                order.deliver_time = parseTime(order.deliver_time)
                order.complete_time = parseTime(order.complete_time)
                order.diff_time = order.group_time + 86400 - Math.floor(new Date().getTime()/1000)
                order.pickup_time = parseTime(order.pickup_time)

                let total_price = 0;
                let vip_price = 0;
                let amount_price = 0;
                order.goods.forEach(item => {
                    total_price += app.formatDecimal(item.sale_price) * item.quantity;
                    vip_price += app.formatDecimal(item.member_price) * item.quantity;
                    item.remarks = order.remarks;
                    let display = '';
                    if(item.product_specs) {
                        let specs =JSON.parse(item.product_specs);
                        for (let key in specs) {
                            display +=  specs[key] + '/'
                        }
                        display = display.substr(0, display.length -1);
                    }
                    item.product_specs = display;
                })
                amount_price = order.amount;


                order.delivery = {
                    consignee: order.consignee,
                    mobile: order.mobile,
                    province: order.province,
                    city: order.city,
                    district: order.district,
                    address: order.address,
                    remarks: order.remarks
                }
                this.setData({
                    order: order,
                    orderStatus: order.status,
                    receiveId: receiveId,
                    order_no: order_no,
                    total_price: total_price,
                    vip_price: vip_price,
                    amount_price: amount_price,
                    storeInfo: order.store
                })
                if (order.status == 2) {
                    this.hideHX();
                }

                if (order.surplusTime && order.surplusTime > 0) {
                    let surplusTime = order.surplusTime * 1000
                        // let surplusTime = 23456765
                    let nowTime = new Date().getTime(); //现在时间（时间戳）
                    // let endTime = nowTime + (order.surplusTime - 0);
                    let endTime = nowTime + (surplusTime - 0);
                    this.setData({ endTime: endTime, surplusTime: surplusTime })
                    this.countDown();
                } else {
                    this.setData({ isShowTime: false })
                }
                if (order.status == 1) { //待支付,取商家支付信息
                    let req = new Request()
                    req.get('order/merchantpay', res => {
                        if (res.success) {
                            res.data.amount = res.data.amount * 1
                            res.data.delivery_fee = res.data.delivery_fee * 1
                            this.setData({ payType: res.data })
                        }
                    }, { id: orderId })
                }

            } else {
                alert(res.msg)
            }
        }, { id: orderId }).showLoading()

        this.setData({ orderId: orderId, index: options.index, userInfo: wx.getStorageSync('userInfo') })
    },

    // 倒计时
    countDown: function() {
        let that = this;
        let surplusTime = this.data.surplusTime;
        if (surplusTime <= 0) return;
        let nowTime = new Date().getTime(); //现在时间（时间戳）
        let endTime = this.data.endTime;
        // let endTime = new Date(that.data.endTime).getTime();//结束时间（时间戳）
        let time = (endTime - nowTime) / 1000; //距离结束的毫秒数
        // let time = this.data.surplusTime / 1000;//距离结束的毫秒数
        // 获取天、时、分、秒
        let day = parseInt(time / (60 * 60 * 24));
        let hou = parseInt(time % (60 * 60 * 24) / 3600);
        let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
        let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
        // console.log(day + "," + hou + "," + min + "," + sec)
        day = that.timeFormin(day),
            hou = that.timeFormin(hou),
            min = that.timeFormin(min),
            sec = that.timeFormin(sec)
        let surplusObj = {
            day: that.timeFormat(day),
            hou: that.timeFormat(hou),
            min: that.timeFormat(min),
            sec: that.timeFormat(sec)
        };
        this.setData({ surplusObj: surplusObj })

        // 每1000ms刷新一次
        if (time > 0) {
            that.setData({
                countDown: true
            })
            let flagTime = this.data.flagTime;
            // console.log(flagTime)
            numberInter = setTimeout(this.countDown, 1000);
        } else {
            that.setData({
                countDown: false
            })
        }
    },
    onHide() {
        this.setData({ flagTime: false, countDown: false })
    },
    onUnload() {
        clearTimeout(numberInter)
    },
    //小于10的格式化函数（2变成02）
    timeFormat(param) {
        return param < 10 ? '0' + param : param;
    },
    //小于0的格式化函数（不会出现负数）
    timeFormin(param) {
        return param < 0 ? 0 : param;
    },

    input1(e) {
        let remarks = e.detail.value
        this.setData({
            resultName: remarks
        })
    },
    input2(e) {
        let remarks = e.detail.value
        this.setData({
            result: remarks
        })
    },
    hideHX() {
        let hx_flag = !this.data.hx_flag;
        let hx_val = this.data.order.verify_no;
        if (hx_val != '') {
            hx_val = hx_val.substring(0, 1) + "***" + hx_val.substring(hx_val.length - 1, hx_val.length)
        } else {
            hx_val = "****";
        }
        this.setData({
            hx_flag: hx_flag,
            hx_val: hx_val
        })
    },
    // 查看付款凭证
    toggleViewSelfPay() {
        this.setData({
        selfPay_pic: !this.data.selfPay_pic
        })
    },
    daohang() {
        const { storeInfo } = this.data;
        if (!storeInfo.lat || !storeInfo.lng) {
            toast('该商家暂未设置位置信息');
            return
        }
        wx.openLocation({
            latitude: Number(storeInfo.lat),//要去的纬度-地址
            longitude: Number(storeInfo.lng),//要去的经度-地址
        })
    },
    previewImage (e) {
        let img = e.currentTarget.dataset.img;
        let imgs = e.currentTarget.dataset.imgs;
        let urls = []
        let url = ALIYUN_URL + '/' + img
        for(let i=0;i<imgs.length;i++){
        let curl = ALIYUN_URL + '/' + imgs[i]
        urls.push(curl)
        }
        wx.previewImage({
        current: url,
        urls: urls 
        })
    },
})