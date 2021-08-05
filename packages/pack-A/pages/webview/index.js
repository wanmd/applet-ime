Page({
  data: {
   targetUrl: '' // 打开的h5页面的地址
  },
  onLoad: function(option){
    console.log('传过来什么地址', option.targetUrl)
    this.setData({
      targetUrl: option.targetUrl
    })
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log('上个页面传来了', data)
    })
  }
})
