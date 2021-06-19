// pages/order/deliverInfo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    delivery : {
      type : Object,
      value : {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    capy(e) {
      let content = e.currentTarget.dataset.content;
      if (content == '') {
        return;
      }
      wx.setClipboardData({
        data: content,
        success(res) {
          wx.showToast({
            title: '买家信息已复制',
            duration: 3000
          })
          wx.getClipboardData({
            success(res) {
              console.log(res.data); // data
            }
          });
        }
      });
      return;
    },
  }
})
