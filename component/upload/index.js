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
        console.log(thumbFileUrl(initFile));
        
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
        itemList: ['图片', '视频'],
        success: function(res) {
          if(res.tapIndex == 0) {
            _this.selectUpload()
          }
          if(res.tapIndex == 1) {
            _this.chooseVideo()
          }
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    selectUpload(){
      let _this = this;
      this.multiUploadImg({number: _this.properties.count}, ret => {
        if(ret.success) {
          _this.setData({ rate: 100})
          let file = ret.data.fileName
          if (!this.properties.only) {
            this.setData({ thumb: thumbFileUrl(file), url: file })
            this.triggerEvent('success', { value: file, file: file})
            return
          }
          this.triggerEvent('success', { value: file, file: file})
        } else {
          errorToast(ret.msg);
        }
      },
      (reject)=>{
        console.log(reject)
        errorToast(reject.msg);
      },
      (uploadInfo)=>{console.log(uploadInfo)},
      (progress)=>{
        if(progress==100) {
          _this.setData({ rate: 99})
          return
        } 
        _this.setData({ rate: progress})
      });
    },
    selectUpload1 () {
      if(this.data.url !== ''){
        wx.previewImage({
          urls: [fileUrl(this.data.url)]
        })
        return
      }
      wx.chooseImage({
        sourceType: ['album', 'camera'],
        count : this.properties.count,
        success : (res) => {

          this.setData({ uploadIng : true})

          const tempFilePaths = res.tempFilePaths

          let task = request.upload('upload/uploadpic', tempFilePaths[0], res => {
            res = JSON.parse(res)
            if(res.success){
              let file = res.data.fileName
              if (!this.properties.only) {
                this.setData({ thumb: thumbFileUrl(file), url: file })
              }

              this.triggerEvent('success', { value: file, file: file, index : 0})

            }else{
              errorToast('上传失败')
            }
          }, res => {
            errorToast('上传失败')
            this.setData({ uploadIng: false })
          })

          task.onProgressUpdate(res => {
            this.setData({ rate: res.progress})
          })

          task.onHeadersReceived(res => {
            this.setData({ uploadIng: false })
          })
          if (tempFilePaths.length > 1) {

            for(let i = 1; i < tempFilePaths.length; i ++) {
              let req = new Request()
              req.upload('upload/uploadpic', tempFilePaths[i], res => {
                res = JSON.parse(res)
                if (res.success) {
                  let file = res.data.fileName
                  this.triggerEvent('success', { value: file, file: file, index : i })

                } else {
                  
                }
              }, res => {
                
              })
            }

          }
        }
      })
    },
    multiUploadImg(options, resolve, reject, uploadInfo, progress) {
      let _this = this 
      let number = options.number || 1;
      options.type = options.type || 'image';
      // let showLoading = options.showLoading == 0 ? false : true;
      wx.chooseImage({
        count: number,
        success: function(res) {
          // if (showLoading) wx._showLoading('图片上传中...');
          if (uploadInfo) {
            uploadInfo(res.tempFiles);
          }
          _this._upload(res.tempFilePaths, 0, options, resolve, reject, progress);
        }
      });
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
