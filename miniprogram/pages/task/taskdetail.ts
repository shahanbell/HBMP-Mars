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
    name: '',
    description: '',
    plannedStartDate: d.toISOString().substring(0, 10),
    plannedStartTime: "08:00",
    plannedFinishDate: d.toISOString().substring(0, 10),
    plannedFinishTime: "08:00",
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
  bindNameChange(e) {
    this.setData!({
      name: e.detail.value
    })
  },
  bindPlannedStartDateChange(e) {
    this.setData!({
      plannedStartDate: e.detail.value
    })
  },
  bindPlannedStartTimeChange(e) {
    this.setData!({
      plannedStartTime: e.detail.value
    })
  },
  bindPlannedFinishDateChange(e) {
    this.setData!({
      plannedFinishDate: e.detail.value
    })
  },
  bindPlannedFinishTimeChange(e) {
    this.setData!({
      plannedFinishTime: e.detail.value
    })
  },
  bindContentChange(e) {
    this.setData!({
      description: e.detail.value
    })
  },
  formSubmit(e) {
    let canSubmit = true
    let errmsg = ''
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
            let newObject = {
              name: _this.data.name,
              description: _this.data.description,
              leaderId: _this.data.employeeId,
              leader: _this.data.employeeName,
              plannedStartDate: _this.data.plannedStartDate,
              plannedFinishDate: _this.data.plannedFinishDate,
              status: 'N'
            }
            //存储
            let url = app.globalData.restAdd + '/WeChatOpen/api/prg26c450ac24f4/jobtask?openid=' + app.globalData.openId + '&sessionkey=' + app.globalData.sessionKey;
            wx.request({
              url: url,
              data: {
                name: _this.data.name,
                description: _this.data.description,
                leaderId: _this.data.employeeId,
                leader: _this.data.employeeName,
                plannedStartDate: _this.data.plannedStartDate,
                plannedFinishDate: _this.data.plannedFinishDate,
                status: 'N'
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: res => {
                //console.log(res)
                wx.hideLoading()
                wx.showModal({
                  title: '系统消息',
                  content: res.data.msg,
                  showCancel: false,
                  success(res) {
                    eventChannel = this.getOpenerEventChannel()
                    eventChannel.emit('returnDetail', { data: newObject, isNew: this.data.isNew })
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              },
              fail: fail => {
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
  }
})
