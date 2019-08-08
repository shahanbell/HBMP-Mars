import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    calendarConfig: {
      multi: false,
      defaultDay: d.toISOString().substring(0, 10)
    },
    dataList: [],
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    canSubmit: false
  },
  onLoad() {
    wx.showLoading({
      title: 'Loading'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
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
    this.loadData();
  },
  onReady() {
    this.calendar.setTodoLabels({
      // 待办点标记设置
      pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
      dotColor: '#40', // 待办点标记颜色
      // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
      circle: true // 待办
    });
  },
  afterTapDay(e) {
    console.log(e)
  },
  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: './taskdetail',
      events: {
        returnDetail: function (res) {
          this.loadData();
        }
      },
      success(res) {
        res.eventChannel.emit('openDetail', {
          data:
          {
            employeeId: _this.data.employeeId,
            employeeName: _this.data.employeeName,
            deptId: _this.data.deptId,
            deptName: _this.data.deptName
          }, isNew: true
        })
      }
    })
  },
  bindEditDetailTap(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: './overdetail',
      events: {
        returnDetail: function (res) {
          let details = _this.data.detailList
          details.splice(index, 1)
          details.push(res.data)
          details.forEach((o, i) => {
            o.seq = i + 1
          })
          _this.setData!({
            detailList: details,
            canSubmit: true
          })
        }
      },
      success(res) {
        let currentObject = _this.data.detailList[index]
        res.eventChannel.emit('openDetail', {
          data:
          {
            employeeId: currentObject.employeeId,
            employeeName: currentObject.employeeName,
            deptId: currentObject.deptId,
            deptName: currentObject.deptName,
            lunch: currentObject.lunch,
            dinner: currentObject.dinner,
            date1: currentObject.date1,
            time1: currentObject.time1,
            time2: currentObject.time2,
            hour: currentObject.hour,
            content: currentObject.content
          }, isNew: false
        })
      }
    })
  },
  bindScanTap(e) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.camera']) {
          wx.authorize({
            scope: 'scope.camera',
            success() {
              // 用户已经同意小程序使用Camera
              console.log('用户已经同意小程序使用Camera')
            }
          })
        } else {
          wx.scanCode({
            onlyFromCamera: true,
            success(res) {
              console.log(res)
            }
          })
        }
      }
    })
  },
  loadData() {
    wx.request({
      url: app.globalData.restAdd + '/WeChatOpen/api/prg26c450ac24f4/jobtask',
      data: {
        openid: app.globalData.openId,
        sessionkey: app.globalData.sessionKey,
        employeeid: app.globalData.employeeId
      }
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        //console.log(res.data)
        this.setData!({
          dataList: res.data.data
        })
      },
      fail: fail => {
        console.log(fail)
      }
    })
  }

})
