import { Request } from '../../utils/util.js'
let request = new Request()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showEmptyNoMore : {
      type : Boolean,
      value : false
    },
    pkName : {
      type : String,
      value : 'id'
    },
    
    url : {
      type : String,
      value : ''
    },

    pageSize : {
      type : Number,
      value : 20
    },

    query : {
      type : Object,
      value : {}
    }
  },

  lifetimes : {
    ready () {
      this.load()
    }
  },

  data: {
    lastPk: 0,
    page : 1,
    isSendIng : false,
    isMore : true
  },

  methods: {
    load () {
      let data = this.data
      if (!data.isMore || data.isSendIng){
        return
      }
      let query = Object.assign({}, this.properties.query)
      query.lastPk = data.lastPk
      query.page = data.page
      query.pageSize = this.properties.pageSize
      console.log(query);
      this.setData({ isSendIng: true})
      request.get(this.properties.url, res => {
        this.setData({ isSendIng: false})
        let resultList = []
        let page = this.data.page
        if(res.success){
          resultList = res.data.list || res.data;
          if (resultList.length > 0){
            if (resultList.length < data.pageSize){
              this.setData({ isMore : false})
            }
            let lastPk = resultList[resultList.length - 1][this.properties.pkName]
            let page_ = page + 1
            this.setData({ lastPk: lastPk, page: page_ })
          }else{
            this.setData({ isMore: false })
          }
        }else{
          this.setData({ isMore: false })
        }
        console.log(this.properties.url)
        if(this.properties.url == 'user/getNewChatList'){
          this.triggerEvent('load', { list: resultList, page: page, isAgent: res.data.isAgent})
        }else{
          this.triggerEvent('load', { list: resultList, page: page})

        }

      }, query)
    },

    initLoad() {
      let update = {
        lastPk: 0,
        page : 1,
        isSendIng : false,
        isMore : true
      }
      this.setData(update)
      this.load()
    }
  }
})
