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
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    skuList:{
      type: Array,
      value: []
    },
    mode: {
      type: String,
    }
  },

  observers: {
    skuList(val) {
      if (val.length) {
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
        name: '缩略图'
      },
      {
        id: 1,
        name: '规格名'
      },
      {
        id: 2,
        name: '零售价'
      },
      {
        id: 3,
        name: '拼单价'
      },
      {
        id: 4,
        name: '会员价'
      },
      {
        id: 5,
        name: '代理价'
      },
      {
        id: 6,
        name: '成本价'
      },
      
    ],
    data: [],
    rowItem: {
      "salePrice": "",
      "groupPrice": "",
      "memberPrice": "",
      "agentPrice": "",
      "costPrice": "",
      "bargainPrice": "",
      "stock": "",
      "url": "",
    },
  },

  lifetimes : {
    // ready () {
    //   this.initData()
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initData() {
      this.setData({
        data: this.data.skuList
      })
    },
    getData() {
      return this.data.data
    }
  }
})
