//leave.ts
import { IMyApp } from '../../app'

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
    reason: ''
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
      url: '../deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
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
    if (e.detail.value) {
      this.setData!({
        formType: '2',
        formTypeDesc: '法定节假假日前后'
      })
    } else {
      this.setData!({
        formType: '1',
        formTypeDesc: '普通工作日'
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
      url: '../workTypeSelect/workTypeSelect',
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
  bindDate1Change(e) {
    this.setData!({
      date1: e.detail.value,
      date2: e.detail.value
    })
  },
  bindTime1Change(e) {
    this.setData!({
      time1: e.detail.value
    })
  },
  bindDate2Change(e) {
    this.setData!({
      date2: e.detail.value
    })
  },
  bindTime2Change(e) {
    this.setData!({
      time2: e.detail.value
    })
  },
  bindLeaveDayChange(e) {
    this.setData!({
      leaveDay: e.detail.value
    })
  },
  bindLeaveHourChange(e) {
    this.setData!({
      leaveHour: e.detail.value
    })
  },
  bindLeaveMinuteChange(e) {
    this.setData!({
      leaveMinute: e.detail.value
    })
  },
  bindReasonChange(e) {
    console.log(e)
    this.setData!({
      reason: e.detail.value
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
                wx.hideLoading()
                console.log(fail)
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
    //console.log('form发生了reset事件');
  }
})
