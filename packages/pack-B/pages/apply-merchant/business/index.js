import { Request, toast, formDate, validmobile } from '../../../../../utils/util.js';
let request = new Request();
let app = getApp();
wx.Page({
    data: {
        step: 1, //第一步是基本信息，第二是付款页，第三是代理付款信息，第四是代理设置
        length: 0,
        selectItem: 0,
        getCodeUrl: 'sms/merchantApply',
        cateItem: [{
                cate_id: 1,
                title: '服饰箱包2000元'
            },
            {
                cate_id: 2,
                title: '母婴玩具1000元'
            },
            {
                cate_id: 3,
                title: '户外运动1000元'
            },
            {
                cate_id: 4,
                title: '家居生活1000元'
            },
            {
                cate_id: 5,
                title: '水果生鲜3000元'
            },
            {
                cate_id: 6,
                title: '虚拟商品5000元'
            },
            {
                cate_id: 7,
                title: '食品保健2000元'
            },
            {
                cate_id: 8,
                title: '数码电器10000元'
            },
            {
                cate_id: 9,
                title: '美容个护1000元'
            },
            {
                cate_id: 10,
                title: '家纺家具2000元'
            },
            {
                cate_id: 0,
                title: '其他 1000元'
            }
        ],
        tips: "获取验证码",
        wait: false,
        mobile: '',
        form1: {
            cate_id: 1,
            is_agree: true,
            type: 1,
            operName: '',
            idcard: '',
            merchantName: '',
            address: '',
            licenseCode: '',
            licenseImg: '',
            mobile: '',
            smsCode: '',

            // 

            idcardImg1: '',
            idcardImg2: '',
            storeImg: '',
            storeInnerImg: '',


        },
        paydata: {},
        form2: {
            wx_pay: '',
            ali_pay: '',
            bank_user: '',
            bank_account: '',
            bank_name: ''
        },
        form3: {
            fee: '',
            slogan: '',
            min_number: '',
            sale_service: '',
            remarks: '',
            picture: []
        },
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(opts) {
        if (opts.step) this.setData({ step: opts.step })
        this.getBankList()
    },
    uploadPic(e) {
        let d = new Date()
        let file = e.detail.value
        let form3 = JSON.parse(JSON.stringify(this.data.form3))
            // form3.images.push({ file: file, id: d.getTime()})
        form3.picture.push(file)
        this.setData({ form3: form3 })
    },
    clearPic1(e) {
        let obj = {}
        let form = this.data[e.target.dataset.form]
        form[e.target.dataset.target] = ''
        obj[e.target.dataset.form] = form
        this.setData(obj)
    },
    clearPic(e) {
        let index = parseInt(e.target.dataset.index)
        let form3 = this.data.form3
        form3.picture.splice(index, 1)
        this.setData({ form3: form3 })
    },
    selectItem(e) {
        let idx = e.currentTarget.dataset.index;
        let form1 = this.data.form1;
        form1.cate_id = this.data.cateItem[idx].cate_id
        this.setData({
            selectItem: idx,
            form1: form1
        })
    },
    look() {
        wx.navigateTo({ url: '../protocol/index' });
    },
    switch1Change(e) {
        let form1 = this.data.form1;
        form1.is_agree = e.detail.value;
        this.setData({
            form1: form1
        });
    },
    input(e) {
        let target = e.currentTarget.dataset.target
        let form = e.currentTarget.dataset.form
        let _form = this.data[form]
        _form[target] = e.detail.value
        if (target == 'remarks') this.setData({ length: _form[target].length })
        if (target == 'mobile') this.setData({ mobile: e.detail.value })
        this.setData({ form: _form })
    },
    laststep(e) {
        let step = e.currentTarget.dataset.step;
        this.setData({
            step: step
        })
    },
    // 基本信息提交
    submit1() {
        let form1 = Object.assign({}, this.data.form1);
        // if (!form1.is_agree) {
        //   toast('请同意协议');
        //   return;
        // }
        // for (let k in form1) {
        //   if (form1[k] === '') {
        //     toast('请完整填写资料');
        //     return;
        //   }
        // }

        if (!validmobile(form1.mobile)) {
            toast('手机号码不正确');
            return;
        }

        this.post('/merchant/apply', form1).then(res => {
            if (res.success) {
                let data = JSON.stringify(res.data);
                wx._showToast('认证成功')

                this.setData({
                    paydata: data,
                    // step:'step2'
                })
                wx.redirectTo({
                    url: '../pay/index?data=' + data + '&type="business"'
                });
            } else {
                toast(res.msg);
            }
        })
    },
    // 付款信息相关操作
    // 选择银行
    selectBank(e) {
        let index = parseInt(e.detail.value)
        let bank = this.data.bankList[index]
        this.setData({ 'form2.bank_name': bank.name })
    },
    submit2() {
        let form2 = this.data.form2
        if (form2.wx_pay === '' && form2.ali_pay === '') {
            toast('至少设置一种扫码支付方式')
            return
        }
        this.post('/merchant/payset', form2).then(res => {
            if (res.success) {
                wx._showToast('提交成功')
                this.setData({
                    step: 4
                })
            } else {
                toast(res.msg);
            }
        })
    },
    // 代理相关设置
    confirm() {
        let formData = Object.assign({}, this.data.form3)
        for (let k in formData) {
            if (formData[k] === '') {
                toast('请完整填写数据')
                return
            }
        }
        this.post('/agent/setrule', formData).then(res => {
            if (res.success) {
                toast('商家设置成功！')
                wx._navigateTo('../success/index')
            }
        })
    },
    getBankList() {
        this.get('/bank/list').then(res => {
            if (res.success) {
                this.setData({ bankList: res.data })
            }
        })
    },
    getPay() {
        this.post('/merchant/getpay').then(res => {
            if (res.success) {
                this.setData({ form2: res.data })
            } else {
                toast(res.msg);
            }
        })
    },
    getRule() {
        this.post('/agent/rule').then(res => {
            if (res.success) {
                let data = res.data
                if (data) {
                    let formData = Object.assign({}, this.data.form3)
                    for (let k in data) {
                        if (k in formData) {
                            formData[k] = data[k]
                        }
                    }
                    this.setData({ form3: formData })
                }
            } else {
                toast(res.msg);
            }
        })
    },

});