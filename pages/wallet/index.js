import { Request, toast } from '../../utils/util.js'
let app = getApp()
let request = new Request()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // amountItems : [1, 20, 100, 500, 2000, 5000],
        amountItems: [1, 100, 1000, 5000, 10000],
        amount: 1,
        otherAmount: '',
        balance: 0,

        otherAmountFlag: ''

    },

    selectAmount(e) {
        this.setData({ amount: e.currentTarget.dataset.amount })
    },
    selectAmount1() {
        this.setData({ otherAmountFlag: 'focus', amount: 0 })
    },
    bindinput_(e) {
        this.setData({ otherAmount: e.detail.value })
    },
    bindblur_() {
        let otherAmount = this.data.otherAmount;
        let otherAmountFlag = 'active';
        if (otherAmount % 1 != 0 || otherAmount < 10000 || otherAmount > 50000) {
            otherAmount = '';
            otherAmountFlag = '';
        }

        this.setData({ otherAmountFlag: otherAmountFlag, amount: otherAmount, otherAmount: otherAmount })
    },


    submit() {
        let balance = this.data.balance
        let amount = this.data.amount
        if (amount > this.data.balance) {
            toast('余额不足')
            return
        }

        request.post('wallet/withdrawal', res => {
            if (res.success) {
                toast('提现成功')
                this.setData({ balance: balance - amount })
                setTimeout(() => {
                    wx.navigateBack({})
                }, 500)

            } else {
                toast(res.msg)
            }
        }, { amount: amount }).showLoading()
    },

    onLoad: function(options) {

        // if (!app.globalData.userInfo.mobile) {
        //   wx.redirectTo({
        //     url: '/pages/bindMobile/index'
        //   })
        //   return
        // }
        request.get('wallet/balance', res => {
            if (res.success) {
                this.setData({ balance: res.data.balance })
            }
        })
    }
})