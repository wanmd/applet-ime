import { Request, toast, alert, queryParams } from '../../../../utils/util.js'
import { ALIYUN_URL } from '../../../../utils/config.js'
let request = new Request();
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseUrl: ALIYUN_URL,
        rentingList: [],
        rentingType: 0,
        rentingListKeyword: '',
        query: {
            keyword: '',
            user_id: '',
            type: 0,
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo;
        let query = this.data.query;
        query.user_id = userInfo.user_id;
        this.setData({
            userInfo: userInfo,
            query: query
        })
    },
    load(e, last = 0) {
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
    deleteBtn(e) {
        let id = e.currentTarget.dataset.id
        let chat_id = e.currentTarget.dataset.chat_id
        let data = { id: id, chat_id: chat_id };
        wx.showModal({
            title: '确删除此条租赁信息？',
            content: '确认后之前发布的求租赁信息将被删除。',
            success: res => {
                if (res.confirm) {
                    this.delLeaseAPI(data)
                }
            }
        })
    },
    delLeaseAPI(data) {
        request.post('chat/delLease', res => {
            if (res.success) {
                this.setData({ rentingList: [] })
                this.selectComponent('#pagination').initLoad()
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