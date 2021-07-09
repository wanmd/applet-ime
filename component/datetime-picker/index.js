import { formatNumber } from '../../utils/util';

Component({
  /**
   * 组件的行为
   */
  behaviors: ['wx://form-field'],

  /**
   * 组件的选项
   */
  options: {
    styleIsolation: 'shared',
  },

  /**
   * 组件的属性列表
   */
  properties: {
    option: {
      type: null,
      value: null,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    value:'',
    initvalue: '',
    showvalue: '',
    message: '',
    rangeValues: []
  },

  /**
   * 组件的数据监听
   */
  observers: {
    'option': function (option) {
      if (option) {
        this.setData({ message: option.message || '', initialValue:option.initialValue });
        this.initValue();
      }
    },
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached() {
      // 初始值
      
    },
    detached() {

    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 初始值
     */
    initValue() {
      // 不符合条件，返回
      if (this.data.option === null) { return }
      // 取值
      // console.log(this.data.option)
      const { initialValue } = this.data.option;
      // 更新初始值
      const initvalue = this.initDate();
      
      if(!initialValue || initialValue === this.data.initialValue) return;

      this.setData({
        value: initialValue?this.initShowValue(initvalue):'',
        initvalue:initvalue,
        // showvalue:this.initShowValue(initvalue)
      })
    },

    /**
     * 显示值
     */
    initShowValue(value,flag) {
      // 解构取值
      const { rangeValues } = this.data;

      // 循环，找到匹配项
      let arr = []
      for (let index = 0; index < rangeValues.length; index++) {
        const item = rangeValues[index];
        arr.push(item[value[index]].value)
      }
      let format = this.data.option.format || 'yyyy-MM-dd hh:mm';
      if(!flag)format = format.replace(/-/g, '/')
      var o = {
        "M+": arr[1], //月份
        "d+": arr[2], //日
        "h+": arr[3], //小时
        "m+": arr[4], //分
        "s+": 0, //秒
      };
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (arr[0] + "").substr(4 - RegExp.$1.length));
      for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      // return `${arr[0]}-${arr[1]}-${arr[2]} ${arr[3]}:${arr[4]}`
      return format
    },
    
    initDate() {
      let { start, end, initialValue } = this.data.option;
      // const { initvalue } = this.data;
      start = start?new Date(start):null;
      end = end?new Date(end):null;
      initialValue = initialValue?new Date(initialValue):new Date();

      if (!start) {
        // start = this.GetTenYear(-10,true);//未提供结束时间取十年前时间
        start = this.GetTenYear(-1,true);//未提供结束时间取十年前时间
      }
      if (!end) end = this.GetTenYear(10,true);//未提供结束时间取十年后时间

      // if(!start && !end)start = now;//若开始和结束时间都未固定
      const dru = end.getTime() - start.getTime();
      let years = [],months = [],days = [],hours = [],mins = [];
      const startInfo = this.getDateInfo(start);
      const endInfo = this.getDateInfo(end);
      const valueInfo = this.getDateInfo(initialValue);
      // const initialInfo = this.getDateInfo(initialValue);

      const startMonth = !this.data.initvalue || this.data.initvalue[0] == 0?start.getMonth()+1:1
      const startDay = !this.data.initvalue || this.data.initvalue[0] == 0 && this.data.initvalue[1] == 0?start.getDate():1
      const startHour = !this.data.initvalue || this.data.initvalue[0] == 0 && this.data.initvalue[1] == 0 && this.data.initvalue[2] == 0?start.getHours():0
      const startMin = !this.data.initvalue || this.data.initvalue[0] == 0 && this.data.initvalue[1] == 0 && this.data.initvalue[2] == 0 && this.data.initvalue[3] == 0?start.getMinutes():0

      years = this.getYears(start,end);
      months = this.getMonth(startMonth);
      days = this.getDay(startDay,this.getMonthDur(this.data.initvalue?this.initShowValue(this.data.initvalue):start)); //默认获取当前选中月的天数
      hours = this.getHours(startHour);
      mins = this.getMin(startMin);

      if (dru <= 60 * 60 * 1000) { //分
        mins = this.getMin(start.getMinutes(),end.getMinutes());
      }
      if (dru <= 24 * 60 * 60 * 1000) { //小时
        hours = this.getMin(start.getHours(),end.getHours());
      }
      if (startInfo.year == endInfo.year && startInfo.month == endInfo.month && dru <= this.getMonthDur(start)) { //天
        days = this.getMin(start.getDate(),end.getDate());
      }
      if (startInfo.year == endInfo.year && dru <= this.getYearDur(startInfo.year)) { //月
        months = this.getMin(start.getMonth() + 1,end.getMonth() + 1);
      }
      const rang = [];//picker的rang

      //格式
      let format = this.data.option.format || 'yyyy-MM-dd hh:mm';
      var o = {
        "y+": years,//年
        "M+": months, //月份
        "d+": days, //日
        "h+": hours, //小时
        "m+": mins, //分
      };
      for (var k in o)
        if (new RegExp("(" + k + ")").test(format)) rang.push(o[k]);
      
        // const rang = [years,months,days,hours,mins];//picker的rang
      //获取picker的value
      const initvalue = this.data.initvalue?this.data.initvalue:[this.getIndex(valueInfo.year,years),this.getIndex(valueInfo.month,months),this.getIndex(valueInfo.day,days),
        this.getIndex(valueInfo.hour,hours),this.getIndex(valueInfo.minute,mins)];
        // console.log(initvalue);
        // console.log('rang----',rang)
      this.setData({
        rangeValues:rang,
        
        // showvalue: this.initShowValue(value),
      },()=>{this.setData({initvalue:[...initvalue]})})
      return initvalue;
    },

    getIndex(value,array){
      return array.findIndex(d=>d.value == value)
    },
    getDateInfo(date){
      return {
        year:date.getFullYear(),
        month:date.getMonth() + 1,
        day:date.getDate(),
        hour:date.getHours(),
        minute:date.getMinutes(),
        second:date.getSeconds()
      }
    },

    /**
     * 获取一个月的天数
     * @param {*} date 
     */
    getMonthDur(date){
      const year = new Date(date).getFullYear()
      const month = new Date(date).getMonth()+1
      var days = new Date(year, month, 0);
      days = days.getDate(); //获取当前日期中月的天数
      return days
    },
    /**
     * 获取一年的时间戳
     * @param {*} year 
     */
    getYearDur(year){
      const start = new Date(year,0,0,0,0,0,0)
      const end = new Date(year,12,31,23,59,59,999);
      return end.getTime() - start.getTime()
    },

    /**
     * 获取N年前或者N年后
     * @param {*} year 
     */
    GetTenYear(year,reset) {
      var time = new Date();
      if(reset) time = new Date(time.getFullYear(),0,1,0,0,0,0)
      time.setFullYear(time.getFullYear() + year);
      return time;
    },
    //
    getYears(start,end) {
      const startnum = new Date(start).getFullYear();
      const endnum = new Date(end).getFullYear()
      let years = []
      for (let i = startnum; i <= endnum; i++) {
        years.push({value:i,name:i+'年'});
      }
      return years
    },
    //获取月份
    getMonth(start = 1, end = 12) {
      let months = []
      for (let i = start; i <= end; i++) {
        months.push({value:i,name:formatNumber(i)+'月'});
      }
      return months
    },
    getDay(start = 1,end = 31) {
      let days = []
      for (let i = start; i <= end; i++) {
        days.push({value:i,name:formatNumber(i)+'日'});
      }
      return days
    },
    getHours(start = 0,end = 23) {
      let hours = []
      for (let i = start; i <= end; i++) {
        hours.push({value:i,name:formatNumber(i)+'时'});
      }
      return hours
    },
    getMin(start = 0, end = 59) {
      let mins = []
      for (let i = start; i <= end; i++) {
        mins.push({value:i,name:formatNumber(i)+'分'});
      }
      return mins
    },

    /**
     * 校验-失焦
     */
    checkRule(e) {
      // 解构取值
      const { value } = e.detail;
      // 更新提示
      this.setData({
        initvalue: value,
        value: this.initShowValue(value),
        showvalue: this.initShowValue(value,true),
      });
      this.triggerEvent('change', { value: this.initShowValue(value, true) });
    },
    handleChangeColumn(e){
      // console.log(e)
      let v = this.data.initvalue
      const { value, column } = e.detail;
      for (let index = 0; index < v.length; index++) {
        if(index>column)v[index] = 0;
        v[column] = value;
      }

      this.setData({
        initvalue:v
      },()=>this.initDate())    
    }
  },
});
