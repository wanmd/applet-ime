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

console.log(app.globalData.goods_skuList);

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    skuList:{
      type: Array,
      value: []
    }
  },

  observers: {
    skuList(val, old) {
      if (val.length && val !== old) {
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
    read_headerLsit: [
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
      agentPrice: "50",
      bargainPrice: "",
      costPrice: "40",
      groupPrice: "80",
      memberPrice: "60",
      salePrice: "100",
      stock: "100",
      "url": "",
    },
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
    initData() {
      const skuList = this.data.skuList.map(item => {
        item.skuList.forEach(vitem => vitem.title = item.title);
        return item
      });
      console.log(skuList);
      
      const list = skuList.map(item => item.skuList);
      console.log(list);
      let allArr = this.cartesianProductOf(...list);
      console.log(allArr);
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

      // const tempArr = [
      //   {index: 1, name: "黄色-64g"},
      //   {index: 1, name: "黄色-128g"},
      //   {index: 1, name: "蓝色-64g"},
      //   {index: 1, name: "蓝色-128g"},
      // ]
      // const newArr = tempArr.map(item =>{
      //   item = {
      //     ...item,
      //     ...this.data.rowItem
      //   }
      //   return item
      // })
      // console.log(newArr);

      this.setData({
        data: newArr
      })
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
    handleInput(e) {
      const { index, name } = e.currentTarget.dataset;
      const { value } = e.detail;
      let update = {};
      switch(name) {
        case 'salePrice':
          update[`data[${index}].salePrice`] = value;
          break
        case 'groupPrice':
          update[`data[${index}].groupPrice`] = value;
          break
        case 'memberPrice':
          update[`data[${index}].memberPrice`] = value;
          break
        case 'agentPrice':
          update[`data[${index}].agentPrice`] = value;
          break
        case 'costPrice':
          update[`data[${index}].costPrice`] = value;
          break
        case 'stock':
          update[`data[${index}].stock`] = value;
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
      update[`data[${index}].url`] = value;
      console.log(update);
      this.setData(update);
    },
    getData() {
      return this.data.data
    }
  }
})
