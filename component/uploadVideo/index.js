import { Request, errorToast, thumbFileUrl, fileUrl } from '../../utils/util.js' 
let request = new Request()
import config from '../../config.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bgcolor : {
      type : String,
      value : ''
    },
    only : {
      type : Boolean,
      value : false
    },
    count : {
      type : Number,
      count : 1
    },
    width : {
      type : String,
      value : "218rpx"
    },
    height : {
      type : String,
      value : '218rpx',
    },
    camera : {
      type : Boolean,
      value : true
    },
    initFile : {
      type : String,
      value : ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rate : 0,
    uploadIng : false,
    url : '',
    thumb : '',
    videoSrc: ''
  },

  lifetimes : {
    ready () {
      let initFile = this.properties.initFile
      if (initFile !== ''){
        this.setData({ thumb: thumbFileUrl(initFile), url: initFile })
      }
    }
  },

  observers : {
    initFile(initFile) {

      if (initFile !== '') {
        this.setData({ thumb: thumbFileUrl(initFile), url: initFile })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    clear () {
      this.setData({ url : '', thumb : ''})
      this.triggerEvent('clear')
    },
    /**
     * 图片  视频 选择框
     */
    actioncnt() {
      let _this = this;
      wx.showActionSheet({
        itemList: ['视频'],
        success: function(res) {
          if(res.tapIndex == 0) {
            _this.chooseVideo()
          }
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
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
            errorToast("视频长度需在15秒中以内");
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
              if (jsonData.code == 200) {
                let file = jsonData.data.fileName;
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
    _upload(files, i, opt, resolve, reject, progressFn) {
      let _this = this
      if(files[i]) {
        _this.setData({ uploadIng : true})
        let uploadTask = wx.uploadFile({
          url: config.baseUrls + '/upload/uploadpic',
          filePath: files[i],
          name: 'file',
          formData: opt,
          success: function(res) {
            _this.setData({ rate: 0})
            if (i == files.length - 1) {
              wx.hideLoading();
            }
            var ret = JSON.parse(res.data);

            if(!ret.success) {
              errorToast(ret.msg);
              _this.setData({ uploadIng : false})
              reject(ret);
            }else {
              _this.setData({ uploadIng : false})
              resolve(ret, opt.start, i);
              if (i < files.length) {
                i++;
                _this._upload(files, i, opt, resolve, reject, progressFn);
              }else {
                _this.setData({ uploadIng : false})
              }
            }
          }
        });
        if (progressFn) {
          uploadTask.onProgressUpdate(res => {
            progressFn(res.progress, opt.start);
          });
          uploadTask.onHeadersReceived(res => {
            _this.setData({ uploadIng: false })
          })
        }
      }
    }

  }
})
