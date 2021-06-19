import { Request, toast } from '../../../utils/util.js'
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
        placeholder: "公开报价格式如下例：\n高露洁牙膏-25\n力士沐浴露1l：35\n多芬沐浴露1g 36\n清扬冰爽薄荷-37\n清扬去屑洗发乳-37\n力士柔亮丝滑-30\n飘柔去屑滋润-36\nVs沙宣深层滋润-57"
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
    onLoad: function(options) {
        console.log(options.type);
        let type = options.type;
        if (type == "editor") {
            this.getEditor()
        }
    }

})