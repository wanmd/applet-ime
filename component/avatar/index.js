// component/avatar/index.js
Component({
    properties: {
        src: {
            type: String,
            value: ''
        },
        size: {
            type: String,
            value: '80rpx'
        },
        vipsize: {
            type: String,
            value: '30rpx'
        },
        userId: {
            type: Number,
            value: ''
        },
        noPreviewImg: {
            type: String,
            value: '1'
        },
        user: {
            type: Object,
            value: {}
        },
        center: {
            type: Boolean,
            value: false
        },
        block: {
            type: Boolean,
            value: false
        },
        store: {
            type: Boolean,
            value: false
        },
        storeType: {
            type: String,
            value: '1'
        }

    },
    data: {


    },

    /**
     * 组件的方法列表
     */
    methods: {
        navTo() {
            let userId = this.properties.userId
            let storeFlag = this.properties.store;
            let storeType = this.properties.storeType;
            if (userId) {
                let url = storeFlag ? '/pages/store/index?storeId=' + userId + '&type=' + storeType : '/pages/homepage/index?userId=' + userId;
                wx.navigateTo({
                    url: url
                })
            }
        },
        previewImg: function(e) {
            let userId = this.properties.userId
            if (!userId && this.properties.noPreviewImg == 1) {
                var imgArr = [this.data.src];
                wx.previewImage({
                    current: imgArr[0], //当前图片地址
                    urls: imgArr, //所有要预览的图片的地址集合 数组形式
                    success: function(res) {},
                    fail: function(res) {},
                    complete: function(res) {},
                })
            }
        }
    }
})