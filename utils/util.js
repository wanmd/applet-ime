import { ALIYUN_URL } from './config.js';
const config = require('../config.js');

class Request {
    constructor() {
        let baseUrls = ['https://r.kingwish.com.cn/api/', 'http://127.0.0.1:8000/', 'http://192.168.43.125:90/api/', 'http://dev.kingwish.com.cn/api/'];
        // this.baseUrl = baseUrls[3];
        this.baseUrl = config.baseUrls;

        this.config = {
            dataType: 'json',
            header: {
                'content-type': 'application/json'
            }
        };

        this.isMany = false;
        this.isSendIng = false;
        this.isShowLoading = false;
    }

    setConfig(key, value) {
        this.config[key] = value;
    }

    setMany(isMany) {
        this.isMany = isMany;
    }

    showLoading(title = '') {
        this.isShowLoading = true;
        wx.showLoading({
            mask: true,
            title: title
        });
    }

    get(url, callback, data) {
        this.config.method = 'GET';
        this.config.header = {
            'content-type': 'application/json;charset=UTF-8'
        };
        this.send(url, data, callback);
        return this;
    }

    delete(url, callback, data) {
        this.config.method = 'DELETE';
        this.send(url, data, callback);
        return this;
    }

    post(url, callback, data) {
        this.config.method = 'POST';
        this.send(url, data, callback);
        return this;
    }

    put(url, callback, data) {
        this.config.method = 'PUT';
        this.send(url, data, callback);
        return this;
    }

    delete(url, callback, data) {
        this.config.method = 'DELETE';
        this.send(url, data, callback);
        return this;
    }

    conf(url = '', callback) {
        let config = Object.assign({}, this.config);
        config.url = this.baseUrl + url;

        let token = wx.getStorageSync('token');
        if (url !== 'login' && token) {
            config.header.Authorization = token;
        }

        config.success = response => {
            if (this.isShowLoading) {
                this.isShowLoading = false;
                wx.hideLoading();
            }
            if (response.statusCode != 200) {
                networkError();
            } else {
                callback(response.data);
            }
        };

        return config;
    }

    upload(url = '', filePath = '', callback = () => {}, fail = res => {}) {
        let config = this.conf(url, callback);
        config.fail = res => {
            fail(res);
        };
        config.name = 'file';
        config.filePath = filePath;
        return wx.uploadFile(config);
    }

    send(url = '', data = '', callback = () => {}) {
        if (!this.isMany && this.isSendIng) {
            return;
        }

        let config = this.conf(url, callback);

        config.complete = () => {
            this.isSendIng = false;
            if (this.isShowLoading) {
                this.isShowLoading = false;
                wx.hideLoading();
            }
        };
        config.fail = e => {
            networkError();
        };

        config.data = data;
        this.isSendIng = true;
        wx.request(config);
    }
}

const validmobile = mobile => {
    return /^1[3|4|5|7|8|9]\d{9}$/.test(mobile);
};

const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return (
        [year, month, day].map(formatNumber).join('/') +
        ' ' + [hour, minute, second].map(formatNumber).join(':')
    );
};

const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
};

const networkError = () => {
    wx.showToast({
        image: '/assets/images/neterror.png',
        title: '网络错误'
    });
};

const successToast = (title = '') => {
    wx.showToast({
        icon: 'success',
        title: title
    });
};

const errorToast = (title = '') => {
    wx.showToast({
        image: '/assets/images/neterror.png',
        title: title,
        duration: 800
    });
};

const toast = (title = '', duration = 1500) => {
    wx.showToast({
        icon: 'none',
        title: title,
        duration: duration
    });
};

const alert = (content = '') => {
    wx.showModal({
        content: content,
        showCancel: false
    });
};

const parseTime = (time, cFormat) => {
    if (time == 0) {
        return '';
    }
    if (arguments.length === 0) {
        return null;
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
    let date;
    if (typeof time === 'object') {
        date = time;
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000;
        date = new Date(time);
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (key === 'a')
            return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
        if (result.length > 0 && value < 10) {
            value = '0' + value;
        }
        return value || 0;
    });

    return time_str;
};

const thumbFileUrl = url => {
    return ALIYUN_URL + '/thumb/' + url;
};

const fileUrl = url => {
    return ALIYUN_URL + '/' + url;
};

const formatDate = time => {
    let date1 = new Date(time * 1000);
    let toDay = new Date();
    let y1 = date1.getFullYear();
    let m1 = date1.getMonth() + 1;
    let d1 = date1.getDate();

    let y = toDay.getFullYear();
    let m = toDay.getMonth() + 1;
    let d = toDay.getDate();
    let offset = Math.ceil(toDay.getTime() / 1000 - time);
    if (offset < 3600 * 24) {
        //小于一天
        if (offset < 3600) {
            let v = Math.floor(offset / 60);
            return v < 5 ? '刚刚' : v + '分钟前';
        } else {
            return Math.floor(offset / 3600) + '小时前';
        }
    } else {
        if (y1 + m1 + d1 === y + m + d) {
            //同一天
            let h = date1.getHours();
            let miu = date1.getMinutes();
            if (h < 10) {
                h = '0' + h;
            }

            if (h < 10) {
                miu = '0' + miu;
            }

            return h + ':' + miu;
        } else if (y1 == y) {
            //同一年
            if (m1 < 10) {
                m1 = '0' + m1;
            }

            if (d1 < 10) {
                d1 = '0' + d1;
            }

            let h = date1.getHours();
            let miu = date1.getMinutes();
            if (h < 10) {
                h = '0' + h;
            }

            if (h < 10) {
                miu = '0' + miu;
            }

            // return m1 + '-' + d1 + ' ' + h + ':' + miu;
            return m1 + '-' + d1;
        }
    }

    if (m < 10) {
        m = '0' + m;
    }

    if (d < 10) {
        d = '0' + d;
    }

    return y + '-' + m + '-' + d;
};

const queryParams = url => {
    let params = {};
    url = decodeURIComponent(url);
    console.log(url);

    let pIndex = url.lastIndexOf('?');
    if (pIndex < 0) {
        return params;
    }
    let queryStr = url.substr(pIndex + 1);
    let itemArr = queryStr.split('&');
    itemArr.forEach(item => {
        let arr = item.split('=');
        let k = arr[0];
        let v = arr[1] !== undefined ? arr[1] : '';
        params[k] = v;
    });

    return params;
};

const copyText = text => {
    wx.setClipboardData({
        data: text,
        success: function(res) {
            toast('复制成功');
        }
    });
};

const rpxTopx = rpx => {
    let app = getApp();
    return (rpx / 750) * app.systemInfo.windowWidth;
};

const getDate = (days = 0) => {
    let currentDate = new Date();
    let y,
        m,
        d = '';
    if (days === 0) {
        y = currentDate.getFullYear();
        m = currentDate.getMonth() + 1;
        d = currentDate.getDate();
    } else {
        let time = currentDate.getTime() + 3600 * 24 * 1000 * days;
        let date = new Date(time);
        y = date.getFullYear();
        m = date.getMonth() + 1;
        d = date.getDate();
    }

    if (m < 10) {
        m = '0' + m;
    }

    if (d < 10) {
        d = '0' + d;
    }

    return `${y}-${m}-${d}`;
};

function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M =
        (date.getMonth() + 1 < 10 ?
            '0' + (date.getMonth() + 1) :
            date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes() + ':';
    let s = date.getSeconds();
    return {
        fulltime: Y + M + D + h + m + s,
        ymd: Y + M + D
    };
}

const maskNumber = num => {
    if (typeof(num) === 'number') {
        num = String(num)
    }
    if (!num) num = '0.00'
    let str = String(num)[0];
    for(let i = 1; i < num.length; i++) {
        let item = num[i];
        if (!isNaN(item)) {
            item = '*'
        }
        str += item
    }
    return str
};
// 跳转iyou
const navToIyou = () => {
    const storeInfo = wx.getStorageSync('userInfo');
    wx.navigateToMiniProgram({
        appId: 'wx3020976f686fe9f8',
        path: 'pages/home/index?storeId=' + storeInfo.user_id,
        extraData: {
          storeInfo
        },
        envVersion: 'develop',
        success(res) {
          // 打开成功
        }
      })
}
module.exports = {
    validmobile: validmobile,
    formatTime: formatTime,
    Request: Request,
    errorToast: errorToast,
    toast: toast,
    alert: alert,
    parseTime: parseTime,
    thumbFileUrl: thumbFileUrl,
    fileUrl: fileUrl,
    formatDate: formatDate,
    copyText: copyText,
    rpxTopx: rpxTopx,
    queryParams: queryParams,
    getDate: getDate,
    timestampToTime,
    maskNumber,
    navToIyou,
    formatNumber
};