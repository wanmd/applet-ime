import { Request, toast } from '../../../utils/util.js'
let request = new Request()
let app = getApp()
wx.Page({
    data: {
        chatId: 0,
        chatType: 0,
        content: '',
        location: '',
        longitude: '',
        latitude: '',
        reward: false,
        images: [],

        goods_name: '',
        goods_no: '',
        sale_price: '',
        vip_price: '',
        agent_price: '',
        category_id: 0,
        category_name: '',
        add: true,
        barTitlle: 'iME爱迷',
        userType: 0,
        backLabel: "<",
        user_id: 0,
        src: "",        // 上传视频
    },
    goback: function() {
        var pages = getCurrentPages();
        wx.showModal({
            title: '确定退出',
            content: '确定退出发布产品/编辑',
            success: res => {
                if (res.confirm) {
                    // this.confirmCompleteApi()
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

    addImage() {
        let images = this.data.images
        let d = new Date()
        images.push({ file: '', id: d.getTime() })
        this.setData({ images: images })
    },

    uploadPic(e) {
        let d = new Date()
        let file = e.detail.value
        let index = parseInt(e.target.dataset.index)
        let images = JSON.parse(JSON.stringify(this.data.images))
        images.push({ file: file, id: d.getTime() })

        this.setData({ images: images })

        /**let update = {}
        update[`images[${index}].file`] = file
        if (index < 8) {
          let d = new Date()
          update[`images[${index + 1}]`] = { file: '', id: d.getTime() }
        }
        this.setData(update)*/
    },
    uploadPic_(e) {
        let d = new Date()
        let file = e.detail.value
        let index = parseInt(e.target.dataset.index)
        let images = JSON.parse(JSON.stringify(this.data.images))
            // images.push({ file: file, id: d.getTime()})
        images[index] = { file: file, id: d.getTime() }

        this.setData({ images: images })

        /**let update = {}
        update[`images[${index}].file`] = file
        if (index < 8) {
          let d = new Date()
          update[`images[${index + 1}]`] = { file: '', id: d.getTime() }
        }
        this.setData(update)*/
    },

    clearPic(e) {
        let index = parseInt(e.target.dataset.index)
        let images = this.data.images
        images.splice(index, 1)

        this.setData({ images: images })
    },

    /**
    * 选择视频
    */
    chooseVideo: function() {
        var _this = this;
        wx.chooseVideo({
            success: function(res) {
                _this.setData({
                    src: res.tempFilePath,
								})
								_this.uploadvideo()
						},
						fail: function(e) {
						}
        })
    },

    /**
    * 上传视频 目前后台限制最大100M, 以后如果视频太大可以选择视频的时候进行压缩
    */
    uploadvideo: function() {
			var src = this.data.src;
			debugger
			wx.uploadFile({
				url: 'upload/uploadpic',
				methid: 'POST',           // 可用可不用
				filePath: src,
				name: 'files',              // 服务器定义key字段名称
				// header: app.globalData.header,
				success: function() {
						console.log('视频上传成功')
				},
				fail: function() {
						console.log('接口调用失败')
				}
			})
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

    toSelectCategory() {
        wx.navigateTo({
            url: '/pages/goodsCategory/index'
        })
    },

    clearCategory() {
        this.setData({ category_id: 0, category_name: '' })
    },

    submit() {
        let data = { chatType: this.data.chatType, content: this.data.content, picture: [] }
        let images = this.data.images
        images.forEach(v => {
            if (v.file !== '') {
                data.picture.push(v.file)
            }
        })
        if (data.chatType == 1) {
            if (data.content === '' && data.picture.length == 0) {
                toast('写点东西或者上传些图片吧~')
                return
            }
            data.reward = this.data.reward
        } else { //商品
            data.goods_name = this.data.goods_name
            if (data.goods_name === '') {
                toast('请填写产品标题~')
                return
            }

            if (data.content === '') {
                toast('写点东西~')
                return
            }

            if (data.picture.length == 0) {
                toast('请上传商品图片~')
                return
            }

            data.sale_price = this.data.sale_price
            if (data.sale_price === '') {
                toast('请填写零售价格')
                return
            }
            if (data.sale_price <= 0) {
                toast('零售价格不能小于0元')
                return
            }

            data.vip_price = this.data.vip_price
            if (data.vip_price === '') {
                toast('请填写会员价格')
                return
            }
            if (data.vip_price <= 0) {
                toast('会员价格不能小于0元')
                return
            }

            data.agent_price = this.data.agent_price
            if (data.agent_price === '') {
                toast('请填写代理价格')
                return
            }
            if (data.agent_price <= 0) {
                toast('代理价格不能小于0元')
                return
            }
            
            if (!
                (
                    app.formatDecimal(data.sale_price) > app.formatDecimal(data.vip_price) &&
                    app.formatDecimal(data.vip_price) > app.formatDecimal(data.agent_price)
                )
            ) {
                toast('零售价>会员价>代理价')
                return
            }


            data.goods_no = this.data.goods_no
            data.add = this.data.add
            data.category_id = this.data.category_id
            if (this.data.chatId > 0) {
                data.chatId = this.data.chatId
            }

        }

        let location = this.data.location
        if (location !== '') {
            data.location = location
        }

        let lng = this.data.longitude
        let lat = this.data.latitude
        if (lng !== '' && lat !== '') {
            data.longitude = lng
            data.latitude = lat
        }

        if (this.data.chatId > 0) {
            if (this.data.share == "dp" || this.data.share == "xc") {
                data.chatId = 0;
            } else {
                data.chatId = this.data.chatId
            }
        }
        request.post('publish', res => {
            if (res.success) {
                toast('发布成功')
                app.newPublish = true
                if (this.data.chatId > 0) {
                    wx._navigateBack()
                } else {
                    // wx._switchTab('/pages/dynamics/index')
                    wx._switchTab('/pages/index/index')
                }
            } else {
                toast(res.msg)
            }
        }, data).showLoading()

    },

    onLoad: function(options) {
        let barTitlle = ''
        let chatType = options.type || 0
        let chatId = options.chatId || 0
        let share = options.share || 0

        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
        let userType = userInfo.user_type;
        this.setData({
            userType: userInfo.user_type
        })

        this.setData({ chatType: chatType, chatId: chatId, share: share })
        if (chatId == 0) { //编辑的
            if (chatType == 1) {
                barTitlle = '发布图文'
            } else {
                barTitlle = '发布产品'
            }

            this.setData({ barTitlle: barTitlle })
            wx.setNavigationBarTitle({
                title: barTitlle
            })

            // this.setData({ chatType: chatType })
        } else if (share == "dp" || share == "xc") {
            barTitlle = '一键转存'
            this.setData({ barTitlle: barTitlle })
            wx.setNavigationBarTitle({
                    title: '一键转存'
                })
                // request.get('chat/copayInfo?chatId='+ chatId , res => {
            request.get('chat/chat?id=' + chatId, res => {
                // console.log(res)
                if (res.success) {
                    // let data = res.data.chat
                    let data = res.data
                    let isAgent = data.isAgent || ''
                    let agent_price = data.agent_price;
                    if (!isAgent) agent_price = "0.00";
                    let update = {
                        // chatType : data.chat_type,
                        content: data.content,
                        location: data.location || '',
                        latitude: data.latitude || '',
                        longitude: data.longitude || '',
                        isAgent: isAgent,
                        goods_name: data.goods_name,
                        // goods_no: data.goods_no,
                        goods_no: "",
                        sale_price: data.sale_price || '',
                        vip_price: data.vip_price || '',
                        agent_price: agent_price,
                        category_id: data.category_id,
                        user_id: data.user_id,
                        category_name: ''
                    }
                    if (data.picture) {
                        if (typeof data.picture == 'string') {
                            data.picture = JSON.parse(data.picture)
                        }
                        let images = []
                        data.picture.forEach((v, i) => {
                            images.push({ file: v, id: i })
                        })

                        update.images = images
                    }

                    this.setData(update)
                } else {
                    toast(res.msg)
                }
            })
        } else {
            barTitlle = '编辑'
            this.setData({ barTitlle: barTitlle })
            wx.setNavigationBarTitle({
                title: '编辑'
            })
            request.get('publish/' + chatId, res => {
                if (res.success) {
                    let data = res.data
                        // let chatType = data.chat_type
                    let update = {
                        chatType: data.chat_type,
                        content: data.content,
                        location: data.location || '',
                        latitude: data.latitude || '',
                        longitude: data.longitude || '',

                        goods_name: data.goods_name,
                        goods_no: data.goods_no,
                        sale_price: data.sale_price || '',
                        vip_price: data.vip_price || '',
                        agent_price: data.agent_price || '',
                        category_id: data.category_id
                    }

                    if ('category_name' in data) {
                        update.category_name = data.category_name
                    }

                    if (data.picture) {
                        if (typeof data.picture == 'string') {
                            data.picture = JSON.parse(data.picture)
                        }
                        let images = []
                        data.picture.forEach((v, i) => {
                            images.push({ file: v, id: i })
                        })

                        update.images = images
                    }
                    this.setData(update)
                } else {
                    toast(res.msg)
                }
            })

            this.setData({ chatId: chatId })
        }


    }

})