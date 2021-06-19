const MDA = require('./md5.js');
const Queue = require('./queue.js');

/*!
 * 生产者消息队列类
 */
class ProducerQueue extends Queue {
  
  //< 构造函数
  constructor(producer_queue_key) { //producer_queue_key 传入如 'onUpdate'
    super(true); //开启调试模式，便于发现队列情况
    this.queue_maxsize  = 1; //生产者队列只需维护最新的一个元素，所以长度为1则可
    this.queue_original_key = producer_queue_key;
    this.queue_name     = MDA.hex_md5('producer_'+this.queue_original_key);
    this.queue_object   = this.createQueue(this.queue_name, this.queue_maxsize);
  }
  
  //< 放入队列
  push(msg_id) {
    this.inQueue(this.queue_name, msg_id ? msg_id : this.message_id());
    return this
  }
  
  //< 消息ID算法
  message_id() {
    let rand_id = ((new Date()).getTime()) + Math.random();
    rand_id = "message_id:"+rand_id; //必须要转换成字符串
    return MDA.hex_md5(rand_id)
  }
  
  //< 获取队列名称
  get_queue_name() {
    return this.queue_name;
  }
  
}

module.exports = {
  ProducerQueue: ProducerQueue
}
