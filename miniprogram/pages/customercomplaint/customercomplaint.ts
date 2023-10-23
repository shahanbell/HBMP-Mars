//leave.ts
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    detailList: [] as any,
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
    responsibilitiesId:'',
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

  //问题类型
  bindProblemTypeSelect(e) {
    let that = this
    wx.navigateTo({
      url: './selectSearch?type=' + 'problemType&&id=' + this.data.productTypeId,
      events: {
        returnProblemTypeSelect: function (res) {
          if (res) {
            that.setData!({
              problemTypeId: res.key,
              problemTypeName: res.value,
              emergencyDrgreeId: res.value1,
              emergencyDrgreeName: res.value2,
              responsibilitiesId: res.value3,
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

  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: './complaintdetail?prodecttypeid='+_this.data.productTypeId,
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
      url: './complaintdetail?prodecttypeid=' + _this.data.productTypeId,
      events: {
        returnDetail: function (res) {
          let details = _this.data.detailList
          details.forEach((o, i) => {
            if (i == index){
                o.employeeId = res.data.employeeId,
                o.employeeName = res.data.employeeName,
                o.deptId = res.data.deptId,
                o.deptName = res.data.deptName,
                o.formId = res.data.formId,
                o.formName = res.data.formName,
                o.machineTypeId = res.data.machineTypeId,
                o.machineTypeName = res.data.machineTypeName,
                o.productNumberId = res.data.productNumberId,
                o.productQuality = res.data.productQuality,
                o.product_name = res.data.product_name,
                o.productStandard = res.data.productStandard,
                o.warrantyStart = res.data.warrantyStart,
                o.warrantyEnd = res.data.warrantyEnd
            }
            o.seq= i + 1;
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
            seq: -1,
            formId: currentObject.formId,
            formName: currentObject.formName,
            machineTypeId: currentObject.machineTypeId,
            machineTypeName: currentObject.machineTypeName,
            productNumberId: currentObject.productNumberId,
            productQuality: currentObject.productQuality,
            product_name: currentObject.product_name,
            productStandard: currentObject.productStandard,
            warrantyStart: currentObject.warrantyStart,
            warrantyEnd: currentObject.warrantyEnd,
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
    if (!this.data.areaId || this.data.areaId == '') {
      canSubmit = false
      errmsg += "请选择区域别\r\n"
    }
    if (!this.data.productId || this.data.productId == '') {
      canSubmit = false
      errmsg += "请选择产品别\r\n"
    }
    if (!this.data.incidentProvinceId || this.data.incidentProvinceId == '') {
      canSubmit = false
      errmsg += "请选择事发省\r\n"
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
                productTypeId: _this.data.productTypeId,
                complaintTypeId: _this.data.complaintTypeId,
                complaintTypeName: _this.data.complaintTypeName,
                customerCodeId: _this.data.customerCodeId,
                caller: _this.data.caller,
                callerUnit: _this.data.callerUnit,
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
                incidentCityId: _this.data.incidentCityId,
                currency: _this.data.currency,
                companyName: _this.data.companyName,
                invoiceAdress1: _this.data.invoiceAdress1,
                invoiceAdress2: _this.data.invoiceAdress2,
                invoiceMail: _this.data.invoiceMail,
                unifyNum: _this.data.unifyNum,
                sessionkey: app.globalData.sessionKey,
                openId: app.globalData.openId,
                emergencyDrgreeId: _this.data.emergencyDrgreeId,
                problemTypeId: _this.data.problemTypeId,
                problemTypeName: _this.data.problemTypeName,
                sercadetails: _this.data.detailList,
                responsibilitiesId: _this.data.responsibilitiesId
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
