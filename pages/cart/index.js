import { Request, toast, rpxTopx, copyText, maskNumber } from '../../utils/util.js';
let app = getApp();
wx.Page({
    data: {
        allSelect: false,
        isEdit: false,
        totalMoney: '0.00',
        totalSelect: 0,
        cartList: [],
        takeGoodsList: [],
        goodsCount: 0,
        ids: [],
        page: 1,
        text: '做我的代理，我宠你！代理价拿货！一件代发！副业好帮手！',
        currentType: 1,
        showlink: 0,
        user: {},
    },
    onLoad() {
        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
        this.setData({
            userInfo: userInfo
        })
    },
    onShow() {
        if (this.data.currentType == 1) {
            this.getList(true);
        } else {
            this.getList2(true);
        }
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
            this.getTabBar().setData({
                selectedIndex: 3
            });
        }
    },
    toggleType(e) {
        let currentType = e.currentTarget.dataset.type;
        this.setData({ currentType });
        if (this.data.currentType == 1) {
            this.getList(true);
        } else {
            this.getList2(true);
        }
    },
    getList(showLoading) {
        if (showLoading) wx._showLoading();
        this.get('/cart').then(res => {
            if (showLoading) wx._hideLoading();
            let cartList = res.data.list;
            let goodsCount = 0;
            if (res.success) {
                if (cartList.length == 0) {
                    this.setData({ cartList: [] });
                } else {
                    cartList.forEach((v, index) => {
                        v.store = JSON.parse(v.store);
                        v.id = index;
                        v.cart.forEach(item => {
                            item.checked = false;
                            item.agent_price = Number(item.agent_price).toFixed(2);
                            item.sale_price = item.isAgent ? Number(item.sale_price).toFixed(2) : maskNumber(Number(item.agent_price).toFixed(2));
                            
                            let display = '';
                            if(item.product_specs) {
                                let product_specs =JSON.parse(item.product_specs);
                                for (let key in product_specs) {
                                    display +=  key + ':' + product_specs[key] + ';'
                                }
                                item.display = display;
                            }
                            
                            // if (item.id == 120) {
                            //     item.state = 0
                            // }
                            goodsCount++;
                        });
                    });
                    console.log(cartList);
                    this.setData({ cartList, goodsCount });
                }
                this.total();
            } else {
                wx.showToast({ title: res.msg, icon: 'none' });
            }
        });
    },
    getList2(showLoading) {
        if (showLoading) wx._showLoading();
        this.get('chat/getTakeGoodsList').then(res => {
            if (showLoading) wx._hideLoading();
            let takeGoodsList = res.data.list;
            if (res.success) {
                if (takeGoodsList.length == 0) {
                    this.setData({ takeGoodsList: [] });
                } else {
                    console.log(takeGoodsList)
                    takeGoodsList.forEach(v => {
                        v['checked'] = false;
                        v.goods.forEach(item => {
                            item['checked'] = false;
                        });
                    });
                    console.log(takeGoodsList)
                    this.setData({ takeGoodsList, takeGoodsList });
                }
                this.total();
            } else {
                wx.showToast({ title: res.msg, icon: 'none' });
            }
        });
    },
    deleteTakeGoodsList(pindex, cindex) {
        let takeGoodsList = this.data.takeGoodsList;
        if (cindex == 'all') {
            if (takeGoodsList[pindex].checked) {
                takeGoodsList.splice(pindex, 1);
            } else {
                let checkedFlag = true;
                takeGoodsList[pindex].goods.forEach(item => {
                    if (item.checked) {
                        checkedFlag = false;
                        takeGoodsList.splice(pindex, 1);
                    }
                });
                // if (checkedFlag) this.total('请选择产品');
            }
            takeGoodsList.forEach(v => {
                v['checked'] = false;
                v.goods.forEach(item => {
                    item['checked'] = false;
                });
            });
        } else {
            takeGoodsList[pindex].goods.splice(cindex, 1);
            if (takeGoodsList[pindex].goods.length == 0) {
                takeGoodsList.splice(pindex, 1);
            }
        }
        console.log(takeGoodsList)
        this.setData({ takeGoodsList, takeGoodsList });
    },
    cancel(e) {
        var id = e.currentTarget.dataset.id;
        var pindex = e.currentTarget.dataset.pindex;
        var cindex = e.currentTarget.dataset.cindex;
        let list = this.data.cartList;
        wx.showModal({
            title: '确定取消此产品下单？',
            content: '确认后此产品将从购物车-拿货清单中移除。',
            success: res => {
                if (res.confirm) {
                    this.cancelAPI(id, pindex, cindex)
                }
            }
        })
    },
    cancelAPI(id, pindex, cindex) {
        wx.showToast({ title: '处理中', icon: 'none' });
        this.post('chat/cancelQuote', { id: id }).then(res => {
            if (res.success) {
                console.log(pindex, cindex)
                this.deleteTakeGoodsList(pindex, cindex);
                toast('取消成功');
            } else {}
        });
    },
    takeQuoteAll(e) {
        var pindex = e.currentTarget.dataset.pindex;
        let id = [];
        let takeGoodsList = this.data.takeGoodsList;
        takeGoodsList[pindex].goods.forEach(item => {
            if (item.checked) {
                id.push(item.id)
            }
        });
        if (id.length == 0) {
            toast('请选择产品');
            return;
        };
        wx.showModal({
            title: '确定已到店拿货并转移到下单拿货记录？',
            content: '确认后此下单拿货产品将转移到卖家下单拿货记录中 卖家可随后浏览查阅每日下单拿货记录明细。',
            success: res => {
                if (res.confirm) {
                    this.takeQuoteAPI(id, pindex, 'all')
                }
            }
        })
    },
    takeQuote(e) {
        var id = [e.currentTarget.dataset.id];
        var pindex = e.currentTarget.dataset.pindex;
        var cindex = e.currentTarget.dataset.cindex;
        wx.showModal({
            title: '确定已到店拿货并转移到下单拿货记录？',
            content: '确认后此下单拿货产品将转移到卖家下单拿货记录中 卖家可随后浏览查阅每日下单拿货记录明细。',
            success: res => {
                if (res.confirm) {
                    this.takeQuoteAPI(id, pindex, cindex)
                }
            }
        })
    },
    takeQuoteAPI(id, pindex, cindex) {
        wx.showToast({ title: '处理中', icon: 'none' });
        this.post('chat/takeQuote', { id: id }).then(res => {
            if (res.success) {
                this.deleteTakeGoodsList(pindex, cindex);
                toast('拿货成功');
            } else {
                toast(res.msg);
            }
        });
    },
    copyName(e) {
        var val = e.currentTarget.dataset.copy_name;
        copyText(val)
    },

    complaints() {
        toast('投诉成功');
    },
    contact(e) {
        let user_id = e.currentTarget.dataset.user_id || "";
        let userInfo = wx.getStorageSync('userinfo') || app.globalData.userInfo
        let isAuth = app.isAuthWxInfo()
        if (user_id == '') {
            toast('未获取到用户信息')
            return
        }
        if (!isAuth) {
            toast('需要授权获取您的用户信息')
            return
        }
        this.get('visit/contactInfo', { userId: user_id }).then(res => {
            if (res.success) {
                this.setData({
                    showlink: 1,
                    user: res.data
                })
            }
        })
    },
    hideMark() {
        this.setData({
            showlink: 2
        })
    },
    copy(e) {
        let val = e.currentTarget.dataset.content;
        copyText(val)
    },
    callNumPhone(e) {
        let pnum = e.currentTarget.dataset.phone
        if (pnum == '') {
            wx.showToast({
                title: '暂无手机号',
                icon: 'none',
                duration: 1500
            })
            return
        }
        wx.makePhoneCall({
            phoneNumber: pnum
        })
    },
    total: function() {
        let list = this.data.cartList;
        let totalMoney = 0;
        let totalSelect = 0;
        let allSelect = false;
        let ids = [];
        if (list.length > 0) {
            list.forEach(item => {
                item.cart.map((v, i) => {
                    if (v.checked) {
                        totalSelect++;
                        ids.push(v.id);
                        // if (item.isAgent) {
                        //     totalMoney += v.agent_price * v.quantity;
                        // } else if (this.data.userInfo.isVip == 1) {
                        //     totalMoney += v.vip_price * v.quantity;
                        // } else {
                        //     totalMoney += v.sale_price * v.quantity;
                        // }
                        if (item.isAgent) {
                            totalMoney += v.agent_price * v.quantity;
                        } else {
                            totalMoney += v.member_price * v.quantity;
                        }

                    }
                });
            });
            console.log(totalMoney);
            if (this.data.goodsCount == totalSelect) {
                allSelect = true;
            } else {
                allSelect = false;
            }
            this.setData({
                totalMoney: totalMoney.toFixed(2),
                totalSelect,
                allSelect,
                ids
            });
        } else {
            this.setData({
                totalMoney: '0.00',
                totalSelect: 0,
                allSelect: false,
                ids: [],
                isEdit: false
            });
        }
    },
    switchState() {
        var _isEdit = !this.data.isEdit;
        let list = this.data.cartList;
        if (list.length > 0) {
            list.forEach(item => {
                item.cart.map((v, i) => {
                    v.checked = false;
                });
            });
        }
        this.setData({
            isEdit: _isEdit,
            cartList: list
        });
        this.total();
    },
    allSelect(e) {
        let status = e.detail.value;
        let list = this.data.cartList;
        list.forEach(item => {
            item.cart.map((v, i) => {
                v.checked = status;
            });
        });
        this.setData({ cartList: list, allSelect: status });
        this.total();
    },
    selectOne(e) {
        let status = e.detail.value;
        var pindex = e.currentTarget.dataset.pindex;
        var cindex = e.currentTarget.dataset.cindex;
        let list = this.data.cartList;
        list[pindex].cart[cindex].checked = status;
        this.setData({ cartList: list });
        this.total();
    },
    selectOne2(e) {
        let status = e.detail.value;
        var pindex = e.currentTarget.dataset.pindex;
        var cindex = e.currentTarget.dataset.cindex;
        let list = this.data.takeGoodsList;
        list[pindex].goods[cindex].checked = status;
        list.forEach(v => {
            var checked = true;
            v.goods.forEach(item => {
                if (!item.checked) {
                    checked = false
                }
                v.checked = checked;
            });
        });
        this.setData({ takeGoodsList: list });
        this.total();
    },
    selectOne21(e) {
        let status = e.detail.value;
        var pindex = e.currentTarget.dataset.pindex;
        let list = this.data.takeGoodsList;
        list[pindex].checked = status;
        list[pindex].goods.forEach(item => {
            item.checked = status;
        })
        this.setData({ takeGoodsList: list });
        this.total();
    },
    deleteGoods() {
        if (this.data.totalSelect == 0) {
            wx.showToast({ title: '请选择要删除的商品', icon: 'none' });
            return;
        }
        this.post('/cart/delete', { cartIds: this.data.ids }).then(res => {
            if (res.success) {
                wx._showToast('删除成功');
                this.getList(false);
            } else {
                wx._showToast(res.msg);
            }
        });
    },
    toPay() {
        if (this.data.totalSelect == 0) {
            wx._showToast('还没选择商品呢~');
            return;
        }
        let { cartList } = this.data;
        let flag = true;
        for (let i = 0; i < cartList.length; i++) {
            let v = cartList[i].cart;
            for(let ii = 0; ii < v.length; ii++) {
                if (v[ii].checked && v[ii].state ==0) {
                    flag = false;
                    break
                }
            }
            
        }
        if (!flag) {
            wx._showToast('有失效的商品，请重新选择后再结算~');
            return;
        }
        let cartIds = this.data.ids.join(',');
        wx.navigateTo({
            // /Users/acongm/files/svnfiles/github/ime/applet/packages/pack-A/pages/checkout/index.wxml
            url: '../../packages/pack-A/pages/checkout/index?cartIds=' + cartIds + '&type=1'
        });
    },
    gotoVip: function() {
        wx.navigateTo({
            url: '../../packages/pack-A/pages/vip/index'
        })
    },
    //数量加减
    operaTap: function(e) {
        var pindex = e.currentTarget.dataset.pindex;
        var cindex = e.currentTarget.dataset.cindex;
        var flag = e.currentTarget.dataset.flag;
        if (this.data.currentType == 1) {
            var ret = this.data.cartList;
            var goods = ret[pindex].cart[cindex];
            let chnum = flag == '-' ? -1 : 1;
            goods.quantity = parseInt(goods.quantity) + chnum;
            if (goods.quantity < 1) goods.quantity = 1;
            this.setData({ cartList: ret });
            this.total();
            this.changeCart(goods.quantity, goods.id, goods.remark)
        } else {
            var ret = this.data.takeGoodsList;
            var goods = ret[pindex].goods[cindex];
            let chnum = flag == '-' ? -1 : 1;
            goods.num = parseInt(goods.num) + chnum;
            if (goods.num < 1) goods.num = 1;
            this.setData({ takeGoodsList: ret })
            this.total();
            this.changeCart(goods.num, goods.id)
        }
    },
    // 占位
    emptytap: function() {},
    //直接编辑数量
    upNumber: function(e) {
        var pindex = e.currentTarget.dataset.pindex;
        var cindex = e.currentTarget.dataset.cindex;
        if (this.data.currentType == 1) {
            var ret = this.data.cartList;
            var goods = ret[pindex].cart[cindex];
            var goods_number = goods.quantity;
            var number = e.detail.value;
            var reg = /^[0-9]+$/;
            if (!reg.test(number) || number <= 0) {
                goods.quantity = goods_number; //恢复
                this.setData({ cartList: ret });
                this.total();
                wx._showAlert('请输入正整数');
                return false;
            }
            number = parseInt(number);
            goods.quantity = number;
            this.setData({ cartList: ret });
            this.total();
            this.changeCart(goods.quantity, goods.id, goods.remark);
        } else {
            var ret = this.data.takeGoodsList;
            var goods = ret[pindex].goods[cindex];
            var goods_number = goods.num;
            var number = e.detail.value;
            var reg = /^[0-9]+$/;
            if (!reg.test(number) || number <= 0) {
                goods.num = goods_number; //恢复
                this.setData({ takeGoodsList: ret });
                this.total();
                wx._showAlert('请输入正整数');
                return false;
            }
            number = parseInt(number);
            goods.num = number;
            this.setData({ takeGoodsList: ret });
            this.total();
            this.changeCart(goods.num, goods.id);;
        }
    },
    //直接编辑数量
    changeCart(q, id, remark) {
        wx.showToast({ title: '处理中', icon: 'none' });
        if (this.data.currentType == 1) {
            this.post('cart/change', { id: id, quantity: q, remark: remark }).then(res => {
                if (res.success) {
                    toast("修改成功");
                } else {
                    toast(res.msg);
                }
            });
        } else {
            wx.showToast({ title: '处理中', icon: 'none' });
            this.post('chat/editTakeQuoteInfo', { id: id, num: q }).then(res => {
                if (res.success) {
                    toast("修改成功");
                } else {
                    toast(res.msg);
                }
            });
        }
    },

    changeRemark(e) {
        console.log(e)
        var pindex = e.currentTarget.dataset.pindex;
        var cindex = e.currentTarget.dataset.cindex;
        var ret = this.data.currentType == 1 ? this.data.cartList : this.data.takeGoodsList;
        var goods = ret[pindex].cart[cindex];
        let id = goods.id;
        let remark = e.detail.value;
        ret[pindex].cart[cindex].remark = remark;
        this.setData({ cartList: ret });
        let quantity = goods.quantity;
        this.post('/cart/change', { id: id, remark: remark, quantity: quantity }).then(res => {
            if (res.success) {} else {
                toast(res.msg);
            }
        });
    },
    toGoodsDetail(e) {
        wx._navigateTo(`/pages/goods/index?chatId=${e.currentTarget.dataset.chatid}`)
    },
    isAuth_(e) {
        if(!this.isToLogin()) return;
        app.requireLogin(e.currentTarget.dataset.url)
    },
    isToLogin() {
        let userInfo = wx._getStorageSync('userinfo')
        if (!userInfo.nickname || !userInfo.isAuth) {
            wx._setStorageSync("nav_key", 'swit')
            app.requireLogin('/pages/index/index')
            return false;
        } else {
            return true;
        }
    },
    onReachBottom: function() {

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
        if (this.data.currentType == 1) {
            this.getList();
        } else {
            this.getList2();
        }
        setTimeout(function() {
            // 不加这个方法真机下拉会一直处于刷新状态，无法复位
            wx.stopPullDownRefresh()
        }, 300)
    },
});