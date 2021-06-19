import { Request, toast, alert, queryParams } from '../../../../../utils/util.js'
// import { Request, toast, alert, queryParams } from '../../utils/util.js';
let request = new Request();
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SMFlag: true,
    tapList: { 1: '今天', 2: '昨天', 3 : '近7天', 4: '上月'},
    tapIndex: 1,
    selectedNav : 1,
    topNavs: [{ type: 1, name: '店铺销售数据' }, { type: 2, name: '产品销售数据' }],
    assetsImages: app.assetsImages,
    quantity: {},
    query: {},
    goodsList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onInit();
  },
  onInit (){
    request.setMany(true);

    this.getStoreOrderInfo();

    request.setMany(false)
  },
  toggleType (e) {
    let type = e.currentTarget.dataset.type
    let selectedNav = this.data.selectedNav
    if (selectedNav == type) {
      return
    }
    if(type==2){
      // this.getRedPacketRecord();
    }
    this.setData({ selectedNav: type, userList: []})
  },
  // 获取我的店铺销售数据
  getStoreOrderInfo(){
    let data = {};
    request.get('user/getStoreOrderInfo', res=>{
      console.log(res);
      if(res.success) {
          this.setData({
            quantity: res.data.info
          })
      }else{
          wx._showToast(res.msg)
        // toast(res.msg)  
      }
    }, data).showLoading()
  },
  load(e) {
    let rows = e.detail.list
    let page = e.detail.page
    console.log(page)
    if (rows.length == 0 && page == 1) {
      this.setData({ goodsList: null})
      return
    }
    if (page == 1) {
      this.setData({ goodsList: []})
    }
    let goodsList = Object.assign([], this.data.goodsList)
    rows.forEach(row => {
      if(!row) {
        return
      }
      goodsList.push(row)
    })

    this.setData({ goodsList: goodsList })
  },
  // 获取我的店铺产品销售数据
  getRedPacketRecord(){
    let data = {};
    request.get('user/getStoreSaleGoodsList', res=>{
      console.log(res);
      if(res.success) {
          this.setData({
            logList: res.data.list
          })
      }else{
          wx._showToast(res.msg)
        // toast(res.msg)  
      }
    }, data).showLoading()
  },
})