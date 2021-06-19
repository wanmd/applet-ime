import { Request } from '../../utils/util.js' 
let request = new Request()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderId : {
      type : Number,
      value : 0
    }
  },

  lifetimes: {
    ready() {
      this.getShareLog()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    logs : []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getShareLog () {
      request.get('share/log', res => {
        if(res.success){
          this.setData({ logs : res.data.list})
        }
      }, { orderId: this.properties.orderId})
    }
  },
})
