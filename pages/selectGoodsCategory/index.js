import { Request, toast } from '../../utils/util.js'
let request = new Request()
wx.Page({
  data: {
    cateName : '',
    cateList: [],
    selectedId : 0,
  },

  select (e) {
    var categoryId = e.detail
    var pages = getCurrentPages()
    var page = pages[pages.length - 2]
    page.changeCategory(categoryId)
    wx.navigateBack({
      
    })
  },

  getList () {
    this.get('/categorys',{storeId:this.data.storeId}).then(res=>{
      if(res.success){
        this.setData({ cateList : res.data.list})
      }
    })
  },

  onLoad: function (options) {
    console.log(options);
    this.setData({ selectedId: options.categoryId || 0,storeId:options.storeId})
    this.getList()
  }
})