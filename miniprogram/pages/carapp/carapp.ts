import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let d = new Date()
let userInput =''
Page({
  data: {
    detailList: [] as any,
    hasOpenId: false,
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    sqrqDate: d.toISOString().substring(0, 10),
    clxz: '1',
    clxzDesc: '1-公务车',
    privatedriver:'',
    telcontact: '',
    purpose: '',
    purposeDesc: '',
    checkArray: [
      {
        name: "trafficfee",
        value: 0,
        notempty: { key: true, msg: "不能为空" },
        isnumber: { key: true, msg: "数字!" }
      }]
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
  bindDeptSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../deptSelect/deptSelect?employeeid=' + app.globalData.employeeId,
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
  bindClzx(e) {
    let that = this
    wx.navigateTo({
      url: './carType',
      events: {
        returncarTypeSelect: function (res) {
          if (res) {
            that.setData!({
              clxz: res.k,
              clxzDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindUserInput(e){
    userInput = e.detail.value
  },
  bindUserSelect(e){
    let that = this
    wx.navigateTo({
      url: '../userSelect/userSelect?userInfo='+userInput,
      events: {
        returnUserSelect: function (res) {
          if (res) {
            that.setData!({
              privatedriver: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })

  },
  bindPurpose(e) {
    let that = this
    wx.navigateTo({
      url: './purpose',
      events: {
        returnPurposeSelect: function (res) {
          if (res) {
            that.setData!({
              purpose: res.k,
              purposeDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: './carappdetail',
      events: {
        returnDetail: function (res) {
          console.log(res.data);
          console.log(_this.data.detailList);
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
      url: './carappdetail',
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
            ycrq: currentObject.ycrq,
            kr: currentObject.kr,
            contact: currentObject.contact,
            cfsf: currentObject.cfsf,
            cfcs: currentObject.cfcs,
            address1: currentObject.address1,
            mdsf: currentObject.mdsf,
            mdcs: currentObject.mdcs,
            address2: currentObject.address2,
            sy: currentObject.sy
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
      reason: e.detail.value
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
    if (this.data.clxzDesc == '') {
      canSubmit = false
      errmsg += "请选择车辆性质\r\n"
    }
    if (this.data.clxz == "2") {
      if (e.detail.value.privatedriver == "") {
        errmsg += "请填写私车驾驶员\r\n"
        canSubmit = false
      }
      if (e.detail.value.privatecarno == "") {
        errmsg += "请填写私车车牌号\r\n"
        canSubmit = false
      }
    }
    if (this.data.purposeDesc == '') {
      canSubmit = false
      errmsg += "请选择用车原因\r\n"
    }
    let t = this.data.sqrqDate
    if (t == '') {
      canSubmit = false
      errmsg += "请填写申请日期\r\n"
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
            console.log(e)
            wx.request({
              //url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hkcw017/wechat?' + app.globalData.restAuth,
              url: 'http://172.16.80.99:8480' + '/Hanbell-JRS/api/efgp/hkgl037/wechat?' + app.globalData.restAuth,
              data: {
                employeeId: _this.data.employeeId,
                employeeName: _this.data.employeeName,
                deptId: _this.data.deptId,
                deptName: _this.data.deptName,
                sqrqDate: _this.data.sqrqDate,
                clxz: _this.data.clxz,
                clxzDesc: _this.data.clxzDesc,
                privatedriver: e.detail.value.privatedriver,
                privatecarno: e.detail.value.privatecarno,
                purpose: _this.data.purpose,
                purposeDesc: _this.data.purposeDesc,
                telcontact: e.detail.value.telcontact,
                reppwList: _this.data.detailList
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

})
