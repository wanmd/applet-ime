// pages/goodsSku/comp/priceExcel/index.js

// const originSkuList = [
//   {
//     id: "颜色",
//     title: "颜色",
//     skuList: [
//       {index: 1, id: null, name: "黄色"},
//       {index: 2, id: null, name: "褐色"}
//     ]
//   },
//   {
//     id: "内存",
//     title: "内存",
//     skuList: [
//       {index: 1, id: null, name: "64g"},
//       {index: 2, id: null, name: "128g"}
//     ]
//   },
// ]
let app = getApp()

console.log(app.globalData);

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show_excel: {
      type: Boolean,
      value: false,
    },
    skuList:{
      type: Array,
      value: []
    },
    // isEdit: {
    //   type: Boolean,
    //   value: false
    // },
    hasChanged: {
      type: Boolean,
      value: false
    },
    excel_skuList: {
      type: Array,
      value: []
    }
  },

  observers: {
    skuList(val) {
      if (val.length && val) {
        this.initData()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    headerLsit: [
      {
        id: 0,
        name: '零售价/柜台价'
      },
      {
        id: 1,
        name: '拼单价'
      },
      {
        id: 2,
        name: '公开价/会员价'
      },
      {
        id: 3,
        name: '代理价/拿货价'
      },
      {
        id: 4,
        name: '成本价'
      },
      {
        id: 5,
        name: '库存'
      },
      {
        id: 6,
        name: '图片'
      },
    ],
    excel_skuList: [],
    rowItem: {
      agentPrice: "60",
      bargainPrice: "",
      costPrice: "50",
      groupPrice: "90",
      memberPrice: "80",
      salePrice: "100",
      stock: "100",
      url: "",
    },
    // 批量设置弹框
    showBatch: false
  },

  // lifetimes : {
  //   ready () {
  //     debugger
  //     this.initData()
  //   }
  // },
  // pageLifetimes: {
  //   show: function() {
  //     // 页面被展示  初始化数据的时候操作
  //     this.initData()
  //   }
  // },

  /**
   * 组件的方法列表
   */
  methods: {
    async initData() {
      // console.log(app.globalData.skuData.isEdit);
      const isEdit = (app.globalData.skuData && app.globalData.skuData.isEdit) || false;
      if (isEdit) { // 编辑
        if (!this.data.hasChanged) {
          this.setData({
            excel_skuList: this.data.excel_skuList
          })
        } else {
          this.propsData();
          //this.mockData();
        }
        
      } else {// 新增
        this.propsData();
        //this.mockData();
      }
      
    },
    // 组件数据  真实
    async propsData() {
      setTimeout(() => {
        const skuList = this.data.skuList.map(item => {
          item.skuList.forEach(vitem => vitem.title = item.title);
          return item
        });
        
        const list = skuList.map(item => item.skuList);
        let allArr = this.cartesianProductOf(...list);
        const newArr = allArr.map(item => {
          var obj = {}
          obj = {
            index:'',
            name: ''
          }
          item.forEach((it, index) => {
            obj.index = it.index
            obj.name = index === 0 ? it.name : `${obj.name}-${it.name}`;
            obj.title = index === 0 ? it.title : `${obj.title}-${it.title}`;
            obj = {
              ...obj,
              ...this.data.rowItem
            }
          })
          return obj
        })
        console.log(newArr);
        this.setData({
          excel_skuList: newArr
        })
      },0)
      
    },
    // 假数据  调试部分功能时使用
    mockData() {
      const tempArr = [
        {index: 1, name: "黄色-64g"},
        // {index: 1, name: "黄色-128g"},
        // {index: 1, name: "蓝色-64g"},
        // {index: 1, name: "蓝色-128g"},
      ]
      const newArr = tempArr.map(item =>{
        item = {
          ...item,
          ...this.data.rowItem
        }
        return item
      })
      console.log(newArr);
      return newArr
    },
    // 动态计算sku
    cartesianProductOf() {
      return Array.prototype.reduce.call(arguments, function(a, b) {
          var ret = [];
          a.forEach(function(a) {
              b.forEach(function(b) {
                  ret.push(a.concat([b]));
              });
          });
          return ret;
      }, [[]]);
    },
    // 批量设置
    batchPrice() {
      this.setData({
        showBatch: true
      })
    },
    handleCancel() {
      this.setData({
        showBatch: false
      })
    },
    formSubmit(e) {
      this.setData({
        data: this.data.excel_skuList.map(item => {
          item = {
            ...item,
            ...e.detail.value
          }
          return item
        }),
        showBatch: false
      })
    },
    handleInput(e) {
      const { index, name } = e.currentTarget.dataset;
      const { value } = e.detail;
      let update = {};
      switch(name) {
        case 'salePrice':
          update[`excel_skuList[${index}].salePrice`] = value;
          break
        case 'groupPrice':
          update[`excel_skuList[${index}].groupPrice`] = value;
          break
        case 'memberPrice':
          update[`excel_skuList[${index}].memberPrice`] = value;
          break
        case 'agentPrice':
          update[`excel_skuList[${index}].agentPrice`] = value;
          break
        case 'costPrice':
          update[`excel_skuList[${index}].costPrice`] = value;
          break
        case 'stock':
          update[`excel_skuList[${index}].stock`] = value;
          break
      }
      this.setData(update);
    },
    // 图片上传成功
    hanldeSuccess(e) {
      console.log(this.data);
      const { index } = e.currentTarget.dataset;
      const { value } = e.detail;

      let update = {};
      update[`excel_skuList[${index}].url`] = value;
      console.log(update);
      this.setData(update);
    },
    getData() {
      return this.data.excel_skuList
    }
  }
})
