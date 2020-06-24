//leave.ts
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    dataList: [] as any,
    employeeId: '',
    employeeName: '',
    deptId: '',
    deptName: '',
    complaintTypeId: '',
    complaintTypeName: '',
    customerCodeId: '',
    customerCodeName: '',
    productTypeId: '',
    productTypeName: '',
    machineTypeId: '',
    machineTypeName: '',
    incidentProvinceId: '',
    incidentProvinceName: '',
    formId: '',
    formName: '',
    problemTypeId: '',
    problemTypeName: '',
    emergencyDrgreeId: '',
    emergencyDrgreeName: '',
    incidentCityId: '',
    incidentCityName: '',
    productNumberId: '',
    productQuality: '',
    product_name: '',
    productStandard: '',
    areaId: '',
    areaName: '',
    productId: '',
    productName: '',
    callerUnit: '',
    caller: '',
    callViewName: '',
    reason: '',
    callerPhone: '',
    phoneCountry: '',
    phoneArea: '',
    phoneCountry1: '',
    phoneArea1: '',
    currency: '',
    companyName: '',
    invoiceAdress1: '',
    invoiceAdress2:'',
    invoiceMail:'',
    unifyNum: '',
    dealer: '',
    warrantyStart:'',
    warrantyEnd:'',
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
        deptName: app.globalData.defaultDeptId + '-' + app.globalData.defaultDeptName
      })
    }
  },
  bindComplaintTypeSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/select?type=' + 'complaintType',
      events: {
        returnComplaintTypeSelect: function (res) {
          if (res) {
            that.setData!({
              complaintTypeId: res.key,
              complaintTypeName: res.value
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },

  bindCustomerCodeSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/selectSearch?type=' + 'customerCode',
      events: {
        returnCustomerCodeSelect: function (res) {
          if (res) {
            //公司简称，来电者,公司电话国码，公司电话区码，行动电话国码，行动电话区码，经销商
            that.setData!({
              customerCodeId: res.key,
              customerCodeName: res.value,
              caller: res.value2,
              callerUnit: res.value1,
              callViewName: res.value,
              callerPhone: res.value7,
              phoneCountry: res.value3,
              phoneArea: res.value4,
              phoneCountry1: res.value5,
              phoneArea1: res.value6,
              dealer: res.value13,
              currency: res.value8,
              companyName: res.value9,
              invoiceAdress1: res.value10,
              invoiceAdress2: res.value11,
              invoiceMail: res.value12,
              unifyNum: res.value13,
            })
            if (res.value2 != '' && res.value2!=null) {
              that.setData!({
                callViewName: res.value + ' - ' + res.value2
              })
            }
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },

  bindProductTypeSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/select?type=' + 'productType',
      events: {
        returnProductTypeSelect: function (res) {
          if (res) {
            that.setData!({
              productTypeId: res.key,
              productTypeName: res.value
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },

  bindMachineTypeSelect(e) {
    let that = this
    if (that.data.productTypeId != '' && that.data.productTypeId != null) {
      wx.navigateTo({
        url: '../customercomplaint/selectSearch?type=' + 'machineType&&id=' + that.data.productTypeId,
        events: {
          returnMachineTypeSelect: function (res) {
            if (res) {
              that.setData!({
                machineTypeId: res.key,
                machineTypeName: res.value
              })
            }
          }
        },
        success(res) {
          console.log(res)
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: "请先选择品号类型",
        showCancel: false
      })
    }

  },

  bindAreaSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/select?type=' + 'area',
      events: {
        returnAreaSelect: function (res) {
          if (res) {
            that.setData!({
              areaId: res.key,
              areaName: res.value
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindIncidentProvinceSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/selectSearch?type=' + 'incidentProvince',
      events: {
        returnIncidentProvinceSelect: function (res) {
          if (res) {
            that.setData!({
              incidentProvinceId: res.key,
              incidentProvinceName: res.value
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },

  bindFormSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/select?type=' + 'form',
      events: {
        returnFormSelect: function (res) {
          if (res) {
            that.setData!({
              formId: res.key,
              formName: res.value
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },

  bindProblemTypeSelect(e) {
    let that = this
    if (that.data.productTypeId != '' && that.data.productTypeId != null) {
      wx.navigateTo({
        url: '../customercomplaint/selectSearch?type=' + 'problemType&&id=' + this.data.productTypeId,
        events: {
          returnProblemTypeSelect: function (res) {
            if (res) {
              that.setData!({
                problemTypeId: res.key,
                problemTypeName: res.value,
                emergencyDrgreeId: res.value1,
                emergencyDrgreeName: res.value2
              })
            }
          }
        },
        success(res) {
          console.log(res)
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: "请先选择品号类型",
        showCancel: false
      })
    }
  },

  bindIncidentCitySelect(e) {
    let that = this
    if (that.data.incidentProvinceId != '' && that.data.incidentProvinceId != null) {
      wx.navigateTo({
        url: '../customercomplaint/selectSearch?type=' + 'incidentCity&&id=' + this.data.incidentProvinceId,
        events: {
          returnIncidentCitySelect: function (res) {
            if (res) {
              that.setData!({
                incidentCityId: res.key,
                incidentCityName: res.value
              })
            }
          }
        },
        success(res) {
          console.log(res)
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: "请先选择事发省",
        showCancel: false
      })
    }
  },

  bindProductNumberSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/selectSearch?type=' + 'productNumber',
      events: {
        returnProductNumberSelect: function (res) {
          if (res) {
            that.setData!({
              productNumberId: res.key,
              productQuality: res.value,
              product_name: res.value1,
              productStandard: res.value2,
              warrantyStart: res.value3,
              warrantyEnd: res.value4,
            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },

  bindProductSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/select?type=' + 'product',
      events: {
        returnProductSelect: function (res) {
          if (res) {
            that.setData!({
              productId: res.key,
              productName: res.value,

            })
          }
        }
      },
      success(res) {
        console.log(res)
      }
    })
  },
  bindReasonChange(e) {
    let that = this
    that.setData!({
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
    if (!this.data.complaintTypeId || this.data.complaintTypeId == '') {
      canSubmit = false
      errmsg += "请选择客诉类型\r\n"
    }
    if (!this.data.customerCodeId || this.data.customerCodeId == '') {
      canSubmit = false
      errmsg += "请选择客户代号\r\n"
    }
    if (!this.data.productTypeId || this.data.productTypeId == '') {
      canSubmit = false
      errmsg += "请选择品号类别\r\n"
    }
    if (!this.data.machineTypeId || this.data.machineTypeId == '') {
      canSubmit = false
      errmsg += "请选择机型\r\n"
    }
    if (!this.data.areaId || this.data.areaId == '') {
      canSubmit = false
      errmsg += "请选择区域别\r\n"
    }
    if (!this.data.productId || this.data.productId == '') {
      canSubmit = false
      errmsg += "请选择产品别\r\n"
    }
    if (!this.data.formId || this.data.formId == '') {
      canSubmit = false
      errmsg += "请选择单别\r\n"
    }

    if (!this.data.problemTypeId || this.data.problemTypeId == '') {
      canSubmit = false
      errmsg += "请选择问题分类\r\n"
    }
    if (!this.data.incidentProvinceId || this.data.incidentProvinceId == '') {
      canSubmit = false
      errmsg += "请选择事发省\r\n"
    }
    if (!this.data.productNumberId || this.data.productNumberId == '') {
      canSubmit = false
      errmsg += "请选择产品序号\r\n"
    }
    if (!this.data.reason || this.data.reason == '') {
      canSubmit = false
      errmsg += "请填写问题描述\r\n"
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
              url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/serbq/create?' + app.globalData.restAuth,
              data: {
                employeeId: _this.data.employeeId,
                deptId: _this.data.deptId,
                complaintTypeId: _this.data.complaintTypeId,
                customerCodeId: _this.data.customerCodeId,
                productTypeId: _this.data.productTypeId,
                emergencyDrgree: _this.data.emergencyDrgreeId,
                caller: _this.data.caller,
                callerUnit: _this.data.callerUnit,
                problemTypeId: _this.data.problemTypeId,
                reason: _this.data.reason,
                callerPhone: _this.data.callerPhone,
                phoneCountry: _this.data.phoneCountry,
                phoneArea: _this.data.phoneArea,
                phoneCountry1: _this.data.phoneCountry1,
                phoneArea1: _this.data.phoneArea1,
                dealer: _this.data.dealer,
                productId: _this.data.productId,
                areaId: _this.data.areaId,
                incidentProvinceId: _this.data.incidentProvinceId,
                formId: _this.data.formId,
                productQuality: _this.data.productQuality,
                product_name: _this.data.product_name,
                productStandard: _this.data.productStandard,
                productNumberId: _this.data.productNumberId,
                problemTypeName: _this.data.problemTypeName,
                incidentCityId: _this.data.incidentCityId,
                machineTypeId: _this.data.machineTypeId,
                currency: _this.data.currency,
                companyName: _this.data.companyName,
                invoiceAdress1: _this.data.invoiceAdress1,
                invoiceAdress2: _this.data.invoiceAdress2,
                invoiceMail: _this.data.invoiceMail,
                unifyNum: _this.data.unifyNum,
                warrantyStart: _this.data.warrantyStart,
                warrantyEnd: _this.data.warrantyEnd,
                sessionkey: app.globalData.sessionKey,
                openId: app.globalData.openId
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
  }
})
