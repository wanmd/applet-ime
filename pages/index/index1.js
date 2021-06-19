import {
	Request,
	toast,
	alert,
	queryParams
} from "../../utils/util.js";
let request = new Request();
let regionChangeInter = null;
let updateLocationInter = null;
const app = getApp();
let WIDTH = 0;
let HEIGHT = 0;
Component({
	data: {
		cityId: 0,
		origin: [], //原点
		location1: [0, 0],
		position1: [0, 0], //位置
		officialList: [],
		nearList: [],
		cityList: [],
		countryList: [],
		markers: [],

		refreshRedenvelopeIng: false,
		openRedenvelopeIng: false,
		currentIndex: -1,
		currentRedenvelope: null,

		currentType: 1,

		location2: [0, 0],
		position2: [],

		nearUserMarkers: null,

		showHideLocation: false,
		hiddenLocation: false,

		drawList: [],
		isAuth:true
	},

	methods: {
		toNewUserGuide(){
			wx.navigateTo({url:'/pages/webview/webview'})
		},
		toggleType(e) {
			let type = parseInt(e.currentTarget.dataset.type);
			if (type == 2 && this.data.nearUserMarkers == null) {
				this.getNearUser();
			}
			this.setData({
				currentType: type
			});
		},

		clickAvatar(e) {
			let userId = e.markerId;
			let url = "/pages/homepage/index?userId=" + userId
			getApp().requireLogin(url)
		},

		toggleShowHideLocation() {
			this.setData({
				showHideLocation: !this.data.showHideLocation
			});
		},

		confirmHiddenLocation() {
			request
				.post("near/hidden", res => {
					if (res.success) {
						clearInterval(updateLocationInter);
						this.setData({
							hiddenLocation: true,
							showHideLocation: false
						});
						wx.setStorageSync("hiddenLocation", 1);
					} else {
						toast(res.msg);
					}
				})
				.showLoading();
		},

		showLocation() {
			this.setData({
				hiddenLocation: false
			});
			wx.getLocation({
				success: res => {
					this.updateLocation(res.longitude, res.latitude, true);
					updateLocationInter = setInterval(() => {
						wx.getLocation({
							success: res => {
								this.updateLocation(res.longitude, res.latitude);
							}
						});
					}, 600000);
				}
			});

			wx.removeStorage({
				key: "hiddenLocation"
			});
		},

		navTo(e) {
			let url = e.currentTarget.dataset.url;
			getApp().requireLogin(url)
		},

		regionChange(e) {
			if (e.type == "end") {
				if (regionChangeInter) {
					clearTimeout(regionChangeInter);
					regionChangeInter = null;
				} else {
					regionChangeInter = setTimeout(() => {
						let currentType = this.data.currentType;
						regionChangeInter = null;
						let map = wx.createMapContext(currentType == 1 ? "map" : "map1");
						map.getCenterLocation({
							success: res => {
								if (currentType == 1) {
									this.setData({
										position1: [res.longitude, res.latitude]
									});
									this.getOfficialRedenvelope();
								} else {
									this.setData({
										position2: [res.longitude, res.latitude]
									});
									this.getNearUser();
								}
							}
						});
					}, 1000);
				}
			}
		},

		getOfficialRedenvelope() {
			//
			this.setData({
				officialList: []
			});
			let req = new Request();
			req.get("redenvelope/official", res => {
				if (res.success && res.data.list) {
					let redenvelopeList = res.data.list || [];
					if (redenvelopeList.length > 0) {
						let officialList = [];
						redenvelopeList.forEach((item, index) => {
							let left = Math.random() * (WIDTH - 44 - 10) + 10;
							let top = Math.random() * (HEIGHT - 44 - 10) + 10;
							item.left = left + "px";
							item.top = top + "px";
							officialList.push(item);
						});
						this.setData({
							officialList: officialList
						});
					}
				}
			});
		},

		openLbsRedenvelope(e) {
			let index = e.markerId;
			this.setData({
				currentRedenvelope: this.data.nearList[index],
				currentIndex: index
			});
		},

		openRedenvelope(e) {
			let userinfo = wx._getStorageSync('userinfo')
			if(!userinfo.nickname || !userinfo.user_id){
				wx._navigateTo('/pages/auth/index')
				return
			}
			let dataset = e.currentTarget.dataset;
			let type = parseInt(dataset.type);
			let index = parseInt(dataset.index);
			if (type == 4) {
				let user = {
					avatar: "/assets/images/index/logo_ime_r@2x.png",
					nickname: "IM官方",
					content: "IM官方给您发了一个红包"
				};
				this.setData({
					currentRedenvelope: {
						type: 4,
						user: user
					},
					currentIndex: index
				});
			} else if (type == 6) {
				var draw = Object.assign({}, this.data.drawList[index]);
				draw.content = "抽个奖";
				this.setData({
					currentRedenvelope: draw,
					currentIndex: index
				});
			} else {
				let redenvelope =
					type == 2 ? this.data.cityList[index] : this.data.countryList[index];
				this.setData({
					currentRedenvelope: redenvelope,
					currentIndex: index
				});
			}
		},

		closeRedenvelope() {
			this.setData({
				currentRedenvelope: null
			});
		},

		refresh() {
			// if(!this.isAuthUserLocation()) return
			let _this =this;
			if (this.timer) {
        clearTimeout(this.timer)
      }
			this.timer = setTimeout(() => {
				if (_this.data.currentType == 1) {
					_this.getLuckDrawList();
					_this.getOfficialRedenvelope();
				} else {
					_this.getNearUser();
				}
				_this.setData({
					refreshRedenvelopeIng: true
				});
      }, 300)
			setTimeout(() => {
				this.setData({
					refreshRedenvelopeIng: false
				});
			}, 1000);
		},

		getNearUser() {
			if (this.data.hiddenLocation) {
				return;
			}
			this.setData({
				nearUserMarkers: null
			});
			let position = this.data.position2;
			request.get(
				"near/person",
				res => {
					if (res.success) {
						let markers = [];
						let list = res.data.list;
						list.forEach((v, i) => {
							if (typeof v.user === "string") {
								v.user = JSON.parse(v.user);
							}
							markers.push({
								id: v.user.user_id,
								width: "80rpx",
								height: "80rpx",
								iconPath: v.user.avatar,
								longitude: Number(v.location[0]),
								latitude: Number(v.location[1])
							});
						});
						this.setData({
							nearUserMarkers: markers
						});
					}
				}, {
					longitude: position[0],
					latitude: position[1]
				}
			);
		},

		backOrigin() {
			if (this.data.currentType == 1) {
				this.setData({
					location1: this.data.origin
				});
				this.getLuckDrawList();
				this.getOfficialRedenvelope();
			} else {
				this.setData({
					location2: this.data.origin
				});
				this.getNearUser();
			}
		},

		share() {
			wx.showShareMenu({
				withShareTicket: true,
				success: res => {
					wx.showActionSheet();
				}
			});
		},
		isAuthUserLocation(){
			let _this = this;
			wx.getSetting({
				success (res) {
					_this.setData({
						isAuth:res.authSetting['scope.userLocation']
					})
					return res.authSetting['scope.userLocation']
				}
			})
		},
		getUserInfoLocation(){
			// 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userLocation" 这个 scope
			wx.getSetting({
				success(res) {
					if (!res.authSetting['scope.userLocation']) {
						wx.authorize({
							scope: 'scope.userLocation',
							success () {
								console.log(111);
								
							}
						})
					}
				}
			})
		},
		receiveRedenvelope() {
			let currentRedenvelope = this.data.currentRedenvelope;
			let index = this.data.currentIndex;
			this.setData({
				openRedenvelopeIng: true
			});
			var chatId = currentRedenvelope.chat_id;
			if (currentRedenvelope.type === "draw") {
				request.post(
					"luck/grab",
					res => {
						this.setData({
							currentRedenvelope: null,
							openRedenvelopeIng: false
						});
						if (res.success) {
							var result = res.data.result;
							var drawList = this.data.drawList;
							drawList.splice(index, 1);
							this.setData({
								drawList: drawList
							});
							wx.navigateTo({
								url: "/pages/luckDraw/index?chatId=" + chatId + "&result=" + result
							});
						} else {
							toast(res.msg);
						}
					}, {
						id: chatId
					}
				);
			} else if (currentRedenvelope.type == 4) {
				//官方红包
				request.get("redenvelope/grabOfficial", res => {
					this.setData({
						currentRedenvelope: null,
						openRedenvelopeIng: false
					});
					if (res.success) {
						let index = this.data.currentIndex;
						let officialList = this.data.officialList;
						officialList.splice(index, 1);
						this.setData({
							officialList: officialList
						});
						// 弹窗改为跳转页面/pages/luckDraw/index，只是展示红包数字
						// alert("领取了" + res.data.amount + "元红包");
						wx._navigateTo('/pages/envelope/index?amount='+res.data.amount)
					} else {
						toast(res.msg);
					}
				});

				return;
			}
		},

		updateLocation(lng, lat, flag = false) {
			let req = new Request();
			req.post(
				"near/location",
				res => {
					if (flag) {
						this.getNearUser();
					}
				}, {
					longitude: lng,
					latitude: lat
				}
			);
		},

		afterLogin(options) {
			if (app.globalData.isLogin == false) {
				setTimeout(() => {
					this.afterLogin(options);
				}, 1000);
				return;
			}

			let fromUserId = 0;

			let scene = options.scene;
			if (scene) {
				scene = decodeURIComponent(scene);
				scene = queryParams(scene);

				if (scene.f) {
					scene.from = scene.f;
				}

				if (scene.iv) {
					scene.inviter = scene.iv;
				}

				if (scene.fi) {
					//来自谁
					scene.fromUserId = scene.fi;
				}

				if (scene.ci) {
					scene.chatId = scene.ci;
				}

				var from = scene.from;
				// 商品列表
				if (from === "g") {
					var url = "/pages/goods/index?chatId=" + scene.chatId;
					if (scene.d == "s") {
						url += "&dst=share&s=" + scene.s;
					}
					wx.navigateTo({
						url: url
					});

					if (scene.fromUserId) {
						fromUserId = scene.fromUserId;
					}
				} 
				// 其他文章
				else if (from === "chat") {
					wx.navigateTo({
						url: "/pages/chat/index?chatId=" + scene.chatId
					});

					if (scene.fromUserId) {
						fromUserId = scene.fromUserId;
					}
				}
			}
			
			let path = options.path || "";
			if (path !== "") {
				path = decodeURIComponent(path);
				wx.navigateTo({
					url: path
				});
			}

			if (fromUserId > 0) {
				request.post("visit/follow", res => {}, {
					userId: fromUserId
				});
			}

			this.getLuckDrawList();

			this.getOfficialRedenvelope();

			wx.getLocation({
				success: res => {
					let longitude = res.longitude;
					let latitude = res.latitude;

					let hiddenLocation = wx.getStorageSync("hiddenLocation");
					if (hiddenLocation != 1) {
						this.updateLocation(longitude, latitude);
						updateLocationInter = setInterval(() => {
							wx.getLocation({
								success: res => {
									this.updateLocation(res.longitude, res.latitude);
								}
							});
						}, 600000);
					} else {
						this.setData({
							hiddenLocation: true
						});
					}

					this.setData({
						origin: [longitude, latitude],
						position1: [longitude, latitude],
						position2: [longitude, latitude],
						location1: [longitude, latitude],
						location2: [longitude, latitude]
					});
				}
			});
		},

		getLuckDrawList() {
			let req = new Request();
			req.get("luck/list", res => {
				if (res.success) {
					if (res.data.list.length > 0) {
						var drawList = [];
						res.data.list.forEach((item, index) => {
							let left = Math.random() * (WIDTH - 44 - 10) + 10;
							let top = Math.random() * (HEIGHT - 44 - 10) + 10;
							item.left = left + "px";
							item.top = top + "px";
							item.type = "draw";
							drawList.push(item);
						});
						this.setData({
							drawList: drawList
						});
					}
				}
			});
		},

		onLoad(options) {
			//获取位置
			this.afterLogin(options);
			const query = wx.createSelectorQuery();
			query.select("#map-wrap").boundingClientRect();
			query.exec(res => {
				WIDTH = res[0].width;
				HEIGHT = res[0].height;
			});
		},
		onReady(){
		
			this.refresh()
		},
		onShareAppMessage(res) {
			let shareUser = getApp().globalData.userInfo;
			return {
				title: 'iME',
				path: '/pages/index/index?inviter='+shareUser.user_id
			}
		}
	},

	pageLifetimes: {
		show() {
			//获取位置
			if (typeof this.getTabBar === "function" && this.getTabBar()) {
				this.getTabBar().setData({
					selectedIndex: 0
				});
			}
		}
	}
});
