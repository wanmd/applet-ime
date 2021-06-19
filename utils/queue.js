/*!
 * 队列处理
 */
class Queue {
  
  constructor(debug) {
    this.queue = {};
    this.debug = debug || false;
  }
  
  createQueue(name, size) {
    if (size==undefined || size<0 || name==undefined || name=='') {
      return false;
    }
    this.queue[name] = {container:[],size:size};
    return this.queue[name];
  }
  
  inQueue(name,value) {
    if (name==undefined || name=='') {
      return false;
    }
    if (this.queue[name].container.length>=this.queue[name].size) {
      this.queue[name].container.shift();
      if (this.debug) console.log('head element shifted.');
    }
    return this.queue[name].container.push(value);
  }
  
  outQueue(name) {
    if (name==undefined || name=='') {
      return false;
    }
    var ret = null;
    if (this.queue[name].container.length>0) {
      ret = this.queue[name].container.shift();
    }
    return ret;
  }
  
  indexQueue(name,index) {
    if (name==undefined || name=='') {
      return false;
    }
    if (index==undefined) {
      index = 0;
    }
    var ret = null;
    if (index>=0) {
      if (this.queue[name].container.length>index) {
        ret = this.queue[name].container[index];
      }
    }
    else {
      var len = this.queue[name].container.length;
      if (Math.abs(index)<=len) {
        index = len+index;
        ret = this.indexQueue(name, index);
      }
    }
    return ret;
  }
  
  clearQueue(name) {
    if (name==undefined || name=='') {
      return false;
    }
    this.queue[name].container.length = 0;
    return true;
  }
  
  getQueueLen(name) {
    if (name==undefined || name=='') {
      return false;
    }
    return this.queue[name].container.length;
  }
  
  getQueueHead(name) {
    if (name==undefined || name=='') {
      return false;
    }
    var ret = null;
    if (this.queue[name].container.length>0) {
      ret = this.queue[name].container[0];
    }
    return ret;
  }
  
  getQueueEnd(name) {
    if (name==undefined || name=='') {
      return false;
    }
    var ret = null;
    var len = this.queue[name].container.length;
    if (len>0) {
      ret = this.queue[name].container[len-1];
    }
    return ret;
  }
  
}

module.exports = Queue
