// 定义一些全局方法或者变量
const config = require('../config.js');
const XPage = function(options) {
  options.data = options.data || {};
  options.data.appData = config.appData || {};
  options.data.wxuserinfo = wx._getStorageSync(config.userinfo_key);
  options.post = wx.promise.post;
  options.get = wx.promise.get;
  options.onUpdate = wx.promise.onUpdate;
	// options = Object.assign({},options,wx.promise)
  return Page(options);
};
module.exports = XPage;
