import { Request, toast } from '../../../utils/util.js'
let request = new Request()
let app = getApp()
wx.Page({
    data: {
        chatType: 9,
        content: '',
        images: [],
        location: '',
        longitude: '',
        latitude: '',
        lease_type: 1,
        title: '',
        floor: '',
        room_number: '',
        supply_area: '',
        demand_area: '',
        mobile: '',

        goods_name: '',
        barTitlle: '发布租赁',
        userType: 0,
        backLabel: "<",
        user_id: 0,

        rentingArr: ['求租', '招租'],
        rentingIndex: 0,

        placeholder: '发布租赁信息请包含城市区域楼宇详细信息，场地详情描述和图文，以便最快的完成租赁供需交易。'


    },
    goback: function() {
        var pages = getCurrentPages();
        wx.showModal({
            title: '确定退出',
            content: '确定退出发布租赁',
            success: res => {
                if (res.confirm) {
                    wx.navigateBack({
                        delta: pages.length - 2
                    })
                }
            }
        })
    },
    // bindPickerChange(e) {
    //     console.log(e.detail.value)
    //     let target = e.currentTarget.dataset.target
    //     let update = {}
    //     update[target] = e.detail.value
    //     this.setData(update)
    // },

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
    setType(e) {
        let lease_type = e.target.dataset.type;
        this.setData({ lease_type: lease_type })

    },
    submit() {
        let data = {
            chatType: this.data.chatType,
            content: this.data.content,
            picture: [],
            location: this.data.location,
            longitude: this.data.longitude,
            latitude: this.data.latitude,

            lease_type: this.data.lease_type * 1,
            // lease_type: this.data.lease_type * 1 + 1,
            title: this.data.title,
            floor: this.data.floor,
            // room_number: this.data.room_number,
            // supply_area: this.data.supply_area,
            // demand_area: this.data.demand_area,
            mobile: this.data.mobile,
        }
        if (data.lease_type == 2) {
            data['room_number'] = this.data.room_number;
            data['supply_area'] = this.data.supply_area;
        } else {
            data['demand_area'] = this.data.demand_area;
        }

        let images = this.data.images
        images.forEach(v => {
            if (v.file !== '') {
                data.picture.push(v.file)
            }
        })
        if (data.content === '') {
            toast('写点东西吧~')
            return
        }

        if (data.title === '') {
            toast('请输入场地名称~')
            return
        }
        if (data.floor === '') {
            toast('请输入楼层~')
            return
        }
        if (data.mobile === '') {
            toast('请输入手机号码~')
            return
        }
        if (data.mobile.length != 11) {
            toast('请输入正确的手机号~')
            return
        }
        if (data.lease_type == 2) {
            if (data.picture.length === 0) {
                toast('请上传图片~')
                return
            }
            if (data.room_number == "") {
                toast('请输入房源具体房号/门牌号~')
                return
            }
            if (data.supply_area == "") {
                toast('请输入招租的场地面积/户型~')
                return
            }
        } else {
            if (data.demand_area == "") {
                toast('请输入求租的场地面积/户型~')
                return
            }
        }
        request.post('publish', res => {
            if (res.success) {
                toast('发布成功')
                app.newPublish = true
                if (this.data.chatId > 0) {
                    wx._navigateBack()
                } else {
                    getApp().globalData.dynamics.type = 4;
                    wx._switchTab('/pages/dynamics/index')
                }
            } else {
                toast(res.msg)
            }
        }, data).showLoading();
    },

    onLoad: function(options) {}


})