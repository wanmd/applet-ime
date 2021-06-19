import { Request, toast } from '../../utils/util.js'
let request = new Request()
wx.Page({
  data: {
    cateName : '',
    cateList: [],
    selectedIndex : -1,
    storeId:''
  },

  input (e) {
    this.setData({cateName : e.detail.value})
  },

  addCategory () {
    let name = this.data.cateName
    if(name === ''){
      return
    }

    request.post('cateogry/add', res => {
      if(res.success){
        let index = this.data.cateList.length
        let update = { cateName : ''}
        update[`cateList[${index}]`] = {id : res.data.id, name : name, count : 0}
        this.setData(update)
      }else{
        toast(res.msg)
      }
    }, {name : name})
  },

  select (e) {
    this.setData({selectedIndex : e.detail})
  },

  getList () {
    this.get('/categorys',{storeId:this.data.storeId}).then(res=>{
      if(res.success){
        this.setData({ cateList : res.data.list})
      }
    })
    // request.get('categorys', res => {
    //   if(res.success){
    //     this.setData({ cateList : res.data.list})
    //   }
    // })
  },
  
  confirm () {
    let index = this.data.selectedIndex
    if(index < 0){
      wx.navigateBack()
      return
    }
    let cate = this.data.cateList[index]
    let pages = getCurrentPages()
    let parent = pages[pages.length - 2]
    parent.setData({ category_id: cate.id, category_name : cate.name})
    wx.navigateBack()
  },

  onLoad: function (opts) {
    if(opts.storeId) this.setData({storeId:opts.storeId})
    this.getList()
  }
})