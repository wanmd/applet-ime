import { Request, toast } from '../../../../utils/util.js'
let request = new Request()
Array.prototype.uniq = function() {
 return [...new Set(this)];
}
Page({
  data: {
    cateName : '',
    cateList: [],
    selectedIndex : -1,
    height: 500,
    letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    cateItem: [],
  },

  input (e) {
    this.setData({cateName : e.detail.value})
  },

  addCategory () {
    let name = this.data.cateName
    if(name === ''){
	  toast('请填写分类名称')
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
    console.log(e)
    this.setData({selectedInd : e.currentTarget.dataset.ind, selectedIndex : e.currentTarget.dataset.index})
  },

  getList () {
    let letterObj = {};
    this.data.letter.forEach((item) => {
      letterObj[item] = {
        "letter": item,
        "data":[]
      };
    })
    request.get('order/getExpressList', res => {
      if(res.success){
        let dataList = res.data.list;
        let cateList = [];
        dataList.forEach((item) => {
          letterObj[item.cate].data.push(item);
        })
        for(let name in letterObj){
          cateList.push(letterObj[name])
        }
        console.log(cateList)
        this.setData({ cateList : cateList})
      }
    })
  },
  confirm_(e){
    let index = e.currentTarget.dataset.index;
    console.log(index)
    let cate = this.data.cateItem[index];
    this.cateItemFill(cate);
    let pages = getCurrentPages()
    let parent = pages[pages.length - 2]
    parent.setData({ resultId: cate.id, resultName : cate.name})
    wx.navigateBack()
  },
  cateItemFill (item_){
    let cateItem = this.data.cateItem;
    cateItem = cateItem.filter(item => item.id!=item_.id )
    cateItem = cateItem.filter((item, index) => index < 3 )
    cateItem.unshift(item_)
    wx._setStorageSync('cateItem', cateItem);
  },
  confirm () {
    let ind = this.data.selectedInd
    let index = this.data.selectedIndex
    if(index < 0){
      wx.navigateBack()
      return
    }
    let cate = this.data.cateList[ind].data[index]
    this.cateItemFill(cate)
    let pages = getCurrentPages()
    let parent = pages[pages.length - 2]
    parent.setData({ resultId: cate.id, resultName : cate.name})
    wx.navigateBack()
  },

  handleLetters(e) {
    const Item = e.currentTarget.dataset.item;
    this.setData({
      cityListId: Item
    });
  },
  onLoad: function (options) {
    let that = this;
    let cateItem = wx.getStorageSync('cateItem') || []
    wx.getSystemInfo({
      success: function(res) {
        // 计算主体部分高度,单位为px
        that.setData({
          height: res.windowHeight,
          cateItem: cateItem
        })
      }
    })
    this.getList()
  }
})