let app = getApp()
wx.Page({
  data: {
    money:0.02,
    chat : {
      picture: [],
      user : {},
      content : '',
    },
    number_count:0,
    assetsImages: app.assetsImages,
    list:[]
  },
  onLoad: function (opts) {
    let chatId = opts.chatId || 0
    this.setData({
      money:opts.amount || 0
    }) 
    this.getOfficialLog()
  },
  getOfficialLog(){
    this.get('/redenvelope/officialLog').then(res=>{
      console.log(res);
      if(res.msg=='success'){
        let list = res.data.list?res.data.list:[];
        if(list.length>8){
          list = [];
          for(var i = 0; i<8; i++){
            list.push(res.data.list[i])
          }
        }
        this.setData({
          list:list,
          number_count:res.data.number_count
        })
      }else{
        wx._showToast(res.msg)
      }
    })
  },
  toDaiyan(){
    wx._navigateTo('')
  }
})