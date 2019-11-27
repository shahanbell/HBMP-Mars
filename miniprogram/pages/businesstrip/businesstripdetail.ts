import { IMyApp } from '../../app'

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
    checkArray: [
      {
        name: "employeeName",
        notempty: { key: true, msg: "出差人员不能为空\n" }
      },
      {
        name: "bizObject",
        notempty: { key: true, msg: "客户名称不能为空\n" }
      },
      {
        name: "bizAddress",
        notempty: { key: true, msg: "出差地址不能为空 \n" }
      },
      {
        name: "bizContent",
        notempty: { key: true, msg: "具体安排不能为空\n" }
      }
    ]
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
  bindBizDateChange(e) {
    this.setData!({
      bizDate: e.detail.value
    })
  },

  bindTime1Change(e) {
    this.setData!({
      bizTime1: e.detail.value
    })
  },
  bindTime2Change(e) {
    this.setData!({
      bizTime2: e.detail.value
    })
  },
  formSubmit(e) {
    let canSubmit = true
    let errmsg = ''
    let checkobj = e.detail.value;
    console.log(checkobj);
    this.data.checkArray.forEach((value, idx, array) => {
      // val: 当前值
      // idx：当前index
      // array: Array
        if (checkobj[value.name] == "") {
          errmsg += value.notempty.msg
          canSubmit = false;
        }
    });
    if (canSubmit) {
      let newObject = {
        bizEmployee: this.data.bizEmployee,
        bizEmployeeName: this.data.bizEmployeeName,
        bizDate: this.data.bizDate,
        bizTime1: this.data.bizTime1,
        bizTime2: this.data.bizTime2,
        bizObject: e.detail.value.bizObject,
        bizAddress: e.detail.value.bizAddress,
        bizContent: e.detail.value.bizContent
      }
      console.log(newObject)
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
