// pages/goodsSku/index.js
import { toast } from '../../utils/util.js'

let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    // 是否是编辑状态
    isEdit: false,
    editIndex: null,
    // 商品规格数组
    goods_skuList: [],
    skuTitle: '',
    // 单个规格数组
    skuList: [],
    hasChanged: false,
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
    // console.log(app.globalData.skuData);
    
    this.setData({
      // 规格数据
      goods_skuList: app.globalData.skuData ? app.globalData.skuData.goods_skuList : this.data.goods_skuList,
      // sku表格数据
      excel_skuList: app.globalData.skuData ? app.globalData.skuData.excel_skuList : this.data.excel_skuList,
    })
  },

  handleShowSkuModal() {
    this.setData({
      show: true
    })
  },

  handleTitleInput(e) {
    this.setData({
      skuTitle: e.detail.value
    })
  },

  handleInput(e) {
    const { index } = e.currentTarget.dataset;
    let update = {}
    // 限制18字
    update[`skuList[${index}].name`]= e.detail.value.substring(0,18)
    this.setData(update)
  },

  handleDeleteSku(e) {
    const { index } = e.currentTarget.dataset;
    const { skuList } = this.data;
    skuList.splice(index, 1)
    this.setData({
      skuList
    })
  },
  

  // 增加规格
  handleAdd() {
    const length = this.data.skuList.length;
    this.setData({
      skuList: [...this.data.skuList, ...[{
        index: length + 1,
        id: null,
        name: ''
      }]],
      hasChanged: true,
    })
  },

  handleCancel() {
    this.setData({
      show: false,
      skuTitle: '',
      skuList: []
    })
  },
  // 保存规格
  handleSave() {
    const { skuTitle, skuList, isEdit } = this.data;
    console.log(this.data.goods_skuList);
    if (!skuTitle) {
      toast('有未填写的规格标题');
      return
    }
    if (skuList.length === 0 || skuList.some(item => !item.name)) {
      toast('有未填写的规格分类');
      return
    }
    if(!isEdit) { // 新增
      this.setData({
        show: false,
        skuTitle: '',
        skuList: [],
        goods_skuList: [...this.data.goods_skuList, ...[{
          id: skuTitle,
          title: skuTitle,
          skuList
        }]],
        hasChanged: true,
      })
      console.log(skuList);
      console.log(this.data.goods_skuList);
    } else { // 编辑  需要替换
      const { goods_skuList, editIndex, skuTitle, skuList } = this.data;
      goods_skuList[editIndex] = {
        id: skuTitle,
        title: skuTitle,
        skuList
      };
      this.setData({
        show: false,
        isEdit: false,
        skuTitle: '',
        skuList: [],
        goods_skuList,
        editIndex: null,
        hasChanged: true,
      })
    }
    
  },
  // 编辑商品规格
  handleEdit_goods_skuItem(e) {
    const { item, index } = e.currentTarget.dataset;
    this.setData({
      show: true,
      isEdit: true,
      editIndex: index,
      skuTitle: item.title,
      skuList: item.skuList,
      hasChanged: true,
    })
  },
  // 删除商品规格
  handleDelete_goods_skuItem(e) {
    const { goods_skuList } = this.data;
    const { title } = e.currentTarget.dataset;
    const _this = this;
    wx.showModal({
        title: '确定删除该规格吗？',
        content: '',
        success: function(res) {
            if (res.confirm) {
              _this.setData({
                goods_skuList: goods_skuList.filter(item => item.title !== title),
                hasChanged: true,
              })
            }
        }
    })
  },
  // 保存规格-价格设定表
  async handleSaveExcel() {
    const excel_skuList = this.selectComponent("#priceExcel").getData();
    const flag = this.checkPrice(excel_skuList);
    if (!flag) return;

    var pages = getCurrentPages();
    var page = pages[pages.length - 2];

    
    console.log(excel_skuList);
    page.setGoods_skuList(excel_skuList);

    //数据挂在app
    app.globalData.skuData = {
      goods_skuList: this.data.goods_skuList,
      excel_skuList,
      isEdit: true
    } 

    wx.navigateBack()
  },

  checkPrice(excel_skuList) {
    console.log(excel_skuList);
    let flag = true;
    if (!excel_skuList.length) {
      toast("请设置参数后再保存");
      flag = false;
      return
    }
    for(let i = 0; i < excel_skuList.length; i++) {
      const rowItem = excel_skuList[i];
      const { salePrice, groupPrice, memberPrice, agentPrice, costPrice, stock, url } = rowItem;
      if(!salePrice || !groupPrice || !memberPrice || !agentPrice || !costPrice || !stock) {
        toast("价格未填写或者填写错误");
        flag = false;
        break
      }
      if (!stock) {
        toast("库存未填写或者填写错误");
        flag = false;
        break
      }
      // if (!url) {
      //   toast("请上传图片");
      //   flag = false;
      //   break
      // }
      if (!((salePrice-groupPrice >= 0) && (groupPrice-memberPrice >= 0) && (memberPrice - agentPrice >= 0) && (agentPrice - costPrice >= 0))) {
        toast("零售价＞拼单价＞公开报价（会员价）＞代理价>成本价");
        flag = false;
        break
      }
    }
    return flag
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