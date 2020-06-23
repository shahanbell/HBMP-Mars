//overdetail.ts
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()
let eventChannel
let restUrl: string;
let d = new Date()
Page({
  data: {
    productQuality: '',
    product_name: '',
    productStandard: '',
    warrantyStart: '',
    warrantyEnd: '',
    planMaintainCount: '',
    maintainCategoryId: '',
    maintainCategoryName: '',
    warehouseId: '',
    warehouseName: '',
    productUnit: '',
  },
  onLoad(option) {
    var _this=this;
    this.setData!({
      warehouseName: option.warehouse,
      warehouseId: option.warehouseId
      
    })
    const eventChannel = _this.getOpenerEventChannel()
    eventChannel.on('openDetail', (res) => {
      if (res.isNew) {
        
      } else {
        this.setData!({
          productQuality: res.data.productQuality,
          product_name: res.data.product_name,
          productStandard: res.data.productStandard,
          warrantyStart: res.data.warrantyStart,
          warrantyEnd: res.data.warrantyEnd,
          planMaintainCount: res.data.planMaintainCount,
          maintainCategoryId: res.data.maintainCategoryId,
          maintainCategoryName: res.data.maintainCategoryName,
          warehouseId: res.data.warehouseId,
          warehouseName: res.data.warehouseName,
          productUnit: res.data.productUnit
        })
      }
    })
  },
  bindMaintainTypeSelect(e) {
    let _this = this
    wx.navigateTo({
      url: '../customercomplaint/select?type=maintainCategory',
      events: {
        returnMaintainCategorySelect: function (res) {
          if (res) {
            _this.setData!({
              maintainCategoryId: res.key,
              maintainCategoryName: res.key + '-' + res.value
            })
          }
        }
      },
      success(res) {
      }
    })
  }, 
  
  bindProductQualitySelect(e) {
    let that = this
    wx.navigateTo({
      url: './productQualitySelect',
      events: {
        returnProductQualitySelect: function (res) {
          if (res) {
            that.setData!({
              productQuality: res.value,
              product_name: res.value1,
              productStandard: res.value2,
              warrantyStart: res.value3,
              warrantyEnd: res.value4,
              productUnit: res.value5
            })
          }
        }
      },
      success(res) {
      }
    })
  },

  bindPlanMaintainCountChange(e) {
    var match =/^[0-9]*$/ ;
     let _this = this
    if (match.test(e.detail.value)){
      _this.setData!({
        planMaintainCount: e.detail.value
      })
    }else{
      wx.showModal({
        title: '系统提示',
        content: '请输入一个整数',
        showCancel: false
      })
    }
  }, 

  bindWarehouseSelect(e) {
    let that = this
    wx.navigateTo({
      url: '../customercomplaint/selectSearch?type=' + 'warehouse',
      events: {
        returnWarehouseSelect: function (res) {
          if (res) {
            that.setData!({
              warehouseId: res.key,
              warehouseName: res.key+"-"+res.value
            })
          }
        }
      },
    })
  },
  
  formSubmit(e) {
    let canSubmit = true
    let errmsg = ''
  
    if (!this.data.warehouseId || this.data.warehouseId == '') {
      canSubmit = false
      errmsg += '请选择仓库 '
    }
    if (!this.data.planMaintainCount || this.data.planMaintainCount == '') {
      canSubmit = false
      errmsg += '请输入预计维修数量 '
    }
    if (canSubmit) {
      let newObject = {
        productQuality: this.data.productQuality,
        product_name: this.data.product_name,
        productStandard: this.data.productStandard,
        warrantyStart: this.data.warrantyStart,
        warrantyEnd: this.data.warrantyEnd,
        planMaintainCount: this.data.planMaintainCount,
        maintainCategoryId: this.data.maintainCategoryId,
        maintainCategoryName: this.data.maintainCategoryName,
        warehouseId: this.data.warehouseId,
        warehouseName: this.data.warehouseName,
        productUnit: this.data.productUnit
      }
      eventChannel = this.getOpenerEventChannel()
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
