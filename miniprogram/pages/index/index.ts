//index.js
//获取应用实例
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()

Page({
  data: {
    hasUserInfo: false,
    authorized: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    menu: [
      { id: 'menu01', name: '请假', imgUrl: '../../images/leave.png', url: '/pages/leave/leave', parentid: -1 },
      { id: 'menu02', name: '加班', imgUrl: '../../images/overtime.png', url: '/pages/overtime/overtime', parentid: -1 },
      { id: 'menu03', name: '出差', imgUrl: '../../images/business.png', url: '/pages/businesstrip/businesstrip', parentid: -1 },
      { id: 'menu04', name: '派车', imgUrl: '../../images/car.png', url: '/pages/carapp/carapp', parentid: -1 },
      { id: 'menu05', name: '借支', imgUrl: '../../images/loan.png', url: '/pages/loan/loan', parentid: -1 },
      { id: 'menu08', name: '报餐', imgUrl: '../../images/baocan.png', url: '/pages/dine/dine', parentid: -1 },
      { id: 'menu09', name: '设备管理', imgUrl: '../../images/eqpManagement.png', url: '/pages/eqpManagement/eqpManageIndex', parentid: -1 },
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData!({
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 app 方法，可以在 app.ts 中 callback 以防止这种情况
      app.userInfoReadyCallback = (res) => {
        let list = this.data.menu;
        for (let entry of res) {
          list.push(entry); // 1, "string", false
        }
        this.setData!({
          hasUserInfo: true,
          menu: list
        })
        // app.updateAuth(res);
        // app.globaldata.auth = res;
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData!({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    if (app.globalData.openId) {
      this.setData!({
        authorized: app.globalData.authorized
      })
    } else {
      app.sessionInfoReadyCallback = (data) => {
        this.setData!({
          authorized: data.authorized
        })
      }
    }

  },
  onShow() {
    if (!this.data.hasUserInfo && app.globalData.userInfo) {
      this.setData!({
        hasUserInfo: true
      })
    }
    if (!this.data.authorized && app.globalData.authorized) {
      this.setData!({
        authorized: true
      })
    }
  },
  // 事件处理函数
  bindAuthorizeTap(e) {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  }
})
