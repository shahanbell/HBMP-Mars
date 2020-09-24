import { IMyApp } from '../../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    dataList: [] as any,
    company: null,
    hasOpenId: false,
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    loanDate: d.toISOString().substring(0, 10),
    loanProperty: '0',
    loanPropertyDesc: '0-销售营业',
    coin: 'RMB',
    coinDesc: "RMB-人民币",
    prePayDate: "",
    centerid: '',
    budgetacc: '',
    preAccno: '',
    trafficfee: 0.00 as number,
    accommodation: 0.00 as number,
    allowance: 0.00 as number,
    entertain: 0.00 as number,
    other: 0.00 as number,
    loanTotal: 0.00 as number,
    reason: '',
    cacudata: [{ name: "trafficfee", value: 0 }, { name: "accommodation", value: 0 }, { name: "entertain", value: 0 }, { name: "allowance", value: 0 }, { name: "other", value: 0 }],
    total: 0.00 as number,
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
      //带出预算中心
      wx.request({
        url: app.globalData.restAdd + '/Hanbell-JRS/api/erp/budgetcenter/f;budgetCenterPK.facno=' + app.globalData.defaultCompany + ';budgetCenterPK.deptid=' + app.globalData.defaultDeptId + '/s/0/10/',
        data: {
          appid: app.globalData.restId,
          token: app.globalData.restToken
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: res => {          
          this.setData!({
            centerid: res.data[0].budgetCenterPK.centerid
          })
        },
        fail: fail => {
          console.log(fail)
        }
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
        // console.log(res)
      }
    })
  },
  bindLoanProperty(e) {
    let that = this
    wx.navigateTo({
      url: './loanPropertySelect',
      events: {
        returnLoanPropertySelect: function (res) {
          if (res) {
            that.setData!({
              loanProperty: res.k,
              loanPropertyDesc: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindBudgetacc(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/budgetacc/budgetacc?centerid='+this.data.centerid,
      events: {
        returnBudgetacc: function (res) {
          if (res) {
            that.setData!({
              budgetacc: res.k,
              preAccno: res.k + '-' + res.v
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindCoin(e) {
    let that = this
    wx.navigateTo({
      url: '../../../pages/coin/coin',
      events: {
        returnCoinSelect: function (res) {
          if (res) {
            that.setData!({
              coin: res.k,
              coinDesc: res.k + '-' + res.v
            })
          }
        } 
      },
      success(res) {
        // console.log(res)
      }
    })
  },
  bindLoanDateChange(e) {
    this.setData!({
      loanDate: e.detail.value,
    })
  },

  bindPrePayDateChange(e) {
    this.setData!({
      prePayDate: e.detail.value
    })
  },
  getmoney(e) {
    let reg = /^(([1-9]\d*)|\d)(\.\d+)?$/;
    if (!reg.test(e.detail.value)) { //e.detail.value就是金额
      wx.showToast({
        title: "请输入正确的金额",
        icon: 'none',
        duration: 1000
      })
      return "";
    } else {
      let iname = e.target.dataset.iname;
      var objdata = this.data.cacudata;
      objdata.forEach((value, index, array) => {
        if (value.name == iname) {
          value.value = Number.parseFloat(e.detail.value);
        }
      });


      let total = this.caculater(objdata);
      this.setData({
        loanTotal: total
      });
    }
  },

  bindReasonChange(e) {
    this.setData!({
      reason: e.detail.value
    })
  },
  formSubmit(e) {
    // console.log(e)

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
    if (this.data.budgetaccName == '') {
      canSubmit = false
      errmsg += "请填写预算科目\r\n"
    }
    if (!this.data.reason || this.data.reason == '') {
      canSubmit = false
      errmsg += "请填写借支理由\r\n"
    }
    let t = this.data.prePayDate
    if (t == '') {
      canSubmit = false
      errmsg += "请填写预计付款日\r\n"
    }
    if (canSubmit) {
      let _this = this
      wx.showModal({
        title: '系统提示',
        content: '确定提交吗',
        success(res) {
          console.log(res)
          if (res.confirm) {
            wx.showLoading({
              title: 'Sending'
            })
            wx.request({
              url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/hzcw017/wechat?' + app.globalData.restAuth,
              data: {
                company: _this.data.company,
                loanUser: _this.data.employeeId,
                loanDate: _this.data.loanDate,
                loanDept: _this.data.deptId,
                loanProperty: _this.data.loanProperty,
                loanPropertyDesc: _this.data.loanPropertyDesc,
                centerid: _this.data.centerid,
                preAccno: _this.data.preAccno,
                coin: _this.data.coin,
                prePayDate: _this.data.prePayDate,
                loanTotal: _this.data.loanTotal,
                trafficfee: _this.data.trafficfee,
                accommodation: _this.data.accommodation,
                allowance: _this.data.allowance,
                entertain: _this.data.entertain,
                other: _this.data.other,
                reason: _this.data.reason
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
  caculater(obj) {
    var num = 0;
    if (obj.length > 0) {
      obj.forEach((value, index, array) => {
        num += value.value;
      });;
    }
    return num;
  }
})
