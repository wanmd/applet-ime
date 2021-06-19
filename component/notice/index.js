import { ALIYUN_URL } from '../../utils/config.js'

Component({
  properties: {
    size : {
      type : Number,
      value : 14
    },
    iconName: {
      type : String,
      value : 'agent-icon'  
    },
    text : {
      type : String,
      value : '加盟代理商 一件代发 拿货更便宜 兼职也赚钱'
    },
  },

  lifetimes : {
    
  },

  observers: {
    
  },
  ready(){
    let length = this.data.text.length * this.data.size //文字长度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕宽度
    this.setData({
      length: length,
      windowWidth: windowWidth,
      // marquee2_margin: length < windowWidth ? windowWidth - length : (windowWidth-70) //当文字长度小于屏幕长度时，需要增加补白
      marquee2_margin: windowWidth-75 //当文字长度小于屏幕长度时，需要增加补白
    })
    console.log(this.data.marquee2_margin);
    
    this.swiperRun() // 第一个字消失后立即从右边出现
  },
  data: {
    marqueePace: 0.1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 30,
    orientation: 'left',//滚动方向
    show_notice: false,
  },

  methods: {
    swiperRun: function () {
      let that = this
      let text_interval = setInterval(function () {
        if (-that.data.marqueeDistance2 < that.data.length) {
          // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
          that.setData({
            marqueeDistance2: that.data.marqueeDistance2 - that.data.marqueePace,
            marquee2copy_status: that.data.length + that.data.marqueeDistance2 <= that.data.windowWidth + that.data.marquee2_margin
          })
        } else {
          if (-that.data.marqueeDistance2 >= that.data.marquee2_margin) { // 当第二条文字滚动到最左边时
            that.setData({
              marqueeDistance2: that.data.marquee2_margin // 直接重新滚动
            })
            clearInterval(text_interval)
            that.swiperRun()
          } else {
            clearInterval(text_interval)
            that.setData({
              marqueeDistance2: -that.data.windowWidth
            })
            that.swiperRun()
          }
        }
      }, this.data.text_interval)
    },
  }
})
