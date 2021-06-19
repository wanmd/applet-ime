import { Request, toast } from '../../../utils/util.js'
let request = new Request()
let app = getApp()
wx.Page({
    data: {
        chatType: '8',
        content: '',
        images: [],
        location: '',
        longitude: '',
        latitude: '',

        goods_name: '',
        barTitlle: '发布求购',
        userType: 0,
        backLabel: "<",
        user_id: 0
    },
    goback: function() {
        var pages = getCurrentPages();
        wx.showModal({
            title: '确定退出',
            content: '确定退出发布求购/编辑',
            success: res => {
                if (res.confirm) {
                    wx.navigateBack({
                        delta: pages.length - 2
                    })
                }
            }
        })
    },

    input(e) {
        let target = e.currentTarget.dataset.target
        let update = {}
        update[target] = e.detail.value
        this.setData(update)
    },
    uploadPic(e) {
        let d = new Date()
        let file = e.detail.value
        let index = parseInt(e.target.dataset.index)
        let images = JSON.parse(JSON.stringify(this.data.images))
        images.push({ file: file, id: d.getTime() })

        this.setData({ images: images })
    },
    uploadPic_(e) {
        let d = new Date()
        let file = e.detail.value
        let index = parseInt(e.target.dataset.index)
        let images = JSON.parse(JSON.stringify(this.data.images))
        images[index] = { file: file, id: d.getTime() }

        this.setData({ images: images })
    },
    clearPic(e) {
        let index = parseInt(e.target.dataset.index)
        let images = this.data.images
        images.splice(index, 1)

        this.setData({ images: images })
    },
    selectPostion() {
        wx.chooseLocation({
            success: res => {
                this.setData({ location: res.name, longitude: res.longitude, latitude: res.latitude })
            }
        })
    },

    clearLocation() {
        this.setData({ location: '', longitude: '', latitude: '' })
    },

    submit() {
        let data = {
            chatType: this.data.chatType,
            content: this.data.content,
            picture: [],
            location: this.data.location,
            longitude: this.data.longitude + '',
            latitude: this.data.latitude + '',
        }

        // let data = { chatType: this.data.chatType, content: this.data.content }
        let images = this.data.images
        images.forEach(v => {
            if (v.file !== '') {
                data.picture.push(v.file)
                    // data.picture = v.file;
            }
        })
        if (data.content === '') {
            toast('写点东西吧~')
            return
        }
        if (data.content.length > 800) {
            toast('输入内容请不要超过800字')
            return
        }
        request.post('publish', res => {
            if (res.success) {
                toast('发布成功')
                app.newPublish = true
                if (this.data.chatId > 0) {
                    wx._navigateBack()
                } else {
                    getApp().globalData.dynamics.type = 3;
                    wx._switchTab('/pages/dynamics/index')
                }
            } else {
                toast(res.msg)
            }
        }, data).showLoading();
    },

    onLoad: function(options) {}


})