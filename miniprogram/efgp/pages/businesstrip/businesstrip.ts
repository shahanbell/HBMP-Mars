import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    detailList: [] as any,
    company: null,
    hasOpenId: false,
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    applyDate: d.toISOString().substring(0, 10),
    businessProperty: '1',
    businessPropertyDesc: '业务推展',
    otherType: '',
    vehicle: '3',
    vehicleDesc: "高铁",
    otherVehicle: '',
    destination: '1',
    destinationDesc: '中国大陆',
    dayBegin: d.toISOString().substring(0, 10),
    dayEnd: '',
    daysTotal: 0.00 as number,
    reason: '',
    total: 0.00 as number,
    showDate: false,
    showRowDate: new Date().getTime(),
    conpomentid: '',
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
        deptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName,
        company: app.globalData.defaultCompany + '-' + app.globalData.defaultCompanyName
      })
    }
  },
  bindCompanySelect(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/companySelect/companySelect?company=' + app.globalData.defaultCompany,
      events: {
        returnCompanySelect: function (res) {
          if (res) {
            that.setData!({
              company: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindDeptSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
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
  bindBusinessProperty(e) {
    let that = this
    wx.navigateTo({
      url: './businessProperty',
      events: {
        returnBusinessPropertySelect: function (res) {
          if (res) {
            that.setData!({
              businessProperty: res.k,
              businessPropertyDesc: res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindVehicle(e) {
    let that = this
    wx.navigateTo({
      url: './vehicle',
      events: {
        returnVehicleSelect: function (res) {
          if (res) {
            console.log(res)
            that.setData!({
              vehicle: res.k,
              vehicleDesc: res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindDestination(e) {
    let that = this
    wx.navigateTo({
      url: './destination',
      events: {
        returnDestinationSelect: function (res) {
          if (res) {
            console.log(res)
            that.setData!({
              destination: res.k,
              destinationDesc: res.v
            })
          }
        }
      },
      success(res) {
        // console.log(res)
      }
    })
  },
  bindApplyDateChange(e) {
    this.setData!({
      applyDate: e.detail.value,
    })
  },
  bindOtherTypeChange(e) {
    this.setData!({
      otherType: e.detail
    })
  },
  bindOtherVehicleChange(e) {
    this.setData!({
      otherVehicle: e.detail
    })
  },
  bindDayBeginChange(e) {
    this.setData!({
      dayBegin: e.detail.value
    })

    let total = this.caculaterDays(this.data.dayBegin, this.data.dayEnd);
    this.setData({
      daysTotal: total
    });
  },
  bindDayEndChange(e) {
    this.setData!({
      dayEnd: e.detail.value
    })
    let total = this.caculaterDays(this.data.dayBegin, this.data.dayEnd);
    this.setData({
      daysTotal: total
    });
  },

  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: './businesstripdetail',
      events: {
        returnDetail: function (res) {
          //console.log(_this.data.detailList);
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
            bizEmployee: _this.data.employeeId,
            bizEmployeeName: _this.data.employeeName
          }, isNew: true
        })
      }
    })
  },
  bindEditDetailTap(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: './businesstripdetail',
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
            bizEmployee: currentObject.bizEmployee,
            bizEmployeeName: currentObject.bizEmployeeName,
            bizDate: currentObject.bizDate,
            bizTime1: currentObject.bizTime1,
            bizTime2: currentObject.bizTime2,
            bizObject: currentObject.bizObject,
            bizAddress: currentObject.bizAddress,
            bizContent: currentObject.bizContent
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

  bindReasonChange(e) {
    this.setData!({
      reason: e.detail
    })
  },


  bindPickerDate(e) {
    this.openPickerDate();
    this.setData!({
      conpomentid: e.currentTarget.id
    })
  },
  bindCloseDate(e) {
    this.closePickerDate();
  },

  bindDateCancel(e) {
    this.closePickerDate();
  },
  bindDateConfirm(e) {
    this.closePickerDate();
  },
  bindDateInput(e) {
    if (this.data.conpomentid == 'dayBegin') {
      this.setData!({
        dayBegin: this.dateFormatForYYMMDD(e.detail)
      })
    }
    if (this.data.conpomentid == 'dayEnd') {
      this.setData!({
        dayEnd: this.dateFormatForYYMMDD(e.detail)
      })
    }
    if (this.data.conpomentid == 'applyDate') {
      this.setData!({
        applyDate: this.dateFormatForYYMMDD(e.detail)
      })

      let total = this.caculaterDays(this.data.dayBegin, this.data.dayEnd);
      this.setData!({
        daysTotal: total
      });
      }
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
    openPickerDate() {
      this.setData!({
        showDate: true
      })
    },
    closePickerDate() {
      this.setData!({
        showDate: false
      })
    },



    formSubmit(e) {
      console.log(e);
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

      let t = this.data.dayEnd
      if (t == '') {
        canSubmit = false
        errmsg += "请填写截止日期\r\n"
      }
      if (this.data.daysTotal == '' || this.data.daysTotal == '0') {
        canSubmit = false
        errmsg += "请填写出差天数\r\n"
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
                url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hzgl004/wechat?' + app.globalData.restAuth,
                data: {
                  company: _this.data.company,
                  applyUser: _this.data.employeeId,
                  applyDate: _this.data.applyDate,
                  applyDept: _this.data.deptId,
                  formType: _this.data.businessProperty,
                  formTypeDesc: _this.data.businessPropertyDesc,
                  otherType: _this.data.otherType,
                  vehicle: _this.data.vehicle,
                  vehicleDesc: _this.data.vehicleDesc,
                  otherVehicle: _this.data.otherVehicle,
                  destination: _this.data.destination,
                  destinationDesc: _this.data.destinationDesc,
                  startDate: _this.data.dayBegin,
                  endDate: _this.data.dayEnd,
                  days: _this.data.daysTotal,
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
  ,
    caculaterDays(date1, date2) {
      if (date1 == "" || date2 == "") {
        return;
      }
      let daysTotal
      let today = new Date();//取今天的日期
      //5天日期管控
      let d2 = new Date(date2);//出差日期
      let days = (Date.parse(today) - Date.parse(d2)) / (1000 * 60 * 60 * 24);
      if (days > 5) {
        wx.showModal({
          title: '系统提示',
          content: "出差日期截止超过5天不可以申请",
          showCancel: false
        })
        return false;
      }
      let d1 = new Date(date1);//出差时间（起）
      days = (Date.parse(d2) - Date.parse(d1)) / (1000 * 60 * 60 * 24);
      daysTotal = days + 1;
      return daysTotal;
    }
  })
