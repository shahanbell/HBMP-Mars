//overdetail.ts
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let eventChannel
let d = new Date()
Page({
  data: {
    prodecttypeid: "",
    employeeId: "",
    employeeName: "",
    deptId: "",
    deptName: "",
    formId:"",
    formName:"",
    machineTypeId: "",
    machineTypeName:"",
    productNumberId: "",
    productQuality: "",
    product_name: "",
    productStandard: "",
    warrantyStart: "",
    warrantyEnd: "",
    hour: 0.5 as number,
    isNew: false
  },
  onLoad(option) {
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
          isNew: res.isNew,
          prodecttypeid: option.prodecttypeid
        })
      } else {
        this.setData!({
          employeeId: res.data.employeeId,
          employeeName: res.data.employeeName,
          deptId: res.data.deptId,
          deptName: res.data.deptName,
          seq: -1,
          formId: res.data.formId,
          formName: res.data.formName,
          machineTypeId: res.data.machineTypeId,
          machineTypeName: res.data.machineTypeName,
          problemTypeId: res.data.problemTypeId,
          problemTypeName: res.data.problemTypeName,
          emergencyDrgreeId: res.data.emergencyDrgreeId,
          emergencyDrgreeName: res.data.emergencyDrgreeName,
          productNumberId: res.data.productNumberId,
          productQuality: res.data.productQuality,
          product_name: res.data.product_name,
          productStandard: res.data.productStandard,
          warrantyStart: res.data.warrantyStart,
          warrantyEnd: res.data.warrantyEnd,
          prodecttypeid: option.prodecttypeid
        })
      }
    })
  },
  // 单别
  bindFormSelect(e) {
    let that = this
    wx.navigateTo({
      url: './select?type=' + 'form',
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
  //机型
  bindMachineTypeSelect(e) {
    let that = this
    wx.navigateTo({
      url: './selectSearch?type=' + 'machineType&&id=' + that.data.prodecttypeid,
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
  },
  //产品序号
  bindProductNumberSelect(e) {
    let that = this
    wx.navigateTo({
      url: './selectSearch?type=' + 'productNumber',
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


  formSubmit(e) {
    let canSubmit = true
    let errmsg = ''
    if (!this.data.formId || this.data.formId == '') {
      canSubmit = false
      errmsg += '请选择单别'
    }
    if (!this.data.machineTypeId || this.data.machineTypeId == '') {
      canSubmit = false
      errmsg += '请选择机型'
    }
    if (!this.data.productNumberId || this.data.productNumberId == '') {
      canSubmit = false
      errmsg += '请选择产品序号'
    }
    if (canSubmit) {
      let newObject = {
        employeeId: this.data.employeeId,
        employeeName: this.data.employeeName,
        deptId: this.data.deptId,
        deptName: this.data.deptName,
        seq: -1,
        formId: this.data.formId,
        formName: this.data.formName,
        machineTypeId: this.data.machineTypeId,
        machineTypeName: this.data.machineTypeName,
        productNumberId: this.data.productNumberId,
        productQuality: this.data.productQuality,
        product_name: this.data.product_name,
        productStandard: this.data.productStandard,
        warrantyStart: this.data.warrantyStart,
        warrantyEnd: this.data.warrantyEnd,
      }
      eventChannel = this.getOpenerEventChannel();
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
