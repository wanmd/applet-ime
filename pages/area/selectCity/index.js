import { Request, toast } from '../../../utils/util.js'
let request = new Request()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        to: '',
        views: [],
        indexesList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    },

    selectIndex(e) {
        this.setData({ to: e.currentTarget.dataset.index })
    },

    selectArea(e) {
        let city = e.currentTarget.dataset
        let pages = getCurrentPages()
        let parent = pages[pages.length - 2]
        parent.selectCity(city)
        wx.navigateBack()
    },

    onLoad: function(options) {
        request.get('area/city', res => {
            let area = res.data.area
            let indexesList = this.data.indexesList
            let views = []
            indexesList.forEach(v => {
                let view = { index: v, city: [] }
                var _area = []
                area.forEach(item => {
                    let s = item.pinyin.toUpperCase().substr(0, 1)
                    if (s === v) {
                        view.city.push(item)
                    } else {
                        _area.push(item)
                    }
                })
                views.push(view)
                area = _area

            })

            this.setData({ views: views })


        })
    }
})