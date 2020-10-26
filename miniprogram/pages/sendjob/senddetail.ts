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
    showDate1: false,
    showRowDate1: new Date().getTime(),
    showDate2: false,
    showRowDate2: new Date().getTime(),
    showDate3: false,
    showRowDate3: new Date().getTime(),
    showDate4: false,
    showRowDate4: new Date().getTime(),
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
      url: '../customercomplaint/select?type=' + 'repairman&id=' + this.data.stationid,
      events: {
        returnRepairmanSelect: function (res) {
          if (res) {
            console.log(res)
         
            if (_this.data.repairmanname2 == ""){
              _this.setData!({
                repairmanname2: res.key + '-' + res.value,
                repairmanid: res.key,
                repairmanname: res.key + '-' + res.value
              })
            } else if (_this.data.repairmanname2.indexOf(res.key)<0){
              _this.setData!({
                repairmanname2: _this.data.repairmanname2 + ";" + res.key + '-' + res.value
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
  formatYYMMDDToDate(value) {
    var str = value.replace(/-/g, '/');
    var date = new Date(str)
    return date.getTime();
  },
  //约定完修日日期选择组件事件
  bindPickerDate1(e) {
    this.setData!({
      showRowDate1: this.formatYYMMDDToDate(this.data.date1)
      // date1:this.data.date1
    })
    this.openPickerDate1();
  },
  bindCloseDate1(e) {
    this.closePickerDate1();
  },

  bindDate1Cancel(e) {
    this.closePickerDate1();
  },
  bindDate1Confirm(e) {
    if (e.detail != 1262275200000) {
      this.setData!({
        date1: this.dateFormatForYYMMDD(e.detail)
      })
    }
    this.closePickerDate1();
  },
  openPickerDate1() {
    this.setData!({
      showDate1: true
    })
  },
  closePickerDate1() {
    this.setData!({
      showDate1: false
    })
  },
  //预交日期日期选择组件事件
  bindPickerDate2(e) {
    this.setData!({
      showRowDate2: this.formatYYMMDDToDate(this.data.date2)
    })
    this.openPickerDate2();
  },
  bindCloseDate2(e) {
    this.closePickerDate2();
  },

  bindDate2Cancel(e) {
    this.closePickerDate2();
  },
  bindDate2Confirm(e) {
    if (e.detail != 1262275200000) {
      this.setData!({
        date2: this.dateFormatForYYMMDD(e.detail)
      })
    }
    this.closePickerDate2();
  },
  openPickerDate2() {
    this.setData!({
      showDate2: true
    })
  },
  closePickerDate2() {
    this.setData!({
      showDate2: false
    })
  },
  //预交维修日日期组件
  bindPickerDate3(e) {
    this.setData!({
      showRowDate3: this.formatYYMMDDToDate(this.data.date3)
    })
    this.openPickerDate3();
  },
  bindCloseDate3(e) {
    this.closePickerDate3();
  },

  bindDate3Cancel(e) {
    this.closePickerDate3();
  },
  bindDate3Confirm(e) {
    if (e.detail != 1262275200000) {
      this.setData!({
        date3: this.dateFormatForYYMMDD(e.detail)
      })
    }
    this.closePickerDate3();
  },
  openPickerDate3() {
    this.setData!({
      showDate3: true
    })
  },
  closePickerDate3() {
    this.setData!({
      showDate3: false
    })
  },
  //预交完修日日期组件
  bindPickerDate4(e) {
    this.setData!({
      showRowDate4: this.formatYYMMDDToDate(this.data.date4)
    })
    this.openPickerDate4();
  },
  bindCloseDate4(e) {
    this.closePickerDate4();
  },

  bindDate4Cancel(e) {
    this.closePickerDate4();
  },
  bindDate4Confirm(e) {
    if (e.detail != 1262275200000) {
      this.setData!({
        date4: this.dateFormatForYYMMDD(e.detail)
      })
    }
    this.closePickerDate4();
  },
  openPickerDate4() {
    this.setData!({
      showDate4: true
    })
  },
  closePickerDate4() {
    this.setData!({
      showDate4: false
    })
  },
  formSubmit(e) {
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
      eventChannel.emit('returnSendjobDetail', { data: newObject, isNew: this.data.isNew })
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
