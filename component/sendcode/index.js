import { Request, showLoading, toast, validmobile } from "../../utils/util.js"
let request = new Request()
Component({
  externalClasses: ['out-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    checkMobile : {
      type : Boolean,
      value : false
    },
    url : {
      type : String,
      value : ""
    },
    mobile : {
      type : String,
      value : ""
    },
    query : {
      type : String,
      value : '{}'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    tips: "获取验证码",
    wait : false,
    inter:0
  },
  lifetimes: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    sendCode : function(){
      if(this.data.wait) return
      clearInterval(this.data.inter)
      let query = JSON.parse(this.data.query)
      if (this.properties.checkMobile){
        if (this.properties.mobile === ''){
          toast('请输入手机号码')
          return
        }
        if (!validmobile(this.properties.mobile)){
          toast('手机号码不正确')
          return
        }
      }
      let data = {
        mobile : this.properties.mobile
      }
      request.post(this.data.url,res=>{
        toast(res.msg)
        if(res.code == 200){
          this.setData({ wait:true})
          let t = res.data.interval
           this.data.inter = setInterval(()=>{
            t --
            if(t <= 0){
              clearInterval(this.data.inter)
              this.setData({ tips: '重新发送', wait:false})
            }else{
              this.setData({ tips: t + 's'})
            }
          },1000)
        }else{

        }
      }, data)
    }
  }
})
