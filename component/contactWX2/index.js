// component/contactWx/index.js
import { Request, toast } from '../../utils/util.js';
let request = new Request();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userId: {
      type: Number,
      value: 0
    },
    userInfo: {
      type: Object,
      value: {}
    },
    mobile: {
      type: String,
      value: ''
    },

    wx: {
      type: String,
      value: ''
    },

    contact: {
      type: String,
      value: '联系卖家'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showlink: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    copy(e) {
      // let content = e.currentTarget.dataset.content;
      let content = this.data.userInfo.wechat;
      console.log(content);
      
      if (!content) {
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
              toast('复制成功')
            }
          });
        }
      });
    },
    callNumPhone(e) {
      // let pnum = e.currentTarget.dataset.phone;
      let pnum = this.data.userInfo.mobile;
      if (!pnum) {
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
    getConcentInfo(userId, type) {
      request.get('visit/contactInfo', res => {
          if (res.success) {
            // this.setData({ userInfo: res.data,showlink: 1 });
            this.setData({ userInfo: res.data});
            if(type == '2'){
              this.callNumPhone()
            }else{
              this.copy()
            }
          }
        },
        { userId: userId }
      );
    },
    contact(e) {
      console.log(e.target.dataset.key)
      this.setData({operate:e.target.dataset.key})
      this.getConcentInfo(this.properties.userId, 1);
    },
    contact2(e) {
      this.setData({operate:e.target.dataset.key})
      this.getConcentInfo(this.properties.userId, 2);
    }
  }
});
