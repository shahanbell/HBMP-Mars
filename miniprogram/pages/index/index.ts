//index.js
//获取应用实例
import { IMyApp } from '../../app'

const app = getApp<IMyApp>()

Page({
  data: {
    authorized: false,
    canSubmit: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    menu: [
      { id: 'menu01', name: '请假', imgUrl: '../../images/leave.png', url: '../../efgp/pages/leave/leave', parentid: -1 },
      { id: 'menu02', name: '加班', imgUrl: '../../images/overtime.png', url: '../../efgp/pages/overtime/overtime', parentid: -1 },
      { id: 'menu03', name: '出差', imgUrl: '../../images/business.png', url: '../../efgp/pages/businesstrip/businesstrip', parentid: -1 },
      { id: 'menu04', name: '派车', imgUrl: '../../images/car.png', url: '../../efgp/pages/carapp/carapp', parentid: -1 },
      { id: 'menu05', name: '借支', imgUrl: '../../images/loan.png', url: '../../efgp/pages/loan/loan', parentid: -1 },
      { id: 'menu012', name: '安全隐患整改', imgUrl: '../../images/safe.png', url: '../../efgp/pages/safetymeasures/safetyManagement', parentid: -1 },
      { id: 'menu09', name: '设备管理', imgUrl: '../../images/eqpManagement.png', url: '../../eam/pages/eqpManagement/eqpManageIndex', parentid: -1 },
      { id: 'menu10', name: '备件管理', imgUrl: '../../images/spareManagement.png', url: '../../eam/pages/spareManagement/spareManagementIndex', parentid: -1 },
      { id: 'menu11', name: '设备保全', imgUrl: '../../images/eqpMaintenance.png', url: '../../eam/pages/maintenanceManagement/eqpMaintainIndex', parentid: -1 },
      { id: 'menu12', name: '扫码签到', imgUrl: '../../images/leanProduction.png', url: '../../pages/leanProductionScan/leanProductionScan', parentid: -1 }
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000
  },
  onLoad() {
    var that = this;
    wx.showLoading({
      title: 'Loading',
    })
    wx.login({
      success: _res => {
        // 发送 _res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/session',
          data: {
            code: _res.code
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: res => {
            var that = this;
            app.globalData.openId = res.data.openId;
            app.globalData.sessionKey = res.data.sessionKey;
            app.globalData.authorized = res.data.authorized;
            if (res.data.authorized) {
              app.globalData.employeeId = res.data.employeeId;
              app.globalData.employeeName = res.data.employeeName;
              app.globalData.profileData = res.data.profile;

              that.loadMenu();
            } else {
              that.setData({
                canSubmit: true
              });
              wx.hideLoading()
            }
          },
          fail: fail => {
            wx.hideLoading()
            console.log(fail)
          }
        })
      }
    })

  },
  onShow() {
    //来源profile跳转验证过来的数据，需要在加载
    var that = this;
    if (app.globalData.profileCommit) {
      that.loadMenu();
      app.globalData.profileCommit = false;
    }
    if (!app.globalData.authorized) {
      that.setData({
        canSubmit: true,
        authorized: false
      })

    }
  },
  loadMenu() {
    console.info("employeeid="+app.globalData.employeeId)
    var that = this;
    wx.request({
      url: app.globalData.restAdd + '/Hanbell-JRS/api/efgp/users/' + app.globalData.employeeId,
      data: {
        appid: app.globalData.restId,
        token: app.globalData.restToken
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: res => {
        console.log("User信息：" + JSON.stringify(res))
        app.globalData.defaultCompany = res.data.company;
        app.globalData.defaultCompanyName = res.data.companyName;
        app.globalData.defaultDeptName = res.data.deptname;
        app.globalData.defaultDeptId = res.data.deptno;
        wx.request({
          url: app.globalData.restAdd + '/Hanbell-WCO/api/prg9f247ab6d5e4/AuthValidation',
          data: {
            employeeid: app.globalData.employeeId,
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'GET',
          success: res => {
            var list = that.data.menu;
            var authdata = res.data;
            for (var _i = 0, _a = authdata; _i < _a.length; _i++) {
              var entry = _a[_i];
              list.push(entry);
            }
      
            const uniqueArray = list.reduce((accumulator, current) => {
              const exists = accumulator.find((item) => item.id === current.id);
              if (!exists) {
                accumulator.push(current);
              }
              return accumulator;
            }, []);
            for(var i=0;i<uniqueArray.length;i++){
              console.info(JSON.stringify(uniqueArray[i]));
              }
            that.setData({
              menu: uniqueArray
            });
            that.setData({
              authorized: true
            })
            wx.hideLoading();
          },
          fail: fail => {
            wx.showModal({
              title: '系统提示',
              content: "权限获取失败，请联系管理员",
              showCancel: false
            })
          }
        });
      },
      fail: fail => {
        wx.hideLoading()
        console.log(fail)
      }
    })
  },
  // 事件处理函数
  bindAuthorizeTap(e) {
    wx.switchTab({
      url: '/pages/profile/profile'
    })
  }
})
