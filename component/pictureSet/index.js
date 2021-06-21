import { ALIYUN_URL } from '../../utils/config.js'
let app = getApp()
Component({
    properties: {
        pictureSet: {
            type: Array,
            value: []
        },
        listLeft: {
            type: Boolean,
            value: false
        },
        margin: {
            type: Number,
            value: 18
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        width: '0rpx',
        height: '0rpx',
        baseUrl: ALIYUN_URL,
        picture: [],
        size: '',
        new_pictureSet: []
    },

    observers: {
        pictureSet() {
            let picture = []
            this.properties.pictureSet.forEach(v => {
                v = ALIYUN_URL + '/' + v
                picture.push(v)
            })
            this.setData({ 
                picture: picture,
                new_pictureSet: picture
            })
        }
    },

    lifetimes: {
        ready() {
            let l = this.data.pictureSet.length;
            let windowWidth = app.systemInfo.windowWidth
            const query = this.createSelectorQuery()
            query.select('#container').boundingClientRect()

            query.exec(res => {
                let WIDTH = res[0].width * (750 / windowWidth)
                if (l == 2 || l == 4) {
                    let size = (WIDTH - this.properties.margin * 2) / 2 + 'rpx'
                    this.setData({ size: size })
                } else {
                    let size = (WIDTH - this.properties.margin * 2) / 3 + 'rpx'
                    this.setData({ size: size })
                }
            })
        }
    },

    methods: {
        previewImage(e) {
            let index = parseInt(e.currentTarget.dataset.index)
            let current = this.data.picture[index]
            wx.previewImage({
                current: current,
                urls: this.data.picture
            })
        }
    }
})