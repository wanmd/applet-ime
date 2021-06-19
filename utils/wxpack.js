/*!
 * 微信接口封装
 */
wx._showModal = function(obj) {
    obj = Object.assign({ confirmColor: '#FF8800', cancelColor: '#777777' }, obj);
    wx.showModal(obj)
};
//调用 _showAlert(content, success, fail, complete)
//或   _showAlert(content, title='提示', success, fail, complete)
//或   _showAlert(content, title='提示', confirmText='好的', success, fail, complete)
//或   _showAlert({title:'提示',content:'',confirmText:'好的'})
wx._showAlert = function(obj) {
    if (typeof(obj) === 'string') { //input parameter 1: content
        obj = { content: obj };
        let _t1 = typeof(arguments[1]);
        let _t2 = typeof(arguments[2]);
        if (_t1 === 'function') { //input parameter 2: success callback
            obj.success = arguments[1];
            if (_t2 === 'function') { //input parameter 3: fail callback
                obj.fail = arguments[2]
            }
            if (typeof(arguments[3]) === 'function') { //input parameter 4: complete callback
                obj.complete = arguments[3]
            }
        } else if (_t1 === 'string') { //input parameter 2: title
            obj.title = arguments[1];
            if (_t2 === 'function') { //input parameter 3: success callback
                obj.success = arguments[2];
                if (typeof(arguments[3]) === 'function') { //input parameter 4: fail callback
                    obj.fail = arguments[3]
                }
                if (typeof(arguments[4]) === 'function') { //input parameter 5: complete callback
                    obj.complete = arguments[4]
                }
            } else if (_t2 === 'string') { //input parameter 3: confirmText
                obj.confirmText = arguments[2];
                if (typeof(arguments[3]) === 'function') { //input parameter 4: success callback
                    obj.success = arguments[3]
                }
                if (typeof(arguments[4]) === 'function') { //input parameter 5: fail callback
                    obj.fail = arguments[4]
                }
                if (typeof(arguments[5]) === 'function') { //input parameter 6: complete callback
                    obj.complete = arguments[5]
                }
            }
        }
    }
    if (typeof(obj.title) === 'undefined') {
        obj.title = '提示'
    }
    obj = Object.assign({ showCancel: false, confirmText: '好的' }, obj);
    wx._showModal(obj)
};
//调用 _showConfirm(content, success, fail, complete)
//或   _showConfirm(content, title='提示', success, fail, complete)
//或   _showConfirm(content, title='提示', confirmText='确定', cancelText='取消', success, fail, complete)
//或   _showConfirm({title:'提示',content:'',confirmText:'确定',cancelText:'取消'})
wx._showConfirm = function(obj) {
    if (typeof(obj) === 'string') { //input parameter 1: content
        obj = { content: obj };
        let _t1 = typeof(arguments[1]);
        let _t2 = typeof(arguments[2]);
        if (_t1 === 'function') { //input parameter 2: success callback
            obj.success = arguments[1];
            if (_t2 === 'function') { //input parameter 3: fail callback
                obj.fail = arguments[2]
            }
            if (typeof(arguments[3]) === 'function') { //input parameter 4: complete callback
                obj.complete = arguments[3]
            }
        } else if (_t1 === 'string') { //input parameter 2: title
            obj.title = arguments[1];
            if (_t2 === 'function') { //input parameter 3: success callback
                obj.success = arguments[2];
                if (typeof(arguments[3]) === 'function') { //input parameter 4: fail callback
                    obj.fail = arguments[3]
                }
                if (typeof(arguments[4]) === 'function') { //input parameter 5: complete callback
                    obj.complete = arguments[4]
                }
            } else if (_t2 === 'string') { //input parameter 3: confirmText
                obj.confirmText = arguments[2];
                if (typeof(arguments[3]) === 'string') { //input parameter 4: cancelText
                    obj.cancelText = arguments[3]
                }
                if (typeof(arguments[4]) === 'function') { //input parameter 5: success callback
                    obj.success = arguments[4]
                }
                if (typeof(arguments[5]) === 'function') { //input parameter 6: fail callback
                    obj.fail = arguments[5]
                }
                if (typeof(arguments[6]) === 'function') { //input parameter 7: complete callback
                    obj.complete = arguments[6]
                }
            }
        }
    }
    if (typeof(obj.title) === 'undefined') {
        obj.title = '提示'
    }
    obj = Object.assign({ confirmText: '确定' }, obj);
    wx._showModal(obj)
};
//调用 _showToast()
//或   _showToast(title, success, fail, complete)
//或   _showToast(title, icon='success', success, fail, complete)
//icon支持值: "success", "loading", "ok", "warn", "fail"
wx._showToast = function(obj) {
    let _t0 = typeof(obj);
    if (_t0 === 'undefined') {
        obj = { title: '' }
    } else if (_t0 === 'string') { //input parameter 1: title
        obj = { title: obj };
        let _t1 = typeof(arguments[1]);
        if (_t1 === 'function') { //input parameter 2: success callback
            obj.success = arguments[1];
            if (typeof(arguments[2]) === 'function') { //input parameter 3: fail callback
                obj.fail = arguments[2]
            }
            if (typeof(arguments[3]) === 'function') { //input parameter 4: complete callback
                obj.complete = arguments[3]
            }
        } else if (_t1 === 'string') { //input parameter 2: icon
            obj.icon = arguments[1];
            if (typeof(arguments[2]) === 'function') { //input parameter 3: success callback
                obj.success = arguments[2]
            }
            if (typeof(arguments[3]) === 'function') { //input parameter 4: fail callback
                obj.fail = arguments[3]
            }
            if (typeof(arguments[4]) === 'function') { //input parameter 5: complete callback
                obj.complete = arguments[4]
            }
        }
    }
    if (!obj.icon) obj.icon = "none";
    if (!wx.canIUse('showToast.image') && obj.icon !== 'success' && obj.icon !== 'loading') {
        obj.icon = 'none'; //因版本过低(<1.1.0)无法使用image属性时，扩展的icon统一降维到'success'
    }
    switch (obj.icon) {
        case 'ok':
            obj.image = '/images/ok.png';
            break;
        case 'warn':
            obj.image = '/images/warn.png';
            break;
        case 'fail':
            obj.image = '/images/fail.png';
            break;
    }
    wx.showToast(obj)
};
wx._hideToast = function() {
    wx.hideToast()
};
//调用 wx._showLoading()
//或   wx._showLoading(title='加载中...')
wx._showLoading = function(obj) {
    if (typeof(obj) === 'undefined') {
        obj = ''
    }
    if (typeof(obj) === 'string') {
        obj = { title: obj }
    }
    if (!obj.title) obj.title = '加载中...';
    if (wx.showLoading) {
        wx.showLoading(obj)
    } else { //向下兼容，不支持时用showToast代替
        obj.icon = 'loading';
        wx.showToast(obj)
    }
};
wx._hideLoading = function() {
    if (wx.hideLoading) {
        wx.hideLoading()
    } else { //向下兼容，不支持时用showToast代替
        wx.hideToast()
    }
};
wx._showActionSheet = function(obj) {
    wx.showActionSheet(obj)
};
//支持 wx._navigateTo(url, success, fail, complete)这种调用方式
wx._navigateTo = function(obj) {
    if (typeof(obj) === 'string') { //input parameter 1: url
        obj = { url: obj };
        if (typeof(arguments[1]) === 'function') { //input parameter 2: fail callback
            obj.success = arguments[1]
        }
        if (typeof(arguments[2]) === 'function') { //input parameter 3: complete callback
            obj.fail = arguments[2]
        }
        if (typeof(arguments[3]) === 'function') { //input parameter 4: complete callback
            obj.complete = arguments[3]
        }
    }
    let _pages = getCurrentPages();
    if (_pages.length > 10) { //页面栈最大深度为10
        console.warn('Pages stack over 5 layers, nothing to do.');
        return
    }
    wx.navigateTo(obj)
};
//支持 wx._redirectTo(url, success, fail, complete)这种调用方式
wx._redirectTo = function(obj) {
    if (typeof(obj) === 'string') { //input parameter 1: url
        obj = { url: obj };
        if (typeof(arguments[1]) === 'function') { //input parameter 2: fail callback
            obj.success = arguments[1]
        }
        if (typeof(arguments[2]) === 'function') { //input parameter 3: complete callback
            obj.fail = arguments[2]
        }
        if (typeof(arguments[3]) === 'function') { //input parameter 4: complete callback
            obj.complete = arguments[3]
        }
    }
    wx.redirectTo(obj)
};
//支持 wx._switchTab(url, success, fail, complete)这种调用方式
wx._switchTab = function(obj) {
    if (typeof(obj) === 'string') { //input parameter 1: url
        obj = { url: obj };
        if (typeof(arguments[1]) === 'function') { //input parameter 2: fail callback
            obj.success = arguments[1]
        }
        if (typeof(arguments[2]) === 'function') { //input parameter 3: complete callback
            obj.fail = arguments[2]
        }
        if (typeof(arguments[3]) === 'function') { //input parameter 4: complete callback
            obj.complete = arguments[3]
        }
    }
    wx.switchTab(obj)
};
//支持 wx._reLaunch(url, success, fail, complete)这种调用方式
wx._reLaunch = function(obj) {
    if (typeof(obj) === 'string') { //input parameter 1: url
        obj = { url: obj };
        if (typeof(arguments[1]) === 'function') { //input parameter 2: fail callback
            obj.success = arguments[1]
        }
        if (typeof(arguments[2]) === 'function') { //input parameter 3: complete callback
            obj.fail = arguments[2]
        }
        if (typeof(arguments[3]) === 'function') { //input parameter 4: complete callback
            obj.complete = arguments[3]
        }
    }
    wx.reLaunch(obj)
};
//支持 wx._navigateBack(delta)这种调用方式
wx._navigateBack = function(obj) {
    let _type = typeof(obj);
    if (_type === 'undefined') {
        obj = { delta: 1 }
    } else if (_type === 'number') { //input parameter 1: delta
        obj = { delta: obj }
    }
    if (!obj.delta) obj.delta = 1;
    wx.navigateBack(obj)
};
// 异步
wx._getStorage = function(key) {
    try {
        return wx.getStorage({ key })
    } catch (e) {
        getApp().trace_debug('wx.getStorage: ' + e);
        return false
    }
};
wx._setStorage = function(key, data) {
    try {
        wx.setStorage({ key, data });
        return wx
    } catch (e) {
        getApp().trace_debug('wx.setStorage: ' + e);
        return wx
    }
};
// 同步
wx._getStorageSync = function(key) {
    try {
        return wx.getStorageSync(key)
    } catch (e) {
        getApp().trace_debug('wx.getStorageSync: ' + e);
        return false
    }
};
wx._setStorageSync = function(key, data) {
    try {
        wx.setStorageSync(key, data);
        return wx
    } catch (e) {
        getApp().trace_debug('wx.setStorageSync: ' + e);
        return wx
    }
};
wx._removeStorageSync = function(key) {
    try {
        wx.removeStorageSync(key);
        return wx
    } catch (e) {
        getApp().trace_debug('wx.removeStorageSync: ' + e);
        return wx
    }
};
wx._clearStorageSync = function() {
    try {
        wx.clearStorageSync();
        return wx
    } catch (e) {
        getApp().trace_debug('wx.clearStorageSync: ' + e);
        return wx
    }
};
//支持 wx._setNavigationBarTitle(title)这种调用方式
wx._setNavigationBarTitle = function(obj) {
    if (typeof(obj) === 'string') { //input parameter 1: title
        obj = { title: obj }
    }
    if (typeof(wx.xthis) === 'object') { //保存了XPage this指针，则setData
        wx.xthis.setData({ navBarTitle: obj.title })
    }
    wx.setNavigationBarTitle(obj)
}