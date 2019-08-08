//overdetail.ts
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let eventChannel
let d = new Date()
Page({
  data: {
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    lunch: false,
    dinner: false,
    date1: d.toISOString().substring(0, 10),
    time1: "08:00",
    time2: "17:10",
    hour: 0.5 as number,
    content: '',
    isNew: false
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
          employeeId: res.data.employeeId,
          employeeName: res.data.employeeName,
          deptId: res.data.deptId,
          deptName: res.data.deptName,
          isNew: res.isNew
        })
      } else {
        this.setData!({
          employeeId: res.data.employeeId,
          employeeName: res.data.employeeName,
          deptId: res.data.deptId,
          deptName: res.data.deptName,
          lunch: res.data.lunch,
          dinner: res.data.dinner,
          date1: res.data.date1,
          time1: res.data.time1,
          time2: res.data.time2,
          hour: res.data.hour,
          content: res.data.content,
          isNew: res.isNew
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
  bindLunchChange(e) {
    this.setData!({
      lunch: e.detail.value
    })
  },
  bindDinnerChange(e) {
    this.setData!({
      dinner: e.detail.value
    })
  },
  bindDate1Change(e) {
    this.setData!({
      date1: e.detail.value
    })
  },
  bindTime1Change(e) {
    this.setData!({
      time1: e.detail.value
    })
  },
  bindTime2Change(e) {
    this.setData!({
      time2: e.detail.value
    })
  },
  bindOvertimeChange(e) {
    this.setData!({
      hour: e.detail.value
    })
  },
  bindContentChange(e) {
    this.setData!({
      content: e.detail.value
    })
  },
  formSubmit(e) {
    let canSubmit = true
    let errmsg = ''
    if (this.data.hour == 0) {
      canSubmit = false
      errmsg += '请输入加班时间'
    }
    if (!this.data.content || this.data.content == '') {
      canSubmit = false
      errmsg += '请输入工作内容'
    }
    if (canSubmit) {
      let newObject = {
        employeeId: this.data.employeeId,
        employeeName: this.data.employeeName,
        deptId: this.data.deptId,
        deptName: this.data.deptName,
        seq: -1,
        lunch: this.data.lunch,
        dinner: this.data.dinner,
        date1: this.data.date1,
        time1: this.data.time1,
        time2: this.data.time2,
        hour: this.data.hour,
        content: this.data.content
      }
      eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('returnDetail', { data: newObject, isNew: this.data.isNew })
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
      })
    }
  }
})
