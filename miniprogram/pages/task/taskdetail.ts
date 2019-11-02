//overdetail.ts
import { IMyApp } from '../../app'
import { formatTime } from '../../utils/util'

const app = getApp<IMyApp>()
let eventChannel
let d = new Date()
Page({
  data: {
    deptId: null,
    deptName: null,
    id: -1 as number,
    name: '',
    description: '',
    leaderId: null,
    leader: null,
    plannedStartDate: d.toISOString().substring(0, 10),
    plannedStartTime: formatTime(d.toISOString()).substring(0, 5),
    plannedFinishDate: d.toISOString().substring(0, 10),
    plannedFinishTime: formatTime(d.toISOString()).substring(0, 5),
    actualStartDate: '',
    actualStartTime: '',
    actualFinishDate: '',
    actualFinishTime: '',
    location: '',
    isNew: false,
    canDelete: false,
    nowDate: d.toISOString().substring(0, 10),
    nowTime: formatTime(d.toISOString()).substring(0, 5)
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
          leaderId: res.data.leaderId,
          leader: res.data.leader,
          isNew: res.isNew
        })
      } else {
        this.setData!({
          deptId: res.data.deptId,
          deptName: res.data.deptName,
          id: res.data.id,
          name: res.data.name,
          description: res.data.description,
          leaderId: res.data.leaderId,
          leader: res.data.leader,
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
                leaderId: _this.data.leaderId,
                leader: _this.data.leader,
                plannedStartDate: _this.data.plannedStartDate,
                plannedStartTime: _this.data.plannedStartTime,
                plannedFinishDate: _this.data.plannedFinishDate,
                plannedFinishTime: _this.data.plannedFinishTime,
                actualStartDate: '',
                actualStartTime: '',
                actualFinishDate: '',
                actualFinishTime: '',
                status: 'N'
              }
              //存储
              let url = app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/jobtask?openid=' + app.globalData.openId + '&sessionkey=' + app.globalData.sessionKey;
              wx.request({
                url: url,
                data: currentObject,
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
              let status = _this.data.actualFinishDate != '' ? 'V' : 'N'
              let currentObject = {
                id: _this.data.id,
                name: _this.data.name,
                description: _this.data.description,
                leaderId: _this.data.leaderId,
                leader: _this.data.leader,
                plannedStartDate: _this.data.plannedStartDate,
                plannedStartTime: _this.data.plannedStartTime,
                plannedFinishDate: _this.data.plannedFinishDate,
                plannedFinishTime: _this.data.plannedFinishTime,
                actualStartDate: _this.data.actualStartDate,
                actualStartTime: _this.data.actualStartTime,
                actualFinishDate: _this.data.actualFinishDate,
                actualFinishTime: _this.data.actualFinishTime,
                location: _this.data.location,
                status: status
              }
              //存储
              let url = app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/jobtask/' + _this.data.id + '?openid=' + app.globalData.openId + '&sessionkey=' + app.globalData.sessionKey;
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
