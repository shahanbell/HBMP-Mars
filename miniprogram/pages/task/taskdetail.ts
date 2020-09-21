import { IMyApp } from '../../app'
import * as util from '../../utils/util'

const app = getApp<IMyApp>()
let eventChannel
let ld = util.getLocalDate()
let lt = util.getLocalTime()
Page({
  data: {
    deptId: null,
    deptName: null,
    id: -1 as number,
    name: '',
    description: '',
    executorId: null,
    executor: null,
    plannedStartDate: ld,
    plannedStartTime: lt,
    plannedFinishDate: ld,
    plannedFinishTime: lt,
    actualStartDate: '',
    actualStartTime: '',
    actualFinishDate: '',
    actualFinishTime: '',
    location: '',
    isNew: false,
    canDelete: false,
    nowDate: ld,
    nowTime: lt,
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
          deptId: res.data.deptId,
          deptName: res.data.deptName,
          executorId: res.data.executorId,
          executor: res.data.executor,
          isNew: res.isNew
        })
      } else {
        this.setData!({
          deptId: res.data.deptId,
          deptName: res.data.deptName,
          id: res.data.id,
          name: res.data.name,
          description: res.data.description,
          executorId: res.data.executorId,
          executor: res.data.executor,
          plannedStartDate: res.data.plannedStartDate,
          plannedStartTime: res.data.plannedStartTime,
          plannedFinishDate: res.data.plannedFinishDate,
          plannedFinishTime: res.data.plannedFinishTime,
          actualStartDate: res.data.actualStartDate,
          actualStartTime: res.data.actualStartTime,
          actualFinishDate: res.data.actualFinishDate,
          actualFinishTime: res.data.actualFinishTime,
          location: res.data.location == undefined ? '' : res.data.location,
          isNew: res.isNew,
          canDelete: res.data.status == 'V' ? false : true
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
        // console.log(res)
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
  bindActualStartDateChange(e) {
    this.setData!({
      actualStartDate: e.detail.value
    })
  },
  bindActualStartTimeChange(e) {
    this.setData!({
      actualStartTime: e.detail.value
    })
  },
  bindActualFinishDateChange(e) {
    this.setData!({
      actualFinishDate: e.detail.value
    })
  },
  bindActualFinishTimeChange(e) {
    this.setData!({
      actualFinishTime: e.detail.value
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
            if (_this.data.isNew) {
              let currentObject = {
                name: _this.data.name,
                description: _this.data.description,
                executorId: _this.data.executorId,
                executor: _this.data.executor,
                plannedStartDate: util.local2UTC(_this.data.plannedStartDate),
                plannedStartTime: util.local2UTC(_this.data.plannedStartTime, 'HH:mm'),
                plannedFinishDate: util.local2UTC(_this.data.plannedFinishDate),
                plannedFinishTime: util.local2UTC(_this.data.plannedFinishTime, 'HH:mm'),
                actualStartDate: null,
                actualStartTime: null,
                actualFinishDate: null,
                actualFinishTime: null,
                status: 'N'
              }
              //存储
              let url = app.globalData.restAdd + '/Hanbell-JRS/api/eap/task?' + app.globalData.restAuth;
              wx.request({
                url: url,
                data: currentObject,
                header: {
                  'content-type': 'application/json'
                },
                method: 'POST',
                success: res => {
                  // console.log(res)
                  wx.hideLoading()
                  wx.showModal({
                    title: '系统消息',
                    content: res.data.msg,
                    showCancel: false,
                    success(res) {
                      eventChannel = _this.getOpenerEventChannel()
                      eventChannel.emit('returnDetail', { data: currentObject, isNew: _this.data.isNew })
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
            } else {
              let status = _this.data.actualFinishDate && _this.data.actualFinishTime ? 'V' : 'N'
              let currentObject = {
                id: _this.data.id,
                name: _this.data.name,
                description: _this.data.description,
                executorId: _this.data.executorId,
                executor: _this.data.executor,
                plannedStartDate: util.local2UTC(_this.data.plannedStartDate),
                plannedStartTime: util.local2UTC(_this.data.plannedStartTime, 'HH:mm'),
                plannedFinishDate: util.local2UTC(_this.data.plannedFinishDate),
                plannedFinishTime: util.local2UTC(_this.data.plannedFinishTime, 'HH:mm'),
                actualStartDate: _this.data.actualStartDate ? util.local2UTC(_this.data.actualStartDate) : null,
                actualStartTime: _this.data.actualStartTime ? util.local2UTC(_this.data.actualStartTime, 'HH:mm') : null,
                actualFinishDate: _this.data.actualFinishDate ? util.local2UTC(_this.data.actualFinishDate) : null,
                actualFinishTime: _this.data.actualFinishTime ? util.local2UTC(_this.data.actualFinishTime, 'HH:mm') : null,
                location: _this.data.location,
                status: status
              }
              //存储
              let url = app.globalData.restAdd + '/Hanbell-JRS/api/eap/task/' + _this.data.id + '?' + app.globalData.restAuth;
              wx.request({
                url: url,
                data: currentObject,
                header: {
                  'content-type': 'application/json'
                },
                method: 'PUT',
                success: res => {
                  //console.log(res)
                  wx.hideLoading()
                  wx.showModal({
                    title: '系统消息',
                    content: res.data.msg,
                    showCancel: false,
                    success(res) {
                      eventChannel = _this.getOpenerEventChannel()
                      eventChannel.emit('returnDetail', { data: currentObject, isNew: _this.data.isNew })
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
  bindRemoveDetailTap(e) {
    if (this.data.canDelete) {
      let _this = this
      wx.showModal({
        title: '系统提示',
        content: '确定删除吗',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: 'Deleting'
            })
            //删除
            let url = app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/jobtask/' + _this.data.id + '?openid=' + app.globalData.openId + '&sessionkey=' + app.globalData.sessionKey;
            wx.request({
              url: url,
              header: {
                'content-type': 'application/json'
              },
              method: 'DELETE',
              success: res => {
                //console.log(res)
                wx.hideLoading()
                eventChannel = _this.getOpenerEventChannel()
                eventChannel.emit('returnDetail', { data: {}, isNew: _this.data.isNew })
                wx.navigateBack({
                  delta: 1
                })
              },
              fail: fail => {
                console.log(fail)
              }
            })
          }
        }
      })
    }
  }
})
