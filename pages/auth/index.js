import {
    Request
} from '../../utils/util.js'
let request = new Request()
let app = getApp()
wx.Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        isAuth: false
    },
    onLoad: function(options) {
        this.change("#fff")
        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo || null
            // wx.getStorage({
            //     key: 'userinfo',
            //     success: (res) => {
            //         let data = res.data
            //         console.log(data)
            // },
            // })
        if (userInfo) {
            this.change("#FFE200")
            this.setData({
                userInfo: userInfo,
                isAuth: userInfo.isAuth
            })
        }

    },
    getUserInfo(res) {
        let data = res.detail
            // console.log(data)
        if (data.userInfo) { //授权
            let params = {
                encryptedData: data.encryptedData,
                iv: data.iv,
                rawData: data.rawData,
                signature: data.signature
            }
            this.getUserInfoData(params)
                // app.reloadUserInfo(()=>{
                // 	this.getUserInfoData(params)
                // },'登录中...')
        } else {
            wx._removeStorageSync('nav_key')
            wx._navigateBack()
        }
    },
    getUserProfile(e) {
        console.log(e);
        // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
        // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
        wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            console.log(res);
            let userInfo = res.userInfo
            userInfo = Object.assign(app.globalData.userInfo, userInfo)
            userInfo.nickname = userInfo.nickName
            userInfo.avatar = userInfo.avatarUrl
            app.globalData.userInfo = userInfo
            wx._setStorageSync('userinfo', userInfo)
            this.change("#FFE200")
            this.setData({
                userInfo: userInfo,
                isAuth: true
            })

            let params = {
                nickname: res.userInfo.nickName,
                avatar: res.userInfo.avatarUrl,
            }
            this.updateNickName_Avatar(params)
            // this.getUserInfoData(params)
          }
        })
    },
    getPhoneNumber(res) {
        let data = res.detail
        console.log(data.errMsg)
        console.log(data.iv)
        console.log(data.encryptedData)
        if (data.errMsg === 'getPhoneNumber:ok') {
            this.getTel(data)
                // let params = {
                // 	encryptedData: data.encryptedData,
                // 	iv: data.iv,
                // }
                // this.getUserInfoData(params)
        } else {
            wx._removeStorageSync('nav_key')
            wx._navigateBack()
        }
    },
    getUserInfoData(params) {
        this.post('/userinfo', params).then(res => {
            console.log('getUserInfoData:获取用户信息');
            if (res.success) {
                let userInfo = res.data
                userInfo = Object.assign(app.globalData.userInfo, userInfo)
                app.globalData.userInfo = userInfo
                wx._setStorageSync('userinfo', userInfo)
                this.change("#FFE200")
                this.setData({
                    userInfo: userInfo,
                    isAuth: userInfo.isAuth
                })
            } else {
                wx._navigateBack()
                wx._showAlert(res.msg)
            }
        })
    },
    updateNickName_Avatar(params) {
        request.post('user/update', res => {
        if(res.success) {
            console.log(res);
            console.log('更新用户昵称和头像成功');
            wx._navigateBack()
        }else{
            wx._showAlert(res.msg)  
        }
        }, params)
    },
    getTel(params) {
        this.post('bindMobile', params).then(res => {
            if (res.success) {
                let userInfo = app.globalData.userInfo;
                userInfo.isAuth = true
                userInfo = Object.assign(app.globalData.userInfo, userInfo)
                app.globalData.userInfo = userInfo
                wx._setStorageSync('userinfo', userInfo)
                this.loginSuccess()
            } else {
                wx._removeStorageSync('userinfo')
                wx._navigateBack()
                wx._showAlert(res.msg)
            }
        })
    },
    loginSuccess: function() {
        // 登录成功后应该去到哪个页面
        console.log('登录成功:去到原来准备去的页面');
        let nav_key = wx.getStorageSync("nav_key")
        let url = wx.getStorageSync("url_key")
        wx._removeStorageSync('nav_key')
        wx._removeStorageSync('url_key')
        console.log(url)
        if (url != "" && nav_key == 'swit') {
            wx._switchTab(url)
        } else if (url != "") {
            wx._redirectTo(url)
        } else {
            wx._navigateBack()
        }

    },
    change: function(e) {
        wx.setNavigationBarColor({
            frontColor: '#ffffff', // 必写项
            backgroundColor: e, // 传递的颜色值
            animation: { // 可选项
                duration: 400,
                timingFunc: 'easeIn'
            }
        })
    },

    reject() {
        wx._removeStorageSync('url_key')
        wx._navigateBack()
    }
})