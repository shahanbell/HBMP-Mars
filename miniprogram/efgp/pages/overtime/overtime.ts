//overtime.ts
import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    formTypes: [
      { k: '1', v: '平日加班' },
      { k: '2', v: '双休加班' },
      { k: '3', v: '节日加班' }
    ],
    selectedType: '1',
    formType: '1',
    formTypeDesc: '平日加班',
    detailList: [] as any,
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
  },
  bindDeptSelect(e) {
    let _this = this
    wx.navigateTo({
      url: '../../../pages/deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
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
  bindFormTypeChange(e) {
    if (e.detail.value == '1') {
      this.setData!({
        formType: '1',
        formTypeDesc: '平日加班',
        selectedType: e.detail.value
      })
    } else if (e.detail.value == '2') {
      this.setData!({
        formType: '2',
        formTypeDesc: '双休加班',
        selectedType: e.detail.value
      })
    } else {
      this.setData!({
        formType: '3',
        formTypeDesc: '节日加班',
        selectedType: e.detail.value
      })
    }
  },
  onTypeCellClick(event){
    const {name} = event.currentTarget.dataset;
    this.setData({
      selectedType:name,
    });
  },
  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: './overdetail',
      events: {
        returnDetail: function (res) {
          let details = _this.data.detailList
          details.push(res.data)
          details.forEach((o, i) => {
            o.seq = i + 1
          })
          _this.setData({
            detailList: details,
            canSubmit: true
          })
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
  bindRemoveDetailTap(e) {
    let details = this.data.detailList
    let index = e.currentTarget.dataset.index
    details.splice(index, 1)
    details.forEach((o, i) => {
      o.seq = i + 1
    })
    this.setData!({
      detailList: details
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
    if (!this.data.detailList) {
      canSubmit = false
      errmsg += "请填写明细资料\r\n"
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
              url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkgl034/wechat?' + app.globalData.restAuth,
              data: {
                employee: _this.data.employeeId,
                formType: _this.data.formType,
                formTypeDesc: _this.data.formTypeDesc,
                detailList: _this.data.detailList
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
                wx.hideLoading();
                wx.showModal({
                  title: '系统提示',
                  content: "请联系管理员:" + fail,
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
