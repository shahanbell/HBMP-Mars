import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    selectedType: '1',
    repairKind: '',
    repairKindname: '请选择',
    detailList: [] as any,
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    customer: '',//客户编号和客户内容
    cusna: '',
    ta009: '',//接单人员
    receiver: '',
    ta005: '',
    ta006: '',
    ta007: '',
    ta013: '',
    ta500: '',
    ta197: '',
    productna: '',
    ta198: '',
    areana: '',
    ta071: '',
    ta010: '',
    ta003: '',
    repairno: '',
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
  bindRepairKind(e) {
    let that = this
    wx.navigateTo({
      url: './repairKind',
      events: {
        returnRepairKind: function (res) {
          if (res) {
            that.setData!({
              repairKind: res.k,
              repairKindname: res.k + '-' + res.v
            })
          }
        }
      }
    })
  },
  bindReceivingpersonnel(e) {
    let that = this
    wx.navigateTo({
      url: '../receivingpersonnel/receivingpersonnel',
      events: {
        returnreceivingpersonnel: function (res) {
          if (res) {
            that.setData!({
              workType: res.k,
              workTypeDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
       
      }
    })
  },
  bindDate1Change(e) {
    this.setData!({
      date1: e.detail.value,
      date2: e.detail.value
    })
  },
  bindRepairnoChange(e) {
    let that = this
    if (that.data.repairKind != '' && that.data.repairKind !=null){
  wx.navigateTo({
    url: '../customercomplaint/selectSearch?type=' + 'repairno&&id=' + this.data.repairKind,
    events: {
      returnRepairnoSelect: function (res) {
        if (res) {
          that.setData!({
            // 叫修单号，单据日期，客户编号, 接单人员, 产品品号，产品品名，产品规格，产品序号, 机型, 产品别，区域别, 问题代号，问题描述
            // TA002, TA003, TA004, TA009, TA005, TA006, TA007, TA013, TA500, TA197, TA198, TA071, TA010
            customer: res.ta004,  //客户
            cusna: res.cusna,
            ta009: res.ta009, //接单人员
            receiver: res.receiver,
            ta005: res.ta005,
            ta006: res.ta006,
            ta007: res.ta007,
            ta013: res.ta013,
            ta500: res.ta500,
            ta197: res.ta197,
            productna: res.productna,
            ta198: res.ta198,
            areana: res.areana,
            ta071: res.ta071,
            ta010: res.ta010,
            ta003: res.value,
            repairno: res.key
          })
        }
      }
    },
    success(res) {
      console.log(res)
    }
  })
    }else{
      wx.showModal({
        title: '系统提示',
        content: "请先选择叫修单别",
        showCancel: false
      })

}
  },
  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: './senddetail',
      events: {
        returnSendjobDetail: function (res) {
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
      url: './senddetail',
      events: {
        returnSendjobDetail: function (res) {
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
            stationname: currentObject.stationname,
            repairmanname: currentObject.repairmanname,
            date1: currentObject.date1,
            date2: currentObject.date2,
            date3: currentObject.date3,
            date4: currentObject.date4,
            repairmanname2: currentObject.repairmanname2
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
    // if (!app.globalData.authorized) {
    //   canSubmit = false
    //   errmsg += '账号未授权\r\n'
    // }
    // if (!this.data.employeeId || this.data.employeeId == '') {
    //   canSubmit = false
    //   errmsg += '请填写申请人员\r\n'
    // }
    // if (!this.data.deptId || this.data.deptId == '') {
    //   canSubmit = false
    //   errmsg += "请填写申请部门\r\n"
    // }
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
            console.log(_this.data)
            wx.request({
              url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/reppw/wechat?' + app.globalData.restAuth,
              //url:'http://172.16.80.99:8480/Hanbell-JRS/api/crm/reppw/wechat?' +app.globalData.restAuth,
              data: {
                repairKindname: _this.data.repairKindname,
                repairno: _this.data.repairno,
                sessionkey: app.globalData.sessionKey,
                openId: app.globalData.openId,
                detailList: _this.data.detailList
              },
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: res => {
                console.log(res)
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
})
