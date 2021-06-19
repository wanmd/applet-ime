import { assetsImages } from '../../utils/config.js';
// component/el-image/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src : {
      type : String,
      value : '',
    },

    style : {
      type : String,
      value : ''
    },

    mode : {
      type: String,
      value: 'widthFix'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    assetsImages: assetsImages,
    imgUrl: '/assets/images/'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
