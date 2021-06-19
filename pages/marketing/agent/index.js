import { Request, toast } from '../../../utils/util.js'
let request = new Request()
wx.Page({
  data: {
    formData : {
      fee : '',
      slogan: '',
      min_number: '',
      sale_service: '',
      picture:[],
      remarks: ''
    },
  },
  uploadPic(e) {
    let d = new Date()
    let file = e.detail.value
    let formData = JSON.parse(JSON.stringify(this.data.formData))
    // form3.images.push({ file: file, id: d.getTime()})
    formData.picture.push(file)
    this.setData({ formData: formData})
  },
  uploadPic_(e) {
    let d = new Date()
    let file = e.detail.value
    let index = parseInt(e.target.dataset.index)
    let formData = JSON.parse(JSON.stringify(this.data.formData))
    // form3.images.push({ file: file, id: d.getTime()})
    formData.picture[index] = file
    // formData.picture.push(file)
    this.setData({ formData: formData})
  },

  clearPic(e) {
    let index = parseInt(e.target.dataset.index)
    let formData = this.data.formData
    formData.picture.splice(index, 1)
    this.setData({ formData: formData})
  },
  input(e) {
    let target = e.currentTarget.dataset.target
    let update = {}
    update['formData.' + target] = e.detail.value
    this.setData(update)
  },

  confirm () {
    let formData = Object.assign({}, this.data.formData)
    for (let k in formData) {
      if (formData[k] === '' &&  k !='slogan') {
        toast('请完整填写数据')
        return
      }
    }

    request.post('agent/setrule', res => {
      if(res.success) {
        toast('设置成功')
        wx.navigateBack({
          
        })
      }else{
        toast(res.msg)
      }
    }, formData).showLoading()
  },

  onLoad: function (options) {
    request.get('agent/rule', res => {
      if(res.success) {
        let data = res.data
        if(typeof data.picture == 'string'){
          data.picture = JSON.parse(data.picture)
        }
        if(data) {
          let formData = Object.assign({}, this.data.formData)
          for(let k in data) {
            if (k in formData) {
              formData[k] = data[k]
            }
          }
          this.setData({ formData: formData})
        }
      }
    }).showLoading()
  }
})