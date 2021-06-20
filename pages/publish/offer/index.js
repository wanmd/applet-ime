import { Request, toast, rpxTopx } from '../../../utils/util.js'
let request = new Request()
let app = getApp()
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
        showCard: !false
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
        this.draw()
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
    // 画布
    draw() {
        this.setData({
            showCard: !this.data.showCard
        })
        var ctx = wx.createCanvasContext('firstCanvas')
        let self = this;
        let userInfo =  wx.getStorageSync('userinfo') || app.globalData.userInfo;
        let avatar = userInfo.avatar;
        let nickname = userInfo.nickname;
        let remark = userInfo.remark;
        // 画头像
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

                // 画商品价格
                ctx.setFontSize(rpxTopx(32))
                ctx.setFillStyle('#333')
                ctx.fillText('商家名-5月20日文字报价单', rpxTopx(144), rpxTopx(204))
                ctx.draw(true)
                // 画数据(日期)
                ctx.font = 'normal bold ' + rpxTopx(20) + ' sans-serif';
                // ctx.setFontSize(rpxTopx(24))
                // ctx.setFontWeight(600);
                // ctx.font = 'bold'
                ctx.setFillStyle('#333')
                ctx.fillText('报价日期：2021-01-01 15：30', rpxTopx(52), rpxTopx(314))
                ctx.draw(true)

                ctx.font = 'normal bold ' + rpxTopx(20) + ' sans-serif';
                ctx.setFillStyle('#333')
                ctx.fillText('报价产品数：268 个', rpxTopx(52), rpxTopx(368))
                ctx.draw(true)

                ctx.setFontSize(rpxTopx(24))
                ctx.setFillStyle('#333')
                ctx.fillText('手机：1564354564', rpxTopx(52), rpxTopx(422))
                ctx.draw(true)

                ctx.setFontSize(rpxTopx(24))
                ctx.setFillStyle('#333')
                ctx.fillText('微信：1564354564', rpxTopx(52), rpxTopx(476))
                ctx.draw(true)

                ctx.setFontSize(rpxTopx(24))
                ctx.setFillStyle('#333')
                ctx.fillText('地址档口：广东深圳华强北大苏打离开了', rpxTopx(52), rpxTopx(530))
                ctx.draw(true)

                let words = '报价说明：发JFK苏菲玛索大陆方面是否立即释放的空间法律界士大夫立刻释放分开就分开圣诞发没发上课方面看是否民生方面80字以内';
                let words_20 = words.substring(0,20);
                let words_20_40 = words.substring(20,40);
                let words_40_60 = words.substring(40,60);
                let words_60_80 = words.substring(60,80);
                ctx.setFontSize(rpxTopx(24))
                ctx.setFillStyle('#333')
                ctx.fillText(words_20, rpxTopx(52), rpxTopx(584))
                ctx.draw(true)

                let lineheight = 30;
                if (words_20_40) {
                    ctx.setFontSize(rpxTopx(24))
                    ctx.setFillStyle('#333')
                    ctx.fillText(words_20_40, rpxTopx(52), rpxTopx(584 + lineheight * 1 ))
                    ctx.draw(true)
                }
                if (words_40_60) {
                    ctx.setFontSize(rpxTopx(24))
                    ctx.setFillStyle('#333')
                    ctx.fillText(words_40_60, rpxTopx(52), rpxTopx(584 + lineheight * 2))
                    ctx.draw(true)
                }
                if (words_60_80) {
                    ctx.setFontSize(rpxTopx(24))
                    ctx.setFillStyle('#333')
                    ctx.fillText(words_60_80, rpxTopx(52), rpxTopx(584 + lineheight * 3))
                    ctx.draw(true)
                }
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
    /**
     * 文本换行
     *
     * @param {Object} obj
     */
    textWrap: function (obj) {
        console.log('文本换行')
        var td = Math.ceil(obj.width / (obj.size));
        var tr = Math.ceil(obj.text.length / td);
        for (var i = 0; i < tr; i++) {
            var txt = {
                x: obj.x,
                y: obj.y + (i * obj.height),
                color: obj.color,
                size: obj.size,
                align: obj.align,
                baseline: obj.baseline,
                text: obj.text.substring(i * td, (i + 1) * td),
                bold: obj.bold
            };
            if (i < obj.line) {
                if (i == obj.line-1){
                    txt.text = txt.text.substring(0, txt.text.length - 3) +'......';
                }
                this.drawText(txt);
            }
        }
    },
    toggleCardHide (){
        this.setData({ storeQr: '' ,showCard:false})
    },
    onLoad: function(options) {
        console.log(options.type);
        let type = options.type;
        if (type == "editor") {
            this.getEditor()
        }
    }

})