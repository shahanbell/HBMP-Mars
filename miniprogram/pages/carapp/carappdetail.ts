
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
    ycrq: d.toISOString().substring(0, 10),
    kr:'',
    contact: '',
    cfsf: "",
    cfcs: "",
    address1: "",
    mdsf: "",
    mdcs: "",
    address2: "",
    sy:''
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
          ycrq: res.data.ycrq,
          kr: res.data.kr,
          contact: res.data.contact,
          cfsf: res.data.cfsf,
          cfcs: res.data.cfcs,
          address1: res.data.address1,
          mdsf: res.data.mdsf,
          mdcs: res.data.mdcs,
          address2: res.data.address2,
          sy: res.data.sy
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
  bindYcrqChange(e) {
    this.setData!({
      ycrq: e.detail.value
    })
  },
  
  bindOvertimeChange(e) {
    this.setData!({
      hour: e.detail.value
    })
  },
  bindSyChange(e) {
    this.setData!({
      sy: e.detail.value
    })
  },
  formSubmit(e) {
    let canSubmit = true
    let errmsg = ''
    if (e.detail.value.cityDes == '') {
      canSubmit = false
      errmsg += '请输入目的城市 \r'
    }
    if (e.detail.value.reason == '') {
      canSubmit = false
      errmsg += '请输入派车事由 \r'
    }
    if (canSubmit) {
      let newObject = {
        employeeId: this.data.employeeId,
        employeeName: this.data.employeeName,
        deptId: this.data.deptId,
        deptName: this.data.deptName,
        ycrq: this.data.ycrq,
        kr: e.detail.value.kr,
        contact: e.detail.value.contact,
        cfsf: e.detail.value.cfsf,
        cfcs: e.detail.value.cfcs,
        address1: e.detail.value.address1,
        mdsf: e.detail.value.mdsf,
        mdcs: e.detail.value.mdcs,
        address2: e.detail.value.address2,
        sy: this.data.sy
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
