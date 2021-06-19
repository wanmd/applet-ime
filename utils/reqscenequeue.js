/*! 
 * 请求现场队列
 */
const Queue = require('./queue.js');

class ReqSceneQueue extends Queue {
  
  //< 构造函数
  constructor(size) {
    super();
    this.queue_name   = '__reqSceneQueue__';
    this.queue_size   = size || 20; //默认支持最多20个页面请求(为wx.request并发最大数的2倍)
    this.queue_object = this.createQueue(this.queue_name, this.queue_size);
  }
  
  //< 入列
  inQ(url, data, callback, method) {
    method = method || 'POST';
    if (typeof callback !== 'function') callback = null;
    if (typeof data !== 'object') data = {};
    this.inQueue(this.queue_name, {url: url, data: data, callback: callback, method: method});
    return this
  }
  
  //< 出列
  outQ() {
    return this.outQueue(this.queue_name)
  }
  
  //< 清除队列
  clearQ() {
    return this.clearQueue(this.queue_name)
  }
  
}

module.exports = ReqSceneQueue
