import { Request, toast, alert } from '../../../../utils/util.js'
// import { Request, toast, alert } from '../../utils/util.js';
let request = new Request();
Page({
  data: {
    selectedNav : 1,
    // urls: ['user/getLookRecord', 'user/getLookRecord'],
    topNavs: [{ type: 1, name: '谁看过我' }, { type: 2, name: '我看过谁' }],
    userinfo: '',
    userList : []
  },

  toggleType (e) {
    let type = e.currentTarget.dataset.type
    let selectedNav = this.data.selectedNav
    if (selectedNav == type) {
      return
    }

    wx.setNavigationBarTitle({
      title: this.data.topNavs[type-1].name
    })
    this.setData({ selectedNav: type, userList: []})
    wx.nextTick(() => {
      this.getLookRecord();
      // this.selectComponent('#pagination').initLoad()
    })
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      let userinfo = wx._getStorageSync('userinfo');
      this.setData({
        userinfo: userinfo
      })
      this.onInit();
    },
    onInit (){
      this.getLookRecord();
    },
    // 获取谁看过我的列表记录
    getLookRecord(){
      // let userList = [{"id":20,"nickname":"Acong","avatar":"https:\/\/wx.qlogo.cn\/mmopen\/vi_32\/Q0j4TwGTfTLjCog6Ket4DJwPj1zAH8Ng1KmicVFvkEqibeooMPpSiaop1Z8vZZmae1N1k4PnkAhzvLSGgV8WVUQcg\/132","add_time":"2020-04-19 03:58"}];
      // this.setData({
      //   userList: userList
      // })
      let data = {userId: this.data.userinfo.user_id, type: this.data.selectedNav};
      request.get('user/getLookRecord', res=>{
        if(res.success) {
            this.setData({
              userList: res.data.list
            })
        }else{
            wx._showToast(res.msg)
        }
      }, data)
    },
})