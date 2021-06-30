import { Request, toast } from '../../../utils/util.js'
let request = new Request()
let app = getApp()

const arr = [
	{
		agent_price: "60",
		bargain_price: "",
		cost_price: "50",
		group_price: "90",
		index: 1,
		member_price: "80",
		name: "2",
		sale_price: "100",
		stock: "100",
		title: "1",
		url: "",
	}
]
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

        name: '',
        no: '',
        // sale_price: '',
        // vip_price: '',
        // agent_price: '',
        category_id: 0,
        category_name: '',
        add: true,
        barTitlle: 'iME爱迷',
        userType: 0,
        backLabel: "<",
        user_id: 0,
        src: "",        // 上传视频
        
        productCategoryId: null,
        isExpress: null,
        templateId: null,
        videoUrl: '',
        option1: [
            {
                value: 1,
                label: '7天无理由'
            },
            {
                value: 2,
                label: '特殊商品不退换'
            }
        ],
        option2: [
            {
                value: 1,
                label: '包邮'
            },
            {
                value: 2,
                label: '不包邮'
            }
        ],
        goods_skuList: [],
        id: null
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
        console.log(images);
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
    * 上传视频 目前后台限制最大100M, 以后如果视频太大可以选择视频的时候进行压缩
    */
   uploadVideo_(e) {
        let d = new Date();
        let file = e.detail.value;
        this.setData({
            videoUrl: file
        })
    },

    uploadVideo(e) {
        debugger
    },

    selectPostion() {
        wx.chooseLocation({
            success: res => {
                this.setData({ location: res.name, lng: res.longitude, lat: res.latitude })
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

     // 允许从相机和相册扫码
     handleScan() {
        // 允许从相机和相册扫码
        wx.scanCode({
            success (res) {
                console.log(res)
                this.setData({
                    no: res.data
                })
            }
        })
    },

    handleNav(e) {
        console.log(e.currentTarget.dataset.url);
        
        wx.navigateTo({
          url: e.currentTarget.dataset.url,
        })
    },

    setLabels(labels) {
        this.setData({
            labels: labels
        })
    },

    setRemarks(remark) {
        this.setData({
            remark: remark
        })
    },

    setProductCategoryId(currentSelect) {
        this.setData({
            productCategoryId: currentSelect
        })
    },

    setCategoryIds(categoryIds) {
        this.setData({
            categoryIds
        })
    },

    // setTemplate(template) {
    //     this.setData({
    //         template
    //     })
    // },

    setGoods_skuList(goods_skuList) {
        console.log(goods_skuList);
        this.setData({
            goods_skuList
        })
    },

    radioChange(e) {
        console.log(e);
        this.setData({
            serviceSetting: e.detail.value
        })
    },

    radioChangeExpress(e) {
        this.setData({
            isExpress: e.detail.value
        })
    },

    handleAddSku() {
        wx.navigateTo({
          url: '/pages/goodsSku/index',
        })
    },
    handleEditSku() {
        wx.navigateTo({
            url: '/pages/goodsSku/index?isEdit=' + 1,
        })
        //数据挂在app
        app.globalData.skuData.isEdit = true 
    },
    // 编辑提交
    submit() {
        console.log(this.data);

        let data = { chatType: this.data.chatType, content: this.data.content, imageUrls: [] }
        let images = this.data.images
        images.forEach(v => {
            if (v.file !== '') {
                data.imageUrls.push(v.file)
            }
        })
        if (data.chatType == 1) {
            if (data.content === '' && data.imageUrls.length == 0) {
                toast('写点东西或者上传些图片吧~')
                return
            }
            data.reward = this.data.reward
        } else { //商品
            data.name = this.data.name
            if (data.name === '') {
                toast('请填写产品标题~')
                return
            }

            if (data.content === '') {
                toast('写点东西~')
                return
            }

            if (data.imageUrls.length == 0) {
                toast('请上传商品图片~')
                return
            }

            if (!this.data.categoryIds.length) {
                toast('请选择店铺分类~')
                return
            }

            data.no = this.data.no
            data.add = this.data.add
            // 视频地址
            data.videoUrl = this.data.videoUrl
            // 来源
            data.sourceChatId = this.data.sourceChatId || 0
            // 产品分类ID
            if (!this.data.productCategoryId) {
                toast('请选择产品分类~')
                return
            }
            data.productCategoryId = this.data.productCategoryId.id;
            // 店铺分类数组categoryIds
            if (!this.data.categoryIds.length) {
                toast('请选择店铺分类~')
                return
            }
            data.categoryIds = [];
            this.data.categoryIds.forEach(item => {
                data.categoryIds.push(item.id)
            })
            // 标签数组
            if (!this.data.labels) {
                toast('请选择标签~')
                return
            }
            if (Array.isArray(this.data.labels)) {
                data.labels = this.data.labels;
            } else {
                data.labels = this.data.labels.split(',');
            }
            
            // 备注
            data.remark = this.data.remark;
            // attribute 规格数组
            data.attribute = [];
            //  商品规格
            let { goods_skuList, excel_skuList } = app.globalData.skuData;
            // console.log(goods_skuList);
            // console.log(excel_skuList);
            
            if (!excel_skuList.length) {
                toast('请添加商品规格~')
                return
            }
            if (!goods_skuList.length) {
                toast('请添加商品规格~')
                return
            }

            goods_skuList.forEach(item => {
                let obj = {};
                obj.name = item.title;
                obj.value = [];
                item.skuList.forEach(citem => {
                    obj.value.push(citem.name)
                })
                data.attribute.push(obj)
            })

            // specs sku数组
            data.specs = [];
            excel_skuList.forEach(item => {
                if (item.title) {// 是数组说明改变过
                    item.productSpecs = {};
                    // 规格标题
                    let title_Arr = item.title.split('-');
                    // 规格类型
                    let name_Arr = item.name.split('-');
                    title_Arr.forEach((titem, tindex) => {
                        item.productSpecs[titem] = name_Arr[tindex]
                    })
                } else {
                    item.productSpecs =  item.product_specs;
                }
                data.specs.push(item)
                
            })
            // 运费 1-包邮 2-不包邮
            if (!this.data.isExpress) {
                toast('请选择运费设置~')
                return
            }
            data.isExpress = this.data.isExpress;
            data.templateId = this.data.templateId;
            // 服务设置
            if (!this.data.serviceSetting) {
                toast('请选择服务设置~')
                return
            }
            data.serviceSetting = this.data.serviceSetting || '';
            if (this.data.chatId > 0) {
                data.chatId = this.data.chatId
            }

        }

        let location = this.data.location
        if (location !== '') {
            data.location = location
        }
        let lng = this.data.lng
        let lat = this.data.lat

        if (lng !== '' && lat !== '') {
            data.lng = lng
            data.lat = lat
        } else {
            toast('定位数据有误，请重新定位')
            return
        }

        if (this.data.chatId > 0) {
            if (this.data.share == "dp" || this.data.share == "xc") {
                data.chatId = 0;
            } else {
                data.chatId = this.data.chatId
            }
        }
        console.log(data);

        if (this.data.share) {
            request.post('product', res => {
                if (res.success) {
                    toast('转存成功')
                    // app.newPublish = true;
                    // 清除之前保存的规格数据
                    app.globalData.goods_skuList = null;
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
        } else {
            request.put('product/' + this.data.id, res => {
                if (res.success) {
                    toast('编辑成功')
                    // app.newPublish = true;
                    // 清除之前保存的规格数据
                    app.globalData.goods_skuList = null;
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
        }

        
        

    },

    onLoad: function(options) {
        console.log(options);
        // const newArr = [
        //     {index: 1, name: "黄色-64g"},
        //     {index: 1, name: "黄色-128g"},
        //     {index: 1, name: "蓝色-64g"},
        //     {index: 1, name: "蓝色-128g"},
        //   ]
        // const data = newArr.map(item =>{
        // item = {
        //     ...item,
        //     ...this.data.rowItem
        // }
        // return item
        // })
        // console.log(data);
        // this.setData({
        //     goods_skuList: data
        // })
        
        let barTitlle = ''
        let chatType = options.type || 0
        let chatId = options.chatId || 0
        let share = options.share || 0
        let id = options.id || 0 // 产品id 新版本

        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
        let userType = userInfo.user_type;
        this.setData({
            userType: userInfo.user_type
        })

        this.setData({ chatType: chatType, chatId: chatId, share: share, id })
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
            this.getProductDetail(id)
            

            this.setData({ 
                chatId: chatId,
                sourceChatId: id
            })
        } else {
            barTitlle = '编辑'
            this.setData({ barTitlle: barTitlle })
            wx.setNavigationBarTitle({
                title: '编辑'
            })

            // this.getPublish(chatId)
            this.getProductDetail(id)
            

            this.setData({ chatId: chatId })
        }
    },
    getPublish(chatId) {
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

                    name: data.name,
                    no: data.no,
                    sale_price: data.sale_price || '',
                    vip_price: data.vip_price || '',
                    agent_price: data.agent_price || '',
                    category_id: data.category_id
                }

                if ('category_name' in data) {
                    update.category_name = data.category_name
                }
                data.productCategoryId = {
                    parent: {
                        name: ''
                    },
                    name: ''
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
    },
    getProductDetail(id) {
        request.get('product/' + id, res => {
            if (res.success) {
                console.log(res);
                
                let data = res.data
                    // let chatType = data.chat_type
                let update = {
                    chatType: data.chat_type || 2,
                    content: data.content,
                    location: data.location || '',
                    lat: data.lat || '',
                    lng: data.lng || '',

                    name: data.name,
                    no: data.no,
                    remark: data.remark,
                    videoUrl: data.video_url,
                    serviceSetting: data.service_setting,
                    templateId: data.template_id,
                    isExpress: data.is_express,
                    fee: {
                        type: data.service_setting === '7天无理由' ? 1 : 2
                    },
                    labels: data.labels.map(item => item.name),
                }
                // 产品品类
                update.productCategoryId = {
                    parent: {
                        name: data.parent_category_name
                    },
                    name: data.category_name,
                    id: data.category_id
                }
                // 商品规格数据
                if ('specs' in data) {
                    update.goods_skuList = data.specs;
                    // 设置globalData
                    let { attribute } = data;
                    let arr = [];
                    attribute.forEach(item => {
                        let obj = {};
                        obj.id = item.name;
                        obj.title = item.name;
                        obj.skuList = [];
                        item.value.forEach((iitem,iindex) => {
                            obj.skuList.push({
                                index: iindex, id: iitem, name: iitem,
                            })
                        })
                        arr.push(obj)
                    })
                    app.globalData.skuData = {
                        goods_skuList: arr,
                        excel_skuList: data.specs.map(item => {
                            item.salePrice = item.sale_price;
                            item.groupPrice = item.group_price;
                            item.memberPrice = item.member_price;
                            item.agentPrice = item.agent_price;
                            item.costPrice = item.cost_price;
                            return item
                        }),
                        isEdit: true // 编辑状态  这个状态很关键priceExcel里面数据做更新时会用到
                    }
                }
                // 店铺分类
                let categoryIds = [];
                data.categoryTrees.forEach(item => {
                    categoryIds.push({
                        parentName: item.name,
                        name: item.son.name,
                        id: item.son.id
                    })
                })
                update.categoryIds = categoryIds;

                if (data.image_urls) {
                    if (typeof data.image_urls == 'string') {
                        data.image_urls = data.image_urls.split(',')
                    }
                    let images = []
                    data.image_urls.forEach((v, i) => {
                        images.push({ file: v, id: i })
                    })

                    update.images = images
                }
                this.setData(update)
            } else {
                toast(res.msg)
            }
        }).showLoading()
    }

})