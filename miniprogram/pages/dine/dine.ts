import { IMyApp } from '../../app'
import util = require('../../utils/util')

const app = getApp<IMyApp>()
let d = new Date()

Page({
  bindDinenew(e) {
    wx.navigateTo({
      url: './dinenew',
      success(res) {
        console.log(res)
      }
    })
  },
  data: {
    dinelist: [] as any,
    employeeId: null,
    employeeName: null,
    deptId: null,
    deptName: null,
    dineid: null,
  },
  onShow(){
    //带出集合
    console.log("执行第二次查询")
    wx.request({
      //app.globalData.restAdd +
      url: app.globalData.restAdd+'/Hanbell-WCO/api/wco/dineinfo/findDineInfoList?userid=' + app.globalData.employeeId
        + "&" + app.globalData.restAuth,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        res.data.forEach((value, index) => {
          value.dinedate = util.getCurrentDate(value.dinedate)
        });
        this.setData!({
          dinelist: res.data,
        });
        wx.hideLoading()
      },
      fail: fail => {
        console.log(fail)
        wx.hideLoading()
      },
    })
  },
  onPullDownRefresh(){
    this.onShow();
    wx.stopPullDownRefresh;
  }
  onLoad() {
    wx.showLoading({
      title: 'Loading',
    })
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
        deptName: app.globalData.defaultDeptName,
      })
    }
    console.log("执行第一次查询")
  },
  bindRemoveDine(e) {
    let id = e.currentTarget.dataset.index;
    if (id != null && id != "") {
      wx.showModal({
        title: '系统提示',
        content: '确定取消预约吗',
        success(res) {
          if (res.confirm) {
            wx.showLoading({
              title: 'Sending'
            })
            wx.request({
              //app.globalData.restAdd +
              url: app.globalData.restAdd +'/Hanbell-WCO/api/wco/dineinfo/removeForStatus?id=' + id + "&" + app.globalData.restAuth,
              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: res => {
                wx.hideLoading()
                if (getCurrentPages().length != 0) {
                  getCurrentPages()[getCurrentPages().length - 1].onShow()
                }
              },
              fail: fail => {
                wx.hideLoading()
                console.log(fail)
              }
            })
          }
        }
      })
    }
  },
});
}