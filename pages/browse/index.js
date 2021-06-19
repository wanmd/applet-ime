import { Request, toast, alert, queryParams } from '../../utils/util.js'
import { ALIYUN_URL } from '../../utils/config.js'
let request = new Request();
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: ALIYUN_URL,
        currentType: 1,
        goodsList: [],
        query: {},

        rentingList: [],
        rentingType: 0,
        rentingListKeyword: '',
        query2: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
        this.setData({
            userInfo: userInfo,
        })
        this.onInit();
    },
    onInit() {
        request.setMany(true);

        request.setMany(false)
    },
    load(e) {
        console.log(e);
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
    load2(e, last = 0) {
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
    toGoodsDetail(e) {
        wx._navigateTo(`/pages/goods/index?chatId=${e.currentTarget.dataset.chatid}`)
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

    toggleType(e) {
        let currentType = e.currentTarget.dataset.type;
        this.setData({ currentType: currentType })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})