// packages/pack-A/pages/shopGoodsList/index.js
import { Request, toast } from '../../../../utils/util.js'
let request = new Request()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    error: undefined,
    loading: false,
    allCategoryMenu: false, // 是否展开所有二级分类
    current: 1, // 顶部导航activeIndex
    sidebarId: 1,
    // 左侧一级分类列表
    sidebarData: [],
    // 二级分类列表
    commodityList: [],
    // 搜索关键字
    goodsName: '',
		goodsList: new Array(20),
		cartGoodsQuantity: '0',
		currentTab: 0,
		navScrollLeft: 0,
		page: 1,
		pageSize: 10,
		hasNextPage: true,
    showDown: true,
    // 自定义导航
    topHeight: 0,
    // statusBarHeight: 0, // 顶部状态栏
    // navTop: 0, // 胶囊按钮与顶部的距离
    // nav_button_height: 0, // 胶囊按钮高度
    navHeight: 0,
    navTop: 0,
    windowHeight: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    wx.getSystemInfo({
      success: res => {
        let statusBarHeight = res.statusBarHeight,
          navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
          navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight)*2;//导航高度

        this.setData({
          navHeight,
          navTop,
          menuButtonHeight: menuButtonObject.height,
          windowHeight: res.windowHeight
        })
      },
      fail(err) {
        console.log(err);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData()
  },

  initData() {
    request.get('category/trees', res => {
      if(res.success){
        console.log(res);
        let { list } = res.data;
        let sidebarId = list.length > 0 ? list[0].id : null;
        let commodityList = [];
        list.forEach(item => {
          if (item.id === sidebarId) {
            commodityList = item.son
          }
        })
        console.log(commodityList);
        this.setData({ 
          sidebarData : list,
          sidebarId,
          commodityList,
        })
        console.log(this.data.commodityList);
      }
    }, {parentid: 0})
  },

  // 后退
  handleBack() {
    wx.navigateBack({
      delta: 1,
    })
  },

  // 切换顶部
  handleNav(e) {
    const { current } = e.currentTarget.dataset;
    this.setData({
      current
    })
  },

  //选择分类
	async sidebarClick(e) {
		const query = e.currentTarget ? e.currentTarget.dataset['id'] : e;
		if (query === this.data.sidebarId) return
    const { sidebarData } = this.data;
    
		this.setData({ 
      sidebarId: query, 
      currentTab: null,
      page: 1, 
      goodsList: [], 
      navScrollLeft: 0, 
      hasNextPage: true, 
      loading: true, 
      commodityList: sidebarData.filter(item => item.id == query)[0].son
    })
    this.setData({
      loading: false
    })
		// const commodityList = await getAllCategoryList({ categoryId: query });
		// console.log(commodityList)
		// if (commodityList.data.length == 0) {
		// 	let noCategory = await getCommunityGoodsList({ categoryId: query });
		// 	noCategory.records.forEach(e => {
		// 		e.tagList = e.tagList.slice(0, 2)
		// 	})
		// 	this.setData({ goodsList: noCategory.records, loading: false, currentTab: 0 })
		// } else {
		// 	let myCommodityList = commodityList.data
		// 	myCommodityList = [...[{ categoryName: '全部', id: query }], ...myCommodityList]
		// 	this.setData({ commodityList: myCommodityList, loading: false, currentTab: 0 })
		// 	this.getGoodsList()

		// }
  },
  
  //展开所有分类
	handleAllCategory(e) {
		this.setData({
			allCategoryMenu: !this.data.allCategoryMenu
		})
  },
  
  //切换分类
	async switchNav(event) {
		//console.log(event)
		var cur = event.currentTarget.dataset.current;
		//每个tab选项宽度占1/5
		var singleNavWidth = this.data.windowWidth / 5;
		//tab选项居中                            
		this.setData({
			// navScrollLeft: 85
			navScrollLeft: ((cur - 2) * singleNavWidth) + 10
		})
		if (this.data.currentTab == cur) {
			return false;
		} else {
			this.setData({
				currentTab: cur,
				goodsList: [],
				allCategoryMenu: false,
				hasNextPage: true,
				page: 1,
			})
			// this.getGoodsList()
		}
  },

  // 监听input变化
  bindinput_(e) {
    console.log(e);
    this.setData({
      goodsName: e.detail.value
    })
  },

  // 确定搜索
  search(e) {
    const { target } = e.currentTarget.dataset;
    console.log(target);
  },

  
  async getGoodsList() {
		let cIdx = this.data.currentTab
		let categoryId = this.data.commodityList[cIdx].id
		//console.log(categoryId)
		let page = this.data.page
		let pageSize = this.data.pageSize
		let goodsListVal = this.data.goodsList
		let hasNextPage = this.data.hasNextPage
		let dataInfo = {
			categoryId: categoryId,
			page: page,
			pageSize: pageSize
		}
		if (!hasNextPage) {
			wx.hideLoading()
			return
		}
		// wx.showLoading({ mask: 'true', title: '加载中.....' })
		this.setData({
			loading: true
		})

		let goodsList = await getCommunityGoodsList(dataInfo);
		//console.log(goodsList)

		if (goodsList.records != undefined) {
			//console.log(goodsListVal)
			//console.log(goodsList.records)
			goodsList.records.forEach(e => {
				e.tagList = e.tagList.slice(0, 2)
			})
			goodsListVal = [...goodsListVal, ...goodsList.records]
			setTimeout(() => {
				this.setData({
					goodsList: goodsListVal,
					hasNextPage: goodsList.hasNextPage,
					showDown: true,
					loading: false
				})
			}, 500)

		} else {
			this.setData({
				loading: false
			})
			wx.showToast({
				title: 'title',
			})
		}

	},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})