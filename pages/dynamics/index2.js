import {
	Request,
	toast,
	formatDate,
	fileUrl
} from '../../utils/util.js'
import {
	ALIYUN_URL
} from '../../utils/config.js'
let request = new Request()
let app = getApp()
wx.Page({
	data: {
		isFirst: true,
		chatList: [],
		bargain: {},
		
		page: 1,
		hasmore: true,
		nav_loading: false,
		ajaxing: false,
		totalnum:0,
		list: [],
	},
	onLoad(opts){
		// this.reset_list();
		// this.getList()
	},
	onShow() {
		if (typeof this.getTabBar === 'function' && this.getTabBar()) {
			this.getTabBar().setData({
				selectedIndex: 1
			});
		}
	},
	onReady(){
		this.getDynamics()
	},
	reset_list(include_list){
		if (typeof include_list == 'undefined') {
			include_list = false
		}
		this.setData({
			hasmore: true,
			ajaxing: false,
			page: 1
		})
		if (include_list) {
			this.setData({
				list: [],
				totalnum: 0
			})
		}
	},
	next_page(){
		if (this.data.ajaxing || !this.data.hasmore) return;
		this.data.page = parseInt(this.data.page) + 1
	},
	getList(showLoading, show_navloading){
		if (!this.data.hasmore || this.data.ajaxing) return;
		if (typeof (showLoading) == 'undefined') showLoading = false;
		if (typeof (show_navloading) == 'undefined') show_navloading = false;
		if (showLoading) wx._showLoading('加载中...');
		if (show_navloading) this.setData({nav_loading: true});

		let data= {
		  page:this.data.page,
			lastPk:this.data.chatList.length>0?this.data.chatList[this.data.chatList.length-1].chat_id:0,
			last: 1,
			pageSize:20
		};
		this.setData({ajaxing: true});
		this.get('/chat/dynamics',data).then(res=>{
			let resultList = res.data.list
			if (res.success) {
				if (resultList.length < data.pageSize){
				  this.setData({ hasmore : false})
				}
			  this.load({ detail: { list: res.data.list, page: 1 } }, 0)
			}
		})
	},
	getDynamics(){
		if (this.data.isFirst) {
		  this.setData({ isFirst : false})
		}else{
		  let chatList = this.data.chatList
		  if (chatList == null || chatList.length < 1) {
		    let pagination = this.selectComponent('#pagination')
		    pagination.initLoad()
		  }else{
		    let lastPk = chatList[0].chat_id
		    let req = new Request()
		    req.get('chat/dynamics', res => {
		      if (res.success && res.data.list.length > 0) {
		        this.load({ detail: { list: res.data.list, page: 1 } }, 1)
		      }
		    }, { lastPk: lastPk, last: 1 })
		  }
		  
		}
		if (typeof this.getTabBar === 'function' &&
		  this.getTabBar()) {
		  this.getTabBar().setData({
		    selectedIndex: 1
		  })
		}
	},
	load(e, last = 0) {
		let rows = e.detail.list
		let page = e.detail.page
		if (rows.length == 0 && page == 1) {
			this.setData({
				chatList: null
			})
			return
		}
		if (rows.length > 0) {
			let chatList = this.data.chatList
			rows.forEach(v => {
				switch (v.chat_type) {
					case 1:
						v.url = '/pages/chat/index';
						break;
					case 2:
					case 4:
					case 5:
						v.url = '/pages/goods/index';
						break;
				}
				v.url += '?chatId=' + v.chat_id
				v.create_time = formatDate(v.create_time)
				v.picture = JSON.parse(v.picture)
				if (last == 0) {
					chatList.push(v)
				} else {
					console.log('unshift');
					chatList.unshift(v)
				}
			})
			this.setData({
				chatList: chatList,
				ajaxing:false
			})
		}
	},

	praise(e) {
		let dataset = e.currentTarget.dataset
		let index = dataset.index
		let chatId = dataset.id
		let praise = dataset.praise
		request.get(praise == 0 ? 'chat/praise' : 'chat/unpraise', res => {
			if (res.success) {
				let update = {}
				update[`chatList[${index}].praise`] = praise == 0 ? 1 : 0
				this.setData(update)
			} else {
				toast(res.msg)
			}
		}, {
			id: chatId
		})
	},

	down(e) {
		let _this = this;
		let index = e.currentTarget.dataset.index
		let urls = _this.data.chatList[index].picture;
		let urlsNum = urls.length;
		let num = 0;
		wx.authorize({
			scope: 'scope.writePhotosAlbum',
			success() {
				wx.getSetting({
					success(res) {
						if (res.authSetting['scope.writePhotosAlbum']) {
							wx.showLoading({
								title: '下载中...'
							})
							urls.forEach(url => {
								wx.downloadFile({
									url: ALIYUN_URL + '/' + url,
									success: res => {
										wx.saveImageToPhotosAlbum({
											filePath: res.tempFilePath,
											success: res => {
												console.log(res)
												num++
												wx.hideLoading()
												if (num == urlsNum) {
													num = 0
													wx.showToast('已下载至相册')
												}
											},
											fail: res => {
												console.log(res)
												wx.hideLoading()
											}
										})
										console.log(res)
									},
									fail: res => {
										wx.hideLoading()
										console.log(res)
									}
								})
							})
						} else {
							wx.hideLoading()
							wx._showAlert('您已拒绝系统相册权限，您可以在小程序设置界面（右上角 - 关于 - 右上角 - 设置）进行授权设置。');
							return;
						}
					}
				})
			},
			fail: function() {
				wx._showAlert('您已拒绝系统相册权限，您可以在小程序设置界面（右上角 - 关于 - 右上角 - 设置）进行授权设置。');
				return;
			}
		})
	},
	toBargain(e) {
		let formId = e.detail.formId
		let index = e.target.dataset.index
		this.setData({
			'bargain.formId': formId,
			'bargain.index': index
		})
		wx.navigateTo({
			url: '/pages/deliveryAddress/index?target=select'
		})
	},
	selectAddress(address) {
		setTimeout(() => {
			let bargain = this.data.bargain
			let chat = this.data.chatList[bargain.index]
			let index = bargain.index
			request.post('bargain/start', res => {
				if (res.success) {
					let bargainId = res.data.id
					let update = {}
					update[`chatList[${index}].bargain`] = 1
					update[`chatList[${index}].bargain_id`] = bargainId
					this.setData(update)
					wx.navigateTo({
						url: '/pages/bargain/index?id=' + bargainId
					})
				} else {
					toast(res.msg)
				}
			}, {
				id: chat.chat_id,
				address: address.id,
				formId: bargain.formId
			}).showLoading()
		}, 500)
	},
	goOnBargain(e) {
		let bargainId = e.currentTarget.dataset.id
		wx.navigateTo({
			url: '/pages/bargain/index?id=' + bargainId
		})
	},
	onShareAppMessage: function (e) {
	  if (e.from === 'button') {
	    let queryStr = '?'
	    let chat = this.data.chatList[e.target.dataset.index]
	    let chatId = chat.chat_id
	    let chatType = chat.chat_type
	    let from = (chatType == 2 || chatType == 4 || chatType == 5) ? 'goods' : 'chat'
	    queryStr += ('from=' + from)
	    queryStr += ('&chatId=' + chatId)
	    queryStr += ('&fromUserId=' + app.globalData.userInfo.user_id)
	    if (chatType == 4) {
	      let sharer = app.globalData.userInfo.user_id
	      queryStr += ('&sharer=' + sharer)
	      queryStr += '&dst=share'
	    }
	    let data = {
	      path: '/pages/index/index?scene=' + encodeURIComponent(queryStr)
	    }
	    if(chatType == 1) {
	      data.title = '分享一个有趣的故事给你'
	    }else{
	      data.title = chat.goods_name
	    }
	    if(chat.picture.length > 0) {
	      data.imageUrl = fileUrl(chat.picture[0])
	    }
	    return data
	  } else {
	  }
	},
	/**
	* 页面相关事件处理函数--监听用户下拉动作
	*/
	onReachBottom: function () {
	  this.next_page();
	  this.getList()
	},
	onPullDownRefresh: function () {
	  this.reset_list()
	  this.getList(false, true)
		setTimeout(function () {
			// 不加这个方法真机下拉会一直处于刷新状态，无法复位
			wx.stopPullDownRefresh()
		}, 100)
	}
})
