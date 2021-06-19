import {
	Request,
	toast,
	fileUrl
} from '../../utils/util.js'
let request = new Request()
let app = getApp()
wx.Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		query: {
			type: 1
		},
		chatList: [],
		tmpMapList : {},
		isSelf: false,
    	assetsImages: app.assetsImages,
		userInfo: {}
	},
	onLoad: function(options) {
		let userInfo = app.globalData.userInfo;
		console.log(userInfo);
		
		let userId = options.userId || 0
		if (userId > 0 && userInfo.user_id != userId) {
			this.setData({
				'query.store_id': userId
			})
			request.get('user/user/' + userId, res => {
				if (res.success) {
					let user = res.data.user
					if (!(user instanceof Object)) {
						user = JSON.parse(user)
					}

					if (user.background) {
						user.background = fileUrl(user.background)
					}

					this.setData({
						userInfo: user
					})
				}
			})

		} else {
			let userInfo = JSON.parse(JSON.stringify(Object.assign(app.globalData.userInfo)))
			if (userInfo.background) {
				userInfo.background = fileUrl(userInfo.background)
			}
			this.setData({
				isSelf: true,
				userInfo: userInfo
			})
		}
	},
	toDetail(e) {
		console.log(e);
		let chatid = e.currentTarget.dataset.chatid
		let chat_type = e.currentTarget.dataset.type
		let url = ''
		switch (chat_type) {
		  case 1: url = '/pages/chat/index'; break;
		  case 2:
		  case 4:
		  case 5: url = '/pages/goods/index'; break;
		}
		url += '?chatId=' + chatid
		wx._navigateTo(url)
	},
	load(e) {
		let rows = e.detail.list
		let page = e.detail.page
		if (rows.length == 0 && page == 1) {
			this.setData({
				chatList: null
			})
			return
		}
		
		if (rows.length > 0) {
			rows = rows.map((v,i)=>{
				v.picture = JSON.parse(v.picture)
				return v
			})
			let chatList = this.data.chatList
			let tmpMapList = this.data.tmpMapList
			
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
				let date = new Date(v.create_time * 1000)
				let m = date.getMonth() + 1
				let d = date.getDate()
				if (m < 10) {
					m = '0' + m
				}
				if (d < 10) {
					d = '0' + d
				}
				let k = m + '' + d
				if (k in tmpMapList) {
					tmpMapList[k].list.push(v)
				} else {
					tmpMapList[k] = {
						list: [v],
						m: m,
						d: d
					}
					chatList.push(tmpMapList[k])
				}
			})
			
			this.setData({
				tmpMapList,
				chatList
			})
		}
	},


	deleteChat(e) {
		let index = e.currentTarget.dataset.index
		let i = e.currentTarget.dataset.i
		let chatList = this.data.chatList
		// let chatMapList = this.data.chatMapList
		let chat = chatList[index]
		console.log(chat);
		
		let key = chat.m + '' + chat.d
		let chatId = chat.list[i].chat_id
		wx.showModal({
			title: '删除产品',
			content: '确定删除这个记录吗',

			success: (res) => {
				if (res.confirm) {
					request.delete('chat/delete', res => {
						if (res.success) {
							wx._showToast('删除成功')
							chat.list.splice(i, 1)
							
							// if (chat.list.length == 0) {
							// 	chatList.splice(index, 1)
							// 	delete chatMapList[key]
							// }

							this.setData({
								chatList: chatList,
								// chatMapList : chatMapList
							})
							if (chatList.length == 0) {
								this.selectComponent('#pagination').initLoad()
							}
						} else {
							toast(res.msg)
						}
					}, {
						chatId: chatId
					})
				}
			}
		})
	},
	onShareAppMessage: function() {
		let pages = getCurrentPages()
    let page = pages[pages.length - 1]
		let to = encodeURIComponent(page.route + '?userId=' + this.data.userInfo.user_id )
		let path = '/pages/index/index?path=' + to +'&fromUserId=' + this.data.userInfo.user_id
    return {
			path: path,
			title:'快来看本宝宝的iME相册哦~'
    }
	}
})
