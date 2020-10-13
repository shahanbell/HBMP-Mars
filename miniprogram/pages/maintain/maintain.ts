//leave.ts
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let d = new Date()
Page({
  data: {
    detailList: [],//明细单身数据
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    maintainTypeId: '',
    maintainTypeName: '',
    repairKindId: '',//叫修单别
    repairKindName: '',
    customer: '',  //客户
    cusna: '',
    ta009: '', //接单人员
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
    repairno: '',//叫修单号
    productUnit: '',
    remark: '',
    maintainer: '',
    maintainerId: '',
    warehouseId: '',
    warehouseName: '',
    incentoryformId: '',
    incentoryformName: '',
    tradingreasonId: '',
    tradingreasonName: '',
    deliveryremark: '',
    deliverydeptId: '',
    deliverydeptName: '',
    sendJobNum: '',
    hasWartb: false, //是否开启录入库存交易单
    canSubmit: true

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
  bindMaintainTypeSelect(e) {
    let that = this
    if (this.data.maintainer == null || this.data.maintainer==""){
      wx.showModal({
        title: '系统提示',
        content: "请先选择维修人员",
        showCancel: false
      })
    }else{
    wx.navigateTo({
      url: '../customercomplaint/select?type=' + 'maintainType&id=' + this.data.maintainer,
      events: {
        returnMaintainTypeSelect: function (res) {
          if (res) {
            that.setData!({
              maintainTypeId: res.key,
              maintainTypeName: res.key + '-' + res.value
            })
          }
        }
      },
      success(res) {
      }
    })
    }
  },
  bindRepairKind(e) {
    let that = this
    wx.navigateTo({
      url: '../sendjob/repairKind',
      events: {
        returnRepairKind: function (res) {
          if (res) {
            that.setData!({
              repairKindId: res.k,
              repairKindName: res.k + '-' + res.v
            })
          }
        }
      }
    })
  },

  bindRepairnoChange(e) {
    let that = this
    if (that.data.repairKindId != '' && that.data.repairKindId != null) {
      wx.navigateTo({
        url: '../customercomplaint/selectSearch?type=' + 'repairno&&id=' + this.data.repairKindId,
        events: {
          returnRepairnoSelect: function (res) {
            if (res) {
              that.setData!({
                // 叫修单号，单据日期，客户编号, 接单人员, 产品品号，产品品名，产品规格，产品序号, 机型, 产品别，区域别, 问题代号，问题描述
                // TA002,    TA003,   TA004,   TA009,    TA005,   TA006,   TA007,    TA013, TA500, TA197,  TA198,   TA071,   TA010
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
                repairno: res.key,
                remark: res.ta017
              })
            }
          }
        },
        success(res) {
        }
      })
    } else {
      wx.showModal({
        title: '系统提示',
        content: "请先选择叫修单别",
        showCancel: false
      })
    }
  },

  bindHasWartb: function (e) {
    console.info("fuckyou")
    if (e.detail) {
      this.setData!({
        hasWartb: true
      });
    }
    else {
      this.setData!({
        hasWartb: false
      });
    }
  },

  bindAddDetailTap(e) {
    let _this = this
    wx.navigateTo({
      url: '../maintain/maintainDetail?warehouse=' + _this.data.warehouseName + "&warehouseId=" + _this.data.warehouseId,
      events: {
        returnDetail: function (res) {
          let details = _this.data.detailList
          details.push(res.data)
          details.forEach((o, i) => {
            o.seq = i + 1
          })
          _this.setData({
            detailList: details,
      
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

  bindEditDetailTap(e) {
    let _this = this
    let index = e.currentTarget.dataset.index
    wx.navigateTo({
      url: './maintainDetail',
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
            productQuality: currentObject.productQuality,
            product_name: currentObject.product_name,
            productStandard: currentObject.productStandard,
            warrantyStart: currentObject.warrantyStart,
            warrantyEnd: currentObject.warrantyEnd,
            planMaintainCount: currentObject.planMaintainCount,
            maintainCategoryId: currentObject.maintainCategoryId,
            maintainCategoryName: currentObject.maintainCategoryName,
            warehouseId: currentObject.warehouseId,
            warehouseName: currentObject.warehouseName,
            productUnit: currentObject.productUnit
          }, isNew: false
        })
      }
    })
  },

  bindMaintainNumberSelect(e) {
    let that = this
    if (that.data.repairKindId == '' && that.data.repairKindId == null) {
      wx.showModal({
        title: '系统提示',
        content: "请先选择叫修单号",
        showCancel: false
      })
    } else {
      wx.navigateTo({
        url: '../customercomplaint/select?type=maintainNumber&&id=' + this.data.repairKindId + "|" + this.data.repairno,//叫修单号
        events: {
          returnMaintainNumberSelect: function (res) {
            if (res) {
              that.setData!({
                maintainer: res.key,
                maintaineId: res.key + '-' + res.value,
                warehouseId: res.value1,
                warehouseName: res.value1 + "-" + res.value2,
                sendJobNum: res.value3
              })
            }
          }
        }
      })
    }
  },


  bindIncentoryformSelect(e) {
    let that = this
      wx.navigateTo({
        url: '../customercomplaint/select?type=incentoryform',
        events: {
          returnIncentoryformSelect: function (res) {
            if (res) {
              that.setData!({
                incentoryformId:res.key,
                incentoryformName:res.key+"-"+res.value
              })
            }
          }
        }
      })
  },

  bindTradingReasonSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/select?type=tradingreason&id='+that.data.incentoryformId,
      events: {
        returnTradingreasonSelect: function (res) {
          if (res) {
            that.setData!({
              tradingreasonId: res.key,
              tradingreasonName: res.key+"-"+res.value
            })
          }
        }
      }
    })
  },


  bindDeliverydeptSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/selectSearch?type=deliverydept',
      events: {
        returnDeliverydeptSelect: function (res) {
          if (res) {
            that.setData!({
              deliverydeptId: res.key,
              deliverydeptName: res.key + "-" + res.value
            })
          }
        }
      }
    })
  },
  
  bindDeliveryremarkChange(e) {
    let that = this
    that.setData!({
      deliveryremark: e.detail.value
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
    if (!this.data.maintainTypeId || this.data.maintainTypeId == '') {
      canSubmit = false
      errmsg += "请选择维修单别\r\n"
    }
    if (!this.data.repairKindId || this.data.repairKindId == '') {
      canSubmit = false
      errmsg += "请选择叫修单别\r\n"
    }
    if (!this.data.repairno || this.data.repairno == '') {
      canSubmit = false
      errmsg += "请选择叫修单号\r\n"
    }
    if (!this.data.maintainer || this.data.maintainer == '') {
      canSubmit = false
      errmsg += "请选择维修人员\r\n"
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
              url: app.globalData.restAdd + '/Hanbell-JRS/api/crm/reptc/createMaintain?' + app.globalData.restAuth,
              data: {
                maintainTypeId: _this.data.maintainTypeId,
                repairKindId: _this.data.repairKindId,
                repairno: _this.data.repairno,
                customer: _this.data.customer,
                employeeId: _this.data.employeeId,
                deptId: _this.data.deptId,
                reptds: _this.data.detailList,
                remark: _this.data.remark,
                maintainer: _this.data.maintainer,
                sessionkey: app.globalData.sessionKey,
                openId: app.globalData.openId,
                incentoryform: _this.data.incentoryformId,
                tradingreason: _this.data.tradingreasonId,
                deliveryremark: _this.data.deliveryremark,
                deliverydeptId: _this.data.deliverydeptId,
                sendJobNum: _this.data.sendJobNum,
                hasWartb: _this.data.hasWartb
              }
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
