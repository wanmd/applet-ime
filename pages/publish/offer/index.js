import { Request, toast, rpxTopx } from '../../../utils/util.js'
import { ALIYUN_URL } from '../../../utils/config.js'
let request = new Request()
let app = getApp()
let W, H = 0

wx.Page({
    data: {
        user_id: 0,
        focus: false,
        content: '',
        chatType: 7,
        backLabel: "<",
        barTitlle: "发布公开报价",
        type: "",
        placeholder: "公开报价格式如下例：\n高露洁牙膏-25\n力士沐浴露1l：35\n多芬沐浴露1g 36\n清扬冰爽薄荷-37\n清扬去屑洗发乳-37\n力士柔亮丝滑-30\n飘柔去屑滋润-36\nVs沙宣深层滋润-57",
				showCard: false,
				cardData: {}
    },
    /*
高露洁牙膏：25
力士沐浴露1l：35
多芬沐浴露1g： 36
清扬冰爽薄荷：37
清扬去屑洗发乳-37
力士柔亮丝滑-30
飘柔去屑滋润-36
Vs沙宣深层滋润-57
  */
    onShow() {
    },
    goback: function() {
        var pages = getCurrentPages();
        wx.showModal({
            title: '确定退出',
            content: '确定退出发布产品/编辑',
            success: res => {
                if (res.confirm) {
                    // this.confirmCompleteApi()
                    wx.navigateBack({
                        delta: pages.length - 2
                    })
                }
            }
        })
    },
    toFocus() {
        let focus = true;
        this.setData({ focus: focus })
        console.log(this.data.focus)
    },
    unFocus(e) {
        console.log(this.data.content)
        if (this.data.content == '') {
            let focus = false;
            this.setData({ focus: focus })
        }
    },

    input(e) {
        let target = e.currentTarget.dataset.target
        let update = {}
        update[target] = e.detail.value
        this.setData(update)
    },
    isNull(str) {
        if (str == "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    },
    splitLine(val_) {
        let val = val_;
        let pairs = [];
        // 拆分出每一行
        var arr = val.split("\n");
        for (var i = 0; i < arr.length; i++) {
            let Item = arr[i];
            console.log(i)
            if (!this.isNull(Item)) pairs.push(Item)
        }
        return pairs;
    },
    splitVal(val_) {
        let val = val_;
        let pairs = [];
        // 拆分出每一行
				var arr = this.splitLine(val_);
				console.log(arr);
				
        for (var i = 0; i < arr.length; i++) {
            let Item = arr[i].split("：") || "";
            if (Item === '' || Item.length != 2) break;
            pairs.push({
                goods_name: Item[0],
                price: Item[1],
            })
        }
        console.log(pairs)
        return pairs;
    },

    submit() {
        let val = this.data.content;
        // console.log(this.isNull(this.data.content))
        let content = this.splitLine(this.data.content)
        if (content.length == 0) {
            toast('请上传报价产品~')
            return
				}
        let data = { chatType: this.data.chatType, content: content }
        request.post('publish', res => {
            if (res.success) {
                toast('发布成功')
                app.newPublish = true
                if (this.data.type == "editor") {
                    wx._navigateBack()
                } else {
                    // wx.navigateTo({ url: `/pages/store/index?type=3` });
                    app.globalData.dynamics.type = 2;
                    wx._switchTab('/pages/dynamics/index')
                }
            } else {
                // app.globalData.dynamics.type = 2;
                // wx._switchTab('/pages/dynamics/index')
                toast(res.msg)
            }
        }, data).showLoading()

    },
    getEditor() {
        this.setData({ type: 'editor', barTitlle: "编辑公开报价" })
        request.get('chat/getLastQuote', res => {
            if (res.success) {
                let list = res.data.list;
                let content = '';
                list.forEach(item => {
                    if (content == "") {
                        content = item.content;
                    } else {
                        content += "\n" + item.content;
                    }
                })
                console.log(content)
                this.setData({
                    content: content,
                    barTitlle: "编辑公开报价",
                    focus: true
                })
            } else {
                toast(res.msg)
            }
        }, {}).showLoading()
    },
    removeList() {
        wx.showModal({
            title: '确定一键清空全部报价?',
            content: '确认后此之前发布的全部文字报价将全部删除.',
            success: res => {
                if (res.confirm) {
                    this.clearQuote()

                }
            }
        })
    },
    clearQuote() {
        request.post('chat/clearQuote', res => {
            if (res.success) {
                this.setData({
                    content: '',
                    focus: true
                })
            } else {
                toast(res.msg)
            }
        })
		},
		// 报价canvas
		initPricePicture() {
			const { content } = this.data;
			if (!content) {
				toast('请先填写报价信息');
				return
			}
			var arr = content.split("\n");

			request.get('quote/poster', res => {
				if (res.success) {
					// console.log(res);
					this.setData({
						cardData: {
							...res.data.list,
							good_num: arr.length
						}
					})
					this.draw();
				} else {
						toast(res.msg)
				}
			}).showLoading()
		},
    // 画图
    draw() {
        this.setData({
            showCard: !this.data.showCard
        })
        const ctx = wx.createCanvasContext('firstCanvas');
        const query = wx.createSelectorQuery();
        query.select('#canvas-modal').boundingClientRect();
        query.exec(function (res) {
            W = res[0].width
            H = res[0].height
            // console.log(res);
            ctx.setFillStyle('#FFF')
            ctx.fillRect(0, 0, rpxTopx(676), H)
            ctx.draw(true)
            // 画背景
            wx.getImageInfo({
                src: '../../../packages/assets/bg.png',
                success(res) {
                    ctx.drawImage('../../../packages/assets/bg.png', 0, 0, res.width, res.height, 0, 0, rpxTopx(676), rpxTopx(1000))
                    ctx.draw(true)
                }
            })
        })
        let self = this;
        const { cardData } = this.data;
        const {nickname, avatar, remark, mobile, wechat, address, store_background, store_quote_state, good_num } = cardData;
        // ctx.setFillStyle('#FFE200')
      
        // 开始画图
        wx.getImageInfo({
            src: avatar,
            success: function (res) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(rpxTopx(100), rpxTopx(80), rpxTopx(50), 0, 2*Math.PI);
                ctx.closePath();
                // 下面就裁剪出一个圆形了，且坐标在 （50， 90）
                ctx.clip();
                ctx.drawImage(res.path, rpxTopx(50), rpxTopx(30), rpxTopx(100), rpxTopx(100));
                ctx.restore();
                ctx.draw(true);
                // 画昵称
                ctx.setFillStyle('#333333')
                ctx.setFontSize(rpxTopx(32))
                var nickname_ = self.transformContentToMultiLineText(ctx, nickname, rpxTopx(320), 1);
                let nickname_length = nickname_[0].length;
                let nickname_txt = nickname;
                if(nickname_length<nickname.length) nickname_txt = nickname.substring(0,nickname_length)+'...';
                ctx.fillText(nickname_txt, rpxTopx(170), rpxTopx(72))
                ctx.draw(true)
                
                // 画签名
                ctx.setFillStyle('#333333')
                ctx.setFontSize(rpxTopx(20))
                var remark_ = self.transformContentToMultiLineText(ctx, remark, rpxTopx(320), 1);
                let remark_length = remark_[0].length;
                let remark_txt = remark;
                if(remark_length<remark.length) remark_txt = remark.substring(0,remark_length)+'...';
                ctx.fillText(remark_txt, rpxTopx(170), rpxTopx(120))
                ctx.draw(true)

                // 画商家名和日期
                let date = new Date();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let storeName = '商家名';
                let title = `${month}月${day}日文字报价单`
                ctx.setFontSize(rpxTopx(32))
                ctx.setFillStyle('#333')
                ctx.fillText(title, rpxTopx(224), rpxTopx(204))
                ctx.draw(true)
                
                let num = -30; // 调整上下距离
                // 画数据(日期)
                // ctx.font = 'normal bold ' + rpxTopx(20) + ' sans-serif';
                ctx.setFontSize(rpxTopx(24))
                ctx.setFillStyle('#333')
                ctx.fillText('报价日期：2021-01-01 15：30', rpxTopx(52), rpxTopx(314 + num))
                ctx.draw(true)

                // ctx.font = 'normal bold ' + rpxTopx(20) + ' sans-serif';
								ctx.setFontSize(rpxTopx(24))
                ctx.setFillStyle('#333')
                ctx.fillText('报价产品数：' + good_num  +' 个', rpxTopx(52), rpxTopx(368 + num))
                ctx.draw(true)

                ctx.setFontSize(rpxTopx(24))
                ctx.setFillStyle('#333')
                ctx.fillText('手机：' + mobile, rpxTopx(52), rpxTopx(422 + num))
                ctx.draw(true)

                ctx.setFontSize(rpxTopx(24))
                ctx.setFillStyle('#333')
                ctx.fillText('微信：' + wechat, rpxTopx(52), rpxTopx(476 + num))
                ctx.draw(true)

                ctx.setFontSize(rpxTopx(24))
                ctx.setFillStyle('#333')
                ctx.fillText('地址档口：' + address, rpxTopx(52), rpxTopx(530 + num))
                ctx.draw(true)

                // 报价说明
                let prewords = '报价说明:';
                let words = store_quote_state || '';
                let words_20 = words.substring(0,20);
                let words_20_40 = words.substring(20,40);
                let words_40_60 = words.substring(40,60);
                let words_60_80 = words.substring(60,80);
                ctx.setFontSize(rpxTopx(24))
                ctx.setFillStyle('#333')
                ctx.fillText(prewords + words_20, rpxTopx(52), rpxTopx(584 + num))
                ctx.draw(true)

                let lineheight = 30;
                let left_width = 120;
                if (words_20_40) {
                    ctx.setFontSize(rpxTopx(24))
                    ctx.setFillStyle('#333')
                    ctx.fillText(words_20_40, rpxTopx(52 + left_width), rpxTopx(584 + num + lineheight * 1 ))
                    ctx.draw(true)
                }
                if (words_40_60) {
                    ctx.setFontSize(rpxTopx(24))
                    ctx.setFillStyle('#333')
                    ctx.fillText(words_40_60, rpxTopx(52 + left_width), rpxTopx(584 + num + lineheight * 2))
                    ctx.draw(true)
                }
                if (words_60_80) {
                    ctx.setFontSize(rpxTopx(24))
                    ctx.setFillStyle('#333')
                    ctx.fillText(words_60_80, rpxTopx(52 + left_width), rpxTopx(584 + num + lineheight * 3))
                    ctx.draw(true)
                }

                // 画背景
                let pic =  ALIYUN_URL + '/' + store_background;

                wx.getImageInfo({
                    src: pic,
                    success(res) {			
                        var w = 0
                        var h = 0
                        var l = 0
                        var t = 0
                        var baseSize = 600
                        var baseSize_ = 300
                        var w_h__bar = res.width/res.height;

                        if(w_h__bar>1){
                                h = baseSize
                                w = h*w_h__bar
                                l = (res.width-res.height)/2
                                baseSize_ = res.height
                        }else{
                                w = baseSize
                                h = w/w_h__bar
                                t = (res.height-res.width)/2
                                baseSize_ = res.width
                        }
                        // –drawImage(Imageimg,float sx,float sy,float sw,float sh,float dx,float dy,float dw,float dh)
                        // •从sx、sy处截取sw、sh大小的图片，绘制dw、dh大小到dx、dy处
                        ctx.drawImage(res.path, l, t, baseSize_, baseSize_, rpxTopx(42), rpxTopx(600), rpxTopx(baseSize), rpxTopx(baseSize_))
                        ctx.draw(true)
                    }
                })

                // 底部文字
                ctx.setFontSize(rpxTopx(20))
                ctx.setFillStyle('#333')
                ctx.fillText('iME供应链  货源+工具+渠道', rpxTopx(216), rpxTopx(1048))
				ctx.draw(true)
								
                // 画商家二维码
                let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo;
                let req = new Request()
                req.setConfig('responseType', 'arraybuffer')
                req.post('quote/qrcode?storeId=' + userInfo.user_id, res => {
                    console.log(res);
                    
                        let qrcode = wx.arrayBufferToBase64(res).replace(/[\r\n]/g, '');
                        let d = new Date()
                        const fsm = wx.getFileSystemManager()
                        const filePath = `${wx.env.USER_DATA_PATH}/` + d.getTime() + '.png';
                        const buffer = wx.base64ToArrayBuffer(qrcode)

                        fsm.writeFile({
                            filePath,
                            data: buffer,
                            encoding: 'binary',
                            success() {
                                wx.getImageInfo({
                                    src: filePath,
                                    success: (res) => {
                                        console.log(res);
                                        
                                        let qrSize = rpxTopx(188)
                                        ctx.drawImage(res.path, 0, 0, res.width, res.height, rpxTopx(464), rpxTopx(326), qrSize, qrSize)
                                        ctx.draw(true)
                                    }
                                })
                            }
                        })
                }).showLoading()
            }
        })
        
    },
    /**
    * canvas绘图相关，把文字转化成只能行数，多余显示省略号
    * ctx: 当前的canvas
    * text: 文本
    * contentWidth: 文本最大宽度
    * lineNumber: 显示几行
    */
    transformContentToMultiLineText(ctx, text, contentWidth, lineNumber) {
			if(!text) return [''];
			var textArray = text.split(""); // 分割成字符串数组
			var temp = "";
			var row = [];

			for (var i = 0; i < textArray.length; i++) {
				if (ctx.measureText(temp).width < contentWidth) {
					temp += textArray[i];
				} else {
					i--; // 这里添加i--是为了防止字符丢失
					row.push(temp);
					temp = "";
				}
			}
			row.push(temp);
			// 如果数组长度大于2，则截取前两个
			if (row.length > lineNumber) {
				var rowCut = row.slice(0, lineNumber);
				console.log(rowCut)
				var rowPart = '';
				if(rowCut.length<=1){
					rowPart = rowCut[0];
				}else{
					rowPart = rowCut[1];
				}
				var test = "";
				var empty = [];
				for (var a = 0; a < rowPart.length; a++) {
					if (ctx.measureText(test).width < contentWidth) {
						test += rowPart[a];
					} else {
						break;
					}
				}
				empty.push(test); // 处理后面加省略号
				var group = empty[0] + '...'
				rowCut.splice(lineNumber - 1, 1, group);
				row = rowCut;
			}
			return row;
    },
    toggleCardHide (){
        this.setData({ storeQr: '' ,showCard:false})
		},
		saveCard() {
			let self = this
			wx.canvasToTempFilePath({
				x: 0,
				y: 0,
				width: W,
				height: H,
				canvasId: 'firstCanvas',
				success(res) {
					wx.saveImageToPhotosAlbum({
						filePath: res.tempFilePath,
						success(res) {
							wx.showToast({
								title: '已下载至相册',
								icon: 'success',
								duration: 1500
							})
							// self.toggleCard()
						},
						fail() {
							toast('保存失败')
						}
					})
				}
			})
	
		},
    onLoad: function(options) {
        console.log(options.type);
        let type = options.type;
        if (type == "editor") {
            this.getEditor()
        }
    }

})