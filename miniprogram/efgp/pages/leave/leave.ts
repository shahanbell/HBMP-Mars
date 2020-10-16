//leave.ts
import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    dataList: [] as any,
    hasOpenId: false,
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    showRowDate: new Date().getTime(),
    date1: d.toISOString().substring(0, 10),
    date2: d.toISOString().substring(0, 10),
    time1: "08:00",
    time2: "17:10",
    formType: '1',
    formTypeDesc: '普通工作日',
    formKind: '2',
    formKindDesc: '2-事假',
    workType: '1',
    workTypeDesc: '1-常日班 8:00-17:10',
    leaveDay: 1 as number,
    leaveHour: 0 as number,
    leaveMinute: 0 as number,
    reason: '',
    checked:false,
    showTime:false,
    showDate:false,
    conpomentid: '',
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
  },
  onLoad() {
    wx.showLoading({
      title: 'Loading',
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    if (app.globalData.openId) {
      this.setData!({
        hasOpenId: true
      })
    }
    if (app.globalData.authorized) {
      this.setData!({
        employeeId: app.globalData.employeeId,
        employeeName: app.globalData.employeeName
      })
    }
    if (app.globalData.defaultDeptId) {
      this.setData!({
        deptId: app.globalData.defaultDeptId,
        deptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName
      })
    }
  },
  bindDeptSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
      events: {
        returnDeptSelect: function (res) {
          if (res) {
            that.setData!({
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
  bindFormTypeChange(e) {
    if (e.detail) {
      this.setData({
        formType: '2',
        formTypeDesc: '法定节假假日前后',
        checked:true
      })
    } else {
      this.setData({
        formType: '1',
        formTypeDesc: '普通工作日',
        checked:false
      })
    }
  },
  bindLeaveKindSelect(e) {
    let that = this
    wx.navigateTo({
      url: './leaveKindSelect',
      events: {
        returnLeaveKindSelect: function (res) {
          if (res) {
            that.setData!({
              formKind: res.k,
              formKindDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindWorkTypeSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/workTypeSelect/workTypeSelect',
      events: {
        returnWorkTypeSelect: function (res) {
          if (res) {
            that.setData!({
              workType: res.k,
              workTypeDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindLeaveDayChange(e) {
    this.setData!({
      leaveDay: e.detail
    })
  },
  bindLeaveHourChange(e) {
    this.setData!({
      leaveHour: e.detail
    })
  },
  bindLeaveMinuteChange(e) {
    this.setData!({
      leaveMinute: e.detail
    })
  },
  bindReasonChange(e) {
    console.log(e)
    this.setData!({
      reason: e.detail.value
    })
  },

  bindPickerTime(e){
    this.setData!({
      conpomentid: e.currentTarget.id
    })
    this.openPickerTime1();
  },
  bindCloseTime(e){
    this.closePickerTime1();
  },
  bindTime1Cencel(e){
    this.closePickerTime1();
  },
  bindTime1Confirm(e){
    this.closePickerTime1();
  },
  bindTime1Input(e){
    if(this.data.conpomentid=='time1'){
      this.setData!({
        time1: e.detail
      })
    }
    if (this.data.conpomentid == 'time2') {
    this.setData!({
      time2: e.detail
    })
    }
  },
  
  openPickerTime1(){ 
    this.setData!({
      showTime: true
    })
  },
  closePickerTime1() {
    this.setData!({
      showTime: false
    })
  },


  bindPickerDate(e){
    this.openPickerDate();
    this.setData!({
      conpomentid: e.currentTarget.id
    })
  },
  bindCloseDate(e){
    this.closePickerDate();
  },

  bindDateCancel(e){
    this.closePickerDate();
  },
  bindDateConfirm(e){
    this.closePickerDate();
  },
  bindDateInput(e){
    if (this.data.conpomentid == 'date1') {
      this.setData!({
        date1: this.dateFormatForYYMMDD(e.detail)
      })
    }
    if (this.data.conpomentid == 'date2') {
      this.setData!({
        date2: this.dateFormatForYYMMDD(e.detail)
      })
    }
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
  formSubmit(e) {
    let canSubmit = true
    let errmsg = ''
    if (!app.globalData.authorized) {
      canSubmit = false
      errmsg += '账号未授权\r\n'
    }
    if (!this.data.employeeId || this.data.employeeId == '') {
      canSubmit = false
      errmsg += '请填写申请人员\r\n'
    }
    if (!this.data.deptId || this.data.deptId == '') {
      canSubmit = false
      errmsg += "请填写申请部门\r\n"
    }
    if (!this.data.reason || this.data.reason == '') {
      canSubmit = false
      errmsg += "请填写请假原因\r\n"
    }
    let t = this.data.leaveDay + this.data.leaveHour + this.data.leaveMinute
    if (t < 1) {
      canSubmit = false
      errmsg += "请填写请假时间\r\n"
    }
    if (canSubmit) {
      let _this = this
      wx.showModal({
        title: '系统提示',
        content: '确定提交吗',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: 'Sending'
            })
            wx.request({
              url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkgl004/wechat?' + app.globalData.restAuth,
              data: {
                employee: _this.data.employeeId,
                formType: _this.data.formType,
                formTypeDesc: _this.data.formTypeDesc,
                formKind: _this.data.formKind,
                formKindDesc: _this.data.formKindDesc,
                workType: _this.data.workType,
                workTypeDesc: _this.data.workTypeDesc,
                date1: _this.data.date1,
                time1: _this.data.time1,
                date2: _this.data.date2,
                time2: _this.data.time2,
                leaveDay: _this.data.leaveDay,
                leaveHour: _this.data.leaveHour,
                leaveMinute: _this.data.leaveMinute,
                reason: _this.data.reason
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: res => {
                // console.log(res.data)
                wx.hideLoading()
                wx.showModal({
                  title: '系统消息',
                  content: res.data.msg,
                  showCancel: false,
                  success(res) {
                    wx.switchTab({
                      url: "/pages/index/index"
                    })
                  }
                })
              },
              fail: fail => {
                wx.hideLoading();
                wx.showModal({
                  title: '系统提示',
                  content: "请联系管理员:"+fail,
                  showCancel: false
                })
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: errmsg,
        showCancel: false
      })
    }
  },
  formReset() {
    // console.log('form发生了reset事件');
  }
})
