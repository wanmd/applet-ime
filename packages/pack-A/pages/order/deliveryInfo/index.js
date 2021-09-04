// pages/order/deliverInfo/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    delivery : {
      type : Object,
      value : {}
    },
    goods : {
      type : Array,
      value : []
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
      console.log(this.data.goods);
      let content = e.currentTarget.dataset.content;
      if (content == '') {
        return;
      }
      const { goods = [] } = this.data;
      let goods_str = '';
      goods.length && goods.forEach(gitem => {
        const { goods_name, quantity, goods_no } = gitem;
        goods_str = `${goods_str}${goods_name},${quantity},${goods_no}`
      })
      wx.setClipboardData({
        data: `${content},${goods_str}`,
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
