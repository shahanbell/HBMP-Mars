import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let eventChannel
let d = new Date()
Page({
  data: {
    bizEmployee: null,
    bizEmployeeName: null,
    bizDate: d.toISOString().substring(0, 10),
    bizTime1: "08:00",
    bizTime2: "17:10",
    bizObject: "",
    bizAddress: "",
    bizContent: "",
    showDate1: false,
    showRowDate1: new Date().getTime(),
    showTime1:false,
    showTime2: false,
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    conpomentid: '',
    showDateInit:''
  },
  onLoad() {
    wx.showLoading({
      title: '加载中',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    eventChannel = this.getOpenerEventChannel()
    eventChannel.on('openDetail', (res) => {
      if (res.isNew) {
        this.setData!({
          bizEmployee: res.data.bizEmployee,
          bizEmployeeName: res.data.bizEmployeeName,
          isNew: res.isNew
        })
      } else {
        this.setData!({
          bizEmployee: res.data.bizEmployee,
          bizEmployeeName: res.data.bizEmployeeName,
          bizDate: res.data.bizDate,
          bizTime1: res.data.bizTime1,
          bizTime2: res.data.bizTime2,
          bizObject: res.data.bizObject,
          bizAddress: res.data.bizAddress,
          bizContent: res.data.bizContent,
        })
      }
    })
  },
  bindDeptSelect(e) {
    let _this = this
    wx.navigateTo({
      url: '../deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
      events: {
        returnDeptSelect: function (res) {
          if (res) {
            _this.setData!({
              deptId: res.k,
              deptName: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },

  bindBizObjectChange(e) {
    this.setData!({
      bizObject: e.detail
    })
  },
  bindBizAddressChange(e) {
    this.setData!({
      bizAddress: e.detail
    })
  },
  bindBizContentChange(e) {
    this.setData!({
      bizContent: e.detail
    })
  },

  
  //出差日期时间组件事件
  bindPickerDate1(e) {
    this.setData!({
      showRowDate1: this.formatYYMMDDToDate(this.data.bizDate)
    })
    this.openPickerDate1();
  },
  bindCloseDate1(e) {
    this.closePickerDate1();
  },

  bindDate1Cancel(e) {
    this.closePickerDate1();
  },
  bindDate1Confirm(e) {
    if (e.detail != 1262275200000) {
      this.setData!({
        bizDate: this.dateFormatForYYMMDD(e.detail)
      })
    }
    this.closePickerDate1();
  },
  openPickerDate1() {
    this.setData!({
      showDate1: true
    })
  },
  closePickerDate1() {
    this.setData!({
      showDate1: false
    })
  },
//开始时间组件事件
  bindPickerTime1(e) {
    this.openPickerTime1();
  },
  bindCloseTime1(e) {
    this.closePickerTime1();
  },
  bindTime1Cencel(e) {
    this.closePickerTime1();
  },
  bindTime1Confirm(e) {
    this.setData!({
      bizTime1: e.detail
    })
    this.closePickerTime1();
  },
 
  openPickerTime1() {
    this.setData!({
      showTime1: true
    })
  },
  closePickerTime1() {
    this.setData!({
      showTime1: false
    })
  },
  //截止时间组件事件
  bindPickerTime2(e) {
    this.openPickerTime2();
  },
  bindCloseTime2(e) {
    this.closePickerTime2();
  },
  bindTime2Cencel(e) {
    this.closePickerTime2();
  },
  bindTime2Confirm(e) {
    this.setData!({
      bizTime2: e.detail
    })
    this.closePickerTime2();
  },

  openPickerTime2() {
    this.setData!({
      showTime2: true
    })
  },
  closePickerTime2() {
    this.setData!({
      showTime2: false
    })
  },

  formatYYMMDDToDate(value) {
    var str = value.replace(/-/g, '/');
    var date = new Date(str)
    return date.getTime();
  },

  dateFormatForYYMMDD(date) {
    let dateTemp = new Date(date);
    let year = dateTemp.getFullYear();
    let month = dateTemp.getMonth() + 1;
    let day = dateTemp.getDate();
    let hour = dateTemp.getHours();
    let minute = dateTemp.getMinutes();
    let dayTemp = year + "-" + month + "-" + day;
    return dayTemp;
  },


  formSubmit(e) {
    let canSubmit = true
    if (this.data.bizObject == '' || this.data.bizAddress== '' || this.data.bizContent==''){
      canSubmit=false
    }
    if (canSubmit) {
      let newObject = {
        bizEmployee: this.data.bizEmployee,
        bizEmployeeName: this.data.bizEmployeeName,
        bizDate: this.data.bizDate,
        bizTime1: this.data.bizTime1,
        bizTime2: this.data.bizTime2,
        bizObject: this.data.bizObject,
        bizAddress: this.data.bizAddress,
        bizContent: this.data.bizContent
      }
      // console.log(newObject)
      eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('returnDetail', { data: newObject, isNew: this.data.isNew })
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: '有必填项未填',
        showCancel: false
      })
    }
  }

})
