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
    menu: [],
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
        this.setData!({
          hasUserInfo: true
        })
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

    if (app.globalData.auth) {
      var arr = Authorities();
      this.setData!({
        menu: arr
      })
    } else {
      app.sessionInfoReadyCallback = (data) => {
        var arr = Authorities();
        this.setData!({
          menu: arr
        })
      }
    }
    function Authorities() {
      let list = app.globalData.auth;
      let array = [];
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 1]
      var routepage = currentPage.route;
      list.forEach((val, idx, arr) => {
        if (val.pageroute == routepage) {
          array.push(val);
        }
      })
    return array;
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
