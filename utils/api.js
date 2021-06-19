const config = require('../config.js');
const ReqSceneQueue = require('./reqscenequeue.js');
let _app = getApp();

function promisify() {
  wx.promise = {};
  //< 根据保留的请求现场信息重新请求
  wx.reqSceneQueue = new ReqSceneQueue();
  wx.reqSceneRedo = function() {
    let _sceneData = wx.reqSceneQueue.outQ();
    if (!_sceneData) return;
    wx.promise
      .request({
        url: _sceneData.url,
        data: _sceneData.data,
        method: _sceneData.method
      })
      .then(resData => {
        if (typeof _sceneData.callback == 'function') {
          _sceneData.callback(resData);
        }
      });
    wx.reqSceneRedo(); //循环处理队列
  };
  wx.promise.request = options => {
    options.url =
      options.url.indexOf('http') === 0
        ? options.url
        : config.baseUrls + options.url;
    options.token = wx._getStorageSync('token');
    // options.data.userinfo = wx._getStorageSync('userinfo');
    let _data = {
      ...(options.data || {})
      // ts: new Date().getTime(),
      // appid: config.appId,
    };
    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        header: {
          'content-type': 'application/json',
          Authorization: options.token
        },
        datatype: 'json',
        method: options.method || 'POST',
        data: _data,
        success: res => {
          if (res.statusCode >= 400) {
            reject(res);
          } else {
            // console.log(num);
            let code = res.data.code;
            // if(num<=0)  code=10003
            // console.log(code);
            if (code != undefined) {
              switch (code) {
                case 10003: //微信登录失效
                  //< 现场入列,如果最后一次请求不是微信登录，则将当前请求保存队列，保存完成后重新请求微信登录获取信息
                  if (options.url.lastIndexOf('/api/login') < 0) {
                    wx.reqSceneQueue.inQ(
                      options.url,
                      _data || {},
                      resolve,
                      options.method || 'POST'
                    );
                  }
                  // 重新调用wxlogin  reloadUserInfo,获取用户信息,请求回信息出列
                  _app.reloadUserInfo(() => {
                    //每次wxlogin要重复请求一次，否则后续请求可能拿不到必要信息
                    wx.reqSceneRedo(); //登录后根据保留的现场信息继续完成请求
                  });
                  break;
                default:
                  resolve(res.data);
              }
            }
          }
        },
        fail: err => {
          reject(err);
        },
        complete: res => {}
      });
    });
  };
  wx.promise.post = (url, data) => {
    url = url.indexOf('http') === 0 ? url : config.baseUrls + url;
    if (typeof data == 'undefined') {
      data = {};
    }
    let options = {
      url,
      data,
      method: 'POST'
    };
    return wx.promise.request(options);
  };
  wx.promise.get = (url, data) => {
    url = url.indexOf('http') === 0 ? url : config.baseUrls + url;
    if (typeof data == 'undefined') {
      data = {};
    }
    let options = {
      url,
      data,
      method: 'GET'
    };
    return wx.promise.request(options);
  };
  wx.promise.getToken = callback => {
    //重新载入用户信息
    let self = this;
    wx.login({
      success(res) {
        if (res.code) {
          wx.promise.post('/login', { code: res.code }).then(result => {
            if (result.code == 200 && result.success) {
              let token = result.data.token || '';
              // 同步设置请求信息
              wx._setStorageSync('token', token);
              if (typeof callback === 'function') {
                callback(result);
              }
            } else {
              wx._showAlert({
                content: res.msg,
                success(res) {
                  wx._navigateBack();
                }
              });
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg);
        }
      }
    });
  };
  function _upload(files, i, opt, resolve, reject, progressFn) {
    if (files[i]) {
      const uploadTask = wx.uploadFile({
        url: config.baseUrls + '/upload/uploadpic',
        filePath: files[i],
        name: 'file',
        formData: opt,
        success: function(res) {
          if (i == files.length - 1) {
            wx._hideLoading();
          }
          var ret = JSON.parse(res.data);
          if (ret.flag == 'FAIL') {
            wx._showAlert(ret.errmsg);
            reject(ret);
          } else {
            resolve(ret, opt.start, i);

            if (i < files.length) {
              i++;
              _upload(files, i, opt, resolve, reject, progressFn);
            }
          }
        }
      });
      if (progressFn) {
        uploadTask.onProgressUpdate(res => {
          progressFn(res.progress, opt.start);
        });
      }
    }
  }
  /**
   * options  选填参数：start的使用:必须在使用的页面data里面定义，用于记录上传列表队列,传参方式如下：
   * this.multiUploadImage({number:9, style:'pic_std', project_id:project_id, start: this.data.start}, (ret, start, i) => {})
   * */
  wx.promise.multiUploadImg = (options, resolve, reject, beforeupload) => {
    let number = options.number || 1;
    options.style = options.style || 'pic_std';
    options.type = options.type || 'image';
    let showLoading = options.showLoading == 0 ? false : true;
    wx.chooseImage({
      count: number,
      success: function(res) {
        if (showLoading) wx._showLoading('图片上传中...');
        if (beforeupload) {
          beforeupload(res.tempFiles);
        }
        _upload(res.tempFilePaths, 0, options, resolve, reject);
      }
    });
  };
}
promisify();
