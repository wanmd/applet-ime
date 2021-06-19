import { Request, toast } from '../../utils/util.js'
let request = new Request()
let page = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index : 0,
    id : 0,
    cateName : ''
  },

  input(e) {
    this.setData({ cateName: e.detail.value })
  },

  remove () {
    request.post('cateogry/remove/' + this.data.id, res => {
      if(res.success) {
        toast('删除成功')
        var cateList = page.data.cateList
        cateList.splice(this.data.index, 1)
        page.setData({ cateList })
        wx.navigateBack({
          
        })
      }else{
        toast(res.msg)
      }
    })
  },

  update () {
    request.post('cateogry/update', res => {
      if (res.success) {
        toast('删除成功')
        var cateList = page.data.cateList
        cateList[this.data.index]['name'] = this.data.cateName
        page.setData({ cateList})
        wx.navigateBack({

        })
      } else {
        toast(res.msg)
      }
    }, {id : this.data.id, name : this.data.cateName})
  },

  onLoad: function (options) {
    var pages = getCurrentPages()
    page = pages[pages.length - 2]
    var index = options.index
    var cate = page.data.cateList[index]
    var id = cate.id
    var cateName = cate.name
    this.setData({ id: id, cateName: cateName, index : index})
  }
})