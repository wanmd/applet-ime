// pages/goodsCategoryManageNew/edit.js
import {
  Request,
  toast
} from '../../utils/util.js'

let request = new Request()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    treeData: [],
    level2_treeData: [],
    parentid: null, // 当前操作的一级分类id
    currentName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData()
  },

  initData() {
    this.getTrees(0)
  },

  getTrees(parentid) {
    request.get('category/trees', res => {
        if (res.success) {
            const { list } = res.data;
            this.setData({
              treeData: list,
            })
            
        } else {
            toast(res.msg)
        }
    }, { parentid })
  },

  // 增加一级
  handleAddFirstLevel () {
    let { treeData, level2_treeData } = this.data;

    if (treeData[treeData.length -1].id < 0) {
      toast('请先完成的上一个一级分类设置');
      return
    }
    
    const item = [{
      name: '',
      id: -1,
      name: '',
      focus: false
    }]
    this.setData({
      treeData: [...this.data.treeData, ...item]
    })
  },

  handleInput(e) {
    this.update_level1(e)
  },

  handleFocus(e) {
    const { id } = e.currentTarget.dataset;
    this.setData({
      currentName: e.detail.value
    })
    this.update_level1(e, id > 0 ? true :  false)
  },

  handleblur(e) {
    console.log(e);
    const { name, id } = e.currentTarget.dataset;
    const { currentName } = this.data;

    if (name !== currentName) {
      if (id < 0) {
        this.postAdd({
          name,
          parentId: 0
        })
      } else {
        this.postEdit({
          name,
          parentId: 0,
          id
        })
      }
    }
  },

  handleDelete(e) {
    const { treeData } = this.data;
    const { id, name } = e.currentTarget.dataset;
    const that = this;
    wx.showModal({
      title: '删除',
      content: '确定删除该分类吗？',
      success: (res) => {
        if (res.confirm == true) {
          if (id < 0) {
            return
          }
          request.post('cateogry/remove/' + id, res => {
            if(res.success) {
              toast('删除成功')
              that.setData({
                treeData: treeData.filter(item => item.name !== name),
                level2_treeData: []
              })
            }else{
              toast(res.msg)
            }
          })
        }
      }
    })
  },

  async update_level1(e, reqLevel2 = false) { // reqLevel2 是否请求二级分类
    console.log(e);
    
    const { id } = e.currentTarget.dataset;
    const { value } = e.detail;
    const newTreeData = this.data.treeData.map(item => {
      if (Number(item.id) === Number(id)) {
        item.name = value;
        item.focus = true;
      } else {
        item.focus = false;
      }
      return item
    })
    this.setData({
      treeData: newTreeData,
      parentid: id,
    })
    // 请求下级
    if (reqLevel2 && id > 0) {
      request.get('category/trees', res => {
        if (res.success) {
              // let orderCount = res.data.info;
              console.log(res);
              const { list } = res.data;
              this.setData({
                level2_treeData: list
              }, () => {
                console.log(this.data.level2_treeData);
                
              })
          } else {
              toast(res.msg)
          }
      }, { parentid: id })
    }
  },
   // 增加二级
   handleAddSecondLevel () {
    let { level2_treeData } = this.data;
    const item = [{
      name: '',
      id: -1,
      focus: false
    }]
    this.setData({
      level2_treeData: [...this.data.level2_treeData, ...item]
    }, () => {
      console.log(this.data.level2_treeData);
    })
  },

  handleFocus2(e) {
    this.setData({
      currentName: e.detail.value
    })
    this.update_level2(e)
  },

  handleInput2(e) {
    this.update_level2(e)
  },

  handleblur2(e) {
    const { name, id } = e.currentTarget.dataset;
    const { currentName } = this.data;

    if (name !== currentName) {
      if (id < 0) {
        this.postAdd({
          name,
          parentId: this.data.parentid
        })
      } else {
        this.postEdit({
          name,
          parentId: this.data.parentid,
          id
        })
      }
    }
  },

  handleDelete2(e) {
    const { level2_treeData } = this.data;
    const { id, name } = e.currentTarget.dataset;
    const that = this;
    wx.showModal({
      title: '删除',
      content: '确定删除该分类吗？',
      success: (res) => {
        if (res.confirm == true) {
          if (id < 0) {
            return
          }
          request.post('cateogry/remove/' + id, res => {
            if(res.success) {
              toast('删除成功')
              console.log(res);
              that.setData({
                level2_treeData: level2_treeData.filter(item => item.name !== name)
              })
            }else{
              toast(res.msg)
            }
          })
        }
      }
    })
  },

  async update_level2(e) {
    const { id } = e.currentTarget.dataset;
    const { value } = e.detail;

    const newTreeData = this.data.level2_treeData.map(item => {
      if (Number(item.id) === Number(id)) {
        item.name = e.detail.value;
        item.focus = true;
      } else {
        item.focus = false;
      }
      return item
    })
    this.setData({
      level2_treeData: newTreeData,
    })
  },

  // 新增提交
  postAdd(params) {
    request.post('cateogry/add', res => {
      if (res.success) {
          const { id } = res.data;
          const { parentId, name } = params;
          // 改变数组里的id值
          const type = parentId ? 'level2_treeData' : 'treeData';
          const list = this.data[type];
          const newList = list.map(item => {
            if (item.name === name) {
              item.id = id
            }
            return item
          })
          this.setData({
            parentid: parentId ? parentId : id,
            [type]: newList
          })
      } else {
          toast(res.msg)
      }
  }, { ...params })
  },

  // 编辑提交
  postEdit(params) {
    request.post('cateogry/update', res => {
      if (res.success) {
        
      } else {
          toast(res.msg)
      }
    }, { ...params })
  },

  handleSave() {
    toast('已保存');
    wx.navigateBack()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})