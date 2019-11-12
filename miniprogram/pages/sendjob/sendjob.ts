import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    selectedType: '1',
    repairKind: '1',
    repairKindname: '请选择',
    detailList: [] as any,
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    customer: '',
    cusna: '',
    ta009: '',
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
  bindRepta(e) {
    // let that = this
    // wx.navigateTo({
    //   url: './customerno',
    //   events: {
    //     returnCustomerno: function (res) {
    //       if (res) {
    //         that.setData!({
    //           customerno: res.k,
    //           customername: res.k + '-' + res.v
    //         })
    //       }
    //     }
    //   },
    //   success(res) {
    //     console.log(res)
    //   }
    // })
    if (this.data.repairno==''){
      wx.showToast({
        title: '请输入叫修单号',
        icon: 'none',
        duration: 2000
      })
      return
   }
    wx.request({
 
	    url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/repta/f;rEPTAPK.ta001=' + this.data.repairKind +';rEPTAPK.ta002='+this.data.repairno+'/s/0/10/'
      //url: 'http://172.16.80.99:8480/Hanbell-JRS/api/crm/repta/f;rEPTAPK.ta001=' + this.data.repairKind +';rEPTAPK.ta002='+this.data.repairno+'/s/0/10/'
        data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        if (res.data.length==0){
          wx.showToast({
            title: '查无资料',
            icon: 'none',
            duration: 2000
          })
          return
     }
     console.log(res.data);
        this.setData!({
          customer: res.data[0].customer,
          cusna: res.data[0].crmgg.gg003,
          ta009: res.data[0].ta009,
          receiver: res.data[0].receiver.mv002,
          ta005: res.data[0].ta005,
          ta006: res.data[0].ta006,
          ta007: res.data[0].ta007,
          ta013: res.data[0].ta013,
          ta500: res.data[0].ta500,
          ta197: res.data[0].ta197,
          productna: res.data[0].productna.el002,
          ta198: res.data[0].ta198,
          areana: res.data[0].areana.bg002,
          ta071: res.data[0].ta071,
          ta010: res.data[0].ta010,
          ta003: res.data[0].ta003
        })
      },
      fail: fail => {
        console.log(fail)
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
        console.log(res)
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
    this.setData!({
      repairno: e.detail.value
    })
  },
  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: './senddetail',
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
      url: './senddetail',
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
            console.log(_this.data)
            wx.request({
              url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/reppw/wechat?' + app.globalData.restAuth,
              //url:'http://172.16.80.99:8480/Hanbell-JRS/api/crm/reppw/wechat?' +app.globalData.restAuth,

              data: {
                repairKindname: _this.data.repairKindname,
                repairno: _this.data.repairno,
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
                     // url: "/pages/index/index"
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
