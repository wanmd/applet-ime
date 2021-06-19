import { ALIYUN_URL } from '../../utils/config.js'

Component({
  properties: {
		ispre : {
			type : Boolean,
			value : false
		},
    src : {
      type : String,
      value : ''
    },
		picture : {
      type : Array,
      value : []
    },
    thumb : {
      type : Boolean,
      value : false
    },

    mode : {
      type : String,
      value: 'aspectFit'
    },

    lazy : {
      type : Boolean,
      value : true
    },

    width : {
      type : String,
      value : '100%'
    },
    height : {
      type: String,
      value: '100%'
    }
  },

  lifetimes : {
    ready () {
      this.buildSrc(this.properties.src)
    }
  },

  observers: {
    src (src) {
      this.buildSrc(src)
    }
  },

  data: {
    imgUrl : ''
  },

  methods: {
    buildSrc (src) {
      let baseUrl = ALIYUN_URL
      if (this.properties.thumb) {
        baseUrl += '/thumb'
      }
      this.setData({ imgSrc: baseUrl + '/' + src })
    },
    previewImage () {
      let url = ALIYUN_URL + '/' + this.properties.src
			 let urls=[];
			if(this.properties.picture.length>0){
				this.properties.picture.map((v,i)=>{
					urls.push(ALIYUN_URL + '/' + this.properties.picture[i])
				})
			}else{
				urls = [url]
			}
      wx.previewImage({
        current: url,
        urls: urls
      })
    }
  }
})
