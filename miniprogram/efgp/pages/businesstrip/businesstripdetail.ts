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
    showDate: false,
    showTime:false,
    showInitDate: new Date().getTime(),
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
          bizContent: res.data.bizContent
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

  
  bindPickerDate(e) {
    this.openPickerDate();
  },
  bindCloseDate(e) {
    this.closePickerDate();
  },

  bindDateCancel(e) {
    this.closePickerDate();
  },
  bindDateConfirm(e) {
    this.closePickerDate();
  },
  bindDateInput(e) {
    this.setData!({
      bizDate: this.dateFormatForYYMMDD(e.detail)
    })   
  },
  openPickerDate() {
    this.setData!({
      showDate: true
    })
  },
  closePickerDate() {
    this.setData!({
      showDate: false
    })
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


  bindPickerTime(e) {
    if (e.currentTarget.id =='bizTime1'){
      this.setData!({
        showDateInit: this.data.bizTime1
      })
    }
    if (e.currentTarget.id == 'bizTime2') {
      this.setData!({
        showDateInit: this.data.bizTime2
      })
    }
    this.setData!({
      conpomentid: e.currentTarget.id
    })
    this.openPickerTime1();
  },
  bindCloseTime(e) {
    this.closePickerTime1();
  },
  bindTime1Cencel(e) {
    this.closePickerTime1();
  },
  bindTime1Confirm(e) {
    this.closePickerTime1();
  },
  bindTime1Input(e) {
    if (this.data.conpomentid == 'bizTime1') {
      this.setData!({
        bizTime1: e.detail
      })
    }
    if (this.data.conpomentid == 'bizTime2') {
      this.setData!({
        bizTime2: e.detail
      })
    }
  },

  openPickerTime1() {
    this.setData!({
      showTime: true
    })
  },
  closePickerTime1() {
    this.setData!({
      showTime: false
    })
  },


  formSubmit(e) {
    let canSubmit = true
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
