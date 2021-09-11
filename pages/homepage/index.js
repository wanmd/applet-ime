import { Request, toast, alert, fileUrl, copyText } from '../../utils/util.js';
import { assetsImages } from '../../utils/config.js';
let request = new Request();
const app = getApp()
wx.Page({
  /**
   * 页面的初始数据
   */
  data: {
    userId: 0,
    user: {},
    praiseNumber: 0,
    followed: false,
    isAgent: false,
    picture: [],
    picture2: [],
    showlink: 0,
    wechat: '',
    phone: '',
    selectedNav : 1,
    topNavs: [{ type: 1, name: '主页' }, { type: 2, name: '照片' }],
    query3: {},
    allPicture: []
  },
  onLoad: function(options) {
    let userId = options.userId;
    if (userId <= 0) {
      alert('访问不了啦~');
      return;
    }

    this.setData({userId:userId})
    this.setData({query3:{
      type: 1,
      userId: userId||''
    }})
    // this.setData({userId: 901159})
  },
  onShow() {
    this.getInfo()
  },
  copy(e){
    let val = e.currentTarget.dataset.content;
    copyText(val)
  },
  getInfo() {
    let userId = this.data.userId
    this.get('/visit/homepage', { userId }).then(res => {
      if (res.code == 200 && res.success) {
        let data = res.data;
        let user = res.data.user;
        if (!(user instanceof Object)) {
          user = JSON.parse(user);
        }
        if (user.background) {
          user.background = fileUrl(user.background);
        }else{
          user.background = assetsImages + '5b1be11b90ce3.png';
        }
        if (typeof user.label === 'string') {
          user.label = JSON.parse(user.label);
        }
        this.setData({
          user: user,
          userId: userId,
          picture: data.picture,
          followed: data.followed,
          isAgent: data.is_agent,
          praiseNumber: data.praise_number
        });
        wx.setNavigationBarTitle({
          title: user.nickname
        });
      } else {
        wx._showAlert(res.msg);
      }
    });
    this.addLookRecord();
  },
  onUpdate() {
    console.log('111');
  },
  load2(e) {
    console.log(e);
    let rows = e.detail.list
    let page = e.detail.page
    console.log(rows)
    console.log(page)
    if (rows.length == 0 && page == 1) {
      this.setData({
        picture2: null
      })
      return
    }
    if (page == 1) {
      this.setData({
        picture2: [],
        allPicture: []
      })
    }
    
    let allPicture = this.data.allPicture;
    if (rows.length > 0) {
      rows = rows.map((v,i)=>{
        v.picture = JSON.parse(v.picture)
        return v
      })
      let picture2 = this.data.picture2
      rows.forEach(v => {
          picture2.push(v)
          allPicture = [...allPicture, ...v.picture];
      })
      console.log(picture2)
      this.setData({
        picture2,
        allPicture
      })
    }
  },
  // 添加用户浏览记录
  addLookRecord(){
    let data = {lookedUserId: this.data.userId};
    request.post('user/addLookRecord', res=>{
      console.log(res);
    }, data)
  },
  toggleFollow() {
		let isAuth = app.isAuthWxInfo()
		if(!isAuth) {
		  toast('需要授权获取您的用户信息')
		  return
		}
    let followed = this.data.followed;
    let url = followed ? 'visit/unfollow' : 'visit/follow';
    request.post(
      url,
      res => {
        if (res.success) {
          this.setData({
            followed: !followed
          });
        } else {
          toast(res.msg);
        }
      },
      {
        userId: this.data.userId
      }
    );
  },
  navTo() {
		let isAuth = app.isAuthWxInfo()
		if(!isAuth) {
		  toast('需要授权获取您的用户信息')
		  return
		}
    let user = this.data.user;
    wx.navigateTo({
      url: `/pages/applyAgent/index?storeId=${user.user_id}&storeName=${user.nickname}`
    });
  },
  capy(e) {
    let content = e.currentTarget.dataset.content;
    if (content == '') {
      wx.showToast({
        title: '暂无微信',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    wx.setClipboardData({
      data: content,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data); // data
          }
        });
      }
    });
  },
  callNumPhone(e) {
    let pnum = e.currentTarget.dataset.phone;
    if (pnum == '') {
      wx.showToast({
        title: '暂无手机号',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    wx.makePhoneCall({
      phoneNumber: pnum
    });
  },
  hideMark() {
    this.setData({
      showlink: 2
    });
  },
  getConcentInfo(userId) {
    request.get(
      'visit/contactInfo',
      res => {
        if (res.success) {
          this.setData({
            userInfo: res.data,
            wechat: res.data.wechat,
            phone: res.data.mobile
          });
        }
      },
      { userId: userId }
    );
  },
  contact() {
    this.getConcentInfo(this.data.userId);
    this.setData({
      showlink: 1
    });
  },
  toggleType (e) {
    let type = e.currentTarget.dataset.type
    let selectedNav = this.data.selectedNav
    if (selectedNav == type) {
      return
    }
    this.setData({ selectedNav: type, userList: []})
    wx.nextTick(() => {
      // if(type == 2) this.getMyImageTextList();
      // this.selectComponent('#pagination').initLoad()
    })
  },
  // 获取我的图文列表
  getMyImageTextList(){
    let data = {type: 1};
    request.get('user/getMyImageTextList', res=>{
      console.log(res);
      if(res.success) {
        this.setData({ picture2: res.data.list})
      }else{
          wx._showToast(res.msg)
      }
    }, data)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let pages = getCurrentPages();
    let page = pages[pages.length - 1];
    let to = encodeURIComponent(page.route + '?userId=' + this.data.userId);
    let path ='/pages/index/index?path=' +to +'&fromUserId=' + getApp().globalData.userInfo.user_id;
    return {
      path: path,
      title: '小哥哥、小姐姐们快来我的iME主页空间收了我吧~嘻嘻！'
    };
  }
});
