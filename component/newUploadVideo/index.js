// component/newUploadVideo/index.js
import { Request, errorToast, thumbFileUrl, fileUrl } from '../../utils/util.js' 
let request = new Request()
import config from '../../config.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    initFile: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    videoSrc: ''
  },

  observers : {
    initFile(initFile) {
      if (initFile !== '') {
        this.setData({ 
          // thumb: thumbFileUrl(initFile), url: initFile ,
          videoSrc: fileUrl(initFile)
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 选择视频
     */
    chooseVideo: function() {
      var _this = this;
      wx.chooseMedia({
        count: 1,//传一个
        mediaType: ['video'],
        sourceType: ['album','camera'],
        maxDuration: 15,//可拍摄视频的长度
        success: function(res) {
          console.log(res);
          var tempFilePath = res.tempFiles[0].tempFilePath; // 视频地址
          console.log(tempFilePath);
          //选中视频的长度
          var duration=res.tempFiles[0].duration;//秒
          var size=res.tempFiles[0].size;//字节
          var height=res.tempFiles[0].height;
          var width=res.tempFiles[0].width;
          var thumbTempFilePath=res.tempFiles[0].thumbTempFilePath;//封面图片

          if (duration >= 15) {
            errorToast("视频长度需在15秒钟以内");
            return
          }
          
          _this.setData({
            videoSrc: tempFilePath,
          })
          // let number = options.number || 1;
          // options.type = options.type || 'image';
          _this.setData({ 
            uploadIng : true,
            rate: 10
          })
          wx.uploadFile({
            url: config.baseUrls + '/upload/video',
            filePath: _this.data.videoSrc,
            name: 'video',
            formData: {
              type: 'image'
            },
            success: function(res) {
              const jsonData =  JSON.parse(res.data);
              console.log(jsonData);
              if (jsonData.code == 200) {
                let file = jsonData.data.fileName;
                console.log(file);
                _this.setData({ 
                  uploadIng : false,
                  thumb: thumbTempFilePath
                })
                _this.triggerEvent('success', { value: file, file: file})
              } else {
                errorToast(jsonData.msg)
                _this.setData({ 
                  uploadIng : false,
                })
              }
              
            },
            fail(e) {
              _this.setData({ uploadIng : false})
            }
          });
        }
      })
    },
  }
})
