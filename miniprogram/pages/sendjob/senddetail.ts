//overdetail.ts
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let eventChannel
let restUrl: string;
let d = new Date()
Page({
  data: {
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    stationid: null,
    stationname: '',
    repairmanid: null,
    repairmanname: '',
    repairmanname2: '',
   // lunch: false,
   // dinner: false,
    date1: d.toISOString().substring(0, 10),
    date2: d.toISOString().substring(0, 10),
    date3: d.toISOString().substring(0, 10),
    date4: d.toISOString().substring(0, 10),
   // time1: "08:00",
  //  time2: "17:10",
    assignmentcode: '1.转维修站',
    hour: 0.5 as number,
    content: '',
    keyuser:'',
    isNew: false,
    repairer:''
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

          date1: res.data.date1,
          date2: res.data.date2,
          date3: res.data.date3,
          date4: res.data.date4,

          stationname: res.data.stationname,
          repairmanname: res.data.repairmanname,
          repairmanname2: res.data.repairmanname2,
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
  bindStation(e) {
    let _this = this
    wx.navigateTo({
      url: './stationKind',
      events: {
        returnStation: function (res) {
          if (res) {
            console.log(res)
            _this.setData!({
              stationid: res.k,
              stationname: res.k + '-' + res.v
            })
          }
        }
      },
    })
  },
  bindRepairman(e) {
    let _this = this
    wx.navigateTo({
      url: '../userSelect/userSelect?userInfo='+this.data.keyuser,
      events: {
        returnUserSelect: function (res) {
          if (res) {
            console.log(res)
            _this.setData!({
              repairmanid: res.k,
              repairmanname: res.k + '-' + res.v
            })
            if (_this.data.repairmanname2 == ""){
              _this.setData!({
                repairmanname2: res.k + '-' + res.v
              })
            } else if (_this.data.repairmanname2.indexOf(res.k)<0){
              _this.setData!({
                repairmanname2: _this.data.repairmanname2 +";"+res.k + '-' + res.v
              })
            }

          }
        }
      },
    })
  },

  bindDate1Change(e) {
    this.setData!({
      date1: e.detail.value
    })
  },
  bindDate2Change(e) {
    this.setData!({
      date2: e.detail.value
    })
  },
  bindDate3Change(e) {
    this.setData!({
      date3: e.detail.value
    })
  },
  bindDate4Change(e) {
    this.setData!({
      date4: e.detail.value
    })
  },
  bindRepairmannameChange(e) {
    this.setData!({
      repairmanname: e.detail.value
    })
  },
  bindRepairmanname2Change(e) {
    this.setData!({
      repairmanname2: e.detail.value
    })
  },

  sltwordInput(e) {
    this.setData!({
      keyuser: e.detail.value
    })
  },
  formSubmit(e) {
    console.log("TIJIAO")
    console.log(this.data.repairmanname)
    let canSubmit = true
    let errmsg = ''
    if (!this.data.stationname ||this.data.stationname == '') {
      canSubmit = false
      errmsg += '请输入站别编号'
    }
    if (!this.data.repairmanname || this.data.repairmanname == '') {
      canSubmit = false
      errmsg += '请输入主要维修人员'
    }
    if (canSubmit) {
      let newObject = {
        employeeId: this.data.employeeId,
        employeeName: this.data.employeeName,
        deptId: this.data.deptId,
        deptName: this.data.deptName,
        seq: -1,
        assignmentcode: this.data.assignmentcode,
        date1: this.data.date1,
        date2: this.data.date2,
        date3: this.data.date3,
        date4: this.data.date4,
        stationname: this.data.stationname,
        repairmanname: this.data.repairmanname,
        repairmanname2: this.data.repairmanname2
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
